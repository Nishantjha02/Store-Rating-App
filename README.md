# Store Rating System

A full-stack MERN-style application (React + Node.js + MySQL) that allows:
- **Admins** to manage users and stores
- **Store owners** to view ratings and reviews for their store
- **Normal users** to rate and review stores

This project was built as part of the **Roxiler Systems Coding Challenge**.

---

## 📌 Features

### Admin Panel
- View dashboard with total users, total stores, and total ratings
- Create new users and store owners
- View and manage all stores and users

### Store Owner Dashboard
- View store details (name, email, address, join date)
- See average store rating and all customer reviews
- View rating distribution (1–5 stars)

### User Features
- Browse and rate stores
- Leave written reviews

---

## 🛠 Tech Stack

**Frontend:**
- React.js
- Axios for API calls
- Context API for authentication state
- CSS for styling

**Backend:**
- Node.js + Express.js
- MySQL database
- JWT Authentication
- bcrypt for password hashing

---

## 📂 Project Structure

store-rating-system/
│
├── backend/ # Express API server
│ ├── routes/ # API routes
│ ├── controllers/ # Request handlers
│ ├── models/ # DB models & queries
│ ├── config/ # DB connection
│ ├── middleware/ # Auth middleware
│ ├── .env.example # Sample environment variables
│ └── server.js
│
├── frontend/ # React application
│ ├── src/
│ └── public/
│
├── db/ # Database dump & SQL setup
│ └── database.sql
│
├── .gitignore
├── README.md

yaml
Copy code

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/store-rating-system.git
cd store-rating-system
2️⃣ Backend Setup
Go into the backend folder:

bash
Copy code
cd backend
Install dependencies:

bash
Copy code
npm install
Create a .env file in the backend folder using .env.example:

bash
Copy code
cp .env.example .env
Important: Update .env values with your local credentials.

Example .env:

ini
Copy code
PORT=5000
DB_HOST=localhost
DB_USER=store_user
DB_PASSWORD=password123
DB_NAME=store_rating_app
JWT_SECRET=replace_this_with_a_secure_key
Import the database:

Open MySQL and create the database:

sql
Copy code
CREATE DATABASE store_rating_app;
Import the provided dump:

bash
Copy code
mysql -u root -p store_rating_app < ../db/database.sql
(Replace root with your MySQL user)

Start the backend server:

bash
Copy code
npm start
3️⃣ Frontend Setup
Go into the frontend folder:

bash
Copy code
cd ../frontend
Install dependencies:

bash
Copy code
npm install
Start the frontend development server:

bash
Copy code
npm start
The frontend will run on http://localhost:3000 and will communicate with the backend API on http://localhost:5000.

🗄 Database Notes
A database.sql file is included in the /db folder with:

Pre-created admin user

Sample store owner

Example store

This allows reviewers to run the project immediately without manually creating data.

🔐 Default Credentials for Testing
Admin Login:

pgsql
Copy code
Email: admin@example.com
Password: Admin@123
Store Owner Login:

pgsql
Copy code
Email: owner@example.com
Password: Owner@123
User Login:

sql
Copy code
Email: user@example.com
Password: User@123
🚀 Running the Project
After setting up both backend and frontend:

Start backend:

bash
Copy code
cd backend && npm start
Start frontend:

bash
Copy code
cd frontend && npm start