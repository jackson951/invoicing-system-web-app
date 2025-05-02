const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const FORMSPREE_URL = 'https://formspree.io/f/xjkbdeqp'; // Replace with your real Formspree endpoint


// Load or initialize mock data from localStorage
const loadMockData = () => {
  const storedUsers = localStorage.getItem("mockUsers");
  const storedInvoices = localStorage.getItem("mockInvoices");

  let users = storedUsers ? JSON.parse(storedUsers) : [];
  let invoices = storedInvoices ? JSON.parse(storedInvoices) : [];

  // If no mock data exists, create initial test data
  if (!storedUsers && !storedInvoices) {
    users = [
      {
        id: "1",
        fullName: "John Doe",
        email: "john@example.com",
        password: "password123",
        companyName: "ABC Corp",
        role: "Admin",
        verified: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        fullName: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        companyName: "XYZ Ltd",
        role: "Business Owner",
        verified: true,
        createdAt: new Date().toISOString(),
      },
    ];

    invoices = [
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

    saveMockData(users, invoices);
  }

  return { users, invoices };
};

// Save mock data to localStorage
const saveMockData = (users, invoices) => {
  localStorage.setItem("mockUsers", JSON.stringify(users));
  localStorage.setItem("mockInvoices", JSON.stringify(invoices));
};

// Initial mock data setup
let { users: mockUsers, invoices: mockInvoices } = loadMockData();

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
    createdAt: new Date().toISOString(),
  };

  mockUsers.push(newUser);
  saveMockData(mockUsers, mockInvoices);

  const token = Math.random().toString(36).substring(2, 10);
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

  delete tokens[token];
  localStorage.setItem("mockVerificationTokens", JSON.stringify(tokens));
  saveMockData(mockUsers, mockInvoices);

  return { success: true, message: "Email verified successfully" };
};

export const sendOtp = async (email) => {
  await delay(1000);

  const user = mockUsers.find((u) => u.email === email);
  if (!user) throw new Error("No user found with this email");

  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  // Save OTP locally for verification later
  const otpData = { email, otp, expiresAt };
  localStorage.setItem("mockOtp", JSON.stringify(otpData));

  // Format the message
  const message = `
    Hello,

    Your one-time password (OTP) is: ${otp}
    It will expire in 5 minutes.

    If you did not request this OTP, please ignore this email.

    Thanks,
    Your Website Team
  `;

  // Send email using Formspree
  const res = await fetch(FORMSPREE_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      message
    })
  });

  const json = await res.json();

  if (json.ok || res.ok) {
    return { success: true, message: "OTP sent successfully to email" };
  } else {
    throw new Error("Failed to send OTP via email");
  }
};
export const verifyOtp = async (email, otp) => {
  await delay(1000);

  const stored = JSON.parse(localStorage.getItem("mockOtp"));
  if (
    !stored ||
    stored.email !== email ||
    stored.otp !== otp ||
    Date.now() > stored.expiresAt
  ) {
    throw new Error("Invalid or expired OTP");
  }

  localStorage.removeItem("mockOtp");

  const user = mockUsers.find((u) => u.email === email);
  const token = btoa(JSON.stringify({ id: user.id, email: user.email }));

  const existingTokens = JSON.parse(localStorage.getItem("mockVerificationTokens")) || {};
  existingTokens[token] = email;
  localStorage.setItem("mockVerificationTokens", JSON.stringify(existingTokens));

  return { success: true, message: "OTP verified", token };
};

export const loginUser = async ({ email, password }) => {
  await delay(1000);

  const user = mockUsers.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid credentials");

  if (!user.verified) throw new Error("Please verify your email");

  // Create a token (you can use JWT in production)
  const token = btoa(JSON.stringify({ id: user.id, email: user.email }));

  // Save token and user to localStorage
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    companyName: user.companyName,
    role: user.role,
  }));

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
  const resetTokens = JSON.parse(localStorage.getItem("mockResetTokens") || "{}");
  resetTokens[token] = { email, expiresAt: Date.now() + 10 * 60 * 1000 };
  localStorage.setItem("mockResetTokens", JSON.stringify(resetTokens));

  return { success: true, resetToken: token };
};

export const resetPassword = async (token, newPassword) => {
  await delay(1000);

  const resetTokens = JSON.parse(localStorage.getItem("mockResetTokens") || "{}");
  const entry = resetTokens[token];

  if (!entry || entry.expiresAt < Date.now()) {
    throw new Error("Invalid or expired token");
  }

  const user = mockUsers.find((u) => u.email === entry.email);
  if (!user) throw new Error("User not found");

  user.password = newPassword;
  delete resetTokens[token];
  localStorage.setItem("mockResetTokens", JSON.stringify(resetTokens));
  saveMockData(mockUsers, mockInvoices);

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
    invoices: [...mockInvoices],
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
    id: `INV-${Math.floor(Math.random() * 10000)}`,
    ...invoiceData,
    issuedAt: new Date().toISOString(),
  };

  mockInvoices.push(newInvoice);
  saveMockData(mockUsers, mockInvoices);

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
  saveMockData(mockUsers, mockInvoices);

  return { success: true, invoice: mockInvoices[index] };
};

export const deleteInvoice = async (id) => {
  await delay(500);
  const index = mockInvoices.findIndex((i) => i.id === id);
  if (index === -1) throw new Error("Invoice not found");

  mockInvoices.splice(index, 1);
  saveMockData(mockUsers, mockInvoices);

  return { success: true, message: "Invoice deleted successfully" };
};