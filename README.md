# DevTinder 👥💻

**DevTinder** is a full-stack MERN application that allows developers to connect with one another through a friend request system. Users can send connection requests, view pending requests, manage accepted connections, and securely authenticate.It also includes a real-time chat feature built using WebSocket and Socket.IO, enabling seamless one-on-one communication between connected users.

---

## 🛠️ Tech Stack

### Frontend
- React
- Redux Toolkit
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (for authentication)
- Socket.IO

---


## 🚀 Features

- ✅ **User Authentication** (Signup/Login with email and password)
- 🔒 **Secure Backend Authentication** using JWT and bcrypt
- 📩 **Friend Request System**
  - Send requests to other users
  - Accept or reject incoming requests
- 👥 **Connections**
  - View your pending requests
  - See your active connections
- 💬 **Real-Time Chat**
  - Chat with connected users
  - Real-time message delivery using WebSocket + Socket.IO
  - Responsive chat UI with auto-scroll

---
### 🔧 Installation

```bash
git clone https://github.com/Mohak0325/devTinder.git
cd devTinder
```

```bash
cd devtinder-backend
npm install
npm run dev
```

```bash
cd ../devtinder-frontend
npm install
npm run dev
```

### 🔐 Environment Variables

### 🗄️ Backend .env

- PORT=7777
- MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/devTinder
- JWT_SECRET=your_jwt_secret
