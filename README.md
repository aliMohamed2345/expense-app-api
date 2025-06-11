Expense Tracker API
Overview
The Expense Tracker API is a RESTful backend service for a personal finance application, built using the MERN stack (MongoDB, Express.js, React, Node.js). It enables users to manage expenses and incomes with full CRUD functionality, supports recurring transactions, provides balance and reporting features, and includes admin controls for user management. The API uses JSON Web Tokens (JWT) stored in HTTP-only cookies for secure authentication and MongoDB for efficient, schemaless data storage. Deployed on Vercel at https://expense-app-api-lemon.vercel.app/, the API includes a comprehensive Postman Collection for testing all endpoints.
Features

User Authentication: Secure signup, login, logout, and profile management with JWT in cookies.
Expense Management: Create, read, update, and delete expenses with filtering, search, and recurring transaction support.
Income Management: Manage incomes with CRUD, search, and recurring options.
Reporting: Calculate total balance (income - expenses) and export data to Excel.
Admin Controls: List, update, delete users, toggle admin roles, and view app-wide statistics.
File Exports: Generate and download Excel files for expenses and incomes via public URLs.
API Testing: Test all endpoints using the Postman Collection.
Scalability: Optimized with MongoDB’s schemaless design and Express.js for performance.

Tech Stack

Framework: Node.js with Express.js
Database: MongoDB (local or MongoDB Atlas)
Authentication: JSON Web Tokens (JWT) in HTTP-only cookies
File Exports: Excel files served from /public/exports
API Testing: Postman
Deployment: Vercel

Prerequisites
To run the API locally, ensure you have:

Node.js: v16.x or higher
MongoDB: v5.0 or higher (local or MongoDB Atlas)
Git
Postman: For testing with the provided collection
Code Editor: e.g., VS Code

Installation
Follow these steps to set up and run the Expense Tracker API locally:

Clone the Repository:
git clone https://github.com/aliMohamed2345/expense-app-api.git
cd expense-app-api


Set Up Environment Variables: Create a .env file in the root directory with:
MONGODB_URI=mongodb://localhost:27017/expense_tracker
JWT_SECRET=your-secure-jwt-secret-12345
PORT=4000
NODE_ENV=development


MONGODB_URI: Use mongodb://localhost:27017/expense_tracker for local MongoDB or a MongoDB Atlas string (e.g., mongodb+srv://<user>:<pass>@cluster0.mongodb.net/expense_tracker).
JWT_SECRET: A unique, secure secret for JWT signing.
PORT: Defaults to 4000 (Vercel overrides in production).
NODE_ENV: Set to development locally or production for deployment.


Install Dependencies:
npm install

Installs Express.js, Mongoose, and dependencies like jsonwebtoken, exceljs for file exports, and others in package.json.

Set Up MongoDB:

Local MongoDB: Run MongoDB locally with mongod and create a database named expense_tracker.
MongoDB Atlas: Use a connection string from MongoDB Atlas in MONGODB_URI.
No manual schema setup is needed; Mongoose defines collections dynamically.


Run the Application:
npm start

The API runs at http://localhost:4000/api/v1.

Test with Postman:

Import the Postman Collection into Postman.
Set up a Postman environment with:
base_url: http://localhost:4000/api/v1 (local) or https://expense-app-api-lemon.vercel.app/api/v1 (production)
Cookies are managed automatically after /auth/login or /auth/signup.


Test endpoints starting with /auth/signup or /auth/login, then proceed to others.



MongoDB Schema
The API uses MongoDB with Mongoose for data modeling. Key collections are:

Users:
{
  _id: ObjectId,
  username: String, // e.g., "john_doe"
  email: String, // e.g., "john@example.com"
  password: String, // Hashed with bcrypt
  isAdmin: Boolean, // Default: false
  createdAt: Date // e.g., "2025-06-11T00:00:00.000Z"
}


Expenses:
{
  _id: ObjectId,
  userId: ObjectId, // Reference to User
  title: String, // e.g., "Lunch"
  amount: Number, // e.g., 12
  isRecurring: Boolean, // e.g., false
  category: String, // e.g., "Food"
  notes: String, // e.g., "Lunch with friends"
  currency: String, // e.g., "USD"
  tags: [String], // e.g., ["restaurant"]
  date: Date, // e.g., "2025-06-11T00:00:00.000Z"
  createdAt: Date
}


Incomes:
{
  _id: ObjectId,
  userId: ObjectId, // Reference to User
  title: String, // e.g., "Freelancing"
  amount: Number, // e.g., 500
  isRecurring: Boolean, // e.g., false
  source: String, // e.g., "Fiverr"
  notes: String, // e.g., "Monthly payout"
  currency: String, // e.g., "USD"
  tags: [String], // e.g., ["freelance"]
  date: Date, // e.g., "2025-06-11T00:00:00.000Z"
  createdAt: Date
}



API Endpoints
Base URL: https://expense-app-api-lemon.vercel.app/api/v1 (production) or http://localhost:4000/api/v1 (local). Protected endpoints require a JWT token in an HTTP-only cookie, set after /auth/signup or /auth/login. The Postman Collection covers all endpoints.
Authentication



Method
Endpoint
Description
Request Body Example
Response Example



POST
/auth/signup
Register a new user
{"username": "john_doe", "email": "john@example.com", "password": "yourpassword"}
{"success": true, "data": {"userId": "uuid", "username": "john_doe", "email": "john@example.com", "isAdmin": false}} (sets JWT cookie)


POST
/auth/login
Authenticate a user
{"email": "john@example.com", "password": "yourpassword"}
{"success": true, "data": {"userId": "uuid", "username": "john_doe", "email": "john@example.com", "isAdmin": false}} (sets JWT cookie)


POST
/auth/logout
Log out the current user
-
{"success": true, "message": "Logged out successfully"}


GET
/auth/profile
Fetch the logged-in user’s profile
-
{"success": true, "data": {"userId": "uuid", "username": "john_doe", "email": "john@example.com", "isAdmin": false}}


Expenses



Method
Endpoint
Description
Request Body Example
Response Example



GET
/expenses
List all user expenses with filters
Query: ?page=1&limit=10&sort=amount&tags=restaurant&category=Food¤cy=USD
{"success": true, "data": [{"id": "uuid", "title": "Lunch", "amount": 12, "category": "Food", "currency": "USD", "tags": ["restaurant"], "date": "2025-06-11T00:00:00.000Z", "createdAt": "2025-06-11T09:25:00.000Z"}], "total": 1, "page": 1, "limit": 10}


POST
/expenses
Create a new expense
{"title": "Lunch", "amount": 12, "isRecurring": false, "category": "Food", "notes": "Lunch with friends", "currency": "USD", "tags": ["restaurant"], "date": "2025-06-11"}
{"success": true, "data": {"id": "uuid", "title": "Lunch", "amount": 12, "category": "Food", "currency": "USD", "date": "2025-06-11T00:00:00.000Z"}}


GET
/expenses/:id
Fetch a single expense by ID
-
{"success": true, "data": {"id": "uuid", "title": "Lunch", "amount": 12, "category": "Food", "currency": "USD", "date": "2025-06-11T00:00:00.000Z"}}


PUT
/expenses/:id
Update an expense
{"title": "Updated Lunch", "amount": 15}
{"success": true, "data": {"id": "uuid", "title": "Updated Lunch", "amount": 15, "category": "Food", "currency": "USD"}}


DELETE
/expenses/:id
Delete an expense
-
{"success": true, "message": "Expense deleted successfully"}


GET
/expenses/recurring
List recurring expenses
-
{"success": true, "data": [{"id": "uuid", "title": "Subscription", "amount": 10, "isRecurring": true, "category": "Subscriptions", "currency": "USD"}]}


GET
/expenses/download
Export expenses to Excel
-
{"success": true, "data": {"url": "https://expense-app-api-lemon.vercel.app/exports/expenses_20250611.xlsx"}}


GET
/expenses/search?q=
Search expenses by query
Query: ?q=lunch
{"success": true, "data": [{"id": "uuid", "title": "Lunch", "amount": 12, "category": "Food", "currency": "USD"}]}


Incomes



Method
Endpoint
Description
Request Body Example
Response Example



GET
/incomes
List all user incomes
-
{"success": true, "data": [{"id": "uuid", "title": "Freelancing", "amount": 500, "source": "Fiverr", "currency": "USD", "date": "2025-06-11T00:00:00.000Z"}]}


POST
/incomes
Create a new income
{"title": "Freelancing", "amount": 500, "isRecurring": false, "source": "Fiverr", "notes": "Monthly payout", "currency": "USD", "tags": ["freelance"], "date": "2025-06-11"}
{"success": true, "data": {"id": "uuid", "title": "Freelancing", "amount": 500, "source": "Fiverr", "currency": "USD", "date": "2025-06-11T00:00:00.000Z"}}


GET
/incomes/:id
Fetch an income by ID
-
{"success": true, "data": {"id": "uuid", "title": "Freelancing", "amount": 500, "source": "Fiverr", "currency": "USD", "date": "2025-06-11T00:00:00.000Z"}}


PUT
/incomes/:id
Update an income
{"title": "Updated Freelancing", "amount": 600}
{"success": true, "data": {"id": "uuid", "title": "Updated Freelancing", "amount": 600, "source": "Fiverr", "currency": "USD"}}


DELETE
/incomes/:id
Delete an income
-
{"success": true, "message": "Income deleted successfully"}


GET
/incomes/recurring
List recurring incomes
-
{"success": true, "data": [{"id": "uuid", "title": "Salary", "amount": 2000, "isRecurring": true, "source": "Employer", "currency": "USD"}]}


GET
/incomes/download
Export incomes to Excel
-
{"success": true, "data": {"url": "https://expense-app-api-lemon.vercel.app/exports/incomes_20250611.xlsx"}}


GET
/incomes/search?q=
Search incomes by query
Query: ?q=freelance
{"success": true, "data": [{"id": "uuid", "title": "Freelancing", "amount": 500, "source": "Fiverr", "currency": "USD"}]}


GET
/incomes/balance
Calculate total balance (income - expenses)
-
{"success": true, "data": {"balance": 488}}


Admin



Method
Endpoint
Description
Request Body Example
Response Example



GET
/admin/users
List all users (admin only)
-
{"success": true, "data": [{"userId": "uuid", "username": "john_doe", "email": "john@example.com", "isAdmin": false}]}


GET
/admin/users/:id
Get user details and stats (admin only)
-
{"success": true, "data": {"userId": "uuid", "username": "john_doe", "email": "john@example.com", "isAdmin": false, "stats": {"expenses": 5, "incomes": 2}}}


PUT
/admin/users/:id
Update user’s username/email (admin only)
{"username": "john_updated", "email": "john2@example.com"}
{"success": true, "data": {"userId": "uuid", "username": "john_updated", "email": "john2@example.com", "isAdmin": false}}


DELETE
/admin/users/:id
Delete a user (admin only)
-
{"success": true, "message": "User deleted successfully"}


PUT
/admin/users/:id/role
Toggle user’s admin role (admin only)
-
{"success": true, "data": {"userId": "uuid", "username": "john_doe", "email": "john@example.com", "isAdmin": true}}


GET
/admin/stats
View app-wide stats (admin only)
-
{"success": true, "data": {"totalUsers": 100, "totalExpenses": 1000, "totalIncomes": 5000, "topCategory": "Food"}}


GET
/admin/users/search
Search users by username/email/role (admin only)
Query: ?q=john&role=admin
{"success": true, "data": [{"userId": "uuid", "username": "john_doe", "email": "john@example.com", "isAdmin": true}]}


Default Route



Method
Endpoint
Description
Response Example



GET
/
API health check
{"success": true, "message": "Hello World"}


Authorization

JWT in Cookies: Protected endpoints (except /auth/signup, /auth/login, and /) require a JWT token in an HTTP-only cookie, set after /auth/signup or /auth/login.
Admin Routes: Require isAdmin: true in the user’s profile, verified via JWT.
Postman Setup: The Postman Collection handles cookies automatically.

File Exports

Excel files for expenses and incomes are stored in /public/exports.

Download links are returned as https://expense-app-api-lemon.vercel.app/exports/filename.xlsx.

Configure Vercel to serve static files from /public/exports using a vercel.json file, e.g.:
{
  "routes": [
    { "src": "/exports/(.*)", "dest": "/public/exports/$1" }
  ]
}



Error Handling
Errors follow a standardized JSON format:
{
  "success": false,
  "message": "Internal server error: detailed message here"
}


400 Bad Request: Invalid input (e.g., missing required fields).
401 Unauthorized: Missing or invalid JWT cookie.
403 Forbidden: Insufficient permissions (e.g., non-admin accessing /admin routes).
404 Not Found: Resource not found (e.g., invalid expense ID).
500 Internal Server Error: Unexpected server error.

Testing with Postman
The Postman Collection includes all endpoints:

Import the collection into Postman.
Set up an environment with:
base_url: https://expense-app-api-lemon.vercel.app/api/v1 (production) or http://localhost:4000/api/v1 (local)
Cookies are managed automatically after /auth/login or /auth/signup.


Test endpoints sequentially, starting with /auth/signup or /auth/login, then /expenses, /incomes, or /admin routes.

Deployment
The API is deployed on Vercel at https://expense-app-api-lemon.vercel.app/. To deploy updates:

Push changes to the GitHub repository linked to Vercel.
Set environment variables in Vercel’s dashboard:
MONGODB_URI: MongoDB Atlas connection string.
JWT_SECRET: Secure JWT secret key.
NODE_ENV: production.


Vercel automatically builds and deploys the API.
Configure static file serving for /public/exports in vercel.json.
Test the deployed API using the Postman collection with base_url set to https://expense-app-api-lemon.vercel.app/api/v1.

Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a feature branch: git checkout -b feature/your-feature.
Commit changes: git commit -m "Add your feature".
Push to the branch: git push origin feature/your-feature.
Submit a pull request.

See CONTRIBUTING.md for detailed guidelines.
