import React from "react";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 text-gray-600 py-2 px-6 z-50">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Smart Invoicing. All rights
          reserved.
        </p>
        {/* You can add more footer content here, like social links, etc. */}
      </div>
    </footer>
  );
}
