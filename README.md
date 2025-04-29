# Eatoes Assignment

## Table of Contents

- [Project Overview](#project-overview)
- [Backend Setup & Running Locally](#backend-setup--running-locally)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Database Design: MongoDB vs PostgreSQL](#database-design-mongodb-vs-postgresql)
- [Frontend Deployment](#frontend-deployment)
- [Assumptions & Challenges](#assumptions--challenges)

---

## Project Overview

This project is a food ordering backend with a React frontend, supporting menu management and order placement. The backend uses Node.js, Express, TypeScript, MongoDB, and PostgreSQL (via Prisma).

---

## Backend Setup & Running Locally

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd eatoes-assignment/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your MongoDB and PostgreSQL connection strings.

4. **Set up the databases:**
   - Ensure MongoDB and PostgreSQL are running.
   - Run Prisma migrations for PostgreSQL:
     ```bash
     npx prisma migrate dev
     ```

5. **Build and start the server:**
   ```bash
   npm run build
   npm start
   ```

---

## Database Setup

- **MongoDB:** Used for storing menu items.
- **PostgreSQL (Prisma):** Used for storing orders.

You must have both MongoDB and PostgreSQL instances running and accessible via the connection strings in your `.env` file.

---

## API Endpoints

### Menu (MongoDB)

- `GET /menu` - Get all menu items
- `POST /menu` - Create a new menu item
- `PATCH /menu/:id` - Update a menu item
- `DELETE /menu/:id` - Delete a menu item

### Orders (PostgreSQL/Prisma)

- `GET /orders` - Get all orders for the authenticated user
- `POST /orders` - Create a new order (requires authentication)

---

## Database Design: MongoDB vs PostgreSQL

**MongoDB** was chosen for menu items because:

- Menu data is document-oriented, flexible, and may change structure over time.
- MongoDB allows for rapid prototyping and schema-less design, which fits the dynamic nature of menu items.

**PostgreSQL** (via Prisma) was chosen for orders because:

- Orders require transactional integrity, relational structure, and strong consistency.
- PostgreSQL supports complex queries and relationships (e.g., users, order items).
- Prisma provides type safety and migrations for relational data.

**Hybrid Approach Justification:**

- Using both databases leverages the strengths of each: flexibility for menu data and transactional safety for orders.

---

## Frontend Deployment

The frontend is deployed on Netlify:  
**[Frontend Application Link](<YOUR_NETLIFY_LINK_HERE>)**

> Please replace `<YOUR_NETLIFY_LINK_HERE>` with your actual Netlify deployment URL.

---

## Assumptions & Challenges

### Assumptions

- Users are authenticated before placing orders.
- Menu items are managed by an admin or authorized user.
- Both MongoDB and PostgreSQL are available in the deployment environment.

### Challenges

- Integrating two databases and ensuring data consistency.
- Managing environment variables securely for both databases.
- Handling different data models (NoSQL vs SQL) in the same codebase.

---