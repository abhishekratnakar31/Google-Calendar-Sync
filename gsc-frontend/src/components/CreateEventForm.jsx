import React, { useState } from "react";
import { Plus, Calendar, Type, AlignLeft, Clock } from "lucide-react";

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
      setSummary("");
      setDescription("");
      setStart("");
      setEnd("");
    } else {
      alert("Error creating event.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <Plus className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">Create New Event</h2>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Type className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Event Title" 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
        </div>

        <div className="relative">
          <AlignLeft className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea 
            placeholder="Description (optional)" 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Start Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="datetime-local" 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">End Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="datetime-local" 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
        <Plus className="w-5 h-5" />
        Create Event
      </button>
    </form>
  );
};

export default CreateEventForm;
