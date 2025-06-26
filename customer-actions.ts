"use server"

import { dataStore } from "@/lib/data-store"
import type { Customer } from "@/types"

export async function createCustomer(formData: FormData) {
  const customerData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
  }

  try {
    const customer = dataStore.createCustomer(customerData)
    return { success: true, customer }
  } catch (error) {
    return { success: false, error: "Failed to create customer" }
  }
}

export async function updateCustomer(id: number, formData: FormData) {
  const updates = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
  }

  try {
    const customer = dataStore.updateCustomer(id, updates)
    if (!customer) {
      return { success: false, error: "Customer not found" }
    }
    return { success: true, customer }
  } catch (error) {
    return { success: false, error: "Failed to update customer" }
  }
}

export async function getCustomers(): Promise<Customer[]> {
  return dataStore.getCustomers()
}

export async function getCustomer(id: number): Promise<Customer | null> {
  return dataStore.getCustomer(id) || null
}
