import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../context/AuthContext';
import { HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineUserGroup } from 'react-icons/hi';

export default function Event() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Community Food Drive & Ration Distribution',
      location: 'Central Community Center, Rajkot',
      image: '/asset/food.png',
      date: 'Upcoming Saturday',
      description: 'Assembling and distributing nutritional meal packs to 300+ daily-wage families.',
    },
    {
      id: 2,
      title: 'Children’s Digital Literacy & Reading Camp',
      location: 'Community Learning Hub, Jamnagar',
      image: '/asset/education.png',
      date: 'Bi-weekly Sundays',
      description: 'Mentoring underprivileged primary school students with books and interactive tablets.',
    },
    {
      id: 3,
      title: 'Rural Preventive Health & Diagnostic Clinic',
      location: 'District Health Center, Bhuj',
      image: '/asset/medical.png',
      date: 'Next Saturday',
      description: 'Free basic medical examinations, vitamin distribution, and vitals checkups by volunteer doctors.',
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600">
            Field Initiatives
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F2B48]">
            Upcoming HopeSphere Events & Drives
          </h1>
          <p className="text-sm text-slate-600">
            Participate in our upcoming community outreach events across western India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="h-48 w-full bg-slate-100 relative">
                <img
                  src={event.image}
                  alt={`${event.title}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/asset/img1.png';
                  }}
                />
                <div className="absolute bottom-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-800 shadow-xs">
                    {event.date}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#0F2B48] mb-2 leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {event.description}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <HiOutlineLocationMarker className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{event.location}</span>
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to="/volunteer"
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <HiOutlineUserGroup className="w-4 h-4" />
                    <span>Join as Volunteer</span>
                  </Link>

                  <Link
                    to="/donate"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0F2B48] hover:bg-emerald-600 transition-colors"
                  >
                    Donate
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}