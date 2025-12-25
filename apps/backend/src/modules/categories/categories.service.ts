import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async onModuleInit() {
    // Инициализация дефолтных категорий при запуске приложения
    const count = await this.categoryModel.countDocuments();
    if (count === 0) {
      await this.seedDefaultCategories();
    }
  }

  private async seedDefaultCategories() {
    const defaultCategories = [
      // Расходы
      { name: 'Еда', type: 'expense', icon: '🍔', isDefault: true },
      { name: 'Кафе и рестораны', type: 'expense', icon: '☕', isDefault: true },
      { name: 'Продукты', type: 'expense', icon: '🛒', isDefault: true },
      { name: 'Транспорт', type: 'expense', icon: '🚗', isDefault: true },
      { name: 'Такси', type: 'expense', icon: '🚕', isDefault: true },
      { name: 'Топливо', type: 'expense', icon: '⛽', isDefault: true },
      { name: 'Развлечения', type: 'expense', icon: '🎬', isDefault: true },
      { name: 'Покупки', type: 'expense', icon: '🛍️', isDefault: true },
      { name: 'Здоровье', type: 'expense', icon: '💊', isDefault: true },
      { name: 'Счета и услуги', type: 'expense', icon: '📱', isDefault: true },
      // Доходы
      { name: 'Зарплата', type: 'income', icon: '💰', isDefault: true },
      { name: 'Бонус', type: 'income', icon: '🎁', isDefault: true },
      { name: 'Фриланс', type: 'income', icon: '💻', isDefault: true },
    ];
    await this.categoryModel.insertMany(defaultCategories);
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = new this.categoryModel(createCategoryDto);
    return category.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async findByName(name: string): Promise<Category | null> {
    return this.categoryModel
      .findOne({ name: { $regex: name, $options: 'i' } })
      .exec();
  }

  async update(
    id: string,
    updateCategoryDto: Partial<CreateCategoryDto>,
  ): Promise<Category> {
    const category = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}

