# GearGuard - Maintenance Management System

A full-scale MERN Stack maintenance management system for tracking equipment, assigning maintenance teams, and managing maintenance requests with automated workflows.

## 🚀 Tech Stack

- **Frontend**: React.js + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT-based
- **UI Pattern**: Kanban Board + Calendar View
- **Role-based Access**: Admin, Manager, Technician, User

## 📁 Project Structure

```
GearGuard/
├── backend/              # Node.js + Express API
├── frontend/             # React.js Application
├── docker-compose.yml    # Docker orchestration
└── README.md            # This file
```

## 🏗️ Architecture

### Backend Structure
- **Clean Architecture** with separation of concerns
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and workflows
- **Models**: MongoDB schemas with Mongoose
- **Middleware**: Auth, validation, error handling
- **Utils**: Shared helper functions

### Frontend Structure
- **Component-based** with reusable UI elements
- **Page-level** components for routing
- **Custom Hooks** for logic reuse
- **Context API** for state management
- **Service Layer** for API communication

## 🚦 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+)
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd GearGuard

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Setup

Create `.env` files in both backend and frontend directories (see `.env.example` files).

### Running the Application

```bash
# Terminal 1 - Start MongoDB (if local)
mongod

# Terminal 2 - Start Backend
cd backend
npm run dev

# Terminal 3 - Start Frontend
cd frontend
npm start
```

### Using Docker

```bash
# Start all services
docker-compose up

# Stop all services
docker-compose down
```

## 🔐 Default Users

After seeding the database:
- **Admin**: admin@gearguard.com / Admin@123
- **Manager**: manager@gearguard.com / Manager@123
- **Technician**: tech@gearguard.com / Tech@123
- **User**: user@gearguard.com / User@123

## 📚 API Documentation

API documentation is available at `http://localhost:5000/api-docs` when running the backend.

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Features

- ✅ JWT Authentication & Authorization
- ✅ Role-based Access Control (RBAC)
- ✅ Equipment Management
- ✅ Maintenance Request Tracking (Corrective & Preventive)
- ✅ Team Management & Assignment
- ✅ Kanban Board for Request Workflow
- ✅ Calendar View for Scheduling
- ✅ Automated Notifications
- ✅ Activity Audit Logs
- ✅ Real-time Status Updates

## 📝 License

MIT License

## 👥 Team

Built with ❤️ by the GearGuard Team
