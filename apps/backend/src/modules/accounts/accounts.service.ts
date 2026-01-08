import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account, AccountDocument } from './schemas/account.schema';

@Injectable()
export class AccountsService implements OnModuleInit {
  constructor(
    @InjectModel(Account.name)
    private accountModel: Model<AccountDocument>,
  ) {}

  async onModuleInit() {
    // Инициализация дефолтных счетов при запуске приложения
    const count = await this.accountModel.countDocuments();
    if (count === 0) {
      await this.seedDefaultAccounts();
    }
  }

  private async seedDefaultAccounts() {
    const defaultAccounts = [
      {
        name: 'Наличные',
        type: 'cash',
        balance: 0,
        currency: 'TJS',
        icon: '💵',
      },
      {
        name: 'Банковская карта',
        type: 'card',
        balance: 0,
        currency: 'TJS',
        icon: '💳',
      },
    ];
    await this.accountModel.insertMany(defaultAccounts);
  }

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const accountData = {
      ...createAccountDto,
      balance: createAccountDto.balance || 0,
      currency: createAccountDto.currency || 'TJS',
    };
    const account = new this.accountModel(accountData);
    return account.save();
  }

  async findAll(): Promise<Account[]> {
    return this.accountModel.find().exec();
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountModel.findById(id).exec();
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  // Получить только обычные счета (не долговые)
  async getRegularAccounts(): Promise<Account[]> {
    return this.accountModel.find({ isDebt: { $ne: true } }).exec();
  }

  // Получить только долговые счета
  async getDebtAccounts(): Promise<Account[]> {
    return this.accountModel.find({ isDebt: true }).exec();
  }

  // Создать долговой счет для человека
  async createDebtAccount(personName: string, initialBalance: number = 0, currency: string = 'TJS'): Promise<Account> {
    const accountData = {
      name: personName,
      type: 'debt',
      balance: initialBalance,
      currency: currency,
      icon: '📝',
      isDebt: true,
      isHidden: false,
      debtPerson: personName,
    };
    const account = new this.accountModel(accountData);
    return account.save();
  }

  // Найти или создать долговой счет для человека
  async findOrCreateDebtAccount(personName: string, currency: string = 'TJS'): Promise<Account> {
    // Ищем существующий долговой счет для этого человека
    const existingAccount = await this.accountModel.findOne({
      isDebt: true,
      debtPerson: personName,
    }).exec();

    if (existingAccount) {
      return existingAccount;
    }

    // Если не найден - создаем новый
    return this.createDebtAccount(personName, 0, currency);
  }

  // Закрыть долг (скрыть счет)
  async closeDebt(accountId: string): Promise<Account> {
    const account = await this.accountModel.findById(accountId).exec();
    if (!account) {
      throw new NotFoundException(`Account with ID ${accountId} not found`);
    }
    if (!account.isDebt) {
      throw new NotFoundException(`Account ${accountId} is not a debt account`);
    }

    account.isHidden = true;
    return account.save();
  }

  // Открыть долг (показать счет)
  async reopenDebt(accountId: string): Promise<Account> {
    const account = await this.accountModel.findById(accountId).exec();
    if (!account) {
      throw new NotFoundException(`Account with ID ${accountId} not found`);
    }
    if (!account.isDebt) {
      throw new NotFoundException(`Account ${accountId} is not a debt account`);
    }

    account.isHidden = false;
    return account.save();
  }

  async updateBalance(id: string, amount: number): Promise<Account> {
    const account = await this.accountModel
      .findByIdAndUpdate(
        id,
        { $inc: { balance: amount } },
        { new: true },
      )
      .exec();
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async update(
    id: string,
    updateAccountDto: Partial<CreateAccountDto>,
  ): Promise<Account> {
    const account = await this.accountModel
      .findByIdAndUpdate(id, updateAccountDto, { new: true })
      .exec();
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async remove(id: string): Promise<void> {
    const result = await this.accountModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
  }
}

