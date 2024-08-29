
# **Online Coding Platform**

An advanced online coding platform built with the MERN stack, featuring a coding playground, coding arena, and coding battleground. The platform also includes semaphores to control multiple requests and sockets for displaying a live leaderboard.

## **Table of Contents**

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
- [To-Do](#to-do)

## **Features**

- **Coding Playground**: An environment where users can write and execute code with custom input.
- **Coding Arena**: A competitive space for coding challenges with real-time problem-solving.
- **Coding Battleground**: A battle arena for live coding contests, featuring a live leaderboard.
- **Live Leaderboard**: Displays real-time rankings of participants using WebSockets.
- **Semaphore Control**: Efficiently manages multiple requests to ensure smooth operation during high traffic.
- **Dockerized Deployment**: Seamless containerized deployment for easy scaling and management.
- **Live Website Link**: Access the live version of the platform [here](https://web-wizards-coding-platform.vercel.app)


## **Technology Stack**

- **Frontend**: React, Tailwind CSS, Material UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Sockets**: Socket.IO
- **Containerization**: Docker

## **Architecture**

The platform follows a microservices architecture, with the following components:

- **Frontend**: Built with React, Tailwind CSS, and Material UI for a responsive and modern UI.
- **Backend**: Node.js and Express.js power the RESTful API, with MongoDB handling data persistence.
- **WebSockets**: Implemented using Socket.IO to handle real-time communication for the live leaderboard.
- **Semaphore Control**: Ensures that multiple simultaneous requests are handled efficiently without overloading the server.

## **Installation**

### **Prerequisites**

- **Node.js**: v14.x or later
- **npm**: v6.x or later
- **Docker**: Latest version

### **Local Setup**

1. **Clone the Repository**
   ```bash
   git clone DeepakJhawar/tally
   ```

2. **Install Dependencies**
   - Backend
   ```bash
   cd backend
   npm install
   npm run docker
   ```
   - Frontend
   ```bash
   cd frontend
   npm install
   ```

3. **Environment Variables**
   - Create a `.env` file in the backend directory.
   - Add the following environment variables:
     ```
      MONGO_URI=<Your_mongo_url>
      GOOGLE_CLIENT_ID=<client_id>
      GOOGLE_CLIENT_SECRET=<google_client_secret>
      GITHUB_CLIENT_ID=<github_client_id>
      GITHUB_CLIENT_SECRET=<github_client_secret>
      SESSION_SECRET=<session_secret>
      MAIL_ID=<your_mail_id>
      MAIL_PASSWORD=<app_password>
      BASE_URL=http://127.0.0.1:6969
      ORIGIN_URL=http://127.0.0.1:3000
      MAX_CONCURRENT_PROCESSES=10
     ```

4. **Run the Application**
   ```bash
   cd backend
   npm start
   ```

   ```bash
   cd frontend
   npm start
   ```

**Access the Platform**
   - The application will be available at `http://localhost:3000`.

## **To-Do**
- [ ] Managing multiple outputs for single inputs
- [ ] Adding solutions and displaying them
- [ ] Auto completion of languages
