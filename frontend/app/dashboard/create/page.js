"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  getEventById,
  createEvent,
  updateEvent,
  getCategories,
  generateCaption,
} from "../../../lib/api";
import { useAuth } from "../../../contexts/auth-context";
import { Sparkles, Save, X } from "lucide-react";

export default function CreateEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const eventId = searchParams.get("id");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    location: "",
    collegeName: "",
    imageUrl: "",
    isPublic: true,
    tags: [],
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard");
      return;
    }
    if (user) {
      loadData();
    }
  }, [user, authLoading, router, eventId]);

  const loadData = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);

      if (eventId) {
        const event = await getEventById(eventId);
        setFormData({
          title: event.title || "",
          description: event.description || "",
          category: event.category || "",
          date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
          location: event.location || "",
          collegeName: event.college?.name || "",
          imageUrl: event.imageUrl || "",
          isPublic: event.isPublic !== undefined ? event.isPublic : true,
          tags: event.tags || [],
        });
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      setError("Failed to load form data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleGenerateCaption = async () => {
    if (!formData.title || !formData.category) {
      alert("Please enter a title and category first");
      return;
    }

    setGeneratingCaption(true);
    try {
      const result = await generateCaption({
        title: formData.title,
        category: formData.category,
      });
      setFormData((prev) => ({
        ...prev,
        description: result.caption,
      }));
    } catch (error) {
      console.error("Failed to generate caption:", error);
      alert("Failed to generate caption");
    } finally {
      setGeneratingCaption(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (eventId) {
        await updateEvent(eventId, formData);
      } else {
        await createEvent(formData);
      }
      router.push("/dashboard/admin");
    } catch (error) {
      setError(error.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-white mb-8">
          {eventId ? "Edit Event" : "Create New Event"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* AI Caption Section */}
          <Card className="p-6 bg-highlight-500/10 backdrop-blur-xl border-highlight-500/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  AI Caption Generator
                </h3>
                <p className="text-sm text-slate-400">
                  Generate an engaging description for your event
                </p>
              </div>
              <Button
                type="button"
                onClick={handleGenerateCaption}
                disabled={generatingCaption || !formData.title || !formData.category}
                className="bg-highlight-500 hover:bg-highlight-600 text-gray-900"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {generatingCaption ? "Generating..." : "Generate Caption"}
              </Button>
            </div>
          </Card>

          {/* Form Fields */}
          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/20">
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  required
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date & Time *</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="collegeName">College Name *</Label>
                  <Input
                    id="collegeName"
                    value={formData.collegeName}
                    onChange={(e) => handleInputChange("collegeName", e.target.value)}
                    placeholder="Enter college name"
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Event venue or address"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required
                  rows={6}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Describe your event..."
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag and press Enter"
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-500/20 text-primary-200 text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => handleInputChange("isPublic", e.target.checked)}
                  className="h-4 w-4 rounded border border-white/20 bg-white/10 text-primary-500"
                />
                <Label htmlFor="isPublic" className="cursor-pointer">
                  Make event public
                </Label>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary-500 hover:bg-primary-600"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : eventId ? "Update Event" : "Create Event"}
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push("/dashboard/admin")}
                  variant="outline"
                  className="border-white/20 hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </motion.div>
    </div>
  );
}
