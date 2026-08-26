
# 🚗 Vehicle Monitoring System
[![Live Demo](https://img.shields.io/badge/Live-Demo-green?logo=render)](https://vehicle-monitoring-system-1.onrender.com)

A comprehensive fleet management system for tracking vehicles, drivers, attendance, and maintenance. Built with the MERN stack and deployed on Render.

## 🌐 Live Demo

- **Frontend (Live App)**: [https://vehicle-monitoring-system-1.onrender.com](https://vehicle-monitoring-system-1.onrender.com)
- **Backend API**: [https://vehicle-monitoring-system-bh4x.onrender.com](https://vehicle-monitoring-system-bh4x.onrender.com)
- **GitHub Repository**: [https://github.com/vibamalika25/Vehicle-Monitoring-System](https://github.com/vibamalika25/Vehicle-Monitoring-System)

## ✨ Features

- **Authentication**: Secure login/logout with JWT tokens
- **Role-Based Access**: Admin and Driver roles with different permissions
- **Vehicle Management**: Track vehicle status, assignments, and history
- **Driver Management**: Manage driver profiles and assignments
- **Attendance Tracking**: Record and view driver attendance
- **Shift Management**: Manage driver shifts and schedules
- **Maintenance Records**: Track vehicle maintenance history
- **Real-time Data**: Live updates and recording

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - REST API
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email services
- **File-based storage** (JSON files) - Lightweight data persistence

### Frontend
- **React** - UI Framework
- **React Router** - Navigation
- **Axios** - HTTP requests
- **Context API** - State management

## 📁 Project Structure

```
Vehicle-Monitoring-System/
├── backend/
│   ├── routes/
│   │   ├── drivers.js
│   │   ├── vehicles.js
│   │   ├── maintenance.js
│   │   └── attendance.js
│   ├── utils/
│   │   └── dataUtils.js
│   ├── data/
│   │   ├── admins.json
│   │   ├── drivers.json
│   │   ├── vehicles.json
│   │   ├── attendance.json
│   │   └── maintenance.json
│   ├── server.js
│   ├── index.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env
└── README.md
```

## 🚀 Deployment on Render

### Backend Deployment (Web Service)

1. **On Render Dashboard**, click **"New +"** → **"Web Service"**
2. **Connect your GitHub repository**
3. **Configure the service**:
   ```yaml
   Name: vehicle-monitoring-backend
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```
4. **Add Environment Variables**:
   ```env
   JWT_SECRET=your-secret-key-here
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=https://vehicle-monitoring-system-1.onrender.com
   PORT=5000
   ```
5. **Deploy**: Click **"Create Web Service"**

### Frontend Deployment (Static Site)

1. **On Render Dashboard**, click **"New +"** → **"Static Site"**
2. **Configure the site**:
   ```yaml
   Name: vehicle-monitoring-frontend
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: build
   ```
3. **Add Environment Variable**:
   ```env
   REACT_APP_API_URL=https://vehicle-monitoring-system-bh4x.onrender.com
   ```
4. **Deploy**: Click **"Create Static Site"**

## 🔐 Default Login Credentials

After deployment, use these credentials to log in:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@example.com` | `admin` |

> **Note**: The system automatically creates this default admin account on first startup.

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
JWT_SECRET=your-secret-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=https://vehicle-monitoring-system-1.onrender.com
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://vehicle-monitoring-system-bh4x.onrender.com
```

## 🛠️ Local Development

### Backend Setup
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

### Run Both (Development)
```bash
# In backend folder
npm run dev
# In frontend folder (separate terminal)
npm start
```


## 🙏 Acknowledgments

- Built with ❤️ using React, Node.js, and Express
- Deployed on [Render](https://render.com)
- Icons and UI components from [Font Awesome](https://fontawesome.com)

---

**Happy Monitoring!** 🚗💨
```

This README is now fully customized with your actual frontend URL (`https://vehicle-monitoring-system-1.onrender.com`) and backend URL (`https://vehicle-monitoring-system-bh4x.onrender.com`). It includes all necessary deployment instructions, default credentials, and troubleshooting steps.
