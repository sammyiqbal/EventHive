"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { getCurrentUser, getEvents, deleteEvent } from "../../../lib/api";
import { useAuth } from "../../../contexts/auth-context";
import { Plus, Edit, Trash2, Calendar, MapPin, Tag, Eye } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, draft, approved, past

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user && user.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    if (user) {
      loadDashboard();
    }
  }, [user, authLoading, router]);

  const loadDashboard = async () => {
    try {
      const [userData, eventsData] = await Promise.all([
        getCurrentUser(),
        getEvents({ createdBy: user.id }),
      ]);
      
      setProfile(userData);
      setEvents(eventsData.events || []);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await deleteEvent(eventId);
      setEvents(events.filter((e) => e.id !== eventId));
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event");
    }
  };

  const filteredEvents = events.filter((event) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    
    if (filter === "past") return eventDate < now;
    if (filter === "upcoming") return eventDate >= now;
    if (filter === "draft") return !event.isPublic;
    if (filter === "approved") return event.isPublic;
    return true; // all
  });

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Admin Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-400">
              {profile?.college?.name && `Managing events for ${profile.college.name}`}
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/create")}
            className="bg-primary-500 hover:bg-primary-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["all", "upcoming", "past", "draft", "approved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === f
                ? "bg-primary-500 text-white"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onDelete={handleDelete}
            onEdit={() => router.push(`/dashboard/create?id=${event.id}`)}
          />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="p-12 text-center bg-white/5 backdrop-blur-xl border-white/20">
          <p className="text-slate-400 mb-4">No events found.</p>
          <Button
            onClick={() => router.push("/dashboard/create")}
            className="bg-primary-500 hover:bg-primary-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Event
          </Button>
        </Card>
      )}

      {/* AI Caption Helper Widget */}
      <Card className="mt-8 p-6 bg-highlight-500/10 backdrop-blur-xl border-highlight-500/30">
        <h2 className="text-xl font-semibold text-white mb-4">AI Caption Helper</h2>
        <p className="text-slate-300 mb-4">
          Use AI to generate engaging captions for your events. Available when creating or editing events.
        </p>
        <Button
          onClick={() => router.push("/dashboard/create")}
          variant="outline"
          className="border-highlight-500/50 hover:bg-highlight-500/20"
        >
          Try AI Caption Generator
        </Button>
      </Card>
    </div>
  );
}

function EventCard({ event, onDelete, onEdit }) {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/20 hover:bg-white/10 transition-all">
        {event.imageUrl && (
          <div className="relative h-48 rounded-xl overflow-hidden mb-4">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {!event.isPublic && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500/80 text-white text-xs rounded">
                Draft
              </div>
            )}
          </div>
        )}
        
        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{eventDate.toLocaleDateString()}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-slate-400" />
            <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-200 text-sm">
              {event.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 border-white/20 hover:bg-white/10"
          >
            <Link href={`/events/${event.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </Button>
          
          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
            className="border-white/20 hover:bg-white/10"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={() => onDelete(event.id)}
            variant="outline"
            size="sm"
            className="border-red-500/50 hover:bg-red-500/20 text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
