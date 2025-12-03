import React from "react";

const EventList = ({ events, onDelete, onUpdate }) => {
  if (!events || events.length === 0) return <p>No events found.</p>;

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="p-4 bg-white shadow rounded-md">
          <h2 className="text-lg font-bold">
            {event.summary || "Untitled Event"}
          </h2>

          <p className="text-sm text-gray-600">
            Start:{" "}
            {event.start?.dateTime
              ? new Date(event.start.dateTime).toLocaleString()
              : "N/A"}
          </p>

          <p className="text-sm text-gray-600">
            End:{" "}
            {event.end?.dateTime
              ? new Date(event.end.dateTime).toLocaleString()
              : "N/A"}
          </p>

          <div className="flex gap-3 mt-3">
            <button
              onClick={() => onDelete(event.id)}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
            <button
              onClick={() => {
                const newTitle = prompt("Enter new title:", event.summary);
                if (newTitle) onUpdate(event.id, { summary: newTitle });
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
