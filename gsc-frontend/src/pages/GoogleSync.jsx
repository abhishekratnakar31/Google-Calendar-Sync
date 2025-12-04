import React from "react";
import CreateGoogleItem from "../components/CreateGoogleItem";

export default function GoogleSync() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black px-6 py-10 transition-colors duration-300">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Google Calendar Dashboard</h1>
            <CreateGoogleItem />
        </div>
    );
}
