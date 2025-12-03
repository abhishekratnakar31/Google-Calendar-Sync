import React from "react";
import { Calendar, ArrowRight, CheckCircle2 } from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PindSync</span>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
              Sync Your Life with <span className="text-indigo-600">PindSync</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Seamlessly manage your Google Calendar events. Create, update, and organize your schedule with a modern, intuitive interface.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="http://localhost:8000/auth/init"
              className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Get Started with Google
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            {[
              { title: "Easy Sync", desc: "One-click synchronization with your Google Calendar." },
              { title: "Smart Management", desc: "Effortlessly create and edit events." },
              { title: "Modern UI", desc: "Clean, responsive, and user-friendly design." }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} PindSync. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
