import React, { useState } from "react";

const CreateEventForm = ({ email, onEventCreated }) => {
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      email,
      title: summary,
      description,
      start,
      end,
    };

    const res = await fetch("http://localhost:8000/auth/events/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.event) {
      alert("Event Created Successfully!");
      onEventCreated(); // refresh events
    } else {
      alert("Error creating event.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold">Create Event</h2>

      <input 
        type="text" 
        placeholder="Title" 
        className="border p-2 w-full"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      <textarea 
        placeholder="Description" 
        className="border p-2 w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input 
        type="datetime-local" 
        className="border p-2 w-full"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />

      <input 
        type="datetime-local" 
        className="border p-2 w-full"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Event
      </button>
    </form>
  );
};

export default CreateEventForm;
