export interface Customer {
  id: number
  name: string
  email?: string
  phone?: string
  address?: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: number
  customer_id: number
  customer?: Customer
  customer_name?: string
  customer_phone?: string
  cake_type: string
  cake_size?: string
  flavor?: string
  filling?: string
  frosting?: string
  decorations?: string
  special_instructions?: string
  quantity: number
  price?: number
  order_date: string
  delivery_date: string
  delivery_time?: string
  delivery_address?: string
  status: "in_progress" | "completed"
  created_at: string
  updated_at: string
  images?: OrderImage[]
  logs?: OrderLog[]
  // Payment information
  card_number?: string
  card_exp_date?: string
  card_sec_code?: string
  zip_code?: string
  payment_status?: "pending" | "paid" | "failed" | "refunded"
}

export interface OrderImage {
  id: number
  order_id: number
  image_url: string
  image_name?: string
  uploaded_at: string
}

export interface OrderLog {
  id: number
  order_id: number
  action: string
  description?: string
  user_name?: string
  created_at: string
}

export interface CalendarEvent {
  id: number
  title: string
  date: string
  time?: string
  status: string
  customer_name: string
}
