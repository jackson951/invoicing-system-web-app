# SaaS-Based Invoicing System

A full-featured, multi-tenant invoicing platform that allows users to create, send, manage, and track invoices in real-time. Built with ASP.NET Core and React.js, this project includes robust authentication, payment integration, and real-time analytics.

## 🚀 Tech Stack

- **Backend**: ASP.NET Core (C#), Entity Framework Core, SQL Server
- **Frontend**: React.js, Tailwind CSS
- **Authentication**: ASP.NET Identity
- **Payments**: Stripe API
- **Real-time Analytics**: SignalR, Chart.js
- **PDF Generation**: iTextSharp or similar libraries

## 📦 Key Features

- ✅ Create, send, and manage invoices
- ✅ Multi-tenant user system with role-based access
- ✅ Secure payment integration via Stripe (one-time + subscription)
- ✅ Real-time dashboard with analytics and invoice tracking
- ✅ Email verification and password reset support
- ✅ PDF invoice generation and download
- ✅ Admin dashboard to manage users and transactions

# User Roles in SaaS-Based Invoicing System

This document outlines the different user roles within the SaaS-based invoicing platform. Each role has specific responsibilities and access permissions to ensure smooth operation and control over invoicing and payment processes.

---

## 👥 **User Roles**

The system supports three main user roles, each with different permissions and responsibilities:

1. **Admin (Platform Administrator)**
2. **Business Owner (Tenant Owner)**
3. **Accountant (Financial Role within Tenant)**

---

## 1. **Admin (Platform Administrator)**

The **Admin** role is responsible for managing the entire platform and overseeing all tenants (organizations) within the system. This role is typically held by the platform owner or a super admin.

### Responsibilities:
- **User Management**:
  - Create, update, and delete user accounts across all tenants.
  - Assign roles (Admin, Business Owner, Accountant) to users within each tenant.
  - View and manage all users' activities within the platform.
  
- **Tenant Management**:
  - Create and manage new tenant accounts (businesses or organizations).
  - Manage subscription and billing information for tenants.
  - Monitor and control tenant access to the platform's features and data.

- **System Configuration**:
  - Set platform-wide settings such as currency, invoice templates, and payment gateway configuration.
  - Manage the payment gateway (Stripe) API keys and payment configurations.

- **Analytics and Monitoring**:
  - Access global platform analytics, such as the total number of active tenants, invoices, and payments.
  - Monitor platform performance and data health.

- **Security**:
  - Manage system-level security settings, including enabling/disabling two-factor authentication (2FA).
  - Perform platform-level data backups and recovery tasks.

### Permissions:
- Full access to all tenants, users, and platform settings.
- Ability to manage global system configurations and platform-wide analytics.

---

## 2. **Business Owner (Tenant Owner)**

The **Business Owner** is the person responsible for managing the invoicing and financial operations within their own organization (tenant). They have full control over the invoicing process and business-related settings but no administrative control over the platform.

### Responsibilities:
- **Invoice Management**:
  - Create, send, and manage invoices for clients.
  - Customize and apply different invoice templates.
  - Generate and download invoices as PDFs for printing or emailing.
  
- **Payment Integration**:
  - Set up and configure payment methods using Stripe (for one-time or subscription payments).
  - Manage payment statuses of invoices (Paid, Pending, Overdue).
  
- **Dashboard Analytics**:
  - View a real-time dashboard displaying total revenue, unpaid invoices, and payment trends for their organization.
  - Track overdue invoices and monitor payment history.

- **Client Management**:
  - Add, update, and delete client information (e.g., name, email, company details).
  
- **Subscription Management**:
  - Manage their organization's subscription plan to the platform (if applicable).
  - View and update billing information related to their platform subscription.

### Permissions:
- Full access to their organization's invoices, clients, and payment-related data.
- Ability to view and manage their organization's subscription and financial data.
- Cannot manage platform-level settings or other tenants.

---

## 3. **Accountant (Financial Role within Tenant)**

The **Accountant** is primarily responsible for overseeing the financial aspects of the business, including managing invoices, tracking payments, and generating reports. They can view and manage financial data but have limited access to non-financial aspects of the system.

### Responsibilities:
- **Invoice Tracking**:
  - Monitor the status of all invoices within the organization (Paid, Pending, Overdue).
  - Assist in creating, updating, and generating invoices as PDFs.

- **Payment Management**:
  - Ensure that payments are processed correctly through Stripe and that payment statuses are updated in real-time.
  - Assist with payment reconciliation and resolve discrepancies.

- **Reporting**:
  - Generate financial reports based on invoice data and payment status (e.g., monthly or yearly revenue).
  
- **Client Interaction**:
  - Contact clients regarding overdue invoices or billing issues.
  
- **Assist Business Owner**:
  - Provide support to the Business Owner by offering financial insights and data for better decision-making.

### Permissions:
- View and manage invoices, payments, and financial reports for their organization.
- Access the real-time financial dashboard.
- Limited access to tenant settings, focused primarily on financial operations (cannot manage clients or subscription plans).

---

## Summary of Permissions

| Role            | Invoice Management | Payment Processing | Client Management | Subscription Management | System Settings | Analytics/Reports |
|-----------------|--------------------|-------------------|-------------------|-------------------------|-----------------|-------------------|
| **Admin**       | Full Access        | Full Access       | Full Access       | Full Access             | Full Access     | Full Access       |
| **Business Owner** | Full Access        | Full Access       | Full Access       | Full Access             | No Access       | Full Access       |
| **Accountant**  | View/Manage        | View/Manage       | No Access         | No Access               | No Access       | View Reports      |

---

## 🎯 Key Takeaways:
- **Admins** have full control over the platform and all tenants.
- **Business Owners** can manage invoices, payments, and client data within their own tenant but do not have control over other tenants or platform-wide settings.
- **Accountants** focus on financial operations within a tenant, with access to invoices, payments, and reports but no administrative control.

This role-based access control ensures that each user can perform their designated tasks efficiently while maintaining a secure and organized system.


## 📊 Real-Time Dashboard

Users can view invoice trends, payment status, and overall business insights through a dynamic dashboard powered by Chart.js and SignalR.

## 🔐 Authentication

- User registration and login
- Email confirmation
- Roles: Admin, Business Owner, Accountant
- Permission-based access to different modules

## 💳 Stripe Integration

- Handles secure online payments
- Subscription billing for SaaS customers
- Webhook support for billing events

## 🗂 Database

- SQL Server with Entity Framework Core Code-First approach
- Includes invoice templates, client data, user accounts, transactions

## 🖨️ PDF Generation

- Generate professional invoices in PDF format for download or print

## 🛠️ Future Improvements

- Custom invoice themes
- Invoice scheduling/reminders
- Integration with accounting tools (e.g., QuickBooks, Xero)

## 📌 Project Timeline

- **Start Date**: April 2025
- **Status**: In Progress

---
