import React, { useState } from "react";
import { X, Save, User, AlignLeft, Type } from "lucide-react";

const EditEventModal = ({ isOpen, onClose, event, onSave }) => {
    const [title, setTitle] = useState(event?.summary || "");
    const [description, setDescription] = useState(event?.description || "");
    const [attendees, setAttendees] = useState(event?.attendees?.map(a => a.email).join(", ") || "");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Prepare updated fields
        const updates = {
            summary: title,
            description: description,
            attendees: attendees.split(",").map(a => a.trim()).filter(Boolean)
        };

        await onSave(event.id, updates);
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Edit Event</h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 ml-1">Title</label>
                        <div className="relative group">
                            <Type className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-brand-blue rounded-xl focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none"
                                placeholder="Event Title"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 ml-1">Description</label>
                        <div className="relative group">
                            <AlignLeft className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-brand-blue rounded-xl focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none min-h-[100px] resize-none"
                                placeholder="Description"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 ml-1">Attendees</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                            <input
                                type="text"
                                value={attendees}
                                onChange={(e) => setAttendees(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-brand-blue rounded-xl focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none"
                                placeholder="email@example.com, another@example.com"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 text-gray-700 font-medium bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 text-white font-medium bg-brand-blue hover:bg-blue-600 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEventModal;
