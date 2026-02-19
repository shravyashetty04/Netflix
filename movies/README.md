# Movieflix – Netflix-style Movie App (React)

A React app with registration/login and Netflix-style movie browsing. Uses OMDB API and PostgreSQL (Aiven) for user data.

## Setup

### 1. Install dependencies

```bash
npm install
cd server && npm install && cd ..
```

### 2. Database (Aiven PostgreSQL)

Copy `server/.env.example` to `server/.env` and set your credentials:

```
DATABASE_URL=postgresql://avnadmin:YOUR_PASSWORD@kafka-3fe94df7-chavishetty03-ca4a.a.aivencloud.com:10762/defaultdb?sslmode=require
PORT=3001
```

Get your password from the [Aiven Console](https://console.aiven.io/) for your PostgreSQL service.

### 3. OMDB API key

In `src/api/omdb.js`, set your key:
```js
const OMDB_API_KEY = "your_key";
```
Get a free key at: https://www.omdbapi.com/apikey.aspx

## Run

**Terminal 1 – Backend:**
```bash
cd server && npm run dev
```

**Terminal 2 – Frontend:**
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Features

- **Auth pages** (green frosted-glass design): Welcome, Login, Register
- **Registration**: User ID, Email, Phone, Password (bcrypt-hashed)
- **Login**: Email + Password
- **Movies**: Netflix-style UI with OMDB data
- **Database**: PostgreSQL on Aiven
