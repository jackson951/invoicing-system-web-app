# 📇 SaaS Invoicing System - Frontend

A modern, responsive **React.js frontend** for a multi-tenant SaaS invoicing platform. Built with Tailwind CSS and designed for scalability, real-time operations, and intuitive invoice management across different user roles.

---

## 🚀 Tech Stack

| Layer          | Technology                                           |
| -------------- | ---------------------------------------------------- |
| **Frontend**   | React.js, Tailwind CSS                               |
| **Auth**       | JWT (JSON Web Tokens)                                |
| **Real-time**  | Socket.IO Client                                     |
| **Charts**     | Chart.js, Recharts                                  |
| **HTTP Client**| Axios                                                |
| **Routing**    | React Router DOM                                     |
| **State**      | React Context API / Redux Toolkit                   |
| **Backend**    | ASP.NET Core Web API (separate repository)          |

---

## 📦 Frontend Features

- ✅ Responsive invoice creation and management interface
- ✅ Multi-tenant dashboard with role-based UI components
- ✅ Real-time financial analytics and charts
- ✅ Stripe payment integration forms
- ✅ PDF invoice preview and download
- ✅ Email verification & password reset flows
- ✅ Employee management interface (Admin only)
- ✅ Smart AI assistant integration
- ✅ Dark/Light theme support
- ✅ Mobile-responsive design

---

## 🤖 AI-Powered Smart Features (Frontend)

### 📌 User Interface Components

- 📄 **Template Selector** – Visual layout suggestions
- ⏱️ **Smart Forms** – Auto-populated payment terms
- 🔮 **Payment Predictor** – Visual indicators for late payment risk
- 🧠 **Auto-complete** – Intelligent item and pricing suggestions
- 🌍 **Tax Calculator** – Region-based tax rate display

### 🎯 User Experience

1. **Smart Suggestions** – Contextual recommendations in forms
2. **Visual Feedback** – Real-time AI insights displayed in UI
3. **Progressive Enhancement** – Features improve with usage
4. **Intuitive Workflows** – Guided invoice creation process

---

## 👤 User Roles & Interface

### 🧑‍💼 Platform Admin Dashboard
- Full platform overview
- Employee management interface
- Client and invoice management
- Subscription and billing controls

### 👥 Employee Interfaces

| Role           | UI Access                                                         |
| -------------- | ----------------------------------------------------------------- |
| **Admin**      | Full dashboard access with all management features                |
| **Editor**     | Invoice management interface with limited settings access         |
| **Subscriber** | Read-only dashboard views                                         |

### 🧾 Customer Portal
- Invoice viewing and payment interface
- Payment history and account details
- Mobile-optimized payment flows

---

## 🗝️ UI Permission System

| Feature                   | User (Admin) | Admin Employee | Editor | Subscriber |
|--------------------------|--------------|----------------|--------|------------|
| Invoice Management UI    | ✅            | ✅              | ✅      | ❌          |
| Analytics Dashboard      | ✅            | ✅              | ✅      | ✅          |
| Client Management UI     | ✅            | ✅              | ❌      | ❌          |
| Employee Management      | ✅            | ❌              | ❌      | ❌          |
| Subscription Settings    | ✅            | ❌              | ❌      | ❌          |
| Payment Configuration    | ✅            | ❌              | ❌      | ❌          |

---

## 💳 Payment Interface

- **Stripe Elements** integration for secure card inputs
- **Payment history** tables with filtering and search
- **Subscription management** interface
- **Payment status** indicators and notifications
- **Mobile-optimized** payment forms

---

## 🔐 Authentication & Security

- **Login/Register** forms with validation
- **Email verification** flow
- **Password reset** interface
- **Two-Factor Authentication** setup (optional)
- **Session management** with automatic logout
- **Role-based** component rendering

---

## 📊 Real-Time Dashboard Components

Built with **Socket.IO Client** and **Chart.js**:

- 📈 **Revenue Charts** – Interactive financial visualizations
- 🧾 **Invoice Status** – Real-time status breakdown widgets
- ⏰ **Overdue Alerts** – Notification system for late payments
- 👥 **Activity Feed** – Live client and invoice activity
- 📱 **Mobile Dashboard** – Responsive chart components

---

## 🖨️ PDF & Document Management

- **PDF Preview** – In-browser invoice preview
- **Download Controls** – One-click PDF generation
- **Print Optimization** – Print-friendly invoice layouts
- **Branding Interface** – Logo and template customization
- **Template Gallery** – Visual template selection

---

## 📱 Responsive Design

### Desktop Features
- **Multi-column** layouts for invoice management
- **Advanced filtering** and sorting interfaces
- **Bulk operations** for invoice management
- **Split-screen** views for editing

### Mobile Optimization
- **Touch-friendly** navigation and forms
- **Swipe gestures** for quick actions
- **Condensed dashboards** for mobile screens
- **Offline-first** invoice viewing

---

## 🎨 UI Components Library

### Core Components
- **InvoiceForm** – Dynamic invoice creation
- **PaymentCard** – Stripe payment component
- **Dashboard** – Real-time analytics display
- **UserManagement** – Employee role management
- **ClientDirectory** – Customer management interface

### Shared Components
- **DataTable** – Sortable, filterable tables
- **Modal** – Reusable modal system
- **Notification** – Toast and alert system
- **LoadingStates** – Skeleton loaders and spinners
- **FormValidation** – Real-time form validation

---

## 📁 Project Structure

```bash
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── forms/           # Form components
│   │   ├── charts/          # Chart components
│   │   └── layout/          # Layout components
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Invoices/
│   │   ├── Clients/
│   │   ├── Settings/
│   │   └── Auth/
│   ├── services/
│   │   ├── api.js           # API client configuration
│   │   ├── auth.js          # Authentication service
│   │   ├── socket.js        # Socket.IO client
│   │   └── stripe.js        # Stripe service
│   ├── hooks/               # Custom React hooks
│   ├── context/             # React Context providers
│   ├── utils/               # Utility functions
│   ├── styles/              # Global styles and themes
│   ├── App.jsx
│   └── index.js
├── public/
│   ├── index.html
│   └── assets/
├── package.json
└── tailwind.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Access to ASP.NET Core Web API (separate repository)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm start
```

### Environment Variables

```bash
REACT_APP_API_URL=https://your-api-url.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_SOCKET_URL=wss://your-socket-url.com
```

---

## 🔧 Available Scripts

- `npm start` – Development server
- `npm build` – Production build
- `npm test` – Run test suite
- `npm run lint` – ESLint code checking
- `npm run format` – Prettier code formatting

---

## 📚 Documentation

For detailed component documentation and usage examples, refer to the `/docs` folder or visit our component library documentation.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
