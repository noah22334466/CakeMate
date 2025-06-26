"use server"

import { dataStore } from "@/lib/data-store"
import type { Order } from "@/types"

export async function createOrder(formData: FormData) {
  const orderData = {
    customer_id: Number.parseInt(formData.get("customer_id") as string),
    cake_type: formData.get("cake_type") as string,
    cake_size: formData.get("cake_size") as string,
    flavor: formData.get("flavor") as string,
    filling: formData.get("filling") as string,
    frosting: formData.get("frosting") as string,
    decorations: formData.get("decorations") as string,
    special_instructions: formData.get("special_instructions") as string,
    quantity: Number.parseInt(formData.get("quantity") as string) || 1,
    price: Number.parseFloat(formData.get("price") as string) || 0,
    order_date: formData.get("order_date") as string,
    delivery_date: formData.get("delivery_date") as string,
    delivery_time: formData.get("delivery_time") as string,
    delivery_address: formData.get("delivery_address") as string,
    status: (formData.get("status") as any) || "pending",
  }

  try {
    const order = dataStore.createOrder(orderData)
    return { success: true, order }
  } catch (error) {
    return { success: false, error: "Failed to create order" }
  }
}

export async function updateOrder(id: number, formData: FormData) {
  const updates: Partial<Order> = {}

  const fields = [
    "customer_id",
    "cake_type",
    "cake_size",
    "flavor",
    "filling",
    "frosting",
    "decorations",
    "special_instructions",
    "quantity",
    "price",
    "order_date",
    "delivery_date",
    "delivery_time",
    "delivery_address",
    "status",
  ]

  fields.forEach((field) => {
    const value = formData.get(field)
    if (value !== null && value !== "") {
      if (field === "customer_id" || field === "quantity") {
        ;(updates as any)[field] = Number.parseInt(value as string)
      } else if (field === "price") {
        ;(updates as any)[field] = Number.parseFloat(value as string)
      } else {
        ;(updates as any)[field] = value
      }
    }
  })

  try {
    const order = dataStore.updateOrder(id, updates)
    if (!order) {
      return { success: false, error: "Order not found" }
    }
    return { success: true, order }
  } catch (error) {
    return { success: false, error: "Failed to update order" }
  }
}

export async function updateOrderStatus(id: number, status: string) {
  try {
    const order = dataStore.updateOrder(id, { status: status as any })
    if (!order) {
      return { success: false, error: "Order not found" }
    }
    return { success: true, order }
  } catch (error) {
    return { success: false, error: "Failed to update order status" }
  }
}

export async function getOrders(): Promise<Order[]> {
  return dataStore.getOrders()
}

export async function getOrder(id: number): Promise<Order | null> {
  return dataStore.getOrder(id) || null
}

export async function addOrderLog(orderId: number, action: string, description?: string) {
  try {
    const log = dataStore.addOrderLog({
      order_id: orderId,
      action,
      description,
      user_name: "Admin",
    })
    return { success: true, log }
  } catch (error) {
    return { success: false, error: "Failed to add log entry" }
  }
}
