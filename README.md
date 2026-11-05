# JobTrack — Job Application Tracker

A full-stack portfolio project built with **Node.js, Express and PostgreSQL**. JobTrack helps a user organise applications, update their status and view a simple progress dashboard.

## Features
- User registration and login with bcrypt password hashing
- JWT-protected API routes (7-day token expiry)
- Create, read, update and delete job applications
- Statuses: Saved, Applied, Interview, Offer and Rejected
- Search by company/job title and filter by status
- Dashboard counts for total applications, applied, interviews and offers
- PostgreSQL schema with foreign keys and indexes
- Security headers, JSON request-size limit and authentication rate limiting
- Responsive browser interface built with HTML, CSS and vanilla JavaScript

## Tech stack
Node.js 18+, Express, PostgreSQL, `pg`, JWT, bcryptjs, HTML, CSS and JavaScript.

## Folder structure
```text
job-application-tracker/
├── db/schema.sql
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── src/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── routes/
│   │   ├── applications.js
│   │   └── auth.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Run locally
Prerequisites: Node.js 18+ and PostgreSQL installed and running.

1. Create a database:
   ```bash
   createdb job_tracker
   ```
   Or in `psql`: `CREATE DATABASE job_tracker;`
2. Create the tables from the project root:
   ```bash
   psql -d job_tracker -f db/schema.sql
   ```
   If needed, add `-U postgres` to the command.
3. Create your local environment file:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your PostgreSQL username/password and a long random JWT secret:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/job_tracker
   JWT_SECRET=replace_with_a_long_random_secret
   NODE_ENV=development
   ```
   Never commit `.env` to GitHub.
4. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```
5. Visit **http://localhost:3000**, create an account and add applications. Use `npm start` for a normal start without nodemon.
6. Check the API/database health at `http://localhost:3000/api/health`. Expected: `{"status":"ok","database":"connected"}`.

## API reference
All `/api/applications` routes require `Authorization: Bearer YOUR_JWT_TOKEN`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/health` | Server/database health |
| GET | `/api/applications` | List your applications |
| GET | `/api/applications?status=Interview` | Filter by status |
| GET | `/api/applications?search=developer` | Search company/title |
| GET | `/api/applications/stats` | Dashboard totals |
| POST | `/api/applications` | Create an application |
| PUT | `/api/applications/:id` | Update an application |
| DELETE | `/api/applications/:id` | Delete an application |

Example create body:
```json
{
  "company": "Example Health",
  "job_title": "Junior Software Developer",
  "location": "Glasgow",
  "job_url": "https://example.com/jobs/123",
  "status": "Applied",
  "applied_date": "2026-11-05",
  "notes": "Applied through the company website."
}
```

## Security and scope
Passwords are hashed with bcrypt. SQL values are parameterised. Every application query is scoped to the authenticated user. JWTs expire after seven days. This is a portfolio MVP, not a production-ready service. Before production, add automated tests, stronger request validation, email verification, password recovery, structured logging, and deployment-specific security review. The browser stores the JWT in local storage for simplicity; consider secure, HttpOnly cookies and a CSRF strategy for a production app.

## Screenshots
After running the app, add screenshots of the login page, dashboard, application list and add/edit form to a `screenshots/` folder. Embed them like this:
```md
![Dashboard](screenshots/dashboard.png)
```

## Push to GitHub
1. Create an empty GitHub repository named `job-application-tracker` (do not initialise it with another README).
2. From this project directory:
   ```bash
   git init
   git add .
   git status   # confirm .env is NOT staged
   git commit -m "Build job application tracker MVP"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/job-application-tracker.git
   git push -u origin main
   ```
3. Replace `YOUR-USERNAME` with your GitHub username.

## Future improvements
Automated tests with Jest/Supertest, pagination and sorting, interview dates/reminders, CSV export, Docker Compose, and deployment with a live demo URL.

## Portfolio summary
JobTrack is a full-stack job application management system built with Node.js, Express and PostgreSQL. It features secure authentication, user-scoped CRUD APIs, search and filtering, and a responsive dashboard for tracking application progress.
