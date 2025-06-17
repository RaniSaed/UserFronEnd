/// File path: src/pages/ProductDetails.tsx

import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [buyer, setBuyer] = useState({
    name: "",
    email: "",
    phone: "",
    country: "Israel",
    city: "Tel Aviv",
    paymentMethod: "cash",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const queryClient = useQueryClient();
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProduct(Number(id)),
    enabled: !!id,
  });

  const { mutate: purchase } = useMutation({
    mutationFn: (qty: number) => api.purchaseProduct(Number(id), qty),
    onSuccess: () => {
      toast({ title: "✅ Purchase Successful" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      generateReceipts();
    },
    onError: (err: any) => {
      toast({ title: "❌ Purchase Failed", description: err?.message });
    },
  });

  const handlePurchase = () => {
    if (product && quantity > 0 && quantity <= product.stock_level) {
      purchase(quantity);
    }
  };

  const generateReceipts = () => {
    const workbook = XLSX.utils.book_new();
    const data = [
      ["Name", "Email", "Phone", "Product", "Category", "Quantity", "Unit Price", "Total", "Country", "City", "Payment"],
      [
        buyer.name,
        buyer.email,
        buyer.phone,
        product?.name,
        product?.category,
        quantity,
        product?.price,
        product?.price * quantity,
        buyer.country,
        buyer.city,
        buyer.paymentMethod === "visa"
          ? `Visa **** **** **** ${buyer.cardNumber.slice(-4)}`
          : "Cash",
      ],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Receipt");
    XLSX.writeFile(workbook, "purchase_receipt.xlsx");

    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("BIU Shop - Purchase Receipt", 20, 20);
    pdf.setFontSize(12);
    pdf.text(`Name: ${buyer.name}`, 20, 40);
    pdf.text(`Email: ${buyer.email}`, 20, 50);
    pdf.text(`Phone: ${buyer.phone}`, 20, 60);
    pdf.text(`Product: ${product?.name}`, 20, 70);
    pdf.text(`Category: ${product?.category}`, 20, 80);
    pdf.text(`Quantity: ${quantity}`, 20, 90);
    pdf.text(`Price Each: $${product?.price.toFixed(2)}`, 20, 100);
    pdf.text(`Total: $${(product?.price * quantity).toFixed(2)}`, 20, 110);
    pdf.text(`Shipping To: ${buyer.city}, ${buyer.country}`, 20, 120);
    pdf.text("Arrival: Expected in 7–14 business days", 20, 130);
    pdf.text(
      `Payment: ${
        buyer.paymentMethod === "visa"
          ? `Visa **** **** **** ${buyer.cardNumber.slice(-4)}`
          : "Cash"
      }`,
      20,
      140
    );
    pdf.text("\nThank you for shopping with BIU Shop!", 20, 160);
    pdf.save("purchase_receipt.pdf");
  };

  if (isLoading) return <p>Loading...</p>;
  if (error || !product) return <p>Product not found</p>;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <p className="text-muted-foreground mb-2">{product.category}</p>
      <p className="text-2xl font-semibold mb-4">${product.price}</p>

      <div className="space-y-4 max-w-md">
        <Label>Quantity</Label>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min={1}
          max={product.stock_level}
        />

        <Label>Name</Label>
        <Input
          value={buyer.name}
          onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
        />

        <Label>Email</Label>
        <Input
          value={buyer.email}
          onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
        />

        <Label>Phone</Label>
        <Input
          value={buyer.phone}
          onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
        />

        <Label>City</Label>
        <select
          className="border rounded p-2 w-full"
          value={buyer.city}
          onChange={(e) => setBuyer({ ...buyer, city: e.target.value })}
        >
          {["Tel Aviv", "Jerusalem", "Haifa", "Eilat", "Nazareth", "Ashdod", "Rishon LeZion", "Petah Tikva", "Netanya", "Beer Sheva"].map(
            (city) => (
              <option key={city} value={city}>
                {city}
              </option>
            )
          )}
        </select>

        <Label>Payment Method</Label>
        <select
          className="border rounded p-2 w-full"
          value={buyer.paymentMethod}
          onChange={(e) => setBuyer({ ...buyer, paymentMethod: e.target.value })}
        >
          <option value="cash">Cash</option>
          <option value="visa">Visa</option>
        </select>

        {buyer.paymentMethod === "visa" && (
          <div className="space-y-2">
            <Label>Card Number</Label>
            <Input
              maxLength={16}
              value={buyer.cardNumber}
              onChange={(e) => setBuyer({ ...buyer, cardNumber: e.target.value })}
            />
            <Label>Expiry (MM)</Label>
            <Input
              maxLength={2}
              value={buyer.expiryMonth}
              onChange={(e) => setBuyer({ ...buyer, expiryMonth: e.target.value })}
            />
            <Label>Expiry (YY)</Label>
            <Input
              maxLength={2}
              value={buyer.expiryYear}
              onChange={(e) => setBuyer({ ...buyer, expiryYear: e.target.value })}
            />
            <Label>CVV</Label>
            <Input
              maxLength={3}
              value={buyer.cvv}
              onChange={(e) => setBuyer({ ...buyer, cvv: e.target.value })}
            />
          </div>
        )}

        <Button onClick={handlePurchase}>Confirm Purchase</Button>
      </div>
    </div>
  );
};

export default ProductDetails;