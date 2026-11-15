# CampusKit
Campus equipment lending application. COMP229 - Web Application Development, Project Part 1.

Install Node.js 22.12 or newer, unzip the project, open Terminal in the `CampusKit` folder, and run:

```bash
npm ci
npm run demo
```

Open **http://localhost:5001**. The API runs on port **5002**, avoiding the macOS AirPlay conflict on port 5000.

| Demo account | Email | Password |
| --- | --- | --- |
| Administrator | admin@campuskit.test | CampusKitDemo2026! |
| Student | student@campuskit.test | CampusKitDemo2026! |

**Demo data is temporary and disappears when you stop the demo.** The demo uses a real temporary MongoDB server, not mock API responses. Its first run may download a MongoDB binary and requires internet access. These publicly documented demo credentials are only for this local classroom demonstration. Use the persistent setup below for the project's ongoing work. Press Control+C to stop.

## Persistent local database setup
Requires MongoDB Community 7.0+ (or a MongoDB Atlas connection) and Node.js 22.12+.

1. Start your existing local MongoDB server. Keep it running.
2. In the project folder, run `npm ci` if you have not already.
3. Run `cp .env.example .env`.
4. Generate a secret with the command below and paste the output over the `JWT_SECRET` placeholder in `.env`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

5. Set `MONGODB_URI` in `.env`. The default is `mongodb://127.0.0.1:27017/campuskit`. This uses its own database; it does not clear your other coursework databases.
6. Run `npm run seed`. It creates 8 sample assets and the two sample accounts. **Save the generated passwords printed in Terminal.** Optional `SEED_ADMIN_PASSWORD` and `SEED_STUDENT_PASSWORD` values set the initial passwords instead. Existing accounts and assets are preserved; running seed again does not reset their passwords.
7. Run `npm run dev`, then open **http://localhost:5001**.

## What works
- Student registration, login, JWT authentication, and staff/student authorization.
- Staff equipment create/read/update/delete; categories, asset tags, pickup locations, descriptions, availability.
- Student equipment search and category/availability filters.
- Student borrowing request create/read/update/delete; cancel pending requests.
- Staff approve/reject requests and record physical equipment returns.
- Atomic physical-asset claiming prevents competing approvals from issuing two loans.
- Students see and manage their own requests; administrators see all requests.
- Profile read/update, password change with current-password verification, account deletion with active-request guards.
- Staff view users and delete eligible student accounts. Administrator accounts are retained.
- Password hashing, input validation, login rate limiting, security headers, centralized API errors.
- Responsive styles, accessible form labels, native modal focus management, confirmation before deletion.

## Workflow and rules
Each equipment record represents **one individual physical asset**, identified by its unique asset tag. Add multiple records for multiple cameras of the same model. Pending requests do not reserve equipment; staff approval does. This is immediate lending with a return deadline, not a calendar-based reservation system.

A student requests an available item with a purpose and a return date within the next 30 days. The request starts `pending`; staff can approve or reject it. Approval sets the asset to `on-loan`. Only staff record the physical return, which sets the request to `returned` and releases the asset. A student can edit or cancel only pending requests, and delete their requests when no loan is active. Deleted equipment/user references retain snapshot names in historical request records.

JWTs stay in React memory. Refreshing the browser requires signing in again. Logging out discards the local token; password changes invalidate prior tokens. No persistent browser token storage or refresh-token system is included.

## Commands
| Command | Purpose |
| --- | --- |
| `npm run demo` | Disposable sample database and both development servers |
| `npm run dev` | Persistent database, API, and Vite frontend |
| `npm run server` | API only (development/watch mode) |
| `npm run client` | Vite frontend only |
| `npm run seed` | Add missing sample records to the configured persistent database |
| `npm test` | 12 integration tests using a separate disposable MongoDB instance |
| `npm run build` | Build the React frontend into `client/dist` |
| `npm start` | Serve API and already-built React app on port 5002 |

To verify the production-style local app, run `npm run build` then `npm start` and open http://localhost:5002. The production start requires the persistent `.env` configuration. Health endpoint: `GET /api/health`.

## MVC structure
```text
server/config/        MongoDB connection
server/models/        Mongoose schemas and indexes (Model)
server/controllers/   Business rules and request handlers (Controller)
server/routes/        API endpoint mapping and middleware
server/middleware/    Authentication, authorization, validation, errors
server/scripts/       Safe sample seeding and development launcher
client/src/           React application and styles (View)
tests/                Supertest + Node test runner integration tests
postman/              Importable collection and environment
docs/                 Draft PDFs, editable source notes, wireframes and screenshots
```

## References
- Assignment: Project Part 1.docx, supplied course instructions.
- Express error handling: https://expressjs.com/en/5x/guide/error-handling/
- Mongoose 8 atomic updates: https://mongoosejs.com/docs/8.x/docs/tutorials/findoneandupdate.html
- MongoDB unique indexes: https://www.mongodb.com/docs/manual/core/index-unique/
- React: https://react.dev/
- Vite: https://vite.dev/
