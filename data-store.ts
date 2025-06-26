import type { Customer, Order, OrderImage, OrderLog, CalendarEvent } from "@/types"
import { isOrderOld } from "@/lib/utils"

// Mock data store - in a real app, this would be database calls
const customers: Customer[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@email.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, ST 12345",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "(555) 987-6543",
    address: "456 Oak Ave, Somewhere, ST 67890",
    created_at: "2024-01-20T14:30:00Z",
    updated_at: "2024-01-20T14:30:00Z",
  },
]

// Get current date for filtering
const getCurrentDate = () => new Date().toISOString().split("T")[0]
const getTwoWeeksFromNow = () => {
  const date = new Date()
  date.setDate(date.getDate() + 14)
  return date.toISOString().split("T")[0]
}

const orders: Order[] = [
  {
    id: 1,
    customer_id: 1,
    customer_name: "Sarah Johnson",
    customer_phone: "(555) 123-4567",
    cake_type: "Wedding Cake",
    cake_size: "3-tier",
    flavor: "Vanilla",
    filling: "Strawberry",
    frosting: "Buttercream",
    decorations: "White roses, pearl details",
    special_instructions: "Gluten-free option needed",
    quantity: 1,
    price: 450.0,
    order_date: getCurrentDate(),
    delivery_date: getTwoWeeksFromNow(),
    delivery_time: "15:00",
    delivery_address: "123 Main St, Anytown, ST 12345",
    status: "in_progress",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    card_number: "**** **** **** 1234",
    card_exp_date: "12/26",
    zip_code: "12345",
    payment_status: "paid",
  },
  {
    id: 2,
    customer_id: 2,
    customer_name: "Mike Chen",
    customer_phone: "(555) 987-6543",
    cake_type: "Birthday Cake",
    cake_size: "8 inch round",
    flavor: "Chocolate",
    filling: "Chocolate ganache",
    frosting: "Chocolate buttercream",
    decorations: "Happy Birthday message, colorful sprinkles",
    special_instructions: 'Please write "Happy 25th Birthday Mike!"',
    quantity: 1,
    price: 85.0,
    order_date: getCurrentDate(),
    delivery_date: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 7)
      return date.toISOString().split("T")[0]
    })(),
    delivery_time: "12:00",
    delivery_address: "456 Oak Ave, Somewhere, ST 67890",
    status: "in_progress",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    payment_status: "pending",
  },
  {
    id: 3,
    customer_id: 1,
    customer_name: "Sarah Johnson",
    customer_phone: "(555) 123-4567",
    cake_type: "Anniversary Cake",
    cake_size: "10 inch round",
    flavor: "Red Velvet",
    filling: "Cream cheese",
    frosting: "Cream cheese frosting",
    decorations: "Gold accents, anniversary message",
    special_instructions: "Please write '25 Years Together'",
    quantity: 1,
    price: 120.0,
    order_date: getCurrentDate(),
    delivery_date: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 10)
      return date.toISOString().split("T")[0]
    })(),
    delivery_time: "14:00",
    delivery_address: "123 Main St, Anytown, ST 12345",
    status: "completed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    payment_status: "paid",
  },
  {
    id: 4,
    customer_id: 2,
    customer_name: "Mike Chen",
    customer_phone: "(555) 987-6543",
    cake_type: "Graduation Cake",
    cake_size: "Sheet cake",
    flavor: "Funfetti",
    filling: "Vanilla",
    frosting: "Buttercream",
    decorations: "Graduation cap, school colors",
    special_instructions: "Blue and gold theme",
    quantity: 1,
    price: 95.0,
    order_date: getCurrentDate(),
    delivery_date: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 21)
      return date.toISOString().split("T")[0]
    })(),
    delivery_time: "16:00",
    delivery_address: "456 Oak Ave, Somewhere, ST 67890",
    status: "in_progress",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    card_number: "**** **** **** 5678",
    card_exp_date: "08/27",
    zip_code: "67890",
    payment_status: "paid",
  },
  {
    id: 5,
    customer_id: 1,
    customer_name: "Sarah Johnson",
    customer_phone: "(555) 123-4567",
    cake_type: "Baby Shower Cake",
    cake_size: "8 inch round",
    flavor: "Lemon",
    filling: "Lemon curd",
    frosting: "Swiss meringue buttercream",
    decorations: "Pink and white flowers, baby theme",
    special_instructions: "Gender neutral decorations preferred",
    quantity: 1,
    price: 85.0,
    order_date: getCurrentDate(),
    delivery_date: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 5)
      return date.toISOString().split("T")[0]
    })(),
    delivery_time: "13:00",
    delivery_address: "789 Pine St, Newtown, ST 54321",
    status: "in_progress",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    payment_status: "pending",
  },
]

const orderImages: OrderImage[] = []
const orderLogs: OrderLog[] = [
  {
    id: 1,
    order_id: 1,
    action: "Order Created",
    description: "New wedding cake order created",
    user_name: "Admin",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    order_id: 2,
    action: "Order Created",
    description: "New birthday cake order created",
    user_name: "Admin",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    order_id: 3,
    action: "Order Created",
    description: "New anniversary cake order created",
    user_name: "Admin",
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    order_id: 3,
    action: "Status Updated",
    description: "Order status changed to completed",
    user_name: "Baker",
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    order_id: 4,
    action: "Order Created",
    description: "New graduation cake order created",
    user_name: "Admin",
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    order_id: 5,
    action: "Order Created",
    description: "New baby shower cake order created",
    user_name: "Admin",
    created_at: new Date().toISOString(),
  },
]

let nextCustomerId = 3
let nextOrderId = 6
let nextImageId = 1
let nextLogId = 7

export const dataStore = {
  // Customers
  getCustomers: (): Customer[] => customers,
  getCustomer: (id: number): Customer | undefined => customers.find((c) => c.id === id),
  createCustomer: (customer: Omit<Customer, "id" | "created_at" | "updated_at">): Customer => {
    const newCustomer: Customer = {
      ...customer,
      id: nextCustomerId++,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    customers.push(newCustomer)
    return newCustomer
  },
  updateCustomer: (id: number, updates: Partial<Customer>): Customer | null => {
    const index = customers.findIndex((c) => c.id === id)
    if (index === -1) return null
    customers[index] = { ...customers[index], ...updates, updated_at: new Date().toISOString() }
    return customers[index]
  },

  // Orders - with automatic cleanup of old orders
  getOrders: (): Order[] => {
    // Filter out orders older than 2 weeks
    const activeOrders = orders.filter((order) => !isOrderOld(order.delivery_date))

    return activeOrders.map((order) => ({
      ...order,
      customer: customers.find((c) => c.id === order.customer_id),
      images: orderImages.filter((img) => img.order_id === order.id),
      logs: orderLogs.filter((log) => log.order_id === order.id),
    }))
  },
  getOrder: (id: number): Order | undefined => {
    const order = orders.find((o) => o.id === id)
    if (!order || isOrderOld(order.delivery_date)) return undefined
    return {
      ...order,
      customer: customers.find((c) => c.id === order.customer_id),
      images: orderImages.filter((img) => img.order_id === order.id),
      logs: orderLogs.filter((log) => log.order_id === order.id),
    }
  },
  createOrder: (order: Omit<Order, "id" | "created_at" | "updated_at">): Order => {
    const newOrder: Order = {
      ...order,
      id: nextOrderId++,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    orders.push(newOrder)

    // Add log entry
    orderLogs.push({
      id: nextLogId++,
      order_id: newOrder.id,
      action: "Order Created",
      description: `New ${order.cake_type.toLowerCase()} order created`,
      user_name: "Admin",
      created_at: new Date().toISOString(),
    })

    return newOrder
  },
  updateOrder: (id: number, updates: Partial<Order>): Order | null => {
    const index = orders.findIndex((o) => o.id === id)
    if (index === -1) return null

    const oldOrder = orders[index]
    orders[index] = { ...oldOrder, ...updates, updated_at: new Date().toISOString() }

    // Add log entry for status changes
    if (updates.status && updates.status !== oldOrder.status) {
      orderLogs.push({
        id: nextLogId++,
        order_id: id,
        action: "Status Updated",
        description: `Order status changed from ${oldOrder.status} to ${updates.status}`,
        user_name: "Admin",
        created_at: new Date().toISOString(),
      })
    }

    return orders[index]
  },

  // Order Images
  addOrderImage: (orderImage: Omit<OrderImage, "id" | "uploaded_at">): OrderImage => {
    const newImage: OrderImage = {
      ...orderImage,
      id: nextImageId++,
      uploaded_at: new Date().toISOString(),
    }
    orderImages.push(newImage)

    // Add log entry
    orderLogs.push({
      id: nextLogId++,
      order_id: orderImage.order_id,
      action: "Image Added",
      description: `Image "${orderImage.image_name}" uploaded`,
      user_name: "Admin",
      created_at: new Date().toISOString(),
    })

    return newImage
  },

  // Order Logs
  addOrderLog: (log: Omit<OrderLog, "id" | "created_at">): OrderLog => {
    const newLog: OrderLog = {
      ...log,
      id: nextLogId++,
      created_at: new Date().toISOString(),
    }
    orderLogs.push(newLog)
    return newLog
  },

  // Calendar Events - only show active orders
  getCalendarEvents: (): CalendarEvent[] => {
    const activeOrders = orders.filter((order) => !isOrderOld(order.delivery_date))

    return activeOrders
      .map((order) => ({
        id: order.id,
        title: `${order.cake_type} - ${order.customer_name || "Unknown Customer"}`,
        date: order.delivery_date,
        time: order.delivery_time,
        status: order.status,
        customer_name: order.customer_name || "Unknown Customer",
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  },
}
