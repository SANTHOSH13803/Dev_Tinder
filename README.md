# DevTinder

DevTinder is a full-stack MERN application inspired by Tinder, designed for developers to connect and network with each other. Users can create profiles, discover other developers, send connection requests, and build professional connections through a simple and intuitive interface.

## Overview

DevTinder enables developers to build professional connections by creating profiles, exploring other users, and managing connection requests. The application follows a modern client-server architecture with secure authentication and scalable backend design.

## Features

- User Authentication using JWT
- Sign Up and Login
- Create and Update Profile
- Browse Developer Feed
- Send Connection Requests
- Accept or Reject Requests
- View Connections
- Protected Routes
- Responsive User Interface

## Tech Stack

### Frontend

- React
- Redux Toolkit
- RTK Query
- React Router
- Tailwind CSS
- ShadCn UI

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

## Project Structure

```text
devtinder/
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── redux/
│
├── backend/
│   ├── src/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── config/
│
└── README.md
```

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd devtinder
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the backend directory and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

## Key Learnings

- Full-Stack MERN Development
- REST API Design
- Authentication and Authorization
- MongoDB Data Modeling
- Redux Toolkit and RTK Query
- State Management
- Frontend and Backend Integration
- Secure Authentication Practices

## Future Enhancements

- Real-Time Chat
- Notifications
- Profile Search and Filters
- User Recommendations
- Dark Mode
- Profile Verification
