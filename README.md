<h1 align="center">🛠️ Together Now Server</h1>
<p align="center">
  Backend API for the <strong>Together Now</strong> social and environmental action platform.
</p>

<p align="center">
  <img src="https://img.shields.io/github/languages/top/arik509/together-now-server" alt="Top Language">
  <img src="https://img.shields.io/github/repo-size/arik509/together-now-server" alt="Repo Size">
  <img src="https://img.shields.io/github/last-commit/arik509/together-now-server" alt="Last Commit">
  <img src="https://img.shields.io/badge/deployed-live-green" alt="Live Deploy">
</p>

---

## ✨ Features

- 🔐 JWT Authentication middleware (Firebase Admin SDK)
- 📣 REST APIs for managing community events (Create, Read, Update, Delete)
- 👥 User registration, login, and participation endpoints
- 🏅 Volunteer and badge management APIs
- ⚡ Real-time data: events, participants, and dashboard
- 🌍 CORS-enabled for frontend integration
- 🗄️ MongoDB database with flexible schema

---

## 🛠️ Tech Stack

- [![My Skills](https://skillicons.dev/icons?i=nodejs,express,js,mongodb)](https://skillicons.dev)
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** Firebase Admin SDK (JWT)
- **Deployment:** Render, Heroku, Vercel

---

## 🚦 Getting Started

1. **Clone the repository**
git clone https://github.com/arik509/together-now-server.git
cd together-now-server


2. **Install dependencies**

npm install


3. **Setup environment variables**
- Create a `.env` file and add your MongoDB URI and Firebase service credentials.

4. **Run server locally**

npm start


---

## 📂 Main Files

- `/index.js` – Entry point (Express server)
- `/encode.js` – Utility functions
- `/package.json` – Project dependencies and scripts
- `/vercel.json` – Deployment configuration (optional)

---

## 🚀 API Endpoints (Examples)

- `POST /api/events` – Create an event
- `GET /api/events` – List all events
- `GET /api/events/:id` – View event details
- `PUT /api/events/:id` – Update event
- `DELETE /api/events/:id` – Delete event
- `POST /api/volunteers` – Join as a volunteer
- `GET /api/user/:id/dashboard` – User’s joined events

*See code for full list and docs!*

---

## 🤝 Contributing

Open to issues and pull requests for improvements. Please submit descriptions for bug fixes, enhancements, or new endpoints.

---


## 🙏 Acknowledgments

- [Express](https://expressjs.com/)
- [MongoDB](https://mongodb.com)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

---

<p align="center"><b>Backend for Together Now – the engine powering social impact events and volunteering.</b></p>
