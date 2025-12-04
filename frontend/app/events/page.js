"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { getEvents, getExternalEvents, getColleges, getCategories } from "../../lib/api";
import { Calendar, MapPin, Tag, Search, Filter, X } from "lucide-react";
import Link from "next/link";

export default function EventsListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [events, setEvents] = useState([]);
  const [externalEvents, setExternalEvents] = useState([]);
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
  
  // External events filters
  const [externalFilters, setExternalFilters] = useState({
    city: searchParams.get("city") || "",
    state: searchParams.get("state") || "",
    country: searchParams.get("country") || "US",
  });
  
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [showExternalEvents, setShowExternalEvents] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadEvents();
    if (showExternalEvents && (externalFilters.city || externalFilters.state)) {
      loadExternalEvents();
    }
  }, [filters, sortBy, externalFilters, showExternalEvents]);

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

  const loadExternalEvents = async () => {
    if (!externalFilters.city && !externalFilters.state) {
      setExternalEvents([]);
      setExternalError(null);
      return;
    }

    setLoadingExternal(true);
    setExternalError(null);
    try {
      console.log('Loading external events with filters:', externalFilters);
      const data = await getExternalEvents({
        city: externalFilters.city,
        state: externalFilters.state,
        country: externalFilters.country,
        category: filters.category || undefined,
        limit: 20
      });
      
      console.log('External events response:', data);
      
      // Check for error in response
      if (data.error) {
        setExternalError(data.error || data.message || 'Failed to fetch external events');
        setExternalEvents([]);
        return;
      }
      
      let sortedExternalEvents = data.events || [];
      
      // Sort external events
      if (sortBy === "nearest") {
        sortedExternalEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else if (sortBy === "newest") {
        sortedExternalEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      
      setExternalEvents(sortedExternalEvents);
      
      if (sortedExternalEvents.length === 0 && data.message) {
        setExternalError(data.message);
      }
    } catch (error) {
      console.error("Failed to load external events:", error);
      const errorMessage = error.data?.error || error.data?.message || error.message || 'Failed to fetch external events';
      setExternalError(errorMessage);
      setExternalEvents([]);
    } finally {
      setLoadingExternal(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleExternalFilterChange = (key, value) => {
    setExternalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      q: "",
      college: "",
      category: "",
    });
    setExternalFilters({
      city: "",
      state: "",
      country: "US",
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
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={showExternalEvents}
                onChange={(e) => setShowExternalEvents(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/10"
              />
              <span className="text-sm">Show Local Events</span>
            </label>
          </div>
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
                  if (showExternalEvents) loadExternalEvents();
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

            {/* Location Filters for External Events */}
            {showExternalEvents && (
              <>
                <div className="border-t border-white/20 pt-4 mb-4">
                  <h3 className="text-white font-medium mb-3">Local Events Location</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">City</label>
                      <Input
                        placeholder="e.g., New York"
                        value={externalFilters.city}
                        onChange={(e) => handleExternalFilterChange("city", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">State</label>
                      <Input
                        placeholder="e.g., NY"
                        value={externalFilters.state}
                        onChange={(e) => handleExternalFilterChange("state", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Country</label>
                      <select
                        value={externalFilters.country}
                        onChange={(e) => handleExternalFilterChange("country", e.target.value)}
                        className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white outline-none focus:border-primary"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

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
            {events.length + externalEvents.length} {events.length + externalEvents.length === 1 ? "event" : "events"} found
            {events.length > 0 && <span className="ml-2">({events.length} college events</span>}
            {externalEvents.length > 0 && <span className="ml-1">, {externalEvents.length} local events</span>}
            {events.length > 0 && <span>)</span>}
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
        ) : events.length === 0 && externalEvents.length === 0 ? (
          <Card className="p-12 text-center bg-white/5 backdrop-blur-xl border-white/20">
            <p className="text-slate-400 mb-4">No events found.</p>
            {showExternalEvents && (
              <p className="text-slate-500 text-sm mb-4">
                Try adding a city and state to search for local events.
              </p>
            )}
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
            {/* College Events Section */}
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

            {/* Loading External Events */}
            {loadingExternal && showExternalEvents && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-slate-400 text-sm">Loading local events...</p>
                </div>
              </div>
            )}

            {/* External Events Error */}
            {!loadingExternal && externalError && (
              <Card className="p-6 bg-yellow-500/10 border-yellow-500/20 mb-6">
                <div className="text-center">
                  <p className="text-yellow-300 font-medium mb-2">⚠️ Unable to load local events</p>
                  <p className="text-slate-400 text-sm">{externalError}</p>
                  {externalError.includes('RAPIDAPI_KEY') && (
                    <p className="text-slate-400 text-xs mt-2">
                      Please configure RAPIDAPI_KEY in your backend .env file
                    </p>
                  )}
                </div>
              </Card>
            )}

            {/* External Events Section */}
            {!loadingExternal && !externalError && externalEvents.length > 0 && (
              <div className={events.length > 0 ? "mt-8" : ""}>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Local Events {externalFilters.city && `in ${externalFilters.city}${externalFilters.state ? `, ${externalFilters.state}` : ''}`}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {externalEvents.map((event) => (
                    <EventCard key={event.id} event={event} isExternal={true} />
                  ))}
                </div>
              </div>
            )}

            {/* No External Events Message */}
            {!loadingExternal && !externalError && showExternalEvents && externalEvents.length === 0 && (externalFilters.city || externalFilters.state) && (
              <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/20">
                <div className="text-center">
                  <p className="text-slate-400 mb-2">No local events found</p>
                  <p className="text-slate-500 text-sm">
                    Try a different city or state, or check back later for new events.
                  </p>
                </div>
              </Card>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

function EventCard({ event, isExternal = false }) {
  const eventDate = new Date(event.date);
  const eventUrl = isExternal ? (event.url || '#') : `/events/${event.id}`;
  const isExternalLink = isExternal && event.url;
  
  const cardContent = (
    <>
      {isExternal && (
        <div className="absolute top-2 right-2 z-10">
          <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium">
            Local
          </span>
        </div>
      )}
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
          {event.venue && (
            <span className="text-slate-400 text-sm">{event.venue.name}</span>
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
        {isExternalLink ? (
          <a 
            href={eventUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 flex flex-col"
          >
            {cardContent}
          </a>
        ) : (
          <Link href={eventUrl} className="flex-1 flex flex-col">
            {cardContent}
          </Link>
        )}
      </Card>
    </motion.div>
  );
}


