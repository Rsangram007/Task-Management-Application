# Task Management Application

## Overview
The Task Management Application is a feature-rich platform that enables users to organize, track, and analyze their tasks efficiently. Users can perform CRUD operations on tasks, filter and sort tasks, and view comprehensive statistics on task progress. The app enforces secure authentication and ensures users can manage only their own tasks.

---

## Tech Stack

### Front End
- **Framework**: React (using TypeScript)
- **Styling**: TailwindCSS,Shadcn

### Back End
- **Framework**: Node.js with Express
- **Database**: MongoDB,
- **Authentication**: JSON Web Tokens (JWT)

---

## Features

### Task Management
1. **Task Fields**:
   - Title
   - Start Time
   - End Time
   - Priority (values 1-5)
   - Status (Pending or Finished)
2. **Behavior**:
   - End Time represents estimated time for pending tasks.
   - End Time is updated to actual completion time when a task is marked as Finished.

### Task Operations
1. **CRUD**: Users can create, update, delete, and view tasks.
2. **Filters**:
   - By Priority
   - By Completion Status
3. **Sorting**:
   - By Start Time
   - By End Time
4. **Pagination**:
   - Tasks are paginated on both frontend and backend.

### Dashboard
The dashboard provides the following statistics:
1. **Total Task Count**
2. **Completion Status Percentages**:
   - Pending Tasks
   - Completed Tasks
3. **Pending Tasks Analysis** (Grouped by Priority):
   - Total Time Lapsed
   - Balance Estimated Time Left
4. **Completed Tasks Analysis**:
   - Overall Actual Average Time for Completion (in hours)

### Authentication
- Username (email-ID) and password-based login.
- JWT for session management.
- Private pages redirect users to the login page if unauthenticated.
- Logged-in users are redirected to the dashboard from the home page.

---

## API Endpoints

### Authentication
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Authenticate a user and return a JWT.

### Task Management
- **GET** `/api/tasks`: Fetch tasks with filtering, sorting, and pagination.
- **POST** `/api/tasks`: Create a new task.
- **PUT** `/api/tasks/:id`: Update a task by ID.
- **DELETE** `/api/tasks/:id`: Delete a task by ID.

### Dashboard Statistics
- **GET** `/api/dashboard`: Fetch task statistics for the authenticated user.

---

## Validations

### Frontend
- Prevent invalid data entry using form validation.
- Ensure required fields are filled before submission.
- Validate time fields to ensure logical consistency:
  - End Time must be after Start Time.
  - Current time cannot be before Start Time for pending tasks.

### Backend
- Validate all task fields to ensure they adhere to requirements.
- Prevent unauthorized access to tasks.
- Ensure task operations are restricted to authenticated users.

---

## Installation and Setup

### Prerequisites
- Node.js and npm
- MongoDB

### Backend
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   PORT=5000
   DATABASE_URL=<your-database-url>
   JWT_SECRET=<your-secret-key>
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=<backend-api-url>
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## Usage
1. Register a new account or log in with an existing account.
2. Access the dashboard to view task statistics and manage tasks.
3. Use filters and sorting to organize tasks efficiently.
4. Analyze task progress and time utilization via the dashboard.

---

## Future Enhancements
- Add support for multiple user roles (e.g., Admin, User).
- Implement reminders and notifications for pending tasks.
- Enhance UI/UX with additional animations and themes.
- Add export/import functionality for task data.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.

