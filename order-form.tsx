"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Customer, Order } from "@/types"
import { createOrder, updateOrder } from "@/actions/order-actions"

interface OrderFormProps {
  customers: Customer[]
  order?: Order
  isEditing?: boolean
}

export default function OrderForm({ customers, order, isEditing = false }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customerName, setCustomerName] = useState(order?.customer_name || "")
  const [customerPhone, setCustomerPhone] = useState(order?.customer_phone || "")
  const [includePayment, setIncludePayment] = useState(false)
  const [formData, setFormData] = useState({
    cake_type: order?.cake_type || "",
    cake_size: order?.cake_size || "",
    flavor: order?.flavor || "",
    filling: order?.filling || "",
    frosting: order?.frosting || "",
    decorations: order?.decorations || "",
    special_instructions: order?.special_instructions || "",
    quantity: order?.quantity || 1,
    price: order?.price || 0,
    order_date: order?.order_date || new Date().toISOString().split("T")[0],
    delivery_date: order?.delivery_date || "",
    delivery_time: order?.delivery_time || "",
    delivery_address: order?.delivery_address || "",
    status: order?.status || "in_progress",
  })

  const [paymentData, setPaymentData] = useState({
    card_number: "",
    card_exp_date: "",
    card_sec_code: "",
    zip_code: "",
  })

  const router = useRouter()

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpDate = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/\D/g, "")
    // Add slash after 2 digits
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerName.trim()) {
      alert("Please enter the customer's name")
      return
    }

    if (!formData.cake_type || !formData.delivery_date) {
      alert("Please fill in all required fields")
      return
    }

    if (includePayment) {
      if (!paymentData.card_number || !paymentData.card_exp_date || !paymentData.card_sec_code) {
        alert("Please fill in all payment details or uncheck the payment section")
        return
      }
    }

    setIsSubmitting(true)

    try {
      const submitData = new FormData()

      // Find existing customer or use -1 for new customer
      const existingCustomer = customers.find(
        (c) =>
          c.name.toLowerCase().includes(customerName.toLowerCase()) ||
          customerName.toLowerCase().includes(c.name.toLowerCase()),
      )

      submitData.append("customer_id", existingCustomer?.id.toString() || "1") // Default to first customer for now
      submitData.append("customer_name", customerName)
      submitData.append("customer_phone", customerPhone)

      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value.toString())
      })

      // Add payment data if included
      if (includePayment) {
        Object.entries(paymentData).forEach(([key, value]) => {
          submitData.append(key, value)
        })
      }

      let result
      if (isEditing && order) {
        result = await updateOrder(order.id, submitData)
      } else {
        result = await createOrder(submitData)
      }

      if (result.success) {
        alert(`Order ${isEditing ? "updated" : "created"} successfully! 🎉`)
        router.push("/orders")
      } else {
        alert(result.error || "Failed to save order")
      }
    } catch (error) {
      alert("An error occurred while saving the order")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-lg">
        <CardTitle className="text-2xl">{isEditing ? "✏️ Edit Order" : "🎂 New Cake Order"}</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Information */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">👤 Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="customer_name" className="text-gray-700 font-medium">
                  Customer Name *
                </Label>
                <Input
                  id="customer_name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer's full name"
                  required
                  className="mt-2 border-purple-200 focus:border-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="customer_phone" className="text-gray-700 font-medium">
                  Phone Number
                </Label>
                <Input
                  id="customer_phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="mt-2 border-purple-200 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Information (Optional) */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3 mb-4">
              <Checkbox
                id="include_payment"
                checked={includePayment}
                onCheckedChange={(checked) => setIncludePayment(checked as boolean)}
              />
              <Label htmlFor="include_payment" className="text-lg font-semibold text-gray-800">
                💳 Payment Information (Optional)
              </Label>
            </div>

            {includePayment && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="md:col-span-2">
                  <Label htmlFor="card_number" className="text-gray-700 font-medium">
                    Card Number *
                  </Label>
                  <Input
                    id="card_number"
                    value={paymentData.card_number}
                    onChange={(e) => handlePaymentChange("card_number", formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="mt-2 border-green-200 focus:border-green-500"
                  />
                </div>

                <div>
                  <Label htmlFor="card_exp_date" className="text-gray-700 font-medium">
                    Expiration Date *
                  </Label>
                  <Input
                    id="card_exp_date"
                    value={paymentData.card_exp_date}
                    onChange={(e) => handlePaymentChange("card_exp_date", formatExpDate(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="mt-2 border-green-200 focus:border-green-500"
                  />
                </div>

                <div>
                  <Label htmlFor="card_sec_code" className="text-gray-700 font-medium">
                    Security Code *
                  </Label>
                  <Input
                    id="card_sec_code"
                    value={paymentData.card_sec_code}
                    onChange={(e) =>
                      handlePaymentChange("card_sec_code", e.target.value.replace(/\D/g, "").substring(0, 4))
                    }
                    placeholder="123"
                    maxLength={4}
                    className="mt-2 border-green-200 focus:border-green-500"
                  />
                </div>

                <div>
                  <Label htmlFor="zip_code" className="text-gray-700 font-medium">
                    Billing Zip Code *
                  </Label>
                  <Input
                    id="zip_code"
                    value={paymentData.zip_code}
                    onChange={(e) => handlePaymentChange("zip_code", e.target.value)}
                    placeholder="12345"
                    className="mt-2 border-green-200 focus:border-green-500"
                  />
                </div>
              </div>
            )}

            {!includePayment && (
              <p className="text-gray-600 text-sm mt-2">
                Check the box above to collect payment information with this order
              </p>
            )}
          </div>

          {/* Cake Details */}
          <div className="bg-gradient-to-r from-pink-50 to-orange-50 p-6 rounded-lg border border-pink-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🍰 Cake Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="cake_type" className="text-gray-700 font-medium">
                  Cake Type *
                </Label>
                <Input
                  id="cake_type"
                  value={formData.cake_type}
                  onChange={(e) => handleInputChange("cake_type", e.target.value)}
                  placeholder="e.g., Wedding Cake, Birthday Cake"
                  required
                  className="mt-2 border-pink-200 focus:border-pink-500"
                />
              </div>

              <div>
                <Label htmlFor="cake_size" className="text-gray-700 font-medium">
                  Cake Size
                </Label>
                <Input
                  id="cake_size"
                  value={formData.cake_size}
                  onChange={(e) => handleInputChange("cake_size", e.target.value)}
                  placeholder="e.g., 8 inch round, 3-tier"
                  className="mt-2 border-pink-200 focus:border-pink-500"
                />
              </div>

              <div>
                <Label htmlFor="flavor" className="text-gray-700 font-medium">
                  Flavor
                </Label>
                <Input
                  id="flavor"
                  value={formData.flavor}
                  onChange={(e) => handleInputChange("flavor", e.target.value)}
                  placeholder="e.g., Vanilla, Chocolate, Red Velvet"
                  className="mt-2 border-pink-200 focus:border-pink-500"
                />
              </div>

              <div>
                <Label htmlFor="filling" className="text-gray-700 font-medium">
                  Filling
                </Label>
                <Input
                  id="filling"
                  value={formData.filling}
                  onChange={(e) => handleInputChange("filling", e.target.value)}
                  placeholder="e.g., Strawberry, Chocolate ganache"
                  className="mt-2 border-pink-200 focus:border-pink-500"
                />
              </div>

              <div>
                <Label htmlFor="frosting" className="text-gray-700 font-medium">
                  Frosting
                </Label>
                <Input
                  id="frosting"
                  value={formData.frosting}
                  onChange={(e) => handleInputChange("frosting", e.target.value)}
                  placeholder="e.g., Buttercream, Cream cheese"
                  className="mt-2 border-pink-200 focus:border-pink-500"
                />
              </div>

              <div>
                <Label htmlFor="quantity" className="text-gray-700 font-medium">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", Number.parseInt(e.target.value) || 1)}
                  className="mt-2 border-pink-200 focus:border-pink-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="decorations" className="text-gray-700 font-medium">
                Decorations & Design
              </Label>
              <Textarea
                id="decorations"
                value={formData.decorations}
                onChange={(e) => handleInputChange("decorations", e.target.value)}
                placeholder="Describe the decorations, colors, themes, etc..."
                rows={3}
                className="mt-2 border-pink-200 focus:border-pink-500"
              />
            </div>

            <div className="mt-6">
              <Label htmlFor="special_instructions" className="text-gray-700 font-medium">
                Special Instructions
              </Label>
              <Textarea
                id="special_instructions"
                value={formData.special_instructions}
                onChange={(e) => handleInputChange("special_instructions", e.target.value)}
                placeholder="Any special requirements, dietary restrictions, messages to write, etc..."
                rows={3}
                className="mt-2 border-pink-200 focus:border-pink-500"
              />
            </div>
          </div>

          {/* Order & Delivery Details */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Order & Delivery Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="order_date" className="text-gray-700 font-medium">
                  Order Date *
                </Label>
                <Input
                  id="order_date"
                  type="date"
                  value={formData.order_date}
                  onChange={(e) => handleInputChange("order_date", e.target.value)}
                  required
                  className="mt-2 border-blue-200 focus:border-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="delivery_date" className="text-gray-700 font-medium">
                  Delivery Date *
                </Label>
                <Input
                  id="delivery_date"
                  type="date"
                  value={formData.delivery_date}
                  onChange={(e) => handleInputChange("delivery_date", e.target.value)}
                  required
                  className="mt-2 border-blue-200 focus:border-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="delivery_time" className="text-gray-700 font-medium">
                  Delivery Time
                </Label>
                <Input
                  id="delivery_time"
                  type="time"
                  value={formData.delivery_time}
                  onChange={(e) => handleInputChange("delivery_time", e.target.value)}
                  className="mt-2 border-blue-200 focus:border-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="price" className="text-gray-700 font-medium">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="mt-2 border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="delivery_address" className="text-gray-700 font-medium">
                Delivery Address
              </Label>
              <Textarea
                id="delivery_address"
                value={formData.delivery_address}
                onChange={(e) => handleInputChange("delivery_address", e.target.value)}
                placeholder="Full delivery address..."
                rows={2}
                className="mt-2 border-blue-200 focus:border-blue-500"
              />
            </div>

            <div className="mt-6">
              <Label htmlFor="status" className="text-gray-700 font-medium">
                Order Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className="mt-2 border-blue-200 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_progress">🔵 In Progress</SelectItem>
                  <SelectItem value="completed">🟢 Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-300 hover:bg-gray-50 px-8 py-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 shadow-lg"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update Order 📝" : "Create Order 🎂"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
