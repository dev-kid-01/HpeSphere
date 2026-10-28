import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE } from '../context/AuthContext';
import {
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineUserGroup,
  HiOutlineCheck,
  HiOutlineSparkles,
} from 'react-icons/hi';

export default function Volunteer() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/volunteers`)
      .then((res) => res.json())
      .then((data) => setOpportunities(data))
      .catch((err) => console.error('Error fetching volunteer drives:', err))
      .finally(() => setLoading(false));
  }, []);

  const openModal = (drive) => {
    setSelectedDrive(drive);
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setError('');
    setSuccess('');
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError('Please provide your name and email');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_BASE}/volunteers/${selectedDrive._id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register for drive');

      setSuccess(data.message || 'You are registered! Our coordinator will contact you.');
      setTimeout(() => {
        setSelectedDrive(null);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600">
            Community Drives
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F2B48]">
            Volunteer With HopeSphere
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Give a few hours of your weekend to help assemble food kits, teach foundational skills, or plant trees with local grassroots organizations.
          </p>
        </div>

        {/* Opportunities List */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            Loading volunteer drives...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((opp) => (
              <div
                key={opp._id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 p-6 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                      {opp.causeCategory}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <HiOutlineClock className="w-3.5 h-3.5 text-slate-400" />
                      {opp.timeCommitment}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0F2B48]">{opp.title}</h3>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    Organized by <strong className="text-slate-800">{opp.organization}</strong>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-4">
                    <HiOutlineLocationMarker className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{opp.location}</span>
                    <span className="text-slate-400">• Schedule: {opp.date}</span>
                  </div>

                  {opp.skillsNeeded && opp.skillsNeeded.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {opp.skillsNeeded.map((skill, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    <strong className="text-emerald-700">{opp.openSlots || 10}</strong> open slots available
                  </div>

                  <button
                    onClick={() => openModal(opp)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs"
                  >
                    Join Volunteer Drive
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedDrive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#0F2B48]">
                Confirm Volunteer Sign-Up
              </h3>
              <button
                onClick={() => setSelectedDrive(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="font-bold text-slate-900">{selectedDrive.title}</div>
              <div className="text-slate-500 mt-0.5">
                {selectedDrive.organization} • {selectedDrive.location}
              </div>
            </div>

            {error && (
              <div className="mt-3 p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-3 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                <HiOutlineCheck className="w-4 h-4 text-emerald-600" />
                <span>{success}</span>
              </div>
            )}

            {!success && (
              <form onSubmit={handleApply} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="10-digit number"
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDrive(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                  >
                    {submitting ? 'Registering...' : 'Confirm Registration'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
