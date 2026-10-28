import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../context/AuthContext';
import {
  HiOutlineHeart,
  HiOutlineUserGroup,
  HiOutlineGlobeAlt,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiArrowRight,
  HiOutlineShieldCheck,
  HiOutlineHand,
  HiOutlineLightningBolt,
} from 'react-icons/hi';

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick Volunteer Modal State
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [volunteerForm, setVolunteerForm] = useState({ name: '', email: '', phone: '' });
  const [volSubmitting, setVolSubmitting] = useState(false);
  const [volSuccess, setVolSuccess] = useState('');
  const [volError, setVolError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campRes, volRes, ngoRes, statRes] = await Promise.all([
          fetch(`${API_BASE}/campaigns`),
          fetch(`${API_BASE}/volunteers`),
          fetch(`${API_BASE}/ngos`),
          fetch(`${API_BASE}/donations/stats`),
        ]);

        if (campRes.ok) setCampaigns(await campRes.json());
        if (volRes.ok) setVolunteers(await volRes.json());
        if (ngoRes.ok) setNgos(await ngoRes.json());
        if (statRes.ok) setStats(await statRes.json());
      } catch (err) {
        console.error('Error loading landing page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVolunteerApply = async (e) => {
    e.preventDefault();
    if (!volunteerForm.name.trim() || !volunteerForm.email.trim()) {
      setVolError('Name and email are required');
      return;
    }

    setVolSubmitting(true);
    setVolError('');
    setVolSuccess('');

    try {
      const res = await fetch(`${API_BASE}/volunteers/${selectedOpportunity._id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(volunteerForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit registration');

      setVolSuccess(data.message || 'Successfully registered for this volunteer drive!');
      setTimeout(() => {
        setSelectedOpportunity(null);
        setVolSuccess('');
        setVolunteerForm({ name: '', email: '', phone: '' });
      }, 2000);
    } catch (err) {
      setVolError(err.message);
    } finally {
      setVolSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#071626] via-[#0F2B48] to-[#0A3C36] text-white">
        {/* Subtle decorative background blur orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide">
                <HiOutlineSparkles className="w-4 h-4 text-emerald-400" />
                <span>Empowering Grassroots Nonprofits & Donors</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none">
                Together, We Can Make a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
                  Lasting Difference.
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl leading-relaxed">
                Discover trusted causes, connect with nonprofit organizations, volunteer your time, and help create meaningful change in communities that need it most.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#campaigns"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-950/40 transform hover:-translate-y-0.5"
                >
                  <HiOutlineHeart className="w-5 h-5" />
                  <span>Explore Causes</span>
                </a>

                <a
                  href="#volunteer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base text-slate-100 bg-white/10 hover:bg-white/15 border border-white/20 transition-all"
                >
                  <HiOutlineUserGroup className="w-5 h-5 text-emerald-300" />
                  <span>Become a Volunteer</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                  <div className="text-xs text-slate-400 font-medium">Verified NGO Partners</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">Direct</div>
                  <div className="text-xs text-slate-400 font-medium">Transparent Impact</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-teal-300">Community</div>
                  <div className="text-xs text-slate-400 font-medium">Grassroots Focus</div>
                </div>
              </div>
            </div>

            {/* Right Visual Image Grid */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-4/3 sm:aspect-square">
                  <img
                    src="/asset/img1.png"
                    alt="Community volunteers distributing food and essential aid"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 shadow-lg">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                      <HiOutlineShieldCheck className="w-4 h-4" />
                      <span>HopeSphere Verified Initiative</span>
                    </div>
                    <div className="font-extrabold text-sm sm:text-base text-slate-900 mt-1">
                      Direct Support for Marginalized Families
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. IMPACT STATISTICS SECTION */}
      <section className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xs uppercase font-extrabold tracking-widest text-emerald-700">
                Community Impact
              </h2>
              <p className="text-2xl font-extrabold text-[#0F2B48] mt-1">
                Numbers That Tell a Real Story
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Sample / Demo Metrics (Pilot Field Data)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0F2B48]">
                {stats?.totalFundsRaised || '₹18,45,000+'}
              </div>
              <div className="text-sm font-semibold text-slate-600 mt-1">
                Funds Mobilized
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Directed toward food, learning kits, and urgent medical camps.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">
                {stats?.mealsProvided || '48,500+'}
              </div>
              <div className="text-sm font-semibold text-slate-600 mt-1">
                Nutritious Meals Served
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Distributed across slum settlements and rural schools.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600">
                {stats?.childrenSupported || '1,200+'}
              </div>
              <div className="text-sm font-semibold text-slate-600 mt-1">
                Children Sponsored
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Equipped with books, stationery, and tutoring assistance.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-600">
                {stats?.activeVolunteers || '850+'}
              </div>
              <div className="text-sm font-semibold text-slate-600 mt-1">
                Active Volunteers
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Contributing hands-on weekend hours in local towns.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ACTIVE CAMPAIGNS SECTION */}
      <section id="campaigns" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600">
                Urgent Appeals
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2B48] mt-1">
                Active Community Campaigns
              </h2>
              <p className="text-slate-600 max-w-xl text-sm sm:text-base mt-2">
                Every rupee is tracked with transparency. Choose a cause close to your heart and make an immediate impact today.
              </p>
            </div>
            <Link
              to="/campaigns"
              className="inline-flex items-center gap-1.5 font-bold text-sm text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span>View All Campaigns</span>
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaigns.slice(0, 4).map((camp) => {
              const progress = Math.min(
                100,
                Math.round(((camp.raisedAmount || 0) / (camp.targetAmount || 1)) * 100)
              );

              return (
                <div
                  key={camp._id || camp.title}
                  className="bg-white rounded-2xl shadow-xs hover:shadow-md border border-slate-200/80 overflow-hidden flex flex-col transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={camp.image || '/asset/img1.png'}
                      alt={camp.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/asset/img1.png';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-white/90 backdrop-blur-xs text-slate-800 shadow-xs">
                        {camp.category}
                      </span>
                    </div>
                    {camp.urgency === 'Urgent' && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-rose-600 text-white shadow-xs animate-pulse">
                          Urgent
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                        <HiOutlineLocationMarker className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{camp.location}</span>
                      </div>
                      <h3 className="font-bold text-base text-[#0F2B48] line-clamp-2 leading-snug">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {camp.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100">
                      {/* Progress Bar */}
                      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                        <span className="text-emerald-700">{progress}% Funded</span>
                        <span className="text-slate-500">
                          Goal: ₹{camp.targetAmount?.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-xs text-slate-400">Raised</div>
                          <div className="text-sm font-extrabold text-[#0F2B48]">
                            ₹{camp.raisedAmount?.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <Link
                          to={`/donate?campaign=${encodeURIComponent(camp.title)}`}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F2B48] hover:bg-emerald-600 transition-colors shadow-xs"
                        >
                          Donate Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600">
              Simple & Transparent
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2B48] mt-1">
              How HopeSphere Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              We eliminate friction between good intentions and tangible social outcomes with a four-step framework.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0F2B48] font-black text-xl flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-[#0F2B48] mb-2">Explore Causes</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Browse verified campaigns across child literacy, nourishment kits, mobile medical camps, and disaster response.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xl flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-[#0F2B48] mb-2">Volunteer Time</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enroll in local weekend drives, mentor children, package food kits, or lend specialized skills with zero bureaucracy.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 font-black text-xl flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-[#0F2B48] mb-2">Contribute Safely</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Donate money, clothing, books, or nutritional meals with complete assurance of transparency and accountability.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 font-black text-xl flex items-center justify-center mb-4">
                4
              </div>
              <h3 className="text-lg font-bold text-[#0F2B48] mb-2">Track Impact</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Access your personalized dashboard to inspect donation logs, volunteer certificates, and field reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED NONPROFITS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600">
                Grassroots Alliances
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2B48] mt-1">
                Featured Nonprofit Organizations
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Discover reputable regional initiatives working with tireless commitment on the ground.
              </p>
            </div>
            <Link
              to="/ngos"
              className="inline-flex items-center gap-1.5 font-bold text-sm text-emerald-700 hover:text-emerald-800"
            >
              <span>Explore All Organizations</span>
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ngos.slice(0, 3).map((ngo, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {ngo.category}
                    </span>
                    {ngo.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <HiOutlineCheckCircle className="w-4 h-4" />
                        Verified NGO
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        Verification Pending
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-[#0F2B48]">{ngo.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 mb-3">
                    <HiOutlineLocationMarker className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ngo.location}</span>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {ngo.mission}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500 font-medium">
                    <span className="font-bold text-slate-800">{ngo.volunteersCount || '50+'}</span> Active Volunteers
                  </div>

                  <Link
                    to="/donate"
                    className="text-xs font-bold text-[#0F2B48] hover:text-emerald-600 transition-colors"
                  >
                    Support Drive →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. VOLUNTEER OPPORTUNITIES */}
      <section id="volunteer" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600">
                Give Your Time
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2B48] mt-1">
                Upcoming Volunteer Drives
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Join our weekend community efforts. No prior experience needed — just empathy and energy.
              </p>
            </div>
            <Link
              to="/volunteer"
              className="inline-flex items-center gap-1.5 font-bold text-sm text-emerald-700 hover:text-emerald-800"
            >
              <span>Browse All Drives</span>
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {volunteers.slice(0, 4).map((opp) => (
              <div
                key={opp._id || opp.title}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
                      {opp.causeCategory}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <HiOutlineClock className="w-3.5 h-3.5 text-slate-400" />
                      {opp.timeCommitment}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0F2B48]">{opp.title}</h3>
                  <div className="text-xs font-semibold text-slate-600 mt-0.5">
                    Hosted by {opp.organization}
                  </div>

                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-4">
                    <HiOutlineLocationMarker className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{opp.location}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between gap-4">
                  <div className="text-xs text-slate-600">
                    <span className="font-bold text-emerald-700">{opp.openSlots || 10}</span> slots remaining
                  </div>

                  <button
                    onClick={() => {
                      setSelectedOpportunity(opp);
                      setVolError('');
                      setVolSuccess('');
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs"
                  >
                    Join Drive
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. INFORMATIONAL COMMUNITY IMPACT / TRANSPARENCY SECTION */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-[#0F2B48] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-widest">
                Our Non-Negotiable Standard
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Authentic Grassroots Action, Driven by Transparency.
              </h2>

              <p className="text-slate-300 text-base leading-relaxed">
                We believe social work should never hide behind opaque promises or fabricated badges. Every program listed on HopeSphere is verified through local field coordinators before receiving verified status.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HiOutlineShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">
                      Zero Tolerance for Misrepresentation
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                      NGO representative accounts undergo manual verification. We never invent certifications or fake audit badges.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HiOutlineGlobeAlt className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">
                      Direct Community Delivery
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                      Donations of food, school supplies, and medical relief are delivered directly to families on the ground.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10 aspect-square">
                <img
                  src="/asset/food.png"
                  alt="Nourishing meal distribution"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10 aspect-square mt-6">
                <img
                  src="/asset/education.png"
                  alt="Childhood education workshop"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10 aspect-square -mt-6">
                <img
                  src="/asset/medical.png"
                  alt="Rural healthcare camp"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10 aspect-square">
                <img
                  src="/asset/img2.png"
                  alt="Community volunteers together"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION */}
      <section className="py-20 bg-emerald-700 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Ready to Create Meaningful Impact?
          </h2>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto mt-4 leading-relaxed">
            Whether you can give an hour of your weekend, sponsor a student’s schooling, or register your NGO to find dedicated volunteers — HopeSphere makes it simple.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base text-emerald-950 bg-white hover:bg-slate-100 transition-all shadow-lg"
            >
              Get Started with HopeSphere
            </Link>

            <Link
              to="/donate"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base text-white bg-emerald-900/60 hover:bg-emerald-900/80 border border-emerald-400/40 transition-all"
            >
              Make a Direct Donation
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK VOLUNTEER MODAL */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#0F2B48]">
                Join Volunteer Drive
              </h3>
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="font-bold text-sm text-[#0F2B48]">
                {selectedOpportunity.title}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {selectedOpportunity.location} • {selectedOpportunity.timeCommitment}
              </div>
            </div>

            {volError && (
              <div className="mt-3 p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold">
                {volError}
              </div>
            )}
            {volSuccess && (
              <div className="mt-3 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold">
                {volSuccess}
              </div>
            )}

            {!volSuccess && (
              <form onSubmit={handleVolunteerApply} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={volunteerForm.name}
                    onChange={(e) =>
                      setVolunteerForm({ ...volunteerForm, name: e.target.value })
                    }
                    placeholder="Enter your name"
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={volunteerForm.email}
                    onChange={(e) =>
                      setVolunteerForm({ ...volunteerForm, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={volunteerForm.phone}
                    onChange={(e) =>
                      setVolunteerForm({ ...volunteerForm, phone: e.target.value })
                    }
                    placeholder="10-digit phone"
                    className="w-full p-2.5 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOpportunity(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={volSubmitting}
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                  >
                    {volSubmitting ? 'Registering...' : 'Confirm Participation'}
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
