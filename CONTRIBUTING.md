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

Step 2: The Git & Kanban Workflow (The "Magic" Automation)
We use GitHub Projects to track all our work. If you follow these exact steps, the Kanban board will update your progress automatically without you having to drag and drop cards.
1: Claim Your Task & Create the Branch (In GitHub)
Do not create your branch in the terminal first!
Go to your assigned Issue on GitHub.
Look at the right-hand sidebar and find the Development section.
Click Create a branch.
GitHub will suggest a branch name (e.g., 12-update-homepage). Leave it as is or rename it following 
our rule:

feat/short-description
or
fix/short-description

Click Create branch.

(Magic: Because you clicked this button, GitHub now links your code to the card, and it will automatically move the card to the "In Progress" column on our board!)

2: Pull the Branch to Your Machine

Now open your terminal and bring that new branch to your local computer:
git checkout main
git pull origin main
git fetch origin
git checkout <the-branch-name-you-just-created>

3: Professional Commits (The "Why", not the "What")
Commit your code often. Do not wait until the end of the week to make one giant commit.
❌ Bad Commit
git commit -m "fixed stuff"
❌ Bad Commit
git commit -m "added a div to the header"
✅ Good Commit
git commit -m "feat: added mobile responsive menu to header"
✅ Good Commit
git commit -m "fix: corrected JWT token expiration time"

4: Push & Automate the PR
When your feature is done and tested locally:
git push origin <your-branch-name>
Then:
Go to GitHub
Click Compare & pull request
The Magic Words
In the description of your Pull Request, you MUST type:
Resolves #<issue-number>
Example:
Resolves #12
Assign your team partner as a Reviewer.
(Magic: Typing Resolves #12 tells GitHub to automatically move the card to "Done" the second I merge your code!)

Step 3. Coding & Naming Standards
Keep it clean, readable, and consistent.
Variables & Functions
Use camelCase
const userEmail
function calculateTotal()
Classes & Models
Use PascalCase
class AuthController
model User
File Names
Use kebab-case
shopping-cart.component.tsx
user-profile.dto.ts

Comments
Code should explain what it is doing. Comments should only explain why you did it a certain way.

// Using a Set here to prevent duplicate product IDs from crashing the loop

Docker Fix (Common Issue)
If your app is acting weird, not updating, or crashing on startup, completely reset Docker by running:
docker-compose down
docker-compose up --build -d

This fixes 90% of local environment issues.

## 4. Database Standards

### ID Convention
Use `Int @id @default(autoincrement())` for all models by default.

**Exception:** `User` and `UserProfile` models use UUID (`String @id @default(uuid())`) 
for security — this prevents attackers from guessing sequential user IDs on 
user-facing endpoints.

All other models (Product, Category, Inventory, etc.) must use Int IDs.

✅ **Advantages of this version**
- Uses `*` and Markdown symbols as you requested  
- No weird spacing when pasting into GitHub  
- Clean GitHub rendering  
- Perfect for `CONTRIBUTING.md`

