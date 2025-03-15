# HandsOn Backend

## Overview
The backend of HandsOn, a community-driven social volunteering platform, is built with Express.js and MongoDB. It provides APIs for managing users, posts, and events.

## Features
- User authentication and authorization (Firebase & JWT-based)
- CRUD operations for user profiles, posts, and events
- Image uploads with Cloudinary
- Secure password hashing with bcrypt
- Efficient data handling with MongoDB

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Storage:** Cloudinary (for images)
- **Security:** bcrypt, helmet, CORS

## Installation
```sh
# Clone the repository
git clone https://github.com/aaliahammedpriom/hands-on-volunteering-platform-server.git
cd HandsOn-Backend

# Install dependencies
npm install

# Set up environment variables (.env file)
DB_USER=your_DB_USER
DB_PASS=your_DB_PASS
ACCESS_TOKEN=your_ACCESS_TOKEN

# Run the server
npm start
```

## API Endpoints
### User Routes
- **POST** `/api/users/register` - Register a new user
- **POST** `/api/users/login` - Authenticate a user
- **GET** `/api/users/:id` - Get user details
- **PUT** `/api/users/:id` - Update user profile

### Post Routes
- **POST** `/api/posts` - Create a new post (Only the creator can edit/delete)
- **GET** `/api/posts` - Get all posts
- **GET** `/api/posts/:id` - Get a specific post
- **PUT** `/api/posts/:id` - Update a post (Only the creator can edit/delete)
- **DELETE** `/api/posts/:id` - Delete a post (Only the creator can edit/delete)

### Event Routes
- **POST** `/api/events` - Create a new event
- **GET** `/api/events` - Get all events
- **GET** `/api/events/:id` - Get a specific event
- **PUT** `/api/events/:id` - Update an event (Only the creator can edit/delete)
- **DELETE** `/api/events/:id` - Delete an event (Only the creator can edit/delete)



📢 Contributions are welcome! If you'd like to improve HandsOn, feel free to submit a pull request. 🎉

# hands-on-volunteering-platform-server
