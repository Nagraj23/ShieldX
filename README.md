# ShieldX – Personal Safety Platform

ShieldX is a real-time safety platform focused on safer travel, trusted companionship, and fast emergency assistance.  
It is designed to help users travel more confidently by providing safer route suggestions, periodic safety check-ins, and instant emergency alerts.

---

## 🚨 Problem Statement
Many users, especially women, face safety risks while traveling alone. ShieldX aims to reduce these risks by offering preventive safety features and real-time emergency support without compromising user privacy.

---

## ✨ Key Features
- Safe route suggestions based on basic risk factors along the travel path
- Periodic safety check-ins during travel
- One-tap panic mode for emergency situations
- Real-time location sharing with trusted contacts
- Instant emergency alerts and notifications
- Personal safety chatbot for guidance and support

---

## 🏗️ System Overview
ShieldX follows a modular backend design to ensure scalability and reliability.

- **Client Layer**: Mobile/Web application for user interaction, safety actions, and route visualization  
- **Backend Services**: Independent services handling routes, alerts, panic mode, and user connections  
- **Real-Time Processing**: Background workers and real-time communication for alerts and live location updates  
- **Data Layer**: Stores user profiles, safety logs, and route-related data securely  

---

## 🛠️ Tech Stack
- Frontend: React / Mobile UI (in progress)
- Backend: REST APIs (Node.js / FastAPI)
- Database: MongoDB
- Real-Time: WebSockets, Redis (for background processing)
- Cloud & Tools: Git, GitHub, Postman

---

## 📌 Project Status
This project is actively under development.  
Core safety features are implemented, and advanced reliability and routing enhancements are in progress.

---

## 🚀 Getting Started (Frontend)
```bash
git clone https://github.com/Nagraj23/ShieldX.git
cd ShieldX
npm install
npm start
