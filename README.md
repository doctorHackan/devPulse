# DevPulse

A modern issue tracking and management system built with Node.js and TypeScript. DevPulse allows teams to create, track, and manage issues collaboratively with role-based access control.

## Live URL

*(Coming soon - Not yet deployed)*

## Features

✨ **Core Features:**
- **User Authentication** - Secure signup and login with JWT tokens
- **Issue Management** - Create, read, update, and delete issues
- **Role-Based Access Control** - Two roles: Contributor and Maintainer
- **Issue Tracking** - Track issues by status (open, in_progress, resolved)
- **Issue Classification** - Categorize issues as bugs or feature requests
- **User Roles** - Different permissions based on user roles
  - **Contributor**: Can create and update their own issues
  - **Maintainer**: Can manage all issues including deletion

## Tech Stack

**Backend:**
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js v5.2.1
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Database Driver**: pg (node-postgres)
- **Development**: tsx (TypeScript executor)

**Dev Dependencies:**
- TypeScript v6.0.3
- @types/express, @types/pg, @types/bcrypt, @types/jsonwebtoken

## Setup Steps

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devpulse/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   CONNECTION_STR=postgresql://user:password@localhost:5432/devpulse
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   ```

   - `CONNECTION_STR`: PostgreSQL connection string
   - `PORT`: Server port (default: 5000)
   - `JWT_SECRET`: Secret key for JWT signing

4. **Database Initialization**
   The application automatically creates tables on startup:
   - `users` table
   - `issues` table

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes

#### Sign Up
```
POST /auth/signup
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "contributor" // optional, defaults to "contributor"
}

Response (Success - 201):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "contributor",
    "created_at": "2026-05-24T10:00:00Z"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (Success - 200):
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "contributor"
    }
  }
}
```

### Issue Routes

#### Create Issue
```
POST /issue
Authorization: Bearer <jwt_token>
Content-Type: application/json
Roles: Contributor, Maintainer

Request Body:
{
  "title": "Login page is broken",
  "description": "The login form is not submitting correctly when users enter credentials",
  "type": "bug"
}

Response (Success - 201):
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Login page is broken",
    "description": "The login form is not submitting...",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-05-24T10:00:00Z"
  }
}
```

#### Get All Issues
```
GET /issue
Content-Type: application/json

Response (Success - 200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Login page is broken",
      "description": "The login form is not submitting...",
      "type": "bug",
      "status": "open",
      "reporter_id": 1,
      "created_at": "2026-05-24T10:00:00Z"
    }
  ]
}
```

#### Get Single Issue
```
GET /issue/:id
Content-Type: application/json

Response (Success - 200):
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Login page is broken",
    "description": "The login form is not submitting...",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-05-24T10:00:00Z"
  }
}
```

#### Update Issue
```
PATCH /issue/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json
Roles: Contributor, Maintainer

Request Body:
{
  "status": "in_progress"
}

Response (Success - 200):
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Login page is broken",
    "description": "The login form is not submitting...",
    "type": "bug",
    "status": "in_progress",
    "reporter_id": 1,
    "updated_at": "2026-05-24T11:00:00Z"
  }
}
```

#### Delete Issue
```
DELETE /issue/:id
Authorization: Bearer <jwt_token>
Roles: Maintainer

Response (Success - 200):
{
  "success": true,
  "message": "Issue deleted successfully"
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(32) NOT NULL,
  email VARCHAR(32) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) CHECK (role IN ('contributor', 'maintainer')) DEFAULT 'contributor',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Columns:**
- `id`: Unique user identifier (auto-increment)
- `name`: User's full name (max 32 characters)
- `email`: User's email address (unique, max 32 characters)
- `password`: Hashed password
- `role`: User role (contributor | maintainer)
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Issues Table
```sql
CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(152) NOT NULL,
  description VARCHAR(200) NOT NULL CHECK (LENGTH(description) >= 20),
  type VARCHAR(20) CHECK (type IN ('bug', 'feature_request')),
  status VARCHAR(20) CHECK(status IN ('open', 'in_progress','resolved')) DEFAULT 'open',
  reporter_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Columns:**
- `id`: Unique issue identifier (auto-increment)
- `title`: Issue title (max 152 characters)
- `description`: Detailed description (20-200 characters)
- `type`: Issue type (bug | feature_request)
- `status`: Issue status (open | in_progress | resolved)
- `reporter_id`: Foreign key referencing users table
- `created_at`: Issue creation timestamp
- `updated_at`: Last update timestamp

## Project Structure

```
backend/
├── src/
│   ├── app.ts                 # Express app setup
│   ├── server.ts              # Server entry point
│   ├── config/
│   │   └── index.ts           # Configuration management
│   ├── db/
│   │   └── index.ts           # Database connection & schema
│   ├── middleware/
│   │   ├── auth.ts            # JWT authentication middleware
│   │   └── issueUpdate.ts     # Issue update validation
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.route.ts
│   │   ├── issue/
│   │   │   ├── issue.controller.ts
│   │   │   ├── issue.service.ts
│   │   │   ├── issue.route.ts
│   │   │   └── issue.interface.ts
│   │   └── user/
│   │       └── user.interface.ts
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   └── utility/
│       └── sendResponse.ts    # Response formatting utility
├── package.json
└── tsconfig.json
```

## Authentication

DevPulse uses JWT (JSON Web Tokens) for authentication.

**How it works:**
1. User signs up or logs in
2. Server generates a JWT token
3. Client stores the token
4. For protected routes, include the token in the Authorization header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## Error Handling

Common error responses:

```json
{
  "statusCode": 401,
  "success": false,
  "message": "Unauthorized access!!"
}
```

```json
{
  "statusCode": 404,
  "success": false,
  "message": "Issue not found"
}
```

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Invalid input"
}
```

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

ISC

---

**Last Updated:** May 24, 2026
