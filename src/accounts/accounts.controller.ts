import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { AccountsService } from './accounts.service';
import { EventDto } from './dto/event.dto';

@Controller()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) { }

  @Post('reset')
  reset(@Res() res: Response): void {
    this.accountsService.reset();
    res.status(HttpStatus.OK).send('OK');
  }

  @Get('balance')
  getBalance(@Query('account_id') accountId: string, @Res() res: Response) {
    const balance = this.accountsService.getBalance(accountId);
    if (balance === null) {
      return res.status(HttpStatus.NOT_FOUND).send('0');
    }
    return res.status(HttpStatus.OK).send(balance.toString());
  }

  @Post('event')
  handleEvent(@Body() body: EventDto, @Res() res: Response) {
    const result = this.accountsService.handleEvent(body);
    if (result === null) {
      return res.status(HttpStatus.NOT_FOUND).send('0');
    }
    return res.status(HttpStatus.CREATED).json(result);
  }
}
