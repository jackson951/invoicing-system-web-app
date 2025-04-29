// src/utils/api.js

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock persistent stores
let mockUsers = [];
let mockVerificationTokens = {};
let mockResetTokens = {};
let mockOtpStore = {};
let mockInvoices = [];

// Initialize with some dummy data
const initializeMockData = () => {
  mockUsers = [
    {
      id: "1",
      fullName: "John Doe",
      email: "john@example.com",
      password: "password123",
      companyName: "ABC Corp",
      role: "Admin",
      verified: true,
      createdAt: new Date(),
    },
    {
      id: "2",
      fullName: "Jane Smith",
      email: "jane@example.com",
      password: "password123",
      companyName: "XYZ Ltd",
      role: "Business Owner",
      verified: true,
      createdAt: new Date(),
    },
  ];

  mockInvoices = [
    {
      id: "INV-001",
      clientId: "C1001",
      clientName: "Client A",
      items: [
        { description: "Web design", quantity: 40, rate: 50 },
        { description: "Hosting", quantity: 1, rate: 100 },
      ],
      total: 2100,
      dueDate: "2025-06-01",
      status: "Pending",
      issuedAt: "2025-05-20",
    },
    {
      id: "INV-002",
      clientId: "C1002",
      clientName: "Client B",
      items: [
        { description: "Consulting", quantity: 10, rate: 75 },
      ],
      total: 750,
      dueDate: "2025-05-28",
      status: "Paid",
      issuedAt: "2025-05-15",
    },
  ];
};

initializeMockData();

// Function to generate a random OTP
const generateOtp = (length = 6) => {
  const characters = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return otp;
};

// Auth APIs
export const registerUser = async (userData) => {
  await delay(1000);

  const existing = mockUsers.find((u) => u.email === userData.email);
  if (existing) throw new Error("Email already taken");

  const newUser = {
    id: (mockUsers.length + 1).toString(),
    ...userData,
    verified: false,
    createdAt: new Date(),
  };

  mockUsers.push(newUser);

  // Generate verification token
  const token = Math.random().toString(36).substring(2, 10);
  mockVerificationTokens[token] = newUser.email;

  return { user: newUser, verificationToken: token };
};

export const verifyEmail = async (token) => {
  await delay(1000);

  const tokens = JSON.parse(localStorage.getItem("mockVerificationTokens")) || {};
  const email = tokens[token];

  if (!email) throw new Error("Invalid or expired token");

  const user = mockUsers.find((u) => u.email === email);
  if (!user) throw new Error("User not found");

  user.verified = true;

  // Remove token
  delete tokens[token];
  localStorage.setItem("mockVerificationTokens", JSON.stringify(tokens));

  return { success: true, message: "Email verified successfully" };
};

export const sendOtp = async (email) => {
  await delay(1000);

  const user = mockUsers.find((u) => u.email === email);
  if (!user) throw new Error("No user found with this email");

  const otp = generateOtp(); // Generate a new OTP
  console.log(otp,"my otppppppppppppppppp")

  const otpData = {
    email,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  };

  // Save OTP in localStorage
  localStorage.setItem("mockOtp", JSON.stringify(otpData));

  return { success: true, message: "OTP sent successfully" };
};

export const verifyOtp = async (email, otp) => {
  await delay(1000);

  // Get OTP from localStorage
  const stored = JSON.parse(localStorage.getItem("mockOtp"));
  console.log(stored, "OTP check");

  if (
    !stored ||
    stored.email !== email ||
    stored.otp !== otp ||
    Date.now() > stored.expiresAt
  ) {
    throw new Error("Invalid or expired OTP");
  }

  // Clear after successful validation
  localStorage.removeItem("mockOtp");

  // ✅ Generate a secure token
  const token = [...Array(64)]
    .map(() => Math.floor(Math.random() * 36).toString(36))
    .join('');

  // ✅ Store token → email mapping in localStorage
  const existing = JSON.parse(localStorage.getItem("mockVerificationTokens")) || {};
  existing[token] = email;
  localStorage.setItem("mockVerificationTokens", JSON.stringify(existing));

  return { success: true, message: "OTP verified", token };
};


export const loginUser = async ({ email, password }) => {
  await delay(1000);

  const user = mockUsers.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid credentials");

  if (!user.verified) throw new Error("Please verify your email");

  const token = btoa(JSON.stringify({ id: user.id, email: user.email }));

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      companyName: user.companyName,
      role: user.role,
    },
  };
};

export const sendPasswordResetEmail = async (email) => {
  await delay(1000);

  const user = mockUsers.find((u) => u.email === email);
  if (!user) throw new Error("If this email exists, we'll send a reset link.");

  const token = Math.random().toString(36).substring(2, 10);
  mockResetTokens[token] = { email, expiresAt: Date.now() + 10 * 60 * 1000 };

  return { success: true, resetToken: token };
};

export const resetPassword = async (token, newPassword) => {
  await delay(1000);

  const entry = mockResetTokens[token];
  if (!entry || entry.expiresAt < Date.now()) {
    throw new Error("Invalid or expired token");
  }

  const user = mockUsers.find((u) => u.email === entry.email);
  if (!user) throw new Error("User not found");

  user.password = newPassword;
  delete mockResetTokens[token];

  return { success: true, message: "Password reset successful" };
};

// Invoice APIs
export const fetchDashboardData = async () => {
  await delay(800);

  const totalInvoices = mockInvoices.length;
  const paidCount = mockInvoices.filter((i) => i.status === "Paid").length;
  const pendingCount = mockInvoices.filter((i) => i.status === "Pending").length;
  const overdueCount = mockInvoices.filter(
    (i) => new Date(i.dueDate) < new Date() && i.status !== "Paid"
  ).length;

  const totalRevenue = mockInvoices.reduce((sum, inv) => sum + inv.total, 0);

  const recentActivity = mockInvoices
    .sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt))
    .slice(0, 3)
    .map((inv) => ({
      date: inv.issuedAt,
      action: `Invoice ${inv.id} created for ${inv.clientName}`,
    }));

  return {
    invoices: mockInvoices,
    stats: {
      totalInvoices,
      paidCount,
      pendingCount,
      overdueCount,
      totalRevenue: `$${totalRevenue.toFixed(2)}`,
    },
    recentActivity,
  };
};

export const createInvoice = async (invoiceData) => {
  await delay(1000);

  const newInvoice = {
    id: `INV-${Math.floor(Math.random() * 1000)}`,
    ...invoiceData,
    issuedAt: new Date().toISOString(),
  };

  mockInvoices.push(newInvoice);
  return { success: true, invoice: newInvoice };
};

export const getInvoiceById = async (id) => {
  await delay(500);
  const invoice = mockInvoices.find((i) => i.id === id);
  if (!invoice) throw new Error("Invoice not found");
  return invoice;
};

export const updateInvoice = async (id, updatedData) => {
  await delay(500);
  const index = mockInvoices.findIndex((i) => i.id === id);
  if (index === -1) throw new Error("Invoice not found");

  mockInvoices[index] = { ...mockInvoices[index], ...updatedData };
  return { success: true, invoice: mockInvoices[index] };
};

export const deleteInvoice = async (id) => {
  await delay(500);
  const index = mockInvoices.findIndex((i) => i.id === id);
  if (index === -1) throw new Error("Invoice not found");

  mockInvoices.splice(index, 1);
  return { success: true, message: "Invoice deleted successfully" };
};