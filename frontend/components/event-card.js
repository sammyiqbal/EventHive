"use client";

import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export function EventCard({ event }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <Card className="overflow-hidden">
      {event.image && (
        <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 mb-4 rounded-t-card">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-lg font-heading font-semibold text-text-primary line-clamp-2">
              {event.title}
            </h3>
            <p className="text-sm text-text-secondary mt-1">{event.college}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary whitespace-nowrap">
            {event.category}
          </span>
        </div>

        <p className="text-sm text-text-secondary line-clamp-2">{event.description}</p>

        <div className="flex flex-wrap gap-4 text-xs text-text-secondary">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(event.date)}
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {event.location}
            </div>
          )}
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href={`/events/${event.id}`}>View Details</Link>
        </Button>
      </div>
    </Card>
  );
}


