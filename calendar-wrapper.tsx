"use client"

import { useRouter } from "next/navigation"
import CalendarView from "@/components/calendar-view"
import type { CalendarEvent } from "@/types"

interface CalendarWrapperProps {
  events: CalendarEvent[]
}

export default function CalendarWrapper({ events }: CalendarWrapperProps) {
  const router = useRouter()

  const handleEventClick = (event: CalendarEvent) => {
    router.push(`/orders/${event.id}`)
  }

  return <CalendarView events={events} onEventClick={handleEventClick} />
}
