
# 📘 **EventHive – The Inter-College Event Hub**

EventHive is a full-stack web platform designed to centralize college events—including fests, workshops, competitions, and cultural programs—into a single, accessible hub.
Clubs and committees can post events, while students across institutions can easily discover, track, and engage with them.

---

## 🚨 **Problem Statement**

Students often miss important college events because information is scattered across:

* WhatsApp / Telegram groups
* Individual college websites
* Social media posts
* Offline notice boards

**EventHive solves this by unifying all event information into one centralized platform**, enabling:

* Students → to discover and follow events with ease
* Club Admins → to manage and promote events in a structured way

---

## 🛠 **System Architecture**

EventHive follows a **modern, decoupled architecture**:

```
Frontend (React.js) → Backend REST API (Node.js/Express) → PostgreSQL Database
```

### **Frontend**

* React.js (SPA)
* React Router
* Axios
* TailwindCSS
* Hosted on **Vercel**

### **Backend**

* Node.js
* Express.js
* Secure, modular REST API
* Hosted on **Render**

### **Database**

* PostgreSQL (Render)

### **Authentication**

* JWT-based login & signup
* bcrypt.js for password hashing

---

## ⭐ **Key Features**

### 🔐 **Authentication & Authorization**

* JWT-based secure login/signup
* Role-based access:

  * **Students** → browse & save events
  * **Admins** → manage (CRUD) their college’s events

### 🗂 **CRUD Event Management**

* Admins can **Create, Read, Update, Delete** events
* Students can view all public events & save favorites

### 🧭 **Event Discovery & Filtering**

* Filter by:

  * College name
  * Event type (Tech, Cultural, Sports…)
  * Date range
* Search bar for direct event lookup

### 🧭 **Frontend Routing Pages**

* Home (All Events Feed)
* Login / Signup
* Event Details
* Student Dashboard
* Admin Dashboard
* Create / Edit Event Page

---

## 🧰 **Tech Stack**

| Layer              | Technologies                               |
| ------------------ | ------------------------------------------ |
| **Frontend**       | React.js, React Router, Axios, TailwindCSS |
| **Backend**        | Node.js, Express.js                        |
| **Database**       | PostgreSQL                                 |
| **Authentication** | JWT, bcrypt.js                             |
| **AI Integration** | OpenAI API                                 |
| **Hosting**        | Vercel (Frontend), Render (Backend + DB)   |

---

## 📡 **API Overview**

| Endpoint                   | Method | Description                       | Access     |
| -------------------------- | ------ | --------------------------------- | ---------- |
| `/api/auth/register`       | POST   | Register new user (Student/Admin) | Public     |
| `/api/auth/login`          | POST   | User login → returns JWT          | Public     |
| `/api/events`              | GET    | Fetch all events                  | Public     |
| `/api/events`              | POST   | Create event                      | Admin Only |
| `/api/events/:id`          | PUT    | Update event                      | Admin Only |
| `/api/events/:id`          | DELETE | Delete event                      | Admin Only |
| `/api/ai/generate-caption` | POST   | Generate event caption using AI   | Admin Only |

---

## 🌐 **Hosting**

Both the frontend and backend are deployed with publicly accessible URLs for demonstration.


