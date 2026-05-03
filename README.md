# Sociali API

A social media backend API built with Node.js, Express, and MongoDB.

## Features

### Authentication

* User signup and login
* JWT-based authentication (1 hour expiry)

### Users

* Follow / Unfollow users
* View followers and following lists

### Posts

* Create posts (default: draft)
* Publish posts
* Edit and delete posts
* Get own posts (paginated & filterable)

### Public Access

* View all published posts (no login required)
* View single published post
* Search by title, author, tags
* Sort by likes, comments, timestamp
* Pagination (default: 20 per page)

### Likes

* Like and unlike posts
* Prevent duplicate likes

### Feed

* Personalized feed based on followed users

### Testing

* Integration tests using Jest and Supertest

---

## Tech Stack

* Node.js
* Express
* MongoDB (Mongoose)
* JWT Authentication
* Jest + Supertest

---

## Installation

```bash
git clone https://github.com/dominion-000/sociali.git
cd sociali
npm install
```

---

## Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
JWT_EXPIRE=1h
```

---

## Run the App

```bash
npm run dev
```

---

## Run Tests

```bash
npm test
```

---

## API Endpoints

### Auth

* POST `/api/v1/auth/signup`
* POST `/api/v1/auth/login`

### Posts

* GET `/api/v1/posts`
* GET `/api/v1/posts/:id`
* POST `/api/v1/posts`
* PATCH `/api/v1/posts/:id`
* DELETE `/api/v1/posts/:id`
* PATCH `/api/v1/posts/:id/publish`
* GET `/api/v1/posts/me`
* GET `/api/v1/posts/feed`

### Likes

* POST `/api/v1/posts/:id/like`
* DELETE `/api/v1/posts/:id/like`

### Users

* POST `/api/v1/users/:id/follow`
* DELETE `/api/v1/users/:id/follow`
* GET `/api/v1/users/me/followers`
* GET `/api/v1/users/me/following`

