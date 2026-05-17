# ShahdCosmetics: Coding & Git Guidelines

## 1. Our Engineering Philosophy
As we start Phase 1, you will notice your assigned tasks are *very small*. This is intentional.

### *Understand the System*
We are keeping tasks small so you understand exactly how the *Next.js frontend*, *NestJS backend*, and *Prisma database* connect without getting overwhelmed.

### *Mindful AI Usage*
You are encouraged to use AI (*ChatGPT, Gemini, GitHub Copilot*) to help you code. However, *do not blindly copy-paste*. You must be able to explain every single line of code in your Pull Request. If AI generates a complex service, break it down and understand it before committing. We are here to learn real architecture.

## 2. The Git & Pull Request Workflow (Read Carefully)
Git merge conflicts are the *#1 reason student projects fail*. To prevent this, follow this exact sequence for every task. Do not be intimidated by this; once you do it twice, it becomes muscle memory.

### *Step 1: Always Sync First*
Before you type a single line of code, make sure your local machine matches the live server.
```bash
git checkout main
git pull origin main
```

### *Step 2: The Git & Kanban Workflow (The "Magic" Automation)*
We use GitHub Projects to track all our work. If you follow these exact steps, the Kanban board will update your progress automatically without you having to drag and drop cards.

#### 1: Claim Your Task & Create the Branch (In GitHub)
*Do not create your branch in the terminal first!*
- Go to your assigned Issue on GitHub.
- Look at the right-hand sidebar and find the **Development** section.
- Click **Create a branch**.
- GitHub will suggest a branch name (e.g., `12-update-homepage`). Leave it as is or rename it following our rule:
feat/short-description
or
fix/short-description

- Click **Create branch**.

*(Magic: Because you clicked this button, GitHub now links your code to the card, and it will automatically move the card to the "In Progress" column on our board!)*

#### 2: Pull the Branch to Your Machine
Now open your terminal and bring that new branch to your local computer:
```bash
git checkout main
git pull origin main
git fetch origin
git checkout <the-branch-name-you-just-created>
```

#### 3: Professional Commits (The "Why", not the "What")
Commit your code often. Do not wait until the end of the week to make one giant commit.

❌ Bad Commit
git commit -m "fixed stuff"
❌ Bad Commit
git commit -m "added a div to the header"
✅ Good Commit
git commit -m "feat: added mobile responsive menu to header"
✅ Good Commit
git commit -m "fix: corrected JWT token expiration time"

#### 4: Push & Automate the PR
When your feature is done and tested locally:
```bash
git push origin <your-branch-name>
```
Then:
- Go to GitHub
- Click **Compare & pull request**

**The Magic Words**
In the description of your Pull Request, you MUST type:
Resolves #<issue-number>
Example:
Resolves #12
Assign your team partner as a Reviewer.

*(Magic: Typing `Resolves #12` tells GitHub to automatically move the card to "Done" the second I merge your code!)*

## 3. Coding & Naming Standards
Keep it clean, readable, and consistent.

### *Variables & Functions*
Use `camelCase`
const userEmail
function calculateTotal()

### *Classes & Models*
Use `PascalCase`
class AuthController
model User

### *File Names*
Use `kebab-case`
shopping-cart.component.tsx
user-profile.dto.ts

### *Comments*
Code should explain what it is doing. Comments should only explain *why* you did it a certain way.
// Using a Set here to prevent duplicate product IDs from crashing the loop

### *Language*
All code, comments, commit messages, and PR descriptions must be in **English only**.
No Turkish, Arabic, or any other language in the codebase.

## 4. Database Standards

### *ID Convention*
Use `Int @id @default(autoincrement())` for all models by default.

**Exception:** `User` and `UserProfile` models use UUID (`String @id @default(uuid())`)
for security — this prevents attackers from guessing sequential user IDs on
user-facing endpoints.

All other models (Product, Category, Inventory, etc.) must use Int IDs.

### *Role Convention*
Roles are stored in a `roles` database table — NOT as a Prisma enum.
This allows adding new roles without requiring a new migration.
The `user_roles` junction table handles the many-to-many relationship between users and roles.

### *Migration Rule*
All schema changes must go through Prisma migrations:
```bash
npx prisma migrate dev --name <migration_name>
```
*Never use `prisma db push` on a shared or production database.*
The `/migrations` folder must always be committed to the repository.

### *Price Convention*
Store all prices as `Decimal` (not `Int` cents, not `Float`).
This avoids floating point errors in financial calculations.

## 5. Docker Standards

### *Common Fix*
If your app is acting weird, not updating, or crashing on startup, completely reset Docker by running:
```bash
docker-compose down
docker-compose up --build -d
```
This fixes 90% of local environment issues.

### *Full Reset (Nuclear Option)*
If the above does not work, wipe the database volumes and rebuild from scratch:
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```
Then reapply migrations:
```bash
docker exec -it shahd_backend npx prisma migrate deploy
```

### *Backend Build Note*
The backend compiles to `dist/src/main.js` — not `dist/main.js`.
This is because we use `"module": "nodenext"` in `tsconfig.json` which changes the output structure.
The `Dockerfile` already handles this correctly. Do not change the CMD path.

## 6. PR Workflow Rules

### *Merge Rules*
- **Backend PRs:** Developer codes → Backend peer reviews & approves → Mudar merges
- **Frontend PRs:** Developer codes → Mudar reviews & merges
- **Database PRs:** Developer codes → Mudar reviews & merges
- **QA:** Tests the feature after Mudar merges to main

### *PR Rules*
- One card per person at a time. Finish and merge before picking up a new card.
- No team member may push directly to `main`. All changes go through PRs.
- Every PR description must include `Resolves #<issue-number>`.
- Every PR must only touch files related to its task. Do not modify unrelated files.
- Always run `npm run build` and `npm run test` locally before opening a PR.


### *Local Testing Rule (Mandatory Before Opening Any PR)*
Before opening a PR you MUST:
1. Run `docker-compose down && docker-compose up --build -d` locally
2. Verify your feature works end-to-end in the browser
3. Run `docker exec -it shahd_backend npm run test` and confirm all tests pass
4. Run `git --no-pager diff main..<your-branch> --name-only` and confirm only your task files are changed

A PR that breaks the Docker build will be closed immediately without review.

## 7. Frontend & Backend Parallel Development

### *Never Wait for a Backend Merge to Start UI Work*
Once the API contract is approved on the issue, the frontend team starts building immediately — do not wait for the backend PR to merge.

Build your UI against a mock that matches the approved contract exactly:

```typescript
// Example: lib/mock-cart.ts — delete this file when the real API merges
export const mockCart = {
  cartId: 1,
  totalAmount: "259.98",
  items: [
    {
      itemId: 1,
      variantId: "uuid",
      productName: "Rose Lip Gloss",
      basePrice: "129.99",
      primaryImage: null,
      quantity: 2,
      subtotal: "259.98"
    }
  ]
}
```

When the backend merges, replace the mock with the real `fetch()` call. If the contract was followed correctly, this is a one-line change.

This is why the API contract approval step exists in every card — it is the handshake between backend and frontend that makes parallel work possible.

If the team is blocked, use the mock pattern above to keep working.