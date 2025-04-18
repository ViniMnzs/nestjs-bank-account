# Bank Account API (https://github.com/ViniMnzs/nestjs-bank-account)

This project implements a simple RESTful API for managing basic banking operations. It handles balance inquiries, deposits, withdrawals, and transfers using in-memory data only — no persistence layer is required.

The main goal is to provide a clean, maintainable, and testable implementation, keeping the code simple, malleable, and focused on the provided specification.

## Features

- In-memory operations (no database)
- RESTful endpoints:
  - `GET /balance`
  - `POST /event`
  - `POST /reset`
- Clear separation between HTTP layer and business logic
- Unit tests using Jest
- Ready for public testing via ngrok tunnel

## Stack

- NestJS (Node.js framework)
- TypeScript
- Jest for unit testing
- ngrok for exposing the app publicly

## Installation

Clone the repository and install the dependencies:

```bash
git clone <your-repo-url>
cd nestjs-bank-account
npm install
```

## Running the Application

To start the API locally on port 3000:

```bash
npm run start
```

You should see output like:

```
Application is running on: http://localhost:3000
```

## Exposing Locally via Ngrok

If you need to expose the API for public access (e.g. for automated testing), you can use [ngrok](https://ngrok.com/).

After starting the app, run:

```bash
ngrok http 3000
```

This will generate a public HTTPS URL like:

```
https://<random-subdomain>.ngrok.io
```

Use that URL when running the automated test suite provided by the company.

## Running Tests

Unit tests are implemented using Jest and cover the business logic (not the HTTP layer).

To run tests:

```bash
npm run test
```

## API Endpoints

### POST /reset

Resets the entire in-memory state.

**Response:**
- `200 OK`

---

### GET /balance?account_id=123

Returns the current balance of the given account.

**Response:**
- `200 <balance>` if account exists
- `404 0` if account does not exist

---

### POST /event

Handles the following event types:
- `deposit`
- `withdraw`
- `transfer`

**Request body examples:**

Deposit:
```json
{ "type": "deposit", "destination": "100", "amount": 10 }
```

Withdraw:
```json
{ "type": "withdraw", "origin": "100", "amount": 5 }
```

Transfer:
```json
{ "type": "transfer", "origin": "100", "amount": 15, "destination": "300" }
```

**Response:**
- `201` with the updated balances
- `404 0` if origin account does not exist

## Future Improvements

In a production-ready version of this API, I would consider:

- Persistent storage (e.g., PostgreSQL, Redis)
- DTO validation (e.g., class-validator)
- Authentication and authorization
- Swagger/OpenAPI integration for documentation
- Observability (structured logs, metrics, etc.)

## Test results

✅ Reset state before starting tests
POST /reset
Expected: 200 OK
Got:      200 OK

✅ Get balance for non-existing account
GET /balance?account_id=1234
Expected: 404 0
Got:      404 0

✅ Create account with initial balance
POST /event {"type":"deposit", "destination":"100", "amount":10}
Expected: 201 {"destination": {"id":"100", "balance":10}}
Got:      201 {"destination":{"id":"100","balance":10}}

✅ Deposit into existing account
POST /event {"type":"deposit", "destination":"100", "amount":10}
Expected: 201 {"destination": {"id":"100", "balance":20}}
Got:      201 {"destination":{"id":"100","balance":20}}

✅ Get balance for existing account
GET /balance?account_id=100
Expected: 200 20
Got:      200 20

✅ Withdraw from non-existing account
POST /event {"type":"withdraw", "origin":"200", "amount":10}
Expected: 404 0
Got:      404 0

✅ Withdraw from existing account
POST /event {"type":"withdraw", "origin":"100", "amount":5}
Expected: 201 {"origin": {"id":"100", "balance":15}}
Got:      201 {"origin":{"id":"100","balance":15}}

✅ Transfer from existing account
POST /event {"type":"transfer", "origin":"100", "amount":15, "destination":"300"}
Expected: 201 {"origin": {"id":"100", "balance":0}, "destination": {"id":"300", "balance":15}}
Got:      201 {"origin":{"id":"100","balance":0},"destination":{"id":"300","balance":15}}

✅ Transfer from non-existing account
POST /event {"type":"transfer", "origin":"200", "amount":15, "destination":"300"}
Expected: 404 0
Got:      404 0
