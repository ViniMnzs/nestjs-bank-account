import { Account } from "./account.interface";

export class InMemoryAccountStore {
  private accounts: Record<string, Account> = {};

  reset() {
    this.accounts = {};
  }

  getAccount(id: string): Account | undefined {
    return this.accounts[id];
  }

  createOrUpdateAccount(id: string, amount: number): Account {
    const account = this.accounts[id] || { id, balance: 0 };
    account.balance += amount;
    this.accounts[id] = account;
    return account;
  }

  withdraw(id: string, amount: number): Account | undefined {
    const account = this.accounts[id];
    if (!account || account.balance < amount) {
      return undefined;
    }
    account.balance -= amount;
    return account;
  }
}

export const accountStore = new InMemoryAccountStore();
