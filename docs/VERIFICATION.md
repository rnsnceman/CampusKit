# Verification record
Verified 9 November 2026 against the packaged implementation.

- `npm run build`: passed (Vite production build).
- `npm test`: 12 integration tests passed, 0 failed, against an isolated real MongoDB 7.0.24 instance. Password hashing, auth/roles/ownership, CRUD, validation, duplicate records, request transitions, active-loan guards, competing approvals and password token invalidation were exercised.
- Supplied Postman collection executed using Newman against a separate disposable database: 31 requests, 34 assertions, 0 failures. Its cleanup removed its test student, asset and requests.
- `npm run demo`: created 8 sample equipment records and both test accounts; API and Vite servers started successfully on 5002/5001.
- Browser: built sign-in and registration pages visually inspected and captured. Full authenticated browser flows and mobile-device testing were not completed. The hosted preview could not launch its temporary MongoDB process; the static preview was used only for account-screen layout inspection.
- PDFs: rendered and visually checked. Team contract is 2 pages; EDD is 8 pages; proposed backlog is 2 pages; logo is 1 page.

Tests describe observed checks, not a claim that the project is production hardened or that the actual team has completed its required review. See README.md for first-release limitations and START_HERE.md for outstanding team deliverables.
