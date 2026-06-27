# Vendor Management & Quotation System (Teyzix Core FS-2)

![Next.js](https://img.shields.io/badge/Next.js-App_Router-black)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen)
![TanStack Query](https://img.shields.io/badge/TanStack-React_Query-red)

A comprehensive Full-Stack Web Application developed for the **Teyzix Core Internship (June Batch)**. This platform provides an organized workflow for organizations to seamlessly manage vendors, request quotations, and evaluate vendor responses in a centralized dashboard.

##  Core Features Implemented

### 1. Vendor Management
- **Add New Vendors:** Capture vendor details (Name, Company, Email, Contact, Address).
- **View & Update:** View complete vendor profiles and edit information seamlessly.
- **Delete Vendors:** Secure deletion of vendor records.
- **Search & Filter:** Advanced searching by Name/Company and sorting (Newest, A-Z, Z-A).

### 2. Quotation Management
- **Create Requests:** Generate new quotation requests and assign them to specific vendors.
- **Status Tracking:** Update quotation statuses dynamically (`Pending`, `Approved`, `Rejected`).
- **Data Association:** Using MongoDB references to link quotations directly to vendors.

### 3. Quotation Comparison Engine 
- **Smart Comparison:** A dedicated module that compares all quotations side-by-side.
- **Cost-Effective Highlight:** Automatically highlights the most cost-effective (lowest amount) quotation with a "Most Cost-Effective / Best Value" badge to aid in decision making.

### 4. Interactive Dashboard
- **Real-Time Statistics:** Displays total vendors, total users, active/pending/approved quotations.
- **Recent Activities Timeline:** Automatically tracks and displays the latest actions (e.g., new vendors added, new quotations requested).

## Bonus Features (Fully Achieved)

- **Authentication & Authorization:** JWT-based secure login/registration. Includes a protected **Admin Panel** to view all registered users and platform stats.
- **Dark Mode:** Flicker-free Light/Dark theme toggle integrated using `next-themes` and Tailwind CSS.
- **Email Notifications:** Automated email alerts sent to vendors (via `nodemailer`) whenever their quotation status is updated.
- **PDF Export for Quotations:** Client-side generation of beautiful, formatted PDF documents for quotations using `jsPDF` and `jspdf-autotable`.

##  Technology Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS, TanStack Query (React Query), React-Hook-Form, Lucide-React.
* **Backend:** Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), Bcrypt.

## 📁 Folder Structure (Modular Monolith)

```text
teyzix-fs2-vendor-system/
│
├── backend/                  # Express.js REST API
│   ├── src/
│   │   ├── config/           # DB connection, Email config, Admin Seeder
│   │   ├── middlewares/      # JWT verification, Role checks
│   │   ├── features/         # Feature-based modular architecture
│   │   │   ├── auth/         # Authentication logic
│   │   │   ├── dashboard/    # Analytics & timeline logic
│   │   │   ├── quotation/    # Quotation CRUD & Comparison
│   │   │   └── vendor/       # Vendor CRUD & Searching
│   │   └── server.js         # Entry point
│
└── frontend/                 # Next.js Application
    ├── src/
    │   ├── app/              # Next.js App Router Pages (login, register, vendors, etc.)
    │   ├── components/       # Global UI (Navbar, Footer)
    │   ├── context/          # Auth Context
    │   └── features/         # Specific module components
    │       ├── dashboard/    
    │       ├── quotation/    
    │       └── vendor/       
    ├── tailwind.config.js
    └── next.config.js


⚙️ Installation & Setup Guide
Prerequisites
Make sure you have Node.js and MongoDB installed. You will also need a Gmail App Password for email notifications.
1. Clone the Repository
code
Bash
git clone https://github.com/your-username/teyzix-fs2-vendor-system.git
cd teyzix-fs2-vendor-system
2. Backend Setup
Open a terminal and navigate to the backend folder:
code
Bash
cd backend
npm install
Create a .env file in the backend directory and add the following:
code
Env
PORT=5000
DATABASE_URL="mongodb://127.0.0.1:27017/teyzix_vendor_system"
JWT_SECRET="your_jwt_secret_key"

# Admin Setup (Auto-seeded on server start)
ADMIN_EMAIL="admin@teyzix.com"
ADMIN_PASSWORD="super_secure_admin"

# Email Setup (Nodemailer)
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_gmail_app_password"
Start the backend server:
code
Bash
npm run dev
3. Frontend Setup
Open a new terminal window and navigate to the frontend folder:
code
Bash
cd frontend
npm install
Start the Next.js development server:
code
Bash
npm run dev
4. Access the Application
Open your browser and go to http://localhost:3000
To access the Admin Dashboard, log in using the credentials provided in your backend .env file.