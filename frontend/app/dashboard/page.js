"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { getCurrentUser, getEvents, getSavedEvents } from "../../lib/api";
import { useAuth } from "../../contexts/auth-context";
import { Calendar, MapPin, Tag, Bookmark, Search, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user && user.role === "admin") {
      router.push("/dashboard/admin");
      return;
    }
    if (user) {
      loadDashboard();
    }
  }, [user, authLoading, router]);

  const loadDashboard = async () => {
    try {
      const [userData, saved, recommended] = await Promise.all([
        getCurrentUser(),
        getSavedEvents(user.id),
        getEvents({ limit: 6 }),
      ]);
      
      setProfile(userData);
      setSavedEvents(saved);
      setRecommendedEvents(recommended.events || []);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const results = await getEvents({ q: searchQuery, limit: 10 });
      setRecommendedEvents(results.events || []);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

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

  const upcomingRegistrations = profile?.registrations?.filter(
    (reg) => new Date(reg.event.date) > new Date()
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {profile?.name || user?.name || "Student"}! 👋
        </h1>
        <p className="text-slate-400">Discover and manage your events</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Saved Events</p>
              <p className="text-3xl font-bold text-white">{savedEvents.length}</p>
            </div>
            <Bookmark className="h-8 w-8 text-primary-400" />
          </div>
        </Card>
        
        <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Upcoming</p>
              <p className="text-3xl font-bold text-white">{upcomingRegistrations.length}</p>
            </div>
            <Clock className="h-8 w-8 text-secondary-400" />
          </div>
        </Card>
        
        <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Events</p>
              <p className="text-3xl font-bold text-white">{recommendedEvents.length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-accent-400" />
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="mb-8 bg-white/5 border-white/20 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Search events by name, category, or college..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="w-full bg-primary-500 hover:bg-primary-600 sm:w-auto"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </Card>

      {/* Saved Events */}
      {savedEvents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Your Saved Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Recommended Events */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Recommended Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        {recommendedEvents.length === 0 && (
          <Card className="p-8 text-center bg-white/5 backdrop-blur-xl border-white/20">
            <p className="text-slate-400">No events found. Check back later!</p>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      {upcomingRegistrations.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Upcoming Registrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingRegistrations.map((reg) => (
              <Card key={reg.id} className="p-6 bg-white/5 backdrop-blur-xl border-white/20">
                <h3 className="text-xl font-semibold text-white mb-2">{reg.event.title}</h3>
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(reg.event.date).toLocaleDateString()}</span>
                  </div>
                  {reg.event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{reg.event.location}</span>
                    </div>
                  )}
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="mt-4 border-white/20 hover:bg-white/10"
                >
                  <Link href={`/events/${reg.event.id}`}>View Details</Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EventCard({ event }) {
  const eventDate = new Date(event.date);
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/20 hover:bg-white/10 transition-all cursor-pointer">
        <Link href={`/events/${event.id}`}>
          {event.imageUrl && (
            <div className="relative h-48 rounded-xl overflow-hidden mb-4">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}
          
          <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
            {event.title}
          </h3>
          
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
            <Calendar className="h-4 w-4" />
            <span>{eventDate.toLocaleDateString()}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-200 text-sm">
              {event.category}
            </span>
            {event.college && (
              <span className="text-slate-400 text-sm">{event.college.name}</span>
            )}
          </div>
        </Link>
      </Card>
    </motion.div>
  );
}
