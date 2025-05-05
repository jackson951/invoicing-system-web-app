# 📇 SaaS-Based Invoicing System

A robust, multi-tenant **SaaS invoicing platform** built with **ASP.NET Core** and **React.js**, designed for business scalability, real-time operations, and secure invoice management. The system supports fine-grained role-based access for employees, Stripe payments, and PDF invoice generation.

---

## 🚀 Tech Stack

| Layer         | Tech                                                     |
|---------------|----------------------------------------------------------|
| **Backend**   | ASP.NET Core (C#), Entity Framework Core, SQL Server     |
| **Frontend**  | React.js, Tailwind CSS                                   |
| **Auth**      | ASP.NET Identity                                         |
| **Payments**  | Stripe API                                               |
| **Analytics** | SignalR (Real-time), Chart.js                            |
| **PDF**       | iTextSharp                                               |

---

## 📦 Key Features

- ✅ Create, send, and manage invoices
- ✅ Multi-tenant architecture with user-scoped data
- ✅ Role-based access control (Admin, Editor, Subscriber)
- ✅ Secure payments via Stripe (one-time + subscription)
- ✅ Real-time financial dashboard (SignalR)
- ✅ PDF invoice generation and download
- ✅ Email verification & password reset
- ✅ Admin panel for managing employees and permissions

---

## 👤 User Model & Access Control

### 🧑‍💼 User (Platform Admin)
- Creates and manages employees (with defined roles)
- Manages clients, invoices, and Stripe settings
- Has full access to all data within their account scope

### 👥 Employees
Employees are created by the User (Admin) and assigned a role:

| Role        | Permissions                                                                 |
|-------------|------------------------------------------------------------------------------|
| **Admin**   | Full access to clients, invoices, payments, and settings                    |
| **Editor**  | Can create/edit invoices, view clients, but no access to settings           |
| **Subscriber** | Read-only access to invoices and analytics                                |

> 🔐 Passwords are auto-generated for employees upon creation by the admin. These can be reset by the employee later.

### 🧾 Customers
- Can be individuals or companies
- Associated with a User and visible to authorized employees
- Recipients of invoices

---

## 🧩 Permission Scope

| Feature                        | User (Admin) | Employee (Admin) | Employee (Editor) | Employee (Subscriber) |
|-------------------------------|--------------|------------------|-------------------|------------------------|
| Create & Manage Invoices      | ✅            | ✅                | ✅                 | ❌                      |
| View Invoices & Analytics     | ✅            | ✅                | ✅                 | ✅                      |
| Manage Clients                | ✅            | ✅                | ❌                 | ❌                      |
| Employee Management           | ✅            | ❌                | ❌                 | ❌                      |
| Subscription Settings         | ✅            | ❌                | ❌                 | ❌                      |
| Stripe Configuration          | ✅            | ❌                | ❌                 | ❌                      |

---

## 💳 Stripe Integration

- Accepts credit card and subscription payments
- One-time & recurring billing support
- Webhooks to track:
  - `invoice.paid`
  - `invoice.payment_failed`
  - `customer.subscription.deleted`

---

## 🔐 Authentication & Security

- Email verification & confirmation
- Password reset via secure token
- Session-based auth with token expiration
- Role-based access enforced on API and UI
- Two-Factor Authentication (optional)

---

## 📊 Real-Time Dashboard

Powered by **SignalR** and **Chart.js**:

- 📈 Revenue trends
- 🧾 Paid vs. unpaid invoices
- ⏰ Overdue invoice alerts
- 👥 Client activity

---

## 🖨️ PDF Invoice Generation

- Built using **iTextSharp**
- Downloadable and print-ready
- Supports logos, business branding, and custom footer messages

---

## 🗃️ Database Design (EF Core)

Entities:

- `User` (admin)
- `Employee` (with roles)
- `Customer` (individual or company)
- `Invoice` / `InvoiceItem`
- `Payment`
- `Subscription`

---

## 📁 Folder Structure (Simplified)

```bash
SaaS-Invoicing/
├── backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   ├── Data/
│   └── Program.cs
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── auth/
│   │   └── App.jsx
│   └── public/
├── docs/
│   └── api-spec.md
├── README.md
└── .env.example
