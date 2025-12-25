import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transactionData = {
      type: createTransactionDto.type,
      amount: createTransactionDto.amount,
      categoryId: createTransactionDto.categoryId,
      accountId: createTransactionDto.accountId,
      description: createTransactionDto.description,
      notes: createTransactionDto.comment,
      date: new Date(createTransactionDto.date || Date.now()),
    };
    const transaction = new this.transactionModel(transactionData);
    return transaction.save();
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionModel
      .find()
      .sort({ date: -1 })
      .populate('categoryId')
      .populate('accountId')
      .exec();
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findById(id)
      .populate('categoryId')
      .populate('accountId')
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

