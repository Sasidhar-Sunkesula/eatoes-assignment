# Eatoes Assignment

## Table of Contents

- [Project Overview](#project-overview)
- [Backend Setup & Running Locally](#backend-setup--running-locally)
- [Database Design Choice](#database-design-choice)
- [API Endpoints](#api-endpoints)
- [Frontend Deployment](#frontend-deployment)
- [Assumptions & Challenges](#assumptions--challenges)

---

## Project Overview

This project is a food ordering platform, supporting menu management and order placement. The backend uses Node.js, Express, TypeScript, MongoDB, and PostgreSQL (via Prisma), while the frontend is built with React, TypeScript, Tailwind CSS and Shadcn/ui.

---

## Backend Setup & Running Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Sasidhar-Sunkesula/eatoes-assignment.git
   cd eatoes-assignment/backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your MongoDB and PostgreSQL connection strings.
   - Fill in your Clerk publishable key and secret key, you can use development keys. You can get it from Clerk dashboard for free [here](https://clerk.com/).
   - Fill in your direct connection string for PostgreSQL. This is used for migrations. I have used Supabase for PostgreSQL because neon.tech is going down from time to time.

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

## Database Design Choice

**MongoDB** was chosen for menu items because:

- Menu data is nested, variable and may change structure over time.
- MongoDB allows for rapid prototyping and schema-less design, which fits the dynamic nature of menu items.

**PostgreSQL** (via Prisma) was chosen for orders because:

- Orders require transactional integrity, relational structure, and strong consistency.
- PostgreSQL is a relational database and supports complex queries and relationships (e.g., users, order items).
- Prisma provides type safety and migrations for relational data.

**Hybrid Approach Justification:**

- Using both databases leverages the strengths of each: flexibility for menu data and transactional safety for orders.

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

## Frontend Deployment

The frontend is deployed on Netlify:  
**[Frontend Application Link](https://digital-diner-eatoes.netlify.app/)**

---

## Assumptions & Challenges

### Assumptions

- For simplicity, we are allowing everyone to add/edit/delete menu items. In a real-world scenario, we will be implementing Role-Based Access Control (RBAC) to restrict this to authorized users.

- For simplicity, we did not implement pagination for menu items, we will be implementing it in a real-world scenario.

### Challenges

- Integrating two databases and ensuring data consistency.
- Managing relationships between users and orders was a challenge because we are using Clerk for user authentication and management, so we had to sync the user data between Clerk and our PostgreSQL database.
- Handling different data models (NoSQL vs SQL) in the same codebase.

---
