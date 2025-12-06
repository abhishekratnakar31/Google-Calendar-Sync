import React, { useState } from "react";
import axios from "axios";
import CalendarDropdown from "./CalendarDropdown";

export default function CreateGoogleItem() {
  const [type, setType] = useState("event");
  const [calendarId, setCalendarId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [addMeet, setAddMeet] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const handleSubmit = async () => {
    const payload = {
      type,
      title,
      description,
      google_calendar_id: calendarId,
      start_at: startAt,
      end_at: endAt,
      due_at: dueAt,
      add_meet: addMeet
    };

    try {
      const res = await axios.post(`${API_URL}/auth/items/create/`, payload, { withCredentials: true });
      alert("Item created!");
      console.log(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed — check console");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border max-w-xl">
      <CalendarDropdown onSelect={setCalendarId} />

      <label className="block mb-2 font-medium">Type</label>
      <select 
        value={type} 
        onChange={(e) => setType(e.target.value)} 
        className="border p-2 rounded-lg w-full mb-4"
      >
        <option value="event">Event</option>
        <option value="appointment">Appointment</option>
        <option value="task">Task</option>
      </select>

      <label className="block mb-2 font-medium">Title</label>
      <input className="border p-2 rounded-lg w-full mb-4" value={title} onChange={(e) => setTitle(e.target.value)} />

      <label className="block mb-2 font-medium">Description</label>
      <textarea className="border p-2 rounded-lg w-full mb-4" value={description} onChange={(e) => setDescription(e.target.value)} />

      {(type === "event" || type === "appointment") && (
        <>
          <label className="block mb-2 font-medium">Start</label>
          <input type="datetime-local" className="border p-2 rounded-lg w-full mb-4" value={startAt} onChange={(e) => setStartAt(e.target.value)} />

          <label className="block mb-2 font-medium">End</label>
          <input type="datetime-local" className="border p-2 rounded-lg w-full mb-4" value={endAt} onChange={(e) => setEndAt(e.target.value)} />

          <div className="flex items-center gap-2 mb-4">
            <input type="checkbox" checked={addMeet} onChange={(e) => setAddMeet(e.target.checked)} />
            <span>Add Google Meet Link</span>
          </div>
        </>
      )}

      {type === "task" && (
        <>
          <label className="block mb-2 font-medium">Due Date</label>
          <input type="date" className="border p-2 rounded-lg w-full mb-4" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
        </>
      )}

      <button onClick={handleSubmit} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg w-full">
        Create Item
      </button>
    </div>
  );
}
