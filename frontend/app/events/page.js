"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { getEvents, getColleges, getCategories } from "../../lib/api";
import { Calendar, MapPin, Tag, Search, Filter, X } from "lucide-react";
import Link from "next/link";

export default function EventsListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [events, setEvents] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [externalError, setExternalError] = useState(null);
  
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    college: searchParams.get("college") || "",
    category: searchParams.get("category") || "",
  });
  
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [showExternalEvents, setShowExternalEvents] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadEvents();
  }, [filters, sortBy]);

  const loadData = async () => {
    try {
      const [collegesData, categoriesData] = await Promise.all([
        getColleges(),
        getCategories(),
      ]);
      setColleges(collegesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents(filters);
      let sortedEvents = data.events || [];
      
      // Sort events
      if (sortBy === "newest") {
        sortedEvents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortBy === "nearest") {
        sortedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      
      setEvents(sortedEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      q: "",
      college: "",
      category: "",
    });
  };

  const activeFiltersCount = Object.values(filters).filter((v) => v).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Discover Events</h1>
            <p className="text-slate-400">Find inter-college fests, workshops & local events</p>
          </div>
          <div className="flex items-center gap-4" />
        </div>

        {/* Search Bar */}
        <Card className="mb-6 bg-white/5 border-white/20 p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search events..."
                value={filters.q}
                onChange={(e) => handleFilterChange("q", e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="w-full border-white/20 hover:bg-white/10 sm:w-auto"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
              <Button
                onClick={() => {
                  loadEvents();
                }}
                className="w-full bg-primary-500 hover:bg-primary-600 sm:w-auto"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </Card>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/20 mb-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">College</label>
                <select
                  value={filters.college}
                  onChange={(e) => handleFilterChange("college", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white outline-none focus:border-primary"
                >
                  <option value="">All Colleges</option>
                  {colleges.map((college) => (
                    <option key={college.id} value={college.id}>
                      {college.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white outline-none focus:border-primary"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

            </div>


            {activeFiltersCount > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  className="border-white/20 hover:bg-white/10"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Sort & Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-400">
            {events.length} {events.length === 1 ? "event" : "events"} found
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white outline-none focus:border-primary"
          >
            <option value="newest">Newest First</option>
            <option value="nearest">Nearest First</option>
          </select>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-white">Loading events...</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <Card className="p-12 text-center bg-white/5 backdrop-blur-xl border-white/20">
            <p className="text-slate-400 mb-4">No events found.</p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-white/20 hover:bg-white/10"
            >
              Clear Filters
            </Button>
          </Card>
        ) : (
          <>
            {events.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">College Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} isExternal={false} />
                  ))}
                </div>
              </div>
            )}

          </>
        )}
      </motion.div>
    </div>
  );
}

function EventCard({ event }) {
  const eventDate = new Date(event.date);
  const eventUrl = `/events/${event.id}`;
  
  const cardContent = (
    <>
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
      
      <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2 flex-1">
        {event.title}
      </h3>
      
        <div className="space-y-2">
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
        
        <div className="flex items-center justify-between mt-3">
          <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-200 text-sm">
            {event.category || 'General'}
          </span>
          {event.college && (
            <span className="text-slate-400 text-sm">{event.college.name}</span>
          )}
        </div>
      </div>
    </>
  );
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/20 hover:bg-white/10 transition-all cursor-pointer h-full flex flex-col relative">
        <Link href={eventUrl} className="flex-1 flex flex-col">
          {cardContent}
        </Link>
      </Card>
    </motion.div>
  );
}


