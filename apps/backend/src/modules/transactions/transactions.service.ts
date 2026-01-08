import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @Inject(forwardRef(() => AccountsService))
    private accountsService: AccountsService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    // Базовые данные транзакции
    const transactionData: any = {
      type: createTransactionDto.type,
      amount: createTransactionDto.amount,
      categoryId: createTransactionDto.categoryId,
      accountId: createTransactionDto.accountId,
      description: createTransactionDto.description,
      place: createTransactionDto.place,
      person: createTransactionDto.person,
      notes: createTransactionDto.comment,
      currency: createTransactionDto.currency || 'TJS',
      date: new Date(createTransactionDto.date || Date.now()),
    };

    // Обработка переводов
    if (createTransactionDto.type === 'transfer') {
      if (!createTransactionDto.accountToId) {
        throw new BadRequestException('accountToId is required for transfer transactions');
      }

      // Проверяем, что оба счета существуют и не являются долговыми
      const fromAccount = await this.accountsService.findOne(createTransactionDto.accountId);
      const toAccount = await this.accountsService.findOne(createTransactionDto.accountToId);

      if (fromAccount.isDebt || toAccount.isDebt) {
        throw new BadRequestException('Cannot transfer between debt accounts');
      }

      transactionData.accountToId = createTransactionDto.accountToId;

      // Создаем транзакцию
      const transaction = new this.transactionModel(transactionData);
      await transaction.save();

      // Обновляем балансы счетов
      await this.accountsService.updateBalance(createTransactionDto.accountId, -createTransactionDto.amount);
      await this.accountsService.updateBalance(createTransactionDto.accountToId, createTransactionDto.amount);

      return transaction;
    }

    // Обработка долгов
    if (createTransactionDto.type === 'debt') {
      if (!createTransactionDto.person) {
        throw new BadRequestException('person is required for debt transactions');
      }
      if (!createTransactionDto.debtSubType) {
        throw new BadRequestException('debtSubType is required for debt transactions');
      }

      // Находим или создаем долговой счет для человека
      const debtAccount = await this.accountsService.findOrCreateDebtAccount(
        createTransactionDto.person,
        createTransactionDto.currency || 'TJS'
      );

      transactionData.debtSubType = createTransactionDto.debtSubType;
      transactionData.accountToId = (debtAccount as any)._id.toString();

      // Создаем транзакцию
      const transaction = new this.transactionModel(transactionData);
      await transaction.save();

      // Обновляем балансы в зависимости от типа долга
      let debtAmount = createTransactionDto.amount;
      let mainAccountAmount = createTransactionDto.amount;

      switch (createTransactionDto.debtSubType) {
        case 'i_gave':
          // Я дал в долг - списываем с основного счета, увеличиваем долговой счет (нам должны)
          debtAmount = createTransactionDto.amount;
          mainAccountAmount = -createTransactionDto.amount;
          break;
        case 'i_returned':
          // Я вернул долг - списываем с основного счета, уменьшаем долговой счет (мы должны меньше)
          debtAmount = createTransactionDto.amount;
          mainAccountAmount = -createTransactionDto.amount;
          break;
        case 'they_gave':
          // Мне дали в долг - зачисляем на основной счет, уменьшаем долговой счет (мы должны)
          debtAmount = -createTransactionDto.amount;
          mainAccountAmount = createTransactionDto.amount;
          break;
        case 'they_returned':
          // Мне вернули долг - зачисляем на основной счет, уменьшаем долговой счет (нам должны меньше)
          debtAmount = -createTransactionDto.amount;
          mainAccountAmount = createTransactionDto.amount;
          break;
      }

      await this.accountsService.updateBalance(createTransactionDto.accountId, mainAccountAmount);
      await this.accountsService.updateBalance((debtAccount as any)._id.toString(), debtAmount);

      return transaction;
    }

    // Обработка обычных транзакций (income/expense)
    const transaction = new this.transactionModel(transactionData);
    await transaction.save();

    // Обновляем баланс счета
    const balanceChange = createTransactionDto.type === 'income'
      ? createTransactionDto.amount
      : -createTransactionDto.amount;
    await this.accountsService.updateBalance(createTransactionDto.accountId, balanceChange);

    return transaction;
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionModel
      .find()
      .sort({ date: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findById(id)
      .exec();
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async update(
    id: string,
    updateTransactionDto: Partial<CreateTransactionDto>,
  ): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findByIdAndUpdate(id, updateTransactionDto, { new: true })
      .exec();
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.transactionModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}

