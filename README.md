# CampusKit
Campus equipment lending application. COMP229 - Web Application Development, Project Part 1.

**First-release starter for your team to review, understand, customize, and extend.** The application code is implemented; the team-specific submission materials remain drafts. No real college service or institutional integration is implied.

## Try it immediately (temporary demo)
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

**Demo data is temporary and disappears when you stop the demo.** The demo uses a real temporary MongoDB server, not mock API responses. Its first run may download a MongoDB binary and requires internet access. These publicly documented demo credentials are only for this local classroom demonstration. Use the persistent setup below for your group's ongoing work. Press Control+C to stop.

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

Do not put `.env`, database credentials, or actual passwords in GitHub. `.gitignore` excludes them. For Atlas, configure the database account and permitted network access in your own Atlas project; never expose a database password in the browser code.

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

## API testing
See `docs/API_REFERENCE.md`. Import both JSON files in `postman/` into Postman and select the CampusKit environment. Start the app first. The collection creates a new test student and a test asset, tests permissions and the approval/return workflow, then removes those test records. It does not remove the seeded sample assets. Set `adminPassword` to your generated seed password for persistent mode; demo mode uses the documented demo password. Run the collection in its listed order. It stores IDs and JWTs in the selected local environment during a run; clear them before exporting evidence or sharing.

Automated tests run against actual MongoDB without touching the persistent application database. They check password hashing, unique records, role escalation protection, invalid login/tokens, equipment CRUD, input validation, request ownership, loan transitions, deletion guards, competing approvals, and password-change token invalidation.

## Submission materials and what your group must do
Open `docs/START_HERE.md` for a checklist. The PDFs and Markdown are drafts. **Do not submit placeholders, an unsigned contract, or the proposed backlog as evidence of a real task board.** The package includes:
- EDD v1 draft with requirements, data design, wireframes, initial account-screen screenshots, and verification limits.
- Team contract draft for 4-6 actual team members to review and sign.
- Proposed CampusKit team logo PDF and editable SVG.
- Proposed product backlog PDF and CSV for importing into your team's actual board.
- Suggested task division and a 7-8 minute video guide, including the required two-slide content.

Your group must add real member names, student IDs, agreed roles, signatures, and current photos; create the actual team GitHub repository and task board; commit each member's actual contribution under their own account; capture the team's current board as a PDF; finish the two-slide deck; and record/upload the demo. No contribution history, signatures, photos, URLs, or completed board history have been invented.

## First-release boundaries
This is a classroom first release, not a hardened production lending service. It does not include email verification, password reset emails, calendar reservations, renewal/fine rules, file uploads, or institutional single sign-on. There is no public deployment in this package. Never deploy the demo credentials or temporary database as a real service.

Approval claims use an atomic update on the asset and a conditional update on the request, with compensating release when the request changes. These are **not one multi-document transaction**: abrupt process/database failure between writes can require manual reconciliation. Deletion checks and related writes are also not transactionally isolated. A future production release should use MongoDB replica-set transactions for those cross-collection workflows, introduce pagination, retention/audit policies, and a deployment-specific security review.

## References
- Assignment: Project Part 1.docx, supplied course instructions.
- Express error handling: https://expressjs.com/en/5x/guide/error-handling/
- Mongoose 8 atomic updates: https://mongoosejs.com/docs/8.x/docs/tutorials/findoneandupdate.html
- MongoDB unique indexes: https://www.mongodb.com/docs/manual/core/index-unique/
- React: https://react.dev/
- Vite: https://vite.dev/
