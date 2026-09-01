**Travel Expense Tracker Application Overview: **
The Travel Expense Tracker is designed to help users to submit and approve travel expense claims.. It includes essential features such as secure user authentication, allowing individuals to sign up and log in to their accounts, as well as profile management to update personal information. With built-in validation such as input field validation and email validation, the application ensures a seamless user experience while enhancing productivity and organization in both personal and professional settings.

**This apps **contain** the following features:**

* Signup
* Login
* Logout
* Update profile
* Add expense claims
* View the expense claims
* Update the expense claims
* Delete the expense claims
* Approve the expense claim by Admin
* Reject the expense claim by Admin

**Setup**

* Backend:
cd backend
npm install
Create a .env file:
MONGO_URI=mongodb+srv://ZeroCool-QUT:Mooseadam1!@cluster0.cxwjkpe.mongodb.net/?appName=Cluster0
JWT_SECRET=2J8zqkP7VN6bxzg+Wy7DXCsd3Yx8mF3Bl0kch6HYtFs=
PORT=5001
npm start

* Frontend:
cd frontend
npm install
npm start

**While deploying on EC2:**
frontend/src/axiosConfig.jsx must be changed to the EC2 instance's public IP (e.g. `http://<ec2-public-ip>:5001`) before building/serving the frontend.
Also make sure that port is open in the EC2 security group.


**Architecture Summary**

* Three\-tier MERN architecture:

* Frontend — React SPA (React Router, Context API for auth state, Axios for HTTP), served as static built files.
* API — Node.js/Express REST API (`/api/auth`, `/api/expenses`), JWT\-based auth via a `protect` middleware, and a separate `adminOnly` middleware enforcing role checks server\-side (not just hidden in the UI).
* Database — MongoDB Atlas, accessed through Mongoose. Two collections: `users` (with a `role: 'user' | 'admin'` field) and `expenses` (with a `status: 'pending' | 'approved' | 'rejected'` field).
* Host — a single AWS EC2 (Ubuntu) instance running both the API and the built frontend, process\-managed with `pm2`.

**Known Limitations**

* No password reset / forgot\-password flow.
* The social login buttons (Google/Facebook/etc.) shown on the Register screen in the Figma design are illustrative only and are not implemented — the app supports email/password authentication only.
* The first admin account must be created by manually setting `role: 'admin'` on a user document directly in the database (via MongoDB Atlas or a seed script).
* Unstable hosting: the app is deployed to a single EC2 instance using its public IP directly (no Elastic IP or domain name), so the deployment URL can change if the instance is stopped/restarted — the URL in this README reflects the address at time of submission and may not remain valid indefinitely.

**Deployment**

* Live URL: http://32.236.135.71:3000

---

**Prerequisite:** Please install the following software and create account in following web tools** **

* **Nodejs [**[https://nodejs.org/en](https://nodejs.org/en)]** **
* **Git [**[https://git-scm.com/](https://git-scm.com/)]** **
* **VS code editor** [[https://code.visualstudio.com/](https://code.visualstudio.com/)]** **
* **MongoDB Account** [[https://account.mongodb.com/account/login](https://account.mongodb.com/account/login)]** - In tutorial, we have also showed how can you create account and database: follow step number 2.**
* **GitHub Account** [[https://github.com/signup?source=login](https://github.com/signup?source=login)]** **

---
