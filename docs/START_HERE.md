# Start here - CampusKit Part 1

1. Run `npm ci` then `npm run demo`. See the root README for accounts and persistent MongoDB setup.
2. Sign in as a student. Open equipment, request it, edit the pending request, and inspect My borrowing.
3. Sign out, sign in as staff, approve the request, then record the return. Verify availability changes.
4. Import the Postman collection and environment and run in order. Read each request and test so you can explain it in the video.
5. Read and understand the models, controllers, routes, middleware, and React fetch calls. Team members should adapt and own their assigned work in accordance with your course's rules for assistance.

## Required team information - still missing
- Confirm 4-6 team members, student IDs, roles, and team name (CampusKit is proposed).
- Agree on the contract text, fill in actual meeting details, and obtain each member's signature.
- Add real student details and photos to the two-slide presentation.
- Create a team GitHub repository. Every member must commit their own genuine work. Do not fabricate authors or backdate contributions.
- Create a real Trello/Jira board from the proposed backlog, assign owners, and update actual statuses.
- Export a PDF snapshot of the current real board. The included proposed backlog is planning material, not that evidence.
- Record a 5-10 minute demonstration, upload it to a streaming service, and add the actual URL.
- Replace draft labels and placeholders in the EDD and regenerate PDFs after the team reviews it.
- Capture working authenticated pages and API results on your computer and update the EDD with them. The supplied screenshots show the implemented account screens only.

## Submission checklist
Part A: signed Team Contract PDF; Team Logo PDF.
Part B: Project Files ZIP; EDD v1 PDF; team GitHub URL; demo-video URL; PDF of current Product Backlog.
Keep the two-slide deck available for the video. Check any additional professor/Luminate instructions.

The ZIP omits node_modules, environment secrets, generated frontend bundles, and actual database files. `npm ci` restores dependencies and `npm run build` regenerates the frontend bundle. Do not upload this draft unchanged as a completed team submission.

## Suggested work division (agree together)
| Member slot | Proposed responsibility | Review partner |
| --- | --- | --- |
| 1 | Project coordination, contract and EDD | Member 2 |
| 2 | Authentication and user APIs | Member 3 |
| 3 | Equipment data and APIs | Member 4 |
| 4 | Borrowing workflow and permissions | Member 2 |
| 5 (optional) | React screens and responsive layout | Member 4 |
| 6 (optional) | API testing, board, demo coordination | Member 1 |

For four people, distribute frontend and testing tasks across all four. Everyone remains a programmer and must understand the entire project.
