# 🚀 Pathfinder

Pathfinder is a comprehensive career and academic guidance platform that empowers users to track their progress, build their resumes, and discover tailored career paths using AI.

## 🌟 Features

- **🎓 Academic Tracker:** Keep tabs on your academic progress, courses, and certifications.
- **🧭 Career Pathfinder:** Get AI/ML-driven recommendations for your ideal career paths based on your unique skills and interests.
- **📄 Resume Builder:** Generate and preview professional 3D resumes dynamically using your tracked data and achievements.
- **⚔️ Challenges & Quizzes:** Test your knowledge, complete daily tasks, and earn badges in the interactive Learning Hub.
- **📅 Activity Calendar:** Plan your learning roadmap, track streaks, and never miss a milestone.
- **📱 Cross-Platform:** Available as a responsive web app and a mobile application!

## 🏗️ Project Structure

This project is organized as a monorepo containing three main environments:

- `/frontend` - The React.js (Vite) web application containing the user dashboard and UI.
- `/backend` - The Node.js & Express REST API that handles database interactions, authentication, and ML logic.
- `/mobile` - The React Native (Expo) mobile application.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrudhulareddy411/pathfinder.git
   cd pathfinder
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *(The backend server will start on its default port, usually 5000 or 8000).*

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *(Open `http://localhost:5173` in your browser to view the web app).*

4. **Mobile Setup**
   ```bash
   cd mobile
   npm install
   npm start
   ```
   *(Use the Expo Go app on your phone to scan the QR code and view the mobile app).*

## 🛠️ Tech Stack
- **Frontend:** React, Vite, TailwindCSS (or Vanilla CSS)
- **Backend:** Node.js, Express.js
- **Mobile:** React Native
- **AI/ML:** Custom Machine Learning recommendation services

## 🤝 Contributing
Contributions are always welcome! Feel free to open an issue or submit a Pull Request.
