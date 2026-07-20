# file-handling-system
📁 File Management API

A RESTful File Management API built with **Node.js**, **Express.js**, and **MongoDB**. The application allows authenticated users to upload and manage their own files, while administrators have full control over all uploaded files through a secure role-based authentication system.

🚀 Tech Stack

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose ODM

**File Handling**
- Multer

**Authentication & Security**
- JWT (JSON Web Tokens)
- bcrypt (Password Hashing)

✨ Features

**1. Authentication**
- User Registration
  - Create a new account using name, email, and password.
  - Passwords are securely hashed using bcrypt before being stored in the database.
- User Login
  - Login using registered email and password.
  - Generates a JWT access token containing the user's ID and role.
  - Protected routes require a valid JWT token.

**2. File Management**
- Upload Single File
  - Authenticated users can upload one file at a time.
- Upload Multiple Files
  - Authenticated users can upload several files in a single request.
- View Files
  - Users can view their own uploaded files.
  - Admins can view files uploaded by all users.
- Update File
  - Replace an existing file with a new one.
- Delete File
  - Remove a file from storage and the database.

**3. File Validation**
- Restricted to JPG, JPEG, PNG, and PDF.
- File type validated using Multer.
- File size limit enforced.
- Unique file naming to avoid collisions.

🔐 Role-Based Access Control (RBAC)

The application supports two user roles.

| Role  | Permissions |
|-------|-------------|
| User  | Upload files, view own files, update own files, delete own files |
| Admin | All user permissions + view, update, and delete any user's files |

**How Authorization Works**
- Every user document contains a role field.
- During login, the role is embedded inside the JWT payload.
- Protected routes first verify the JWT.
- Authorization middleware checks whether the authenticated user has permission to access the requested resource.
- Unauthorized requests receive a 403 Forbidden response.

📁 Project Structure

```
File-Management-API/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   ├── uploads/
│   └── app.js
│
└── README.md
```

📌 API Endpoints

**Authentication**

| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |

**Files**

| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/api/file/uploads` | Upload a single file |
| POST | `/api/file/uploads/multiple` | Upload multiple files |
| GET | `/api/file/all` | Get files (own files, or all files for Admin) |
| GET | `/api/file/:id` | Get a single file |
| PUT | `/api/file/:id` | Replace an existing file |
| DELETE | `/api/file/:id` | Delete a file |

⚙️ Environment Variables

Create a `.env` file inside the project root.

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
```

🛠️ Installation

**Clone the Repository**
```
git clone <repository-url>
```

**Setup**
```
cd <project-folder>
npm install
npm start
```