import React, { useState } from "react";
import { Plus, Type, AlignLeft, Clock, Calendar as CalendarIcon, Video, X } from "lucide-react";
import CalendarDropdown from "./CalendarDropdown";

const API_URL = import.meta.env.VITE_API_URL;
// or process.env.REACT_APP_API_URL
const CreateEventForm = ({ email, onEventCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [itemType, setItemType] = useState("event");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [calendarId, setCalendarId] = useState("primary");
  const [addMeet, setAddMeet] = useState(false);
  const [attendees, setAttendees] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      alert("No user email found. Please sign in again.");
      setLoading(false);
      return;
    }

    const body = {
      email,
      type: itemType,
      title: summary,
      description,
      start_at: start,
      end_at: end,
      google_calendar_id: calendarId,
      attendees: attendees.split(",").map(a => a.trim()).filter(Boolean),
      add_meet: addMeet
    };

    if (itemType === "task") {
      body.due_at = dueDate;
    }

    try {
      const res = await fetch(`${API_URL}/auth/items/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.google_event || data.google_task) {
        onEventCreated();
        setIsOpen(false);
        // reset
        setSummary("");
        setDescription("");
        setStart("");
        setEnd("");
        setDueDate("");
        setAddMeet(false);
        setAttendees("");
      } else {
        console.log(data);
        alert(data.error || "Error creating item.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-white hover:text-green-600 transition-all h-[52px]"
      >
        <Plus className="w-5 h-5" />
        Create New
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-brand-blue/5 p-6 border-b border-brand-blue/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-blue rounded-lg shadow-sm shadow-brand-blue/20">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Create New Item</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-4">
            {/* Type Selector */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
              {["event", "task", "appointment"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setItemType(type)}
                  className={`py-2 text-sm font-medium rounded-lg capitalize transition-all ${itemType === type
                    ? "bg-white text-brand-blue shadow-sm ring-1 ring-black/5"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Calendar Selection - Hide for Tasks */}
            {itemType !== "task" && (
              <CalendarDropdown email={email} onSelect={setCalendarId} />
            )}

            {/* Title */}
            <div className="relative group">
              <Type className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
              <input
                type="text"
                placeholder="Title"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-brand-blue rounded-xl focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="relative group">
              <AlignLeft className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
              <textarea
                placeholder="Description (optional)"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-brand-blue rounded-xl focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none min-h-[100px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Attendees - Hide for Tasks */}
            {itemType !== "task" && (
              <div className="relative group">
                <div className="absolute left-3 top-3 w-5 h-5 flex items-center justify-center text-gray-400 group-focus-within:text-brand-blue transition-colors">@</div>
                <input
                  type="text"
                  placeholder="Attendees (comma separated emails)"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-brand-blue rounded-xl focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                />
              </div>
            )}

            {/* Date & Time Fields */}
            {(itemType === "event" || itemType === "appointment") && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">Start</label>
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-brand-blue rounded-xl focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none text-sm"
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">End</label>
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-brand-blue rounded-xl focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none text-sm"
                      value={end}
                      onChange={(e) => setEnd(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Meet Toggle */}
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
                  <div className={`w-10 h-6 rounded-full p-1 transition-colors ${addMeet ? 'bg-brand-green' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${addMeet ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  <input
                    type="checkbox"
                    checked={addMeet}
                    onChange={(e) => setAddMeet(e.target.checked)}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Video className={`w-4 h-4 ${addMeet ? 'text-brand-green' : 'text-gray-400'}`} />
                    Add Google Meet
                  </div>
                </label>
              </div>
            )}

            {itemType === "task" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 ml-1">Due Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-brand-blue rounded-xl focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full bg-brand-blue hover:bg-blue-600 text-white font-semibold py-3 rounded-xl 
            transition-all shadow-lg shadow-brand-blue/30 hover:shadow-brand-blue/40 active:scale-[0.98] 
            flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventForm;
