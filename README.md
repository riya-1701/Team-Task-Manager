# Team Task Manager

Welcome to **Team Task Manager**, a robust and collaborative project management application designed to help teams organize, track, and accomplish their tasks efficiently. This production-ready To-Do app comes with built-in Role-Based Access Control (RBAC), allowing seamless collaboration between project admins and team members.

## 🔗 Live URL
https://team-task-manager-eosin-chi.vercel.app/login

## 🌟 Features

- **User Authentication:** Secure signup and login using JWT (JSON Web Tokens).
- **Role-Based Access Control (RBAC):** Differentiated views and permissions for `Admin` and `Member` roles.
  - **Admins** can create projects, add members, and manage tasks across the project.
  - **Members** can view their assigned tasks, update their status, and collaborate within assigned projects.
- **Project Management:** Create, edit, and delete projects. Manage team members collaboratively.
- **Task Handling:** Comprehensive task lifecycle management—create, assign, edit, and track progress.
- **Dashboard Statistics:** Real-time visibility into project progress and task distribution, tailored to user roles.
- **Modern UI:** A sleek, responsive dark-themed interface built with React and Tailwind CSS.

## 🛠️ Tech Stack

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

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (Local instance or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/riya-1701/Team-Task-Manager
   cd "Team Task Manager"
   ```

2. **Backend Setup:**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `backend` folder and configure the following environment variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_super_secret_jwt_key
     ```
   - Start the backend development server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup:**
   - Open a new terminal tab and navigate to the frontend directory:
     ```bash
     cd team-task-manager
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the React development server:
     ```bash
     npm run dev
     ```

4. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite) to view the app. The backend API will be running on `http://localhost:5000`.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License

**Rya Srivastava**

This project is licensed under the ISC License.
