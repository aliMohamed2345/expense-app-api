📘 **Expense Tracker API Documentation**

## Postman Documentation Link:
[Open in Postman](https://web.postman.co/workspace/93ef3755-40b8-4805-8ff0-0a8cf0be68e7/collection/42373444-8b7cf832-e32d-45ce-96a3-4afaaf43e48f?action=share&source=copy-link&creator=42373444)

---

# 📊 Expense App API Documentation

This RESTful API manages users, expenses, and incomes, with full CRUD functionality, authentication, reporting, and admin controls.

> **Base URL:**  
> `http://localhost:4000/api/v1` (replace with production URL)

---

## 📁 Contents

- [Authentication](#authentication)
- [Expenses](#expenses)
- [Incomes](#incomes)
- [Admin](#admin)
- [Default Route](#default-route)

---

## 🛂 Authentication

### 🔐 POST `/auth/signup`
**Description:** Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

**Response:**
- JWT token in cookie
- JSON with user info

---

### 🔐 POST `/auth/login`
**Description:** Authenticate existing users using email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

**Response:**
- Sets JWT in cookie
- Returns user info

---

### 🔐 POST `/auth/logout`
**Description:** Logs out the currently authenticated user.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

### 👤 GET `/auth/profile`
**Description:** Fetch profile of the currently logged-in user.

**Headers:**
- Requires valid JWT cookie

---

## 💸 Expenses

### 📄 GET `/expenses`
**Description:** List all user's expenses with optional filters.

**Query Parameters:**
- `page`, `limit`, `sort`, `tags`, `currency`, `category`

**Response:**
- Paginated list of expenses

---

### 🆕 POST `/expenses`
**Description:** Create a new expense entry.

**Request Body:**
```json
{
  "title": "Lunch",
  "amount": 12,
  "isRecurring": false,
  "category": "Food",
  "notes": "Lunch with friends",
  "currency": "USD",
  "tags": ["restaurant"]
}
```

---

### 🔍 GET `/expenses/:id`
**Description:** Fetch details of a single expense by its ID.

---

### ❌ DELETE `/expenses/:id`
**Description:** Delete a specific expense entry.

---

### 🔄 PUT `/expenses/:id`
**Description:** Update a specific expense.

**Request Body:** (Partial or full updates allowed)
```json
{
  "title": "Updated Title"
}
```

---

### ♻️ GET `/expenses/recurring`
**Description:** Retrieve all expenses marked as recurring.

---

### 📥 GET `/expenses/download`
**Description:** Export user's expenses to an Excel file and return a download link.

---

### 🔎 GET `/expenses/search?q=`
**Description:** Search expenses using text query. Matches title, notes, category, and tags.

---

## 💰 Incomes

### 📄 GET `/incomes/:id`
**Description:** List all incomes for a specific user (based on auth).

---

### 🆕 POST `/incomes`
**Description:** Add a new income entry.

**Request Body:**
```json
{
  "title": "Freelancing",
  "amount": 500,
  "isRecurring": false,
  "source": "Fiverr",
  "notes": "Monthly payout",
  "currency": "USD",
  "tags": ["freelance"]
}
```

---

### 🔍 GET `/incomes/:id`
**Description:** Get income details by ID.

---

### ❌ DELETE `/incomes/:id`
**Description:** Delete income by ID.

---

### 🔄 PUT `/incomes/:id`
**Description:** Edit income entry.

---

### ♻️ GET `/incomes/recurring`
**Description:** Fetch recurring income entries.

---

### 📥 GET `/incomes/download`
**Description:** Download incomes in Excel format and return public link.

---

### 🔎 GET `/incomes/search?q=`
**Description:** Search incomes based on query string.

---

### 📊 GET `/incomes/balance`
**Description:** Calculate and return total balance: income - expenses.

---

## 🛠️ Admin

All routes below require the user to be an admin.

### 👥 GET `/admin/users`
**Description:** List all registered users (excluding passwords).

---

### 🔍 GET `/admin/users/:id`
**Description:** Retrieve details and stats for a user.

---

### 📝 PUT `/admin/users/:id`
**Description:** Update a user's `username` and `email`.

---

### ❌ DELETE `/admin/users/:id`
**Description:** Permanently delete a user by ID.

---

### 🔁 PUT `/admin/users/:id/role`
**Description:** Toggle a user’s admin role (admin/user).

---

### 📊 GET `/admin/stats`
**Description:** View global app statistics for users, expenses, and most common categories.

---

### 🔎 GET `/admin/users/search`
**Description:** Search users by `username` or `email`, with `role` filtering.

---

## 🌐 Default Route

### GET `/`
**Description:** Health check for the API root. Returns status message.

---

## 🛡️ Authorization

- JWT token is required (sent in cookies)
- Admin routes require `isAdmin: true`

---

## 📁 File Exports

Excel sheets are saved in `/public/exports` and served statically via:
```
http://localhost:4000/exports/filename.xlsx
```

---

## 🛑 Error Handling

All errors are returned in a standardized JSON format:

```json
{
  "success": false,
  "message": "Internal server error: detailed message here"
}
```
