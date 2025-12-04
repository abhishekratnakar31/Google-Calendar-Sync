import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronDown, Calendar } from 'lucide-react';

export default function CalendarDropdown({ email, onSelect }) {
  const [calendars, setCalendars] = useState([]);

  useEffect(() => {
    if (!email) return;
    axios.get('http://localhost:8000/auth/calendars/', {
      params: { email },
      withCredentials: true
    })
      .then(res => setCalendars(res.data.calendars || []))
      .catch(err => console.log(err));
  }, [email]);

  return (
    <div className="relative group">
      <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
      <select
        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-brand-blue rounded-xl focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none appearance-none cursor-pointer text-gray-700"
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Choose a calendar</option>
        {calendars.map(cal => (
          <option key={cal.id} value={cal.id}>
            {cal.summary}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  );
}
