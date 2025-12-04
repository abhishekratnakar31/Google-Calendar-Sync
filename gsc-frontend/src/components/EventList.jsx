import React, { useRef, useState } from "react";
import { Calendar, Trash2, Edit2, Video, MoreVertical, ExternalLink, CheckSquare } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import EditEventModal from "./EditEventModal";

const EventList = ({ events, onDelete, onUpdate, type }) => {
  const container = useRef();
  const [editingEvent, setEditingEvent] = useState(null);

  useGSAP(() => {
    gsap.from(".event-card", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out",
      clearProps: "all"
    });
  }, { scope: container, dependencies: [events] });

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full text-gray-400">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
          {type === 'task' ? <CheckSquare className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
        </div>
        <p className="text-sm font-medium">No {type}s found</p>
      </div>
    );
  }

  const cardStyles = [
    { bg: "bg-brand-yellow", text: "text-gray-900", icon: "text-gray-900" },
    { bg: "bg-brand-blue", text: "text-white", icon: "text-white" },
    { bg: "bg-brand-red", text: "text-white", icon: "text-white" },
    { bg: "bg-brand-green", text: "text-white", icon: "text-white" },
  ];

  return (
    <>
      <div ref={container} className="flex flex-col gap-4">
        {events.map((event, index) => {
          const meetLink = event.conferenceData?.entryPoints?.find(
            (ep) => ep.entryPointType === "video"
          )?.uri;

          // Handle different date fields for Tasks vs Events
          let dateStr = "No Date";
          if (event.start?.dateTime) {
            dateStr = new Date(event.start.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          } else if (event.due) {
            dateStr = new Date(event.due).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          }

          const style = cardStyles[index % cardStyles.length];

          return (
            <div
              key={event.id}
              className={`event-card group relative ${style.bg} ${style.text} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[180px] border border-black/5 subpixel-antialiased overflow-hidden`}
            >
              {/* Top Section */}
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80 bg-black/10 px-2 py-1 rounded-md">
                  {dateStr}
                </span>
                {type !== 'task' && (
                  <button
                    onClick={() => setEditingEvent(event)}
                    className={`p-1.5 rounded-full hover:bg-white/20 transition-colors ${style.icon}`}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Middle Section - Content */}
              <div className="flex-1 flex flex-row items-center gap-3 py-3 min-w-0">
                {type === 'task' && (
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      onChange={() => onDelete(event.id)}
                      className="w-6 h-6 rounded-md border-2 border-white/50 bg-transparent checked:bg-white checked:border-white cursor-pointer transition-all"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center min-w-0 w-full">
                  <h3 className="text-lg font-bold leading-tight mb-1 line-clamp-2 group-hover:line-clamp-none transition-all break-words">
                    {event.title || event.summary || "Untitled"}
                  </h3>
                  {(event.description || event.notes) && (
                    <div className="text-xs opacity-80 line-clamp-2 group-hover:line-clamp-none transition-all break-words whitespace-pre-wrap">
                      {(event.description || event.notes).split(/(https?:\/\/[^\s]+)/g).map((part, i) => (
                        part.match(/https?:\/\/[^\s]+/) ? (
                          <a
                            key={i}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline font-bold hover:opacity-80 relative z-10 break-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {part}
                          </a>
                        ) : part
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Section - Divider & Actions */}
              {type !== 'task' && (
                <div className="pt-3 border-t border-white/20 flex justify-between items-center mt-auto">
                  <div className="flex items-center gap-2">
                    {meetLink ? (
                      <a
                        href={meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors ${style.icon}`}
                        title="Join Meet"
                      >
                        <Video className="w-4 h-4" />
                      </a>
                    ) : (
                      <div className="w-7 h-7" /> // spacer
                    )}
                  </div>

                  <button
                    onClick={() => onDelete(event.id)}
                    className={`p-1.5 rounded-lg hover:bg-white/20 transition-colors ${style.icon}`}
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <EditEventModal
        key={editingEvent?.id || 'modal'}
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        event={editingEvent}
        onSave={onUpdate}
      />
    </>
  );
};

export default EventList;
