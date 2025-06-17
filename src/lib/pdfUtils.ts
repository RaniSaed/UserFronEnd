// 📄 Path: src/lib/pdfUtils.ts

import jsPDF from "jspdf";

interface ReceiptProps {
  name: string;
  email: string;
  city: string;
  country: string;
  paymentMethod: string;
  total: number;
  productName: string;
  quantity: number;
  priceEach: number;
}

export function generateThankYouPDF({
  name,
  email,
  city,
  country,
  paymentMethod,
  total,
  productName,
  quantity,
  priceEach,
}: ReceiptProps) {
  const doc = new jsPDF();

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("🛍️ BIU Shop – Thank You for Your Purchase!", 20, 20);

  // Body text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text(`Dear ${name},`, 20, 35);
  doc.text("We appreciate your business. Here's a summary of your order:", 20, 45);

  doc.setFontSize(12);
  doc.text(`📧 Email: ${email}`, 20, 60);
  doc.text(`📍 Location: ${city}, ${country}`, 20, 70);
  doc.text("🚚 Delivery: Expected within 7–14 business days", 20, 80);
  doc.text(`💳 Payment Method: ${paymentMethod}`, 20, 90);

  doc.setFont("helvetica", "bold");
  doc.text("🧾 Order Summary:", 20, 105);
  doc.setFont("helvetica", "normal");
  doc.text(`• Product: ${productName}`, 20, 115);
  doc.text(`• Quantity: ${quantity}`, 20, 125);
  doc.text(`• Price Each: $${priceEach.toFixed(2)}`, 20, 135);
  doc.text(`• Total: $${total.toFixed(2)}`, 20, 145);

  doc.setFont("helvetica", "italic");
  doc.setTextColor(100);
  doc.text("Thank you for shopping with BIU Shop!", 20, 170);
  doc.text("We hope to see you again soon!", 20, 180);

  doc.save("BIU_Shop_Receipt.pdf");
}