"use client"

import { useState, useEffect } from "react"
import CalendarWrapper from "@/components/calendar-wrapper"
import { dataStore } from "@/lib/data-store"
import type { CalendarEvent } from "@/types"

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = dataStore.getCalendarEvents()
        setEvents(eventsData)
      } catch (error) {
        console.error("Failed to fetch events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            📅 Order Calendar
          </h1>
          <p className="text-gray-700 mt-2 text-lg">View all your delicious cake orders and deliveries</p>
        </div>

        <CalendarWrapper events={events} />
      </div>
    </div>
  )
}
