# 🌍 HopeSphere

**HopeSphere** is a modern, full-stack nonprofit community platform built to connect compassionate donors, dedicated volunteers, and grassroots NGOs.  
HopeSphere enables transparent donations, weekend volunteer drives, and direct support for **underprivileged children, nutritional relief, and rural healthcare outreach**.

---

## ✨ Features

- 🤝 **Comprehensive Authentication & Roles** – Secure JWT authentication with role-based dashboards for **Volunteers / Donors** and **NGO Representatives**.
- 📋 **NGO Verification System** – NGO accounts undergo review before earning a verified partner badge, preserving community trust and transparency.
- 🎯 **Active Community Campaigns** – Interactive campaign cards with live progress bars, funding targets, and instant contribution options.
- 🙋 **Volunteer Drives Hub** – Discover and register for local weekend volunteer opportunities in a single click.
- 💳 **Transparent Donation Processing** – Support food security, educational supplies, clothing, and medical drives with receipts logged to your dashboard.
- 📊 **Real-Time Impact Metrics** – Track community impact, meals distributed, hours volunteered, and supported causes.
- 📱 **Fully Responsive Modern UI** – Designed with Tailwind CSS, Inter & Manrope typography, accessible color contrasts, and mobile navigation.
- 🗄️ **MongoDB Atlas Connectivity** – Powered by Express.js and Mongoose with password hashing (bcrypt) and session management.

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React 19** + **Vite 7**
- 🎨 **Tailwind CSS v4**
- 🌐 **React Router DOM v7**
- 🔤 **Inter & Manrope Google Fonts**
- 🛡️ **Context API** (reactive auth and session management)

### Backend
- 🟢 **Node.js** with **Express.js**
- 📦 **Mongoose** – MongoDB object modeling
- 🛢️ **MongoDB Atlas** – Secure cloud database
- 🔐 **bcryptjs** (password hashing) & **jsonwebtoken** (JWT tokens)
- 🛡️ Security headers & CORS middleware

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
- **Node.js** (v18 or above recommended)
- **npm** installed
- **MongoDB Atlas** database connection string (configured in `backend/.env`)

---

### 2️⃣ Running the Backend Server

```bash
cd backend
npm install
npm start
```

The backend server will run on: `http://localhost:5000`  
Health check endpoint: `http://localhost:5000/api/health`

---

### 3️⃣ Running the Frontend Client

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend client will run on: `http://localhost:5173`

---

## 🗄️ Database Architecture

| Collection | Description | Key Fields |
|---|---|---|
| **users** | Registered volunteers, donors, and NGO representatives | `name`, `email`, `password` (bcrypt), `role`, `organizationDetails`, `isVerified` |
| **donations** | All donor contributions and pledges | `name`, `phone`, `date`, `location`, `donationType`, `amount`, `donorId`, `campaignTitle` |
| **campaigns** | Active community nonprofit drives | `title`, `description`, `category`, `ngoName`, `targetAmount`, `raisedAmount`, `location` |
| **volunteeropportunities** | Volunteer drives & participant registrations | `title`, `organization`, `causeCategory`, `location`, `date`, `volunteersRegistered` |
| **contacts** | Support & inquiry messages | `name`, `email`, `message`, `createdAt` |

---

## 🔒 Security Best Practices

- Passwords hashed using `bcryptjs` with 10 salt rounds before database persistence.
- Zero credential leakage on password-recovery endpoints (safe uniform responses).
- JWT session tokens protected with server-side secret (`JWT_SECRET`).
- `MONGO_URI` kept strictly in server-side environment variables and never exposed to the client.
