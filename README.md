<div align="center">

# 🎬 NkMovies - Full-Stack Movie Streaming Platform

![NkMovies Banner](https://img.shields.io/badge/NkMovies-Streaming_Platform-e50914?style=for-the-badge&logo=netflix&logoColor=white)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TMDB](https://img.shields.io/badge/TMDB_API-Integration-01b4e4?style=for-the-badge&logo=themoviedb&logoColor=white)](https://developer.themoviedb.org/docs)

**A premium, cinematic web application for discovering, saving, and streaming movies instantly.**

[Features](#-features) • [Quick Start](#%EF%B8%8F-quick-start-guide) • [Architecture](#%EF%B8%8F-architecture) • [Deployment](#-deployment) 

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#%EF%B8%8F-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Overview

NkMovies is a complete full-stack web application designed to replicate a premium streaming service experience. It leverages the TMDB API for rich, up-to-date movie metadata and integrates a third-party streaming player (Vidking) for seamless video playback. With a custom Node.js backend, users can securely create accounts, log in, and curate their own personal list of favorite films.

---

## ✨ Features

### 🎥 **Seamless Streaming**
- **Integrated Player**: Watch movies directly in the browser via Vidking integration.
- **Dynamic Routing**: Dedicated `/movie/:id` pages for immersive viewing.

### 🔍 **Smart Discovery**
- **Live Debounced Search**: Lightning-fast search that updates as you type (no "Enter" required).
- **Genre Filtering**: Browse specific categories via a sticky sidebar.
- **Pagination**: Browse thousands of popular movies seamlessly.

### 👤 **User Personalization**
- **JWT Authentication**: Secure login and registration system.
- **Favorites Database**: Save and manage a persistent list of favorite movies stored in MongoDB.
- **Session Protection**: Protected routes that redirect unauthenticated users.

### 🎨 **Cinematic UI/UX**
- **Dynamic Backgrounds**: The app background updates dynamically based on the movie you hover over.
- **Modern Components**: Sleek, dark-mode UI utilizing `shadcn/ui` and custom CSS glassmorphism.
- **Loading States**: Skeleton loaders ensure a smooth visual experience while fetching data.

---

## 🏗️ Architecture

### System Components

```text
┌─────────────────────────────────────────────────────────────┐
│                       Browser (Client)                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                     React Frontend                    │  │
│  │              (Vite, React Router, shadcn/ui)          │  │
│  └──────┬───────────────────────┬─────────────────┬──────┘  │
└─────────┼───────────────────────┼─────────────────┼─────────┘
          │ HTTP/REST             │ HTTP/REST       │ Iframe
          │                       │                 │
┌─────────▼────────┐      ┌───────▼────────┐  ┌─────▼────────┐
│   Node Backend   │      │    TMDB API    │  │ Vidking CDN  │
│    (Express)     │      │   (Metadata)   │  │ (Video Host) │
└─────────┬────────┘      └────────────────┘  └──────────────┘
          │
┌─────────▼────────┐
│ MongoDB Database │
│(Users, Favorites)│
└──────────────────┘

```

### Technology Stack

#### Frontend
- **React 18** (via Vite)
- **React Router DOM** - Client-side routing
- **shadcn/ui & Lucide Icons** - Modern UI components
- **Axios** - Data fetching
- **React Loading Skeleton** - Perceived performance boosters

#### Backend
- **Node.js & Express** - REST API server
- **MongoDB & Mongoose** - NoSQL Database
- **JSON Web Tokens (JWT)** - Secure stateless authentication
- **Bcrypt.js** - Password hashing
- **CORS & Dotenv** - Security and environment configuration

---

## 📋 Prerequisites

### Make sure you have the following installed on your machine:
- **Node.js** (v18.x or higher)
- **MongoDB** (Local instance or MongoDB Atlas URI)
- **Git**

### You will also need:
- A free API key from [The Movie Database (TMDB)](https://developer.themoviedb.org/docs/getting-started)

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/nk-movies.git](https://github.com/yourusername/nk-movies.git)
cd nk-movies
```
### 2. Setup the Backend
```bash
cd backend
npm install
```
### 3. Setup the Frontend
```bash
cd ../frontend
npm install
```
---

## 🔐 Environment Variables
You must create two .env files to run this project locally. Never commit these files to GitHub.

### Backend .env (Create in /backend/.env)
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_string
```
### Frontend .env (Create in /frontend/.env)

```bash
# If using Vite, variables MUST start with VITE_
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_API_BASE_URL=http://localhost:5000
```
---
## 🏃‍♂️ Quick Start Guide
### Open two terminal windows to run both servers simultaneously.

### Terminal 1 (Backend):

```bash
cd backend
node index.js
# Server running on port 5000
# MongoDB Connected
```
### Terminal 2 (Frontend):

```bash
cd frontend
npm run dev
# App running at http://localhost:5173
```
---

## 📁 Project Structure
```text
nk-movies/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI (NavBar, Moviecard)
│   │   ├── context/          # React Context (MovieContext for favorites)
│   │   ├── css/              # Custom stylesheets (home.css, NavBar.css)
│   │   ├── pages/            # Route pages (Home, Login, WatchMovie, Favorites)
│   │   └── services/         # API call logic (api.js)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                  # Node.js backend server
│   ├── controllers/          # Business logic for routes
│   ├── models/               # Mongoose schemas (User, Favorite)
│   ├── routes/               # Express route definitions
│   ├── index.js              # Server entry point
│   └── package.json
│
├── .gitignore                # Root gitignore
└── README.md                 # Project documentation
```
## 🔌 API Endpoints

### Internal Backend API (`http://localhost:5000`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Authenticate and receive JWT | No |
| `GET` | `/api/favorites` | Get logged-in user's saved movies | Yes (JWT) |
| `POST` | `/api/favorites` | Add a movie to favorites | Yes (JWT) |
| `DELETE` | `/api/favorites/:id` | Remove a movie from favorites | Yes (JWT) |

---

## 🌐 Deployment

### Frontend (Vercel)
1. Push your code to GitHub.
2. Log in to Vercel and import your repository.
3. Set the **Root Directory** to `frontend`.
4. Add your `VITE_TMDB_API_KEY` and `VITE_API_BASE_URL` to the Environment Variables settings.
5. Deploy!

### Backend (Vercel)
1. Go back to your Vercel dashboard and click **Add New Project**.
2. Import the exact same GitHub repository.
3. Set the **Root Directory** to `backend`.
4. Add your `MONGO_URI` and `JWT_SECRET` in the Environment Variables tab.
5. Deploy!
*(Note: To run an Express server on Vercel, ensure you have a `vercel.json` file in your backend folder to configure the serverless functions).*

---

<div align="center">

**Developed by Naren Kumar Chandran**

⭐ Star this repo if you found it helpful!

</div>