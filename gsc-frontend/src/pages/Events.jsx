

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import EventList from "../components/EventList";
import CreateEventForm from "../components/CreateEventForm";

const Events = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const emailParam = params.get("email");

  const email = emailParam || localStorage.getItem("user_email") || "";
  const [events, setEvents] = useState([]);

  const fetchEvents = React.useCallback(() => {
    if (email) {
      fetch(`http://localhost:8000/auth/events/?email=${email}`)
        .then((res) => res.json())
        .then((data) => setEvents(data.events || []))
        .catch((err) => console.error("Error fetching events:", err));
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Your Google Calendar Events</h1>

      <button
        onClick={fetchEvents}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Sync Events
      </button>

      <CreateEventForm email={email} onEventCreated={fetchEvents} />

      <div className="mt-6">
        <EventList events={events} email={email} onDelete={deleteEvent} onUpdate={updateEvent}/>
      </div>
    </div>
  );
};

export default Events;
