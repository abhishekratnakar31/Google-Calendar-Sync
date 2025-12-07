import React from "react";
import { Video, Calendar, Clock, MapPin, MoreVertical, Trash2, Edit2 } from "lucide-react";

/**
 * ScheduleList Component
 * Displays a list of events grouped by date.
 * 
 * @param {Array} events - List of event objects (mixed events & appointments)
 * @param {Function} onDelete - Handler for deleting an event
 * @param {Function} onUpdate - Handler for updating an event
 */
const ScheduleList = ({ events, onDelete, onUpdate, selectedIds, onToggleSelect }) => {
    // 1. Group events by Date
    const groupedEvents = events.reduce((acc, event) => {
        const date = new Date(event.start?.dateTime || event.start?.date || new Date());
        const dateKey = date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
    }, {});

    // Sort dates (keys) to ensure chronological order
    const sortedDates = Object.keys(groupedEvents).sort((a, b) => {
        return new Date(a) - new Date(b);
    });

    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Calendar className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">No upcoming events</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {sortedDates.map((dateKey) => (
                <div key={dateKey} className="relative">
                    {/* Date Header */}
                    <h3 className="text-2xl font-serif text-gray-900 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
                        {dateKey}
                    </h3>

                    <div className="space-y-0">
                        {groupedEvents[dateKey].map((event, index) => (
                            <ScheduleItem
                                key={event.id}
                                event={event}
                                onDelete={onDelete}
                                onUpdate={onUpdate}
                                isLast={index === groupedEvents[dateKey].length - 1}
                                isSelected={selectedIds?.has(event.id)}
                                onToggleSelect={onToggleSelect}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const ScheduleItem = ({ event, onDelete, onUpdate, isLast, isSelected, onToggleSelect }) => {
    const isVideo = event.conferenceData?.entryPoints?.length > 0;
    const startTime = new Date(event.start?.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = new Date(event.end?.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const meetLink = event.conferenceData?.entryPoints?.find(
        (ep) => ep.entryPointType === "video"
    )?.uri;

    return (
        <div className={`group flex py-6 items-start gap-6 lg:gap-10 transition-colors hover:bg-gray-50/50 dark:hover:bg-white/5 px-4 -mx-4 rounded-xl ${!isLast ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>

            {/* Checkbox for Selection */}
            {onToggleSelect && (
                <div className="pt-1.5">
                    <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => onToggleSelect(event.id)}
                        className="w-5 h-5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue cursor-pointer"
                    />
                </div>
            )}

            {/* Time Column */}
            <div className="w-24 text-right flex-shrink-0 pt-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">{startTime}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{endTime}</p>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                                {event.summary}
                            </h4>
                            {isVideo && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-green/10 text-brand-green">
                                    <Video className="w-3 h-3 mr-1" />
                                    Meet
                                </span>
                            )}
                        </div>

                        {/* Description / Location */}
                        {event.location && (
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                {event.location}
                            </div>
                        )}

                        {event.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1 max-w-2xl">
                                {event.description}
                            </p>
                        )}
                    </div>

                    {/* Actions - Top Right */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {meetLink && (
                            <a
                                href={meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white transition-colors"
                            >
                                <Video className="w-3.5 h-3.5" />
                                Join
                            </a>
                        )}

                        <button
                            onClick={() => onUpdate(event.id, {})} // Trigger edit
                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors"
                            title="Edit"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                            onClick={() => onDelete(event.id)}
                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleList;
