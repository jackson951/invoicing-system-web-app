# 📇 SaaS-Based Invoicing System

A full-featured, **multi-tenant invoicing platform** that allows users to create, send, manage, and track invoices in real-time. Built with **ASP.NET Core** and **React.js**, this solution offers role-based access control, secure payments, and real-time analytics to support growing businesses.

---

## 🚀 Tech Stack

| Layer         | Tech                                                     |
|---------------|----------------------------------------------------------|
| **Backend**   | ASP.NET Core (C#), Entity Framework Core, SQL Server     |
| **Frontend**  | React.js, Tailwind CSS                                   |
| **Auth**      | ASP.NET Identity                                         |
| **Payments**  | Stripe API                                               |
| **Analytics** | SignalR (Real-time), Chart.js                            |
| **PDF**       | iTextSharp or similar                                    |

---

## 📦 Key Features

✅ Create, send, and manage invoices  
✅ Multi-tenant user system with role-based access  
✅ Secure payment integration via Stripe (one-time + subscription)  
✅ Real-time dashboard with analytics and invoice tracking  
✅ Email verification and password reset support  
✅ PDF invoice generation and download  
✅ Admin dashboard to manage users and tenants  

---

# 👥 User Roles in SaaS-Based Invoicing System

This system includes **role-based access control** to ensure secure and efficient collaboration across organizations. Below are the supported roles and their respective responsibilities.

---

## 🔒 1. Admin (Platform Administrator)

### 🧩 Description:
Responsible for the entire platform’s configuration, user management, and monitoring across tenants.

### 🛠️ Responsibilities:
- Manage all users and assign roles
- Create and manage tenants (business organizations)
- View and manage all platform-wide invoices
- Access global analytics (revenue, tenant activity)
- Handle Stripe API configuration and platform billing
- Enforce security features (e.g., 2FA, backup)

### 🔑 Permissions:
- Full access to **all tenants**, users, analytics, and system settings

---

## 🏢 2. Business Owner (Tenant Owner)

### 🧩 Description:
Owner of an organization using the platform. They oversee their business’s invoicing operations.

### 🛠️ Responsibilities:
- Create and manage invoices
- Manage clients and payment status
- View financial dashboards
- Customize invoice templates
- Configure Stripe for receiving payments
- Manage their SaaS subscription plan

### 🔑 Permissions:
- Full access to their **own tenant’s** clients, invoices, payments, and subscription
- No access to platform-level or other tenant data

---

## 💼 3. Accountant (Financial Role within Tenant)

### 🧩 Description:
Handles financial tasks within a tenant’s organization, including invoicing, payments, and reports.

### 🛠️ Responsibilities:
- Track paid/pending/overdue invoices
- Generate and download invoice PDFs
- Monitor real-time payments
- Generate monthly/annual financial reports
- Collaborate with the Business Owner on cash flow and collections

### 🔑 Permissions:
- Limited access to **financial modules** (invoices and analytics only)
- Cannot access clients or subscription management

---

## 📋 Role-Based Permission Matrix

| Feature                        | Admin         | Business Owner | Accountant      |
|-------------------------------|---------------|----------------|-----------------|
| Manage Users                  | ✅             | ❌              | ❌               |
| Create & Send Invoices        | ✅             | ✅              | ✅               |
| View Financial Dashboard      | ✅             | ✅              | ✅               |
| Manage Clients                | ✅             | ✅              | ❌               |
| PDF Invoice Generation        | ✅             | ✅              | ✅               |
| Subscription Management       | ✅             | ✅              | ❌               |
| Access Other Tenants' Data    | ✅             | ❌              | ❌               |
| Global Settings & Stripe Keys| ✅             | ❌              | ❌               |

---

## 📊 Real-Time Dashboard

The dashboard includes live financial metrics powered by **SignalR** and **Chart.js**:

- 📈 Total revenue trends
- 🧾 Paid vs. unpaid invoices
- ⏰ Overdue invoice alerts
- 🧠 Client activity insights

---

## 🔐 Authentication & Security

- Secure login and registration via **ASP.NET Identity**
- Email confirmation and verification flows
- Password reset via secure token
- Role-based access and session protection

---

## 💳 Stripe Integration

- Accept credit card and subscription payments
- Configure payment modes (one-time or recurring)
- Receive webhook events from Stripe for:
  - Invoice Paid
  - Subscription Cancelled
  - Failed Payment Alerts

---

## 🗃️ Database Design

Uses **Entity Framework Core** with a code-first approach.

### Entities:
- Users
- Tenants (organizations)
- Clients
- Invoices
- Invoice Items
- Payments
- Subscriptions

---

## 🖨️ PDF Invoice Generation

- Downloadable PDF invoices generated using **iTextSharp**
- Professional, printable layout
- Supports logo, branding, and custom messages

---

## 🛠️ Future Improvements

- [ ] Custom invoice themes
- [ ] Scheduled invoicing
- [ ] Recurring billing cycles
- [ ] Multi-currency support
- [ ] Integration with QuickBooks / Xero

---

## 📌 Project Timeline

| Phase               | Date          | Status        |
|--------------------|---------------|---------------|
| Project Kickoff    | April 2025    | ✅ In Progress |
| MVP Completion     | May 2025      | ⏳ Planned     |
| Public Beta Launch | June 2025     | ⏳ Planned     |

---

## 📁 Folder Structure (Preview)

