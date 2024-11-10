# User Management API - Test Task
This project is a simple RESTful API for managing users, built using NestJS and PostgreSQL. It is
designed as a test task to demonstrate basic backend capabilities including CRUD operations,
JWT-based authentication, logging middleware, and database integration with Prisma ORM.
---
## Features
- **CRUD Operations**: Allows Create, Read, Update, and Delete operations for user data.
- **JWT Authentication**: Secures routes using JSON Web Tokens.
- **PostgreSQL Integration**: Uses Prisma ORM to connect and manage a PostgreSQL database.
- **Request Logging**: Middleware to log request details, including time taken for each API request.
---
## Prerequisites
- **Node.js** (v14 or higher)
- **npm**
- **Docker** (for running PostgreSQL)
---
## Setup Instructions
1. **Clone the Repository**
```bash
git clone https://github.com/username/user-management-api.git
cd user-management-api
```
2. **Install Dependencies**
```bash
npm install
```
3. **Configure Environment Variables**
Create a `.env` file from the example file:
```bash
cp .env.example .env
```
Update `.env` with your preferred settings. Ensure PostgreSQL database credentials match
Docker's configuration.
4. **Run PostgreSQL Using Docker**
Use Docker to start a PostgreSQL container:
```bash
docker-compose up -d
```
5. **Run Database Migrations**
Set up the database schema by running Prisma migrations:
```bash
npx prisma migrate dev
```
6. **Start the Application**
Launch the application in development mode:
```bash
npm run start:dev
```
The API will be available at `http://localhost:3000`.
---
## Running Tests
To verify functionality, run the test suite:
```bash
npm run test
```
---
## API Endpoints Overview
- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Authenticate a user and receive a JWT token.
- **GET /users**: Retrieve all users (JWT required).
- **GET /users/:id**: Retrieve a user by ID (JWT required).
- **PUT /users/:id**: Update a user by ID (JWT required).
- **DELETE /users/:id**: Delete a user by ID (JWT required).
---
## Request Logging
The application includes middleware to log each API request. For every request, it logs:
- The HTTP method and endpoint accessed.
- The start and end time for each request, allowing you to monitor the time taken for processing.
---
**happy testing!**