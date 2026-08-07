# API Documentation

## 1. Overview

This document describes all REST API endpoints available in the RAG Backend project. The APIs are responsible for user authentication, file management, and question answering using the Retrieval-Augmented Generation (RAG) pipeline.

All APIs exchange data in JSON format except file upload endpoints, which use `multipart/form-data`.

---

## 2. Base URL

```
http://localhost:5000/api
```

> Replace the base URL with your production server URL after deployment.

---

## 3. Authentication

The project uses **JWT (JSON Web Token)** for authentication.

Protected endpoints require a valid JWT access token in the request header.

**Header**

```http
Authorization: Bearer <your_jwt_token>
```

If the token is missing or invalid, the server returns an authentication error.

---

## 4. Content Types

| Content Type        | Usage                        |
| -------------------- | ------------------------------ |
| application/json    | Authentication and Chat APIs |
| multipart/form-data | File Upload APIs             |

---

## 5. Common Response Format

**Success Response**

```json
{
    "success": true,
    "message": "Operation completed successfully",
    "data": {}
}
```

**Error Response**

```json
{
    "success": false,
    "message": "Something went wrong"
}
```

---

## 6. Authentication APIs

### 6.1 Register User

**Endpoint**

```http
POST /api/auth/register
```

**Description**

Creates a new user account.

**Authentication:** Not Required

**Request Body**

```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "12345678"
}
```

**Success Response**

```json
{
    "success": true,
    "message": "User registered successfully"
}
```

**Possible Errors**

- Validation failed
- Email already exists

---

### 6.2 Login User

**Endpoint**

```http
POST /api/auth/login
```

**Description**

Authenticates a user and returns a JWT access token.

**Authentication:** Not Required

**Request Body**

```json
{
    "email": "john@example.com",
    "password": "12345678"
}
```

**Success Response**

```json
{
    "success": true,
    "token": "<jwt_token>"
}
```

**Possible Errors**

- Invalid email
- Invalid password

---

### 6.3 Get User Profile

**Endpoint**

```http
GET /api/auth/profile
```

**Description**

Returns the authenticated user's profile.

**Authentication:** Required

**Headers**

```http
Authorization: Bearer <jwt_token>
```

**Success Response**

```json
{
    "success": true,
    "data": {
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

---

### 6.4 Admin Authorization Test

**Endpoint**

```http
GET /api/auth/admin
```

**Description**

Checks whether the authenticated user has the **Admin** role.

**Authentication:** Required
**Authorization:** Admin Only

**Success Response**

```json
{
    "success": true,
    "message": "Welcome Admin"
}
```

---

## 7. File Management APIs

### 7.1 Upload Single File

**Endpoint**

```http
POST /api/files/uploads
```

**Description**

Uploads a single document for processing through the RAG pipeline.

**Authentication:** Required
**Content Type:** `multipart/form-data`

**Form Data**

| Field | Type |
| ----- | ---- |
| file  | File |

**Supported Files**

- PDF
- DOCX
- XLSX
- HTML
- Markdown

**Success Response**

```json
{
    "success": true,
    "message": "File uploaded successfully"
}
```

---

### 7.2 Upload Multiple Files

**Endpoint**

```http
POST /api/files/uploads/multiple
```

**Description**

Uploads multiple documents in one request.

Maximum files allowed: **5**

**Authentication:** Required
**Content Type:** `multipart/form-data`

**Form Data**

| Field | Type   |
| ----- | ------ |
| files | File[] |

**Success Response**

```json
{
    "success": true,
    "message": "Files uploaded successfully"
}
```

---

### 7.3 Get All Files

**Endpoint**

```http
GET /api/files/all
```

**Description**

Returns all uploaded files.

**Authentication:** Required
**Authorization:** Admin, User

**Success Response**

```json
{
    "success": true,
    "data": []
}
```

---

### 7.4 Get File By ID

**Endpoint**

```http
GET /api/files/:id
```

**Description**

Returns details of a specific uploaded file.

**Authentication:** Required
**Authorization:** Admin, User

**Success Response**

```json
{
    "success": true,
    "data": {}
}
```

---

### 7.5 Update File

**Endpoint**

```http
PUT /api/files/:id
```

**Description**

Updates an existing uploaded file.

**Authentication:** Required
**Authorization:** Admin, User
**Content Type:** `multipart/form-data`

**Form Data**

| Field | Type |
| ----- | ---- |
| file  | File |

**Success Response**

```json
{
    "success": true,
    "message": "File updated successfully"
}
```

---

### 7.6 Delete File

**Endpoint**

```http
DELETE /api/files/:id
```

**Description**

Deletes a file and its associated records.

**Authentication:** Required
**Authorization:** Admin, User

**Success Response**

```json
{
    "success": true,
    "message": "File deleted successfully"
}
```

---

## 8. Chat API

### 8.1 Ask Question

**Endpoint**

```http
POST /api/chat
```

**Description**

Processes a user question using the Retrieval-Augmented Generation (RAG) pipeline.

The API performs the following operations:

1. Generate question embedding.
2. Retrieve relevant document chunks.
3. Build the prompt.
4. Send the prompt to the configured LLM.
5. Return the generated answer.

**Authentication:** Depends on project configuration.

**Request Body**

```json
{
    "question": "What is Retrieval-Augmented Generation?"
}
```

**Success Response**

```json
{
    "success": true,
    "answer": "Retrieval-Augmented Generation (RAG) is..."
}
```

---

## 9. HTTP Status Codes

| Status Code | Description                    |
| ------------ | -------------------------------- |
| 200         | Request completed successfully |
| 201         | Resource created successfully  |
| 400         | Bad Request                    |
| 401         | Unauthorized                   |
| 403         | Forbidden                      |
| 404         | Resource Not Found             |
| 500         | Internal Server Error          |

---

## 10. Error Responses

**400 Bad Request**

```json
{
    "success": false,
    "message": "Validation failed"
}
```

**401 Unauthorized**

```json
{
    "success": false,
    "message": "Unauthorized"
}
```

**403 Forbidden**

```json
{
    "success": false,
    "message": "Access denied"
}
```

**404 Not Found**

```json
{
    "success": false,
    "message": "Resource not found"
}
```

**500 Internal Server Error**

```json
{
    "success": false,
    "message": "Internal server error"
}
```

---

## 11. API Workflow Summary

**Authentication**

Register → Login → Receive JWT → Access Protected APIs

**File Processing**

Upload File → Parse Document → Create Chunks → Generate Embeddings → Store in PostgreSQL (pgvector)

**Question Answering**

User Question → Generate Embedding → Vector Search → Retrieve Context → Build Prompt → LLM → Return Answer

---

## 12. Notes

- All protected endpoints require a valid JWT token.
- File upload APIs accept `multipart/form-data`.
- Multiple file upload supports a maximum of **5 files**.
- The backend follows REST API principles.
- Responses are returned in JSON format.
- Vector search is performed using PostgreSQL with the pgvector extension.
- The RAG pipeline retrieves relevant document chunks before generating answers using the configured LLM.