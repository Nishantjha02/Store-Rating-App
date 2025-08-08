# Store Rating System

A full-stack web application for managing stores and customer ratings with role-based access control. Built with React, Node.js/Express, and MySQL.

# Screenshots
Login Page  
<img width="600" height="460" alt="Screenshot 2025-08-09 004721" src="https://github.com/user-attachments/assets/14126fb3-e187-4aea-8498-6116d9e8f17a" />

Admin Dashboard  
<img width="600" height="338" alt="Screenshot 2025-08-09 004816" src="https://github.com/user-attachments/assets/fbd8e4ed-c41d-4515-bb64-7388d1ed70fd" />

Admin Dashboard  
<img width="600" height="341" alt="Screenshot 2025-08-09 004849" src="https://github.com/user-attachments/assets/dd8866f1-14c6-4dfb-adb8-4a7f4bced1f1" />

Admin Dashboard  
<img width="600" height="242" alt="Screenshot 2025-08-09 004909" src="https://github.com/user-attachments/assets/642fc5e3-3d0d-4b41-bcd6-c5378d08b762" />

User DashBoard  
<img width="600" height="298" alt="Screenshot 2025-08-09 005458" src="https://github.com/user-attachments/assets/b6ab3014-6c27-4034-a702-a0367da2d240" />

Store owner Dashboard  
<img width="600" height="361" alt="Screenshot 2025-08-09 005654" src="https://github.com/user-attachments/assets/1112cf47-5d20-4dcc-8933-29774006f65d" />


## 🌟 Features

### Authentication System
- ✅ User registration with comprehensive validation
- ✅ JWT-based secure login system
- ✅ Role-based access control (Admin, User, Store Owner)
- ✅ Password update functionality

### Admin Features
-  Dashboard with comprehensive statistics
-  User management (view, create, filter, sort)
-  Store management (view, create, filter, sort)
-  Add new users with different roles
-  Create stores with owner accounts

### User Features
-  View and search all stores with ratings
-  Submit ratings (1-5 stars) with reviews
-  Update existing ratings
-  View personal rating history

### Store Owner Features
-  Store dashboard with average rating
-  View all customer ratings and reviews
-  See rating distribution
-  View customer details

## 🛠️ Tech Stack

- **Frontend**: React 18, CSS3, Axios
- **Backend**: Node.js, Express.js
- **Database**: MySQL 8.0+
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **Validation**: express-validator

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MySQL Server** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download here](https://git-scm.com/)
- **Text Editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Nishantjha02/Store-Rating-App.git
cd Store-Rating-App

```

### Step 2: Database Setup

Open MySQL command line or MySQL Workbench and execute:

```sql
CREATE DATABASE store_rating_system;
USE store_rating_system;
```

### Step 3: Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create environment file:

```bash
# Create .env file
touch .env
```

Add the following content to `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=store_rating_system
JWT_SECRET=your_super_secret_jwt_key_here_12345
PORT=5000
```

**⚠️ Important**: Replace `your_mysql_password_here` with your actual MySQL password.

### Step 4: Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

## 🏃‍♂️ Running the Application

### Start Backend Server

Open a terminal and run:

```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
Database initialized successfully
```

### Start Frontend Application

Open a new terminal and run:

```bash
cd frontend
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

## 🔐 Default Admin Account

Use these credentials to access the admin panel:

- **Email**: `admin@example.com`
- **Password**: `Admin123!`

## 🧪 Testing the Application

Follow these steps to test all features:

1. **Admin Login**: Use default admin credentials
2. **Create Users**: Add new users via Admin Panel
3. **Create Stores**: Add stores via Admin Panel
4. **User Registration**: Register as a regular user
5. **Rate Stores**: Login as user and rate stores
6. **Store Dashboard**: Login as store owner to view ratings

## 📁 Project Structure

```
store-rating-system/
├── README.md
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── .env
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Store.js
│   │   └── Rating.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── user.js
│   │   └── store.js
│   ├── middleware/
│   │   └── auth.js
│   └── utils/
│       └── validation.js
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── components/
        │   ├── Login.js
        │   ├── Register.js
        │   ├── AdminDashboard.js
        │   ├── UserDashboard.js
        │   └── StoreDashboard.js
        ├── contexts/
        │   └── AuthContext.js
        ├── services/
        │   └── api.js
        └── styles/
            └── App.css
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Admin Routes (requires admin role)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get users with filters
- `POST /api/admin/users` - Create new user
- `GET /api/admin/stores` - Get stores with filters
- `POST /api/admin/stores` - Create new store

### User Routes (requires user role)
- `GET /api/user/stores` - Get stores with user ratings
- `POST /api/user/rating` - Submit rating
- `PUT /api/user/rating` - Update rating
- `PUT /api/user/password` - Update password

### Store Routes (requires store_owner role)
- `GET /api/store/dashboard` - Get store dashboard
- `GET /api/store/ratings` - Get store ratings
- `PUT /api/store/password` - Update password



## 🎯 User Roles

1. **Admin**: Full system access, manage users and stores
2. **User**: Can view and rate stores
3. **Store Owner**: Can view their store's ratings and customer feedback




## 🌐 Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🎉 Acknowledgments

- Built with modern web technologies
- Responsive design for all devices
- Comprehensive error handling and validation
- Real-time search and filtering capabilities

---
