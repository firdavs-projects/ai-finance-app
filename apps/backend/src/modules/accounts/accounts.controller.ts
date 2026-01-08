import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать счёт' })
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все счета' })
  findAll() {
    return this.accountsService.findAll();
  }

  @Get('regular/list')
  @ApiOperation({ summary: 'Получить обычные счета (не долговые)' })
  getRegularAccounts() {
    return this.accountsService.getRegularAccounts();
  }

  @Get('debts/list')
  @ApiOperation({ summary: 'Получить долговые счета' })
  getDebtAccounts() {
    return this.accountsService.getDebtAccounts();
  }

  @Patch(':id/close-debt')
  @ApiOperation({ summary: 'Закрыть долг (скрыть счет)' })
  closeDebt(@Param('id') id: string) {
    return this.accountsService.closeDebt(id);
  }

  @Patch(':id/reopen-debt')
  @ApiOperation({ summary: 'Открыть долг (показать счет)' })
  reopenDebt(@Param('id') id: string) {
    return this.accountsService.reopenDebt(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить счёт по ID' })
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить счёт' })
  remove(@Param('id') id: string) {
    return this.accountsService.remove(id);
  }
}

