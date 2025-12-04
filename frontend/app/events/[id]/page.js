"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { getEventById, saveEvent, registerForEvent, getEvents } from "../../../lib/api";
import { useAuth } from "../../../contexts/auth-context";
import { Calendar, MapPin, Tag, Share2, Bookmark, User, ArrowLeft } from "lucide-react";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      loadEvent();
    }
  }, [params.id]);

  const loadEvent = async () => {
    try {
      const data = await getEventById(params.id);
      setEvent(data);
      
      // Load related events (same category or college, excluding current event)
      if (data) {
        const related = await getEvents({
          category: data.category,
          limit: 4,
        });
        setRelatedEvents(
          related.events?.filter((e) => e.id !== parseInt(params.id)) || []
        );
      }
    } catch (err) {
      setError(err.message || "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setSaving(true);
    try {
      await saveEvent(params.id);
      // Show success message or update UI
    } catch (err) {
      setError(err.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setRegistering(true);
    try {
      await registerForEvent(params.id);
      // Show success message or update UI
    } catch (err) {
      setError(err.message || "Failed to register for event");
    } finally {
      setRegistering(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </Card>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="mb-6 border-white/20 hover:bg-white/10 backdrop-blur-sm"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Event Banner */}
        {event.imageUrl && (
          <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden mb-8">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {event.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="h-5 w-5" />
                  <span>{formattedDate}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="h-5 w-5" />
                    <span>{event.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-300">
                  <Tag className="h-5 w-5" />
                  <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-200">
                    {event.category}
                  </span>
                </div>
              </div>
            </div>

            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4">Description</h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </Card>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/20">
                <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-accent-500/20 text-accent-200 text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* AI Generated Caption */}
            {event.aiCaption && (
              <Card className="p-6 bg-highlight-500/10 backdrop-blur-xl border-highlight-500/30">
                <h3 className="text-lg font-semibold text-white mb-2">AI Generated Caption</h3>
                <p className="text-slate-300 italic">{event.aiCaption}</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Event Info</h3>
              
              <div className="space-y-4">
                {event.college && (
                  <div>
                    <p className="text-sm text-slate-400 mb-1">College</p>
                    <p className="text-white font-medium">{event.college.name}</p>
                  </div>
                )}

                {event.creator && (
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Organizer</p>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <p className="text-white font-medium">{event.creator.name || event.creator.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Action Buttons */}
            {user && (
              <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/20">
                <div className="space-y-3">
                  {user.role === "student" && (
                    <>
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-primary-500 hover:bg-primary-600"
                        variant="outline"
                      >
                        <Bookmark className="mr-2 h-4 w-4" />
                        {saving ? "Saving..." : "Save Event"}
                      </Button>
                      
                      <Button
                        onClick={handleRegister}
                        disabled={registering}
                        className="w-full bg-secondary-500 hover:bg-secondary-600"
                      >
                        {registering ? "Registering..." : "Register Now"}
                      </Button>
                    </>
                  )}
                  
                  {user.role === "admin" && event.createdBy === user.id && (
                    <Button
                      onClick={() => router.push(`/dashboard/create?id=${event.id}`)}
                      className="w-full bg-primary-500 hover:bg-primary-600"
                    >
                      Edit Event
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="w-full border-white/20 hover:bg-white/10 backdrop-blur-sm"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Event
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Related Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedEvents.map((relatedEvent) => (
                <Card
                  key={relatedEvent.id}
                  className="p-4 bg-white/5 backdrop-blur-xl border-white/20 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => router.push(`/events/${relatedEvent.id}`)}
                >
                  {relatedEvent.imageUrl && (
                    <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                      <img
                        src={relatedEvent.imageUrl}
                        alt={relatedEvent.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">
                    {relatedEvent.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {new Date(relatedEvent.date).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
