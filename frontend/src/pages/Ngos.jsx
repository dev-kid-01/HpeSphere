import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../context/AuthContext';
import {
  HiOutlineSearch,
  HiOutlineLocationMarker,
  HiOutlineCheckCircle,
  HiOutlineGlobeAlt,
  HiOutlineExternalLink,
} from 'react-icons/hi';

export default function Ngos() {
  const [ngos, setNgos] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/ngos`)
      .then((res) => res.json())
      .then((data) => setNgos(data))
      .catch((err) => console.error('Error fetching NGOs:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Hunger Relief & Nutrition', 'Childhood Education & Literacy', 'Healthcare & Medical Outreach', 'Ecology & Urban Afforestation'];

  const filteredNgos = ngos.filter((ngo) => {
    const matchesCategory =
      filterCategory === 'All' ||
      ngo.category.toLowerCase().includes(filterCategory.toLowerCase());
    const matchesSearch =
      ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.mission.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600">
            Trusted Partners
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F2B48]">
            Explore Nonprofit Organizations
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Discover verified grassroots nonprofits driving measurable impact across education, nutritional security, healthcare, and ecology.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <HiOutlineSearch className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, location, or cause..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterCategory === cat
                    ? 'bg-[#0F2B48] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* NGO Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            Loading NGO directory...
          </div>
        ) : filteredNgos.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
            No nonprofit organizations found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNgos.map((ngo, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                      {ngo.category}
                    </span>

                    {ngo.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <HiOutlineCheckCircle className="w-4 h-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        Pending Verification
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-[#0F2B48]">{ngo.name}</h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-3">
                    <HiOutlineLocationMarker className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ngo.location}</span>
                    {ngo.established && (
                      <span className="text-slate-400">• Est. {ngo.established}</span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {ngo.mission}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  {ngo.website ? (
                    <a
                      href={ngo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-700"
                    >
                      <HiOutlineGlobeAlt className="w-4 h-4" />
                      <span>Website</span>
                      <HiOutlineExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">HopeSphere Partner</span>
                  )}

                  <Link
                    to={`/donate?ngo=${encodeURIComponent(ngo.name)}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F2B48] hover:bg-emerald-600 transition-colors shadow-xs"
                  >
                    Donate to NGO
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
