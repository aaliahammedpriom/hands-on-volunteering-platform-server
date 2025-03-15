# HandsOn Server

## Overview
The backend of **HandsOn**, a community-driven social volunteering platform, is built with **Express.js** and **MongoDB**. It provides APIs for managing users, posts, and events.

## Git Repository
- [Client Repository](https://github.com/aaliahammedpriom/hands-on-volunteering-platform-client)
- [Server Repository](https://github.com/aaliahammedpriom/hands-on-volunteering-platform-server)

## Features
- User authentication and authorization (Firebase & JWT-based)
- CRUD operations for user profiles, posts, and events
- Efficient data handling with MongoDB

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT

## ⚙ Setup Instructions

### 1. Clone the repository
```sh
git clone https://github.com/aaliahammedpriom/hands-on-volunteering-platform-server.git
cd handson-server
```

### 2. Install dependencies
```sh
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory and add the required credentials:
```env
DB_USER=your_DB_USER
DB_PASS=your_DB_PASS
ACCESS_TOKEN=your_ACCESS_TOKEN
```

### 4. Run the development server
```sh
nodemon
```

## API Endpoints

### **User Authentication**
- `POST /jwt` – Generate JWT token
- `POST /users` – Register a new user
- `GET /users/:uid` – Get user details by UID
- `GET /users` – Search users by email
- `GET /user/:email` – Get user details by email
- `PATCH /update/:uid` – Update user details
- `PATCH /users/log` – Increment user log count

### **Events**
- `POST /events` – Create a new event
- `GET /events` – Fetch all events (supports filtering by location, category, and availability)
- `GET /events/user/:uid` – Fetch events created by a user (requires authentication)
- `GET /events/:id` – Get event details by ID (requires authentication)

### **Community Help Requests**
- `POST /communityhelp` – Create a new help request (requires authentication)
- `GET /communityhelp` – Fetch all community help requests (supports filtering by location, urgency, and availability)
- `POST /communityhelpmessage` – Send a message related to a community help request (requires authentication)
- `GET /communityhelpmessage/:creator` – Fetch messages sent to a community help request creator (requires authentication)

### **Contributions**
- `POST /contribution` – Join a contribution (requires authentication)
- `GET /contribution` – Fetch all contributions
- `GET /contribution/user/:uid` – Fetch contributions by a specific user (requires authentication)

### **Teams**
- `POST /team` – Create a new team (requires authentication)
- `GET /team` – Fetch all teams (supports leaderboard sorting)
- `GET /teamowner` – Fetch teams owned by a user (requires authentication)
- `GET /teamdetails` – Fetch team details by ID (requires team permission verification)

### **Team Requests**
- `POST /teamrequest` – Send a team join request (requires authentication)
- `PATCH /teamrequest` – Update team join request status (requires authentication)
- `GET /teamrequest/:id` – Fetch approved team requests by team ID (requires authentication)

### **Team Discussions**
- `POST /teamdiscussion` – Create a discussion post in a team (requires authentication)
- `GET /teamdiscussion/:id` – Fetch discussion posts by team ID (requires authentication)

---

📢 **Contributions are welcome!** If you'd like to improve HandsOn, feel free to submit a pull request. 🎉

