import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RefreshCw, Calendar as CalendarIcon, LayoutDashboard, Settings, LogOut, User, Mail, CheckSquare, Clock, Video } from "lucide-react";
import EventList from "../components/EventList";
import ScheduleList from "../components/ScheduleList";
import CreateEventForm from "../components/CreateEventForm";
import ThemeToggle from "../components/ThemeToggle";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const API_URL = import.meta.env.VITE_API_URL;
const Events = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const emailParam = params.get("email");

  const email = emailParam || localStorage.getItem("user_email") || "";
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profile, setProfile] = useState(null);

  // Calendar Filtering State
  const [activeCalendar, setActiveCalendar] = useState("primary");
  const [calendars, setCalendars] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const container = useRef();

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".sidebar", {
      x: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    })
      .from(".main-content", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6")
      .from(".stagger-item", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.4");

  }, { scope: container, dependencies: [activeTab] });

  const fetchData = React.useCallback((silent = false) => {
    if (email) {
      if (!silent) setLoading(true);

      // Fetch Events with potentially selected calendar
      fetch(`${API_URL}/auth/events/?email=${email}&calendar_id=${activeCalendar}`)
        .then((res) => res.json())
        .then((data) => setEvents(data.events || []))
        .catch((err) => console.error("Error fetching events:", err));

      // Fetch Tasks (independent of calendar selection)
      fetch(`${API_URL}/auth/tasks/?email=${email}`)
        .then((res) => res.json())
        .then((data) => setTasks(data.tasks || []))
        .catch((err) => console.error("Error fetching tasks:", err))
        .finally(() => {
          if (!silent) setLoading(false);
        });
    }
  }, [email, activeCalendar]); // Depend on activeCalendar

  const fetchProfile = React.useCallback(() => {
    if (email) {
      fetch(`${API_URL}/auth/profile/?email=${email}`)
        .then((res) => res.json())
        .then((data) => setProfile(data))
        .catch((err) => console.error("Error fetching profile:", err));

      // Fetch Calendars list
      fetch(`${API_URL}/auth/calendars/?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          const calList = data.calendars || [];
          // Move primary to front if exists
          const primary = calList.find(c => c.primary);
          const others = calList.filter(c => !c.primary);
          setCalendars(primary ? [primary, ...others] : calList);
        })
        .catch((err) => console.error("Error fetching calendars:", err));
    }
  }, [email]);

  useEffect(() => {
    if (emailParam) {
      localStorage.setItem("user_email", emailParam);
    }
  }, [emailParam]);

  useEffect(() => {
    fetchData(); // Initial load (with loading spinner)
    fetchProfile();

    // Polling every 2 seconds (silent)
    const interval = setInterval(() => {
      fetchData(true);
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchData, fetchProfile]);

  // Prevent back button navigation
  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const deleteEvent = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    await fetch(`${API_URL}/auth/events/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, event_id: eventId }),
    });

    fetchData(); // refresh list
  };

  const deleteTask = async (taskId) => {
    // Optimistic update for better UX
    setTasks(prev => prev.filter(t => t.id !== taskId));

    await fetch(`${API_URL}/auth/tasks/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, task_id: taskId }),
    });

    fetchData(); // refresh list to confirm
  };

  const updateEvent = async (eventId, updatedFields) => {
    await fetch(`${API_URL}/auth/events/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        event_id: eventId,
        ...updatedFields,
      }),
    });

    fetchData(); // refresh list
  };

  const handleLogout = () => {
    localStorage.removeItem("user_email");
    navigate("/");
  };

  // Categorize & Merge Events for Schedule View
  // Categorize & Merge Events for Schedule View
  const allScheduleItems = [...events]
    .filter((event) => {
      if (filterType === "all") return true;
      // "Appointments" = Timed events (have start.dateTime)
      // "Events" = All-day events (have start.date only)
      const isTimed = !!event.start?.dateTime;
      if (filterType === "appointments") return isTimed;
      if (filterType === "events") return !isTimed;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.start?.dateTime || a.start?.date || 0);
      const dateB = new Date(b.start?.dateTime || b.start?.date || 0);
      return dateA - dateB;
    });

  // Selection State
  const [selectedEventIds, setSelectedEventIds] = useState(new Set());

  // Toggle selection for a single event
  const toggleEventSelection = (eventId) => {
    const newSelected = new Set(selectedEventIds);
    if (newSelected.has(eventId)) {
      newSelected.delete(eventId);
    } else {
      newSelected.add(eventId);
    }
    setSelectedEventIds(newSelected);
  };

  // Select/Deselect All
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(allScheduleItems.map(evt => evt.id));
      setSelectedEventIds(allIds);
    } else {
      setSelectedEventIds(new Set());
    }
  };

  // Bulk Delete
  const handleDeleteSelected = async () => {
    if (selectedEventIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedEventIds.size} selected events?`)) return;

    setLoading(true);
    try {
      // Execute deletions in parallel
      await Promise.all(
        Array.from(selectedEventIds).map(eventId =>
          fetch(`${API_URL}/auth/events/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, event_id: eventId }),
          })
        )
      );
      setSelectedEventIds(new Set());
      fetchData();
    } catch (error) {
      console.error("Error deleting events:", error);
      alert("Failed to delete some events.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div ref={container} className="min-h-screen bg-gray-50 dark:bg-black flex overflow-hidden selection:bg-brand-blue/20 selection:text-brand-blue transition-colors duration-300">
      {/* Sidebar */}
      <aside className="sidebar w-64 bg-white dark:bg-black dark:border-gray-800 hidden md:flex flex-col z-10">
        <div className="p-6 flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900 dark:text-white">PindSync</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "dashboard"
              ? "bg-green-600 text-white shadow-lg shadow-brand-blue/30 font-medium"
              : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-brand-blue dark:hover:text-white hover:shadow-sm"
              }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Events
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "settings"
              ? "bg-green-600 text-white shadow-lg shadow-brand-blue/30 font-medium"
              : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-brand-blue dark:hover:text-white hover:shadow-sm"
              }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        <div className="px-4 mt-auto">
          <div className="flex items-center gap-3 px-4 py-3">
            <ThemeToggle className=" justify-center" />
          </div>
        </div>

        <div className="p-4 border-t border-brand-blue/10 dark:border-gray-900">
          <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-black rounded-xl shadow-sm border border-brand-blue/5 dark:border-gray-600">
            {profile?.picture ? (
              <img src={profile.picture} alt="Profile" className="w-8 h-8 rounded-full ring-2 ring-brand-blue/20" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white font-medium text-sm">
                {email.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{profile?.name || email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content flex-1 overflow-y-auto h-screen bg-white dark:bg-black">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-12">

          {activeTab === "dashboard" ? (
            <>
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-gray-100 dark:border-gray-800 pb-8 relative">

                {/* Hamburger Menu (Mobile Only) */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden absolute -top-8 -left-2 w-12 h-12 flex flex-col items-center justify-center gap-1.5 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl transition-all z-10"
                >
                  <div className="w-6 h-0.5 bg-gray-900 dark:bg-white rounded-full"></div>
                  <div className="w-6 h-0.5 bg-gray-900 dark:bg-white rounded-full"></div>
                  <div className="w-6 h-0.5 bg-gray-900 dark:bg-white rounded-full"></div>
                </button>

                <div>
                  <h1 className="text-4xl font-serif text-gray-900 dark:text-white mb-2">Activities Scheduled</h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>


                  {/* Filters & Actions Toolbar */}
                  <div className="flex flex-wrap items-center gap-4 mt-6">
                    {/* Calendar Filter Dropdown */}
                    <div className="relative group min-w-[200px]">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors pointer-events-none">
                        <CalendarIcon className="w-5 h-5" />
                      </div>
                      <select
                        value={activeCalendar}
                        onChange={(e) => setActiveCalendar(e.target.value)}
                        className="w-full appearance-none pl-11 pr-10 py-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all shadow-sm hover:border-gray-300 dark:hover:border-gray-700"
                      >
                        {calendars.map((cal) => (
                          <option key={cal.id} value={cal.id}>
                            {cal.primary ? "Primary Calendar" : cal.summary}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>

                    {/* Event Type Filter Dropdown */}
                    <div className="relative group min-w-[180px]">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors pointer-events-none">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                      </div>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full appearance-none pl-11 pr-10 py-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all shadow-sm hover:border-gray-300 dark:hover:border-gray-700"
                      >
                        <option value="all">All Items</option>
                        <option value="appointments">Appointments</option>
                        <option value="events">Events</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>

                    <CreateEventForm email={email} onEventCreated={fetchData} />

                    {/* Bulk Actions */}
                    {allScheduleItems.length > 0 && (
                      <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                        {/* Select All Checkbox */}
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded-md border-gray-300 text-brand-blue focus:ring-brand-blue"
                            checked={allScheduleItems.length > 0 && selectedEventIds.size === allScheduleItems.length}
                            onChange={handleSelectAll}
                          />
                          Select All
                        </label>

                        {/* Delete Selected Button */}
                        {selectedEventIds.size > 0 && (
                          <button
                            onClick={handleDeleteSelected}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-all animate-in fade-in slide-in-from-right-4"
                          >
                            <LogOut className="w-4 h-4 rotate-0" /> {/* Reusing LogOut icon as generic trash/action due to limited imports, or import Trash */}
                            Delete ({selectedEventIds.size})
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>


              </div>

              {/* New Layout: Main Content (Events) + Side (Tasks) */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">

                {/* Main Column: Schedule (Events + Appointments) */}
                <div className="xl:col-span-8 stagger-item">
                  <ScheduleList
                    events={allScheduleItems}
                    onDelete={deleteEvent}
                    onUpdate={updateEvent}
                    selectedIds={selectedEventIds}
                    onToggleSelect={toggleEventSelection}
                  />
                </div>

                {/* Side Column: Tasks */}
                <div className="xl:col-span-4 stagger-item space-y-8">
                  {/* Tasks Section */}
                  <div className="bg-black/10 dark:bg-gray-900 rounded-3xl p-8 sticky top-8">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-brand-yellow/20 rounded-lg text-brand-yellow-dark">
                          <CheckSquare className="w-5 h-5" />
                        </div>
                        Tasks
                      </h2>
                      <span className="text-sm font-medium text-gray-500 bg-white dark:bg-black px-3 py-1 rounded-full shadow-sm">
                        {tasks.length}
                      </span>
                    </div>

                    <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
                      <EventList events={tasks} onDelete={deleteTask} type="task" />
                    </div>
                  </div>
                </div>

              </div>
            </>
          ) : (
            <div className="max-w-2xl mx-auto stagger-item pt-10">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

              <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
                <div className="p-8 border-b border-gray-100/50 dark:border-gray-700/50 flex flex-col items-center text-center bg-gradient-to-b from-white/50 to-transparent dark:from-white/5 dark:to-transparent">
                  <div className="w-24 h-24 rounded-full bg-brand-blue mb-4 p-1 ring-4 ring-white/50 dark:ring-white/10 shadow-lg">
                    {profile?.picture ? (
                      <img src={profile.picture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-brand-blue flex items-center justify-center text-white text-3xl font-bold">
                        {email.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile?.name || "User"}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{email}</p>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Profile Information</h3>

                    <div className="flex items-center gap-4 p-4 bg-gray-50/50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-brand-blue/30 dark:hover:border-brand-blue/30 transition-all group">
                      <div className="p-3 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <User className="w-5 h-5 text-brand-blue" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">Full Name</p>
                        <p className="text-gray-900 dark:text-white font-semibold text-lg">{profile?.name || "Not set"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50/50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-brand-blue/30 dark:hover:border-brand-blue/30 transition-all group">
                      <div className="p-3 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Mail className="w-5 h-5 text-brand-blue" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">Email Address</p>
                        <p className="text-gray-900 dark:text-white font-semibold text-lg">{email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100/50 dark:border-white/5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-brand-red/10 hover:bg-brand-red text-brand-red hover:text-white font-semibold rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-brand-red/20 transform hover:-translate-y-0.5"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main >
    </div >
  );
};

export default Events;
