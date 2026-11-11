# CampusKit video plan (target 7-8 minutes)
Use this as a speaking outline. Rehearse and explain the code in your own words. Do not claim that unverified work was demonstrated. Keep the screen legible and microphone level clear.

## Required two-slide deck
Slide 1: CampusKit team name and supplied logo; COMP229 - Web Application Development; Project Part 1; Campus equipment lending application; full name and student ID for every actual member.
Slide 2: current real photo of each member, with their full name and agreed role underneath. Use 4-6 photos, no avatars. These details and photos must come from your team. The package provides the outline, not a completed deck.

## 0:00-0:50 - Introduce team and project
Show both slides. Explain that students borrow individually tracked equipment and staff manage lending. Briefly name the roles and member contributions.

## 0:50-2:10 - Student workflow
Sign in as student (avoid revealing passwords). Show the collection, search and category filters. Open an available item and submit a request with a valid return date. Show it in My borrowing; edit its purpose. Explain pending requests are reviewed by staff.

## 2:10-3:25 - Staff workflow
Sign out and sign in as administrator. Open Borrowing requests and approve the request. Show that equipment is now on loan. Record its physical return and show availability restored. Add, edit, and delete a separate sample asset without active requests to demonstrate inventory CRUD.

## 3:25-4:30 - API and authorization evidence
In Postman show registration/login, a successful CRUD operation, missing-token 401, student attempting staff-only action 403, and duplicate/conflict 409. Show the tests passing. Demonstrate request cancellation/deletion using a second pending request if not already shown.

## 4:30-6:30 - Explain the code
Show User, Equipment, and BorrowRequest models and their references/indexes. Trace one API call from the route through authenticate/adminOnly to its controller, then to the Mongoose model. Explain bcrypt hashing, token verification, field allowlists, and request ownership checks. In requestController.js, show the atomic asset claim and conditional status transition. Mention the multi-document failure limitation if asked; there is no claim of full transactional isolation. Show React's API helper and form submission.

## 6:30-7:30 - Evidence and wrap-up
Show the actual team GitHub history with contributions from each member, the real board/backlog, and your EDD wireframes/screenshots. Explain the first-release boundaries and planned improvements. End before 10 minutes. Upload the video and add the actual link to your submission.

## Before recording
Test the complete sequence using fresh demo data or a dedicated persistent test database. Choose a test-only asset for deletions. Keep .env files, MongoDB credentials, JWTs, and unrelated personal data out of the recording. Do not use this generated package as proof of the team's actual participation.
