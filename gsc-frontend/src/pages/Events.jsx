

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RefreshCw, Calendar as CalendarIcon } from "lucide-react";
import EventList from "../components/EventList";
import CreateEventForm from "../components/CreateEventForm";

const Events = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const emailParam = params.get("email");

  const email = emailParam || localStorage.getItem("user_email") || "";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = React.useCallback(() => {
    if (email) {
      setLoading(true);
      fetch(`http://localhost:8000/auth/events/?email=${email}`)
        .then((res) => res.json())
        .then((data) => setEvents(data.events || []))
        .catch((err) => console.error("Error fetching events:", err))
        .finally(() => setLoading(false));
    }
  }, [email]);

  useEffect(() => {
    if (emailParam) {
      localStorage.setItem("user_email", emailParam);
    }
  }, [emailParam]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const deleteEvent = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    await fetch("http://localhost:8000/auth/events/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, event_id: eventId }),
    });

    fetchEvents(); // refresh list
  };

  const updateEvent = async (eventId, updatedFields) => {
    await fetch("http://localhost:8000/auth/events/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        event_id: eventId,
        ...updatedFields,
      }),
    });

    fetchEvents(); // refresh list
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PindSync</h1>
              <p className="text-sm text-gray-500">Manage your Google Calendar events</p>
            </div>
          </div>

          <button
            onClick={fetchEvents}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Syncing..." : "Sync Events"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CreateEventForm email={email} onEventCreated={fetchEvents} />
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Upcoming Events</h2>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                  {events.length} Events
                </span>
              </div>
              <EventList events={events} email={email} onDelete={deleteEvent} onUpdate={updateEvent}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
