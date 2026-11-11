# CampusKit API reference
Base URL: `http://localhost:5002/api`. Send JSON bodies. Except health, login, and registration, send `Authorization: Bearer <token>`.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | /health | Public | API health |
| POST | /auth/register | Public | Create student (user Create) |
| POST | /auth/login | Public | Issue 2-hour JWT |
| GET | /auth/me | Signed in | Current identity |
| GET | /users | Admin | List users |
| GET | /users/:id | Self or admin | Read profile |
| PATCH | /users/:id | Self | Update name/email or change password |
| DELETE | /users/:id | Self or admin | Delete eligible student |
| GET | /equipment | Signed in | List inventory |
| GET | /equipment/:id | Signed in | Read individual asset |
| POST | /equipment | Admin | Add asset |
| PATCH | /equipment/:id | Admin | Edit asset |
| DELETE | /equipment/:id | Admin | Delete unreserved asset |
| GET | /requests | Signed in | Own requests; admin sees all |
| GET | /requests/:id | Owner or admin | Read request |
| POST | /requests | Student | Create request |
| PATCH | /requests/:id | Owner or admin | Allowed state transition or edit |
| DELETE | /requests/:id | Owner | Delete if not actively approved |

## Example bodies
Registration: `{"name":"Student Name","email":"student@example.ca","password":"ExamplePassword123!"}`. Registration ignores role input; staff accounts come from the server seed process.

Equipment: `{"name":"Sony Camera","category":"Cameras","assetTag":"CAM-100","location":"Media lab","description":"Includes lens and charger","status":"available"}`.
Categories: Audio, Cameras, Computing, Accessories. Status edits allow available/maintenance only; return/approve controls on-loan automatically.

Borrow: `{"equipment":"<ObjectId>","purpose":"Film a short documentary","dueDate":"<YYYY-MM-DD within 30 days>"}`.
Edit: `{"action":"edit","purpose":"Updated purpose","dueDate":"<valid YYYY-MM-DD>"}`.
Cancel: `{"action":"cancel"}`.
Staff action: `{"action":"approve","decisionNote":"Collect after 10am."}`; substitute reject/return.
Profile: `{"name":"Updated Name","email":"updated@example.ca"}`.
Password: `{"currentPassword":"ExamplePassword123!","password":"DifferentPassword123!"}`. Success invalidates existing tokens; sign in again.

## Responses
200 successful read/update/login; 201 created; 204 deleted; 400 invalid input; 401 missing/invalid login or token; 403 insufficient role/ownership; 404 missing record; 409 duplicate or conflicting workflow; 429 too many authentication attempts. Errors return `{"message":"..."}`. A missing record during an atomic equipment update/delete can return 409. Equipment and requests are bounded by the classroom scope; pagination is future work.

## Suggested manual evidence
Capture Postman results for registration/login, equipment CRUD, request CRUD, student denied staff operation (403), unauthenticated request (401), approval and return (200), duplicate request (409), and invalid data (400). Keep JWTs and passwords out of shared screenshots. Compare MongoDB records before and after approval/return to explain persistence.
