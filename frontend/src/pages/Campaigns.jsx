import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../context/AuthContext';
import {
  HiOutlineLocationMarker,
  HiOutlineSearch,
  HiOutlineHeart,
  HiOutlineFilter,
} from 'react-icons/hi';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/campaigns`)
      .then((res) => res.json())
      .then((data) => setCampaigns(data))
      .catch((err) => console.error('Error fetching campaigns:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    'All',
    'Community Support',
    'Hunger & Nutrition',
    'Children & Education',
    'Healthcare Access',
  ];

  const filtered = campaigns.filter((camp) => {
    const matchCat = category === 'All' || camp.category === category;
    const matchSearch =
      camp.title.toLowerCase().includes(search.toLowerCase()) ||
      camp.description.toLowerCase().includes(search.toLowerCase()) ||
      camp.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600">
            Transparent Giving
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F2B48]">
            Active Community Campaigns
          </h1>
          <p className="text-sm text-slate-600">
            100% of your contributions go directly toward food packages, student kits, and medical relief.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <HiOutlineSearch className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaigns..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  category === c
                    ? 'bg-[#0F2B48] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            Loading campaigns...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-12 text-center text-slate-500 rounded-2xl border border-slate-200">
            No campaigns found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((camp) => {
              const progress = Math.min(
                100,
                Math.round(((camp.raisedAmount || 0) / (camp.targetAmount || 1)) * 100)
              );

              return (
                <div
                  key={camp._id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-48 bg-slate-100">
                    <img
                      src={camp.image || '/asset/img1.png'}
                      alt={camp.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/asset/img1.png';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-white/90 text-slate-800 shadow-xs">
                        {camp.category}
                      </span>
                    </div>
                    {camp.urgency === 'Urgent' && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-rose-600 text-white shadow-xs">
                          Urgent Need
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                        <HiOutlineLocationMarker className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{camp.location}</span>
                        <span className="text-slate-400">• By {camp.ngoName}</span>
                      </div>
                      <h3 className="font-bold text-lg text-[#0F2B48] leading-snug">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {camp.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-emerald-700">{progress}% Funded</span>
                        <span className="text-slate-500">
                          Goal: ₹{camp.targetAmount?.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[11px] text-slate-400">Total Raised</div>
                          <div className="text-sm font-extrabold text-[#0F2B48]">
                            ₹{camp.raisedAmount?.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <Link
                          to={`/donate?campaign=${encodeURIComponent(camp.title)}`}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1.5"
                        >
                          <HiOutlineHeart className="w-4 h-4" />
                          <span>Donate Now</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
