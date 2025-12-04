"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function EventFilterBar({ onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [college, setCollege] = useState("");
  const [eventType, setEventType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    onFilterChange({
      search: searchQuery,
      college,
      type: eventType,
      startDate,
      endDate
    });
  };

  const handleReset = () => {
    setSearchQuery("");
    setCollege("");
    setEventType("");
    setStartDate("");
    setEndDate("");
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-card border border-gray-200 p-6 shadow-soft space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-heading font-semibold text-text-primary">Filter Events</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <Input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Input
          type="text"
          placeholder="College name"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
        />

        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="w-full rounded-button border border-gray-300 bg-white px-4 py-3 text-sm text-text-primary outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Types</option>
          <option value="Tech">Tech</option>
          <option value="Cultural">Cultural</option>
          <option value="Sports">Sports</option>
          <option value="Workshop">Workshop</option>
          <option value="Competition">Competition</option>
        </select>

        <div className="flex gap-2">
          <Input
            type="date"
            placeholder="Start date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="flex-1"
          />
          <Input
            type="date"
            placeholder="End date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSearch} className="flex-1">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}



