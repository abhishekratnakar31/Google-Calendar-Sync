import React from "react";
import { Calendar, Clock, Trash2, Edit2 } from "lucide-react";

const EventList = ({ events, onDelete, onUpdate }) => {
  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <Calendar className="w-12 h-12 mb-2 opacity-50" />
        <p>No events found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <div
          key={event.id}
          className="group relative p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
              {event.summary || "Untitled Event"}
            </h2>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  const newTitle = prompt("Enter new title:", event.summary);
                  if (newTitle) onUpdate(event.id, { summary: newTitle });
                }}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>
                {event.start?.dateTime
                  ? new Date(event.start.dateTime).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>
                {event.start?.dateTime
                  ? new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : "N/A"}
                {" - "}
                {event.end?.dateTime
                  ? new Date(event.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
