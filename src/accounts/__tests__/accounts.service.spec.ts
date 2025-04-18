import { AccountsService } from '../accounts.service';
import { accountStore } from '../accounts.memory';

describe('AccountsService', () => {
  let service: AccountsService;

  beforeEach(() => {
    service = new AccountsService();
    accountStore.reset();
  });

  it('should deposit and create account', () => {
    const res = service.handleEvent({ type: 'deposit', destination: '100', amount: 10 });
    expect(res).toEqual({ destination: { id: '100', balance: 10 } });
  });

  it('should withdraw correctly', () => {
    service.handleEvent({ type: 'deposit', destination: '100', amount: 20 });
    const res = service.handleEvent({ type: 'withdraw', origin: '100', amount: 5 });
    expect(res).toEqual({ origin: { id: '100', balance: 15 } });
  });

  it('should transfer between accounts', () => {
    service.handleEvent({ type: 'deposit', destination: '100', amount: 15 });
    const res = service.handleEvent({
      type: 'transfer',
      origin: '100',
      destination: '300',
      amount: 15,
    });
    expect(res).toEqual({
      origin: { id: '100', balance: 0 },
      destination: { id: '300', balance: 15 },
    });
  });

  it('should return null for invalid transfer', () => {
    const res = service.handleEvent({
      type: 'transfer',
      origin: '999',
      destination: '300',
      amount: 10,
    });
    expect(res).toBeNull();
  });
});
