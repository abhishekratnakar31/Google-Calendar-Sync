import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RefreshCw, Calendar as CalendarIcon, LayoutDashboard, Settings, LogOut, User, Mail, CheckSquare, Clock, Video } from "lucide-react";
import EventList from "../components/EventList";
import CreateEventForm from "../components/CreateEventForm";
import ThemeToggle from "../components/ThemeToggle";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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

  const fetchData = React.useCallback(() => {
    if (email) {
      setLoading(true);

      // Fetch Events
      fetch(`http://localhost:8000/auth/events/?email=${email}`)
        .then((res) => res.json())
        .then((data) => setEvents(data.events || []))
        .catch((err) => console.error("Error fetching events:", err));

      // Fetch Tasks
      fetch(`http://localhost:8000/auth/tasks/?email=${email}`)
        .then((res) => res.json())
        .then((data) => setTasks(data.tasks || []))
        .catch((err) => console.error("Error fetching tasks:", err))
        .finally(() => setLoading(false));
    }
  }, [email]);

  const fetchProfile = React.useCallback(() => {
    if (email) {
      fetch(`http://localhost:8000/auth/profile/?email=${email}`)
        .then((res) => res.json())
        .then((data) => setProfile(data))
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [email]);

  useEffect(() => {
    if (emailParam) {
      localStorage.setItem("user_email", emailParam);
    }
  }, [emailParam]);

  useEffect(() => {
    fetchData();
    fetchProfile();
  }, [fetchData, fetchProfile]);

  const deleteEvent = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    await fetch("http://localhost:8000/auth/events/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, event_id: eventId }),
    });

    fetchData(); // refresh list
  };

  const deleteTask = async (taskId) => {
    // Optimistic update for better UX
    setTasks(prev => prev.filter(t => t.id !== taskId));

    await fetch("http://localhost:8000/auth/tasks/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, task_id: taskId }),
    });

    fetchData(); // refresh list to confirm
  };

  const updateEvent = async (eventId, updatedFields) => {
    await fetch("http://localhost:8000/auth/events/update", {
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

  // Categorize Events
  const appointments = events.filter(e =>
    e.attendees?.length > 0 ||
    e.conferenceData?.entryPoints?.length > 0
  );

  const soloEvents = events.filter(e =>
    !e.attendees?.length &&
    !e.conferenceData?.entryPoints?.length
  );

  return (
    <div ref={container} className="min-h-screen bg-gray-50 dark:bg-black flex overflow-hidden selection:bg-brand-blue/20 selection:text-brand-blue transition-colors duration-300">
      {/* Sidebar */}
      <aside className="sidebar w-64 bg-brand-blue/5 dark:bg-black border-r border-brand-blue/10 dark:border-gray-800 hidden md:flex flex-col z-10">
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-brand-blue rounded-lg shadow-md shadow-brand-blue/20">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">PindSync</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "dashboard"
              ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/30 font-medium"
              : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-brand-blue dark:hover:text-white hover:shadow-sm"
              }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "settings"
              ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/30 font-medium"
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
      <main className="main-content flex-1 overflow-y-auto h-screen bg-gray-50/50 dark:bg-black">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {activeTab === "dashboard" ? (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {profile?.name || "User"}. Here's your schedule.</p>
                </div>

                <div className="flex gap-3">
                  <CreateEventForm email={email} onEventCreated={fetchData} />
                  <button
                    onClick={fetchData}
                    disabled={loading}
                    className="stagger-item flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all shadow-sm h-[52px]"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* 3 Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">

                {/* Column 1: Tasks */}
                <div className="stagger-item flex flex-col bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-brand-blue/10 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-brand-yellow/5 dark:bg-brand-yellow/10">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 bg-brand-yellow/20 rounded-lg text-brand-yellow-dark">
                        <CheckSquare className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tasks</h2>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">To-do items from Google Tasks</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <EventList events={tasks} onDelete={deleteTask} type="task" />
                  </div>
                </div>

                {/* Column 2: Events */}
                <div className="stagger-item flex flex-col bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-brand-blue/10 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-brand-blue/5 dark:bg-brand-blue/10">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 bg-brand-blue/20 rounded-lg text-brand-blue">
                        <Clock className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Events</h2>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Standard calendar events</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <EventList events={soloEvents} onDelete={deleteEvent} onUpdate={updateEvent} type="event" />
                  </div>
                </div>

                {/* Column 3: Appointments */}
                <div className="stagger-item flex flex-col bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-brand-blue/10 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-brand-green/5 dark:bg-brand-green/10">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 bg-brand-green/20 rounded-lg text-brand-green">
                        <Video className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Appointments</h2>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Meetings with attendees or links</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <EventList events={appointments} onDelete={deleteEvent} onUpdate={updateEvent} type="appointment" />
                  </div>
                </div>

              </div>
            </>
          ) : (
            <div className="max-w-2xl mx-auto stagger-item">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-brand-blue/10 dark:border-gray-700 overflow-hidden">
                <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col items-center text-center bg-brand-blue/5 dark:bg-brand-blue/10">
                  <div className="w-24 h-24 rounded-full bg-brand-blue mb-4 p-1 border-2 border-brand-blue/20 shadow-md">
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

                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Profile Information</h3>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-brand-blue/20 transition-colors">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <User className="w-5 h-5 text-brand-blue" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Full Name</p>
                        <p className="text-gray-900 dark:text-white font-medium">{profile?.name || "Not set"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-brand-blue/20 transition-colors">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <Mail className="w-5 h-5 text-brand-blue" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Email Address</p>
                        <p className="text-gray-900 dark:text-white font-medium">{email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-red/10 text-brand-red font-medium rounded-xl hover:bg-brand-red hover:text-white transition-all shadow-sm hover:shadow-md"
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
      </main>
    </div>
  );
};

export default Events;
