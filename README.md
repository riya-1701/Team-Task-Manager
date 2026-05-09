# Team Task Manager

Welcome to **Team Task Manager**, a robust and collaborative project management application designed to help teams organize, track, and accomplish their tasks efficiently. This production-ready To-Do app comes with built-in Role-Based Access Control (RBAC), allowing seamless collaboration between project admins and team members.

## Live URL: https://team-task-manager-eosin-chi.vercel.app/login 

## Features

- **User Authentication:** Secure signup and login using JWT (JSON Web Tokens).
- **Role-Based Access Control (RBAC):** Differentiated views and permissions for `Admin` and `Member` roles.
  - **Admins** can create projects, add members, and manage tasks across the project.
  - **Members** can view their assigned tasks, update their status, and collaborate within assigned projects.
- **Project Management:** Create, edit, and delete projects. Manage team members collaboratively.
- **Task Handling:** Comprehensive task lifecycle management—create, assign, edit, and track progress.
- **Dashboard Statistics:** Real-time visibility into project progress and task distribution, tailored to user roles.
- **Modern UI:** A sleek, responsive dark-themed interface built with React and Tailwind CSS.

## Tech Stack

### Frontend
- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS (v4)
- **Routing:** React Router DOM
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** bcryptjs for password hashing, jsonwebtoken (JWT) for session management

## 📝 License
   Rya Srivastava

This project is licensed under the ISC License.
