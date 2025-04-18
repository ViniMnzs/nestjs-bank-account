import { Injectable } from '@nestjs/common';
import { EventDto } from './dto/event.dto';
import { accountStore } from './accounts.memory';

@Injectable()
export class AccountsService {
  reset() {
    accountStore.reset();
  }

  getBalance(accountId: string): number | null {
    const account = accountStore.getAccount(accountId);
    return account ? account.balance : null;
  }

  handleEvent(event: EventDto): any {
    const { type, origin, destination, amount } = event;

    if (type === 'deposit') {
      const acc = accountStore.createOrUpdateAccount(destination!, amount);
      return { destination: { id: acc.id, balance: acc.balance } };
    }

    if (type === 'withdraw') {
      const acc = accountStore.withdraw(origin!, amount);
      if (!acc) return null;
      return { origin: { id: acc.id, balance: acc.balance } };
    }

    if (type === 'transfer') {
      const from = accountStore.withdraw(origin!, amount);
      if (!from) return null;
      const to = accountStore.createOrUpdateAccount(destination!, amount);
      return {
        origin: { id: from.id, balance: from.balance },
        destination: { id: to.id, balance: to.balance },
      };
    }

    return null;
  }
}
