import { FiZap, FiShield, FiTrendingUp } from 'react-icons/fi';

export const features = [
  {
    icon: FiZap,
    title: "Smart Invoice Creation",
    description: "Create professional invoices with AI suggestions for line items, descriptions, and optimal payment terms.",
    items: [
      "Context-aware line item suggestions",
      "Smart tax calculation by jurisdiction",
      "Automatic client data filling"
    ]
  },
  {
    icon: FiShield,
    title: "Error Detection",
    description: "Our system automatically checks for common invoice errors before you send them to clients.",
    items: [
      "Anomaly detection for amounts",
      "Client data validation",
      "Required field verification"
    ]
  },
  {
    icon: FiTrendingUp,
    title: "Financial Insights",
    description: "Get AI-powered insights into your expected payments and cash flow based on historical data.",
    items: [
      "30/60/90 day projections",
      "Client payment behavior analysis",
      "Seasonal trend detection"
    ]
  }
];