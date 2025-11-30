
# Employee Attendance System

A full-stack web application to automate employee attendance tracking with role-based access control.  
Employees can mark daily check-in/check-out, while managers can view and generate attendance reports.

Demo Video- https://drive.google.com/file/d/1At5M2vQKrPRjthhFJWl496Z9VxEOcmGm/view?usp=drive_link
---

## Tech Stack
**Frontend:** React, TypeScript, Zustand  
**Backend:** Node.js, Express  
**Database:** MongoDB  
**Authentication:** JWT  
**Tools:** Git, VS Code, Postman

---

## ⚙ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/employee-attendance-system.git
cd employee-attendance-system


### 1. Frontend (Browser Preview)
The application currently runs in **Demo Mode** using a mock backend service (`services/mockBackend.ts`). This allows you to view the UI and test features immediately in the browser without setting up a server.

### 2. Backend (Local Setup)
To run the full stack application with a real database:

1.  **Prerequisites:**
    *   Node.js installed
    *   MongoDB installed and running locally (or use MongoDB Atlas)

2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    # Create a .env file with: MONGO_URI=your_mongodb_connection_string
    npm start
    ```

3.  **Connect Frontend to Backend:**
    *   Modify `store.ts` to make HTTP requests (using `fetch` or `axios`) to `http://localhost:5000` instead of calling `mockBackend`.
    *   Example: Replace `backend.login(email, password)` with `fetch('http://localhost:5000/api/auth/login', ...)`

## Features
*   **Employee:** Register/Login, Check In/Out, View History, Dashboard Stats.
*   **Manager:** View Team Attendance, Reports, Export CSV, Team Calendar.
