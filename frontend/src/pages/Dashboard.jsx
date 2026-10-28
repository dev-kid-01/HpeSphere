import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API_BASE } from '../context/AuthContext';
import {
  HiOutlineHeart,
  HiOutlineUserGroup,
  HiOutlineCurrencyRupee,
  HiOutlineCalendar,
  HiOutlinePlus,
  HiOutlineShieldCheck,
  HiOutlineInformationCircle,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineLocationMarker,
} from 'react-icons/hi';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'campaigns' | 'volunteers' | 'donations'

  // Data states
  const [myDonations, setMyDonations] = useState([]);
  const [allDonations, setAllDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [volunteerDrives, setVolunteerDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Campaign Form Modal (for NGO)
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    category: 'Community Support',
    targetAmount: '',
    location: '',
    urgency: 'Normal',
  });
  const [campSubmitting, setCampSubmitting] = useState(false);
  const [campMsg, setCampMsg] = useState({ error: '', success: '' });

  // New Volunteer Drive Modal (for NGO)
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [driveForm, setDriveForm] = useState({
    title: '',
    causeCategory: 'Community Service',
    location: '',
    date: '',
    timeCommitment: '4 Hours',
    description: '',
    skillsNeeded: '',
    openSlots: 15,
  });
  const [driveSubmitting, setDriveSubmitting] = useState(false);
  const [driveMsg, setDriveMsg] = useState({ error: '', success: '' });

  // Fetch relevant dashboard data
  const loadData = async () => {
    try {
      setLoading(true);

      if (user?.role === 'ngo') {
        const [campRes, volRes, donRes] = await Promise.all([
          fetch(`${API_BASE}/campaigns`),
          fetch(`${API_BASE}/volunteers`),
          fetch(`${API_BASE}/donations/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (campRes.ok) setCampaigns(await campRes.json());
        if (volRes.ok) setVolunteerDrives(await volRes.json());
        if (donRes.ok) setAllDonations(await donRes.json());
      } else {
        // Volunteer / Donor
        const [myDonRes, volRes] = await Promise.all([
          fetch(`${API_BASE}/donations/my`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/volunteers`),
        ]);

        if (myDonRes.ok) setMyDonations(await myDonRes.json());
        if (volRes.ok) setVolunteerDrives(await volRes.json());
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Handle NGO Campaign Creation
  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setCampMsg({ error: '', success: '' });
    setCampSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(campaignForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create campaign');

      setCampMsg({ error: '', success: 'Campaign published successfully!' });
      setTimeout(() => {
        setShowCampaignModal(false);
        setCampaignForm({
          title: '',
          description: '',
          category: 'Community Support',
          targetAmount: '',
          location: '',
          urgency: 'Normal',
        });
        loadData();
      }, 1000);
    } catch (err) {
      setCampMsg({ error: err.message, success: '' });
    } finally {
      setCampSubmitting(false);
    }
  };

  // Handle NGO Volunteer Opportunity Creation
  const handleCreateDrive = async (e) => {
    e.preventDefault();
    setDriveMsg({ error: '', success: '' });
    setDriveSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/volunteers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(driveForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post opportunity');

      setDriveMsg({ error: '', success: 'Volunteer drive posted successfully!' });
      setTimeout(() => {
        setShowDriveModal(false);
        setDriveForm({
          title: '',
          causeCategory: 'Community Service',
          location: '',
          date: '',
          timeCommitment: '4 Hours',
          description: '',
          skillsNeeded: '',
          openSlots: 15,
        });
        loadData();
      }, 1000);
    } catch (err) {
      setDriveMsg({ error: err.message, success: '' });
    } finally {
      setDriveSubmitting(false);
    }
  };

  const isNGO = user?.role === 'ngo';

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER GREETING BANNER */}
        <div className="bg-gradient-to-r from-[#0F2B48] via-[#16385D] to-[#0A3C36] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {isNGO ? 'NGO Organization Workspace' : 'Volunteer & Donor Hub'}
              </span>
              {isNGO && (
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    user?.organizationDetails?.isVerified
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                  }`}
                >
                  <HiOutlineShieldCheck className="w-4 h-4" />
                  {user?.organizationDetails?.isVerified
                    ? 'Verified Partner'
                    : 'Verification Pending Review'}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome, {isNGO ? user?.organizationDetails?.orgName || user?.name : user?.name}!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              {isNGO
                ? 'Manage your community campaigns, monitor volunteer applicants, and review social impact drives.'
                : 'Track your contributions, browse upcoming volunteer drives, and see your community impact in real time.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isNGO ? (
              <>
                <button
                  onClick={() => setShowCampaignModal(true)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-[#0F2B48] bg-white hover:bg-slate-100 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <HiOutlinePlus className="w-4 h-4 text-emerald-600" />
                  <span>Launch Campaign</span>
                </button>
                <button
                  onClick={() => setShowDriveModal(true)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <HiOutlinePlus className="w-4 h-4" />
                  <span>Post Volunteer Drive</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/donate"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <HiOutlineHeart className="w-4 h-4" />
                  <span>Make a Donation</span>
                </Link>
                <Link
                  to="/volunteer"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-100 bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center gap-1.5"
                >
                  <HiOutlineUserGroup className="w-4 h-4" />
                  <span>Browse Drives</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* VERIFICATION DISCLAIMER NOTICE (FOR UNVERIFIED NGOS) */}
        {isNGO && !user?.organizationDetails?.isVerified && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
            <HiOutlineInformationCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Trust & Transparency Protocol:</span> Your organization account has been created and is active. In accordance with HopeSphere security guidelines, verified badges are granted once physical or documentation checks are completed by regional coordinators. You can still initiate campaigns and post volunteer drives.
            </div>
          </div>
        )}

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {isNGO ? (
            <>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Active Campaigns
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#0F2B48] mt-2">
                  {campaigns.length}
                </div>
                <div className="text-xs text-slate-400 mt-1">Live causes in directory</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Volunteer Drives
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
                  {volunteerDrives.length}
                </div>
                <div className="text-xs text-slate-400 mt-1">Upcoming community sessions</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Volunteers Enrolled
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-2">
                  {volunteerDrives.reduce((acc, d) => acc + (d.volunteersRegistered?.length || 0), 0)}
                </div>
                <div className="text-xs text-slate-400 mt-1">Total registered participants</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Contributions
                </div>
                <div className="text-2xl sm:text-3xl font-black text-teal-600 mt-2">
                  ₹{allDonations.filter(d => d.donationType === 'money').reduce((sum, d) => sum + (d.amount || 0), 0).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-400 mt-1">Direct community funding</div>
              </div>
            </>
          ) : (
            <>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Donations Made
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#0F2B48] mt-2">
                  {myDonations.length}
                </div>
                <div className="text-xs text-slate-400 mt-1">Contributions recorded</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Donated
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
                  ₹{myDonations.filter(d => d.donationType === 'money').reduce((sum, d) => sum + (d.amount || 0), 0).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-400 mt-1">Monetary support</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Volunteer Drives
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-2">
                  {volunteerDrives.filter(d => d.volunteersRegistered?.some(v => v.email === user?.email)).length}
                </div>
                <div className="text-xs text-slate-400 mt-1">Events joined</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Impact Hours
                </div>
                <div className="text-2xl sm:text-3xl font-black text-teal-600 mt-2">
                  {volunteerDrives.filter(d => d.volunteersRegistered?.some(v => v.email === user?.email)).length * 4} hrs
                </div>
                <div className="text-xs text-slate-400 mt-1">Estimated service time</div>
              </div>
            </>
          )}
        </div>

        {/* TABS NAVIGATION */}
        <div className="border-b border-slate-200 flex gap-4 text-sm font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 transition-colors ${
              activeTab === 'overview'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {isNGO ? 'Organization Overview' : 'My Donations History'}
          </button>
          <button
            onClick={() => setActiveTab('volunteers')}
            className={`pb-3 transition-colors ${
              activeTab === 'volunteers'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {isNGO ? 'Volunteer Opportunities & Applicants' : 'Volunteer Drives'}
          </button>
          {isNGO && (
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`pb-3 transition-colors ${
                activeTab === 'campaigns'
                  ? 'text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Managed Campaigns
            </button>
          )}
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {!isNGO ? (
              // VOLUNTEER / DONOR DONATION HISTORY
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#0F2B48]">
                    My Recent Contributions
                  </h3>
                  <Link
                    to="/donate"
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    + New Donation
                  </Link>
                </div>

                {myDonations.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <HiOutlineHeart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold">No donations recorded yet</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Support a local food kit, sponsor children's education, or donate medical essentials to begin your impact log.
                    </p>
                    <Link
                      to="/donate"
                      className="mt-4 inline-block px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                    >
                      Donate Now
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 uppercase text-[11px] font-bold text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="px-5 py-3">Date</th>
                          <th className="px-5 py-3">Cause / Type</th>
                          <th className="px-5 py-3">Location</th>
                          <th className="px-5 py-3">Amount / Details</th>
                          <th className="px-5 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {myDonations.map((don) => (
                          <tr key={don._id} className="hover:bg-slate-50/70">
                            <td className="px-5 py-3.5 font-medium text-slate-900">
                              {new Date(don.date || don.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="font-bold text-[#0F2B48]">
                                {don.campaignTitle || don.donationType.toUpperCase()}
                              </span>
                              <div className="text-[10px] text-slate-400 capitalize">
                                Category: {don.donationType}
                              </div>
                            </td>
                            <td className="px-5 py-3.5">{don.location}</td>
                            <td className="px-5 py-3.5 font-bold text-slate-900">
                              {don.donationType === 'money' ? `₹${don.amount}` : 'In-Kind Contribution'}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                {don.status || 'Completed'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              // NGO OVERVIEW CONTENT
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* NGO Details Card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                    <h3 className="font-bold text-base text-[#0F2B48] flex items-center justify-between">
                      <span>Organization Profile</span>
                      <Link to="/profile" className="text-xs text-emerald-700 hover:underline">
                        Edit Profile
                      </Link>
                    </h3>
                    <div className="space-y-2 text-xs text-slate-600">
                      <div>
                        <span className="font-bold text-slate-800">Official Name: </span>
                        {user?.organizationDetails?.orgName || user?.name}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">Registration ID: </span>
                        {user?.organizationDetails?.registrationNumber || 'Not submitted'}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">Focus Areas: </span>
                        {user?.organizationDetails?.focusAreas?.join(', ') || 'Community Support'}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">Website: </span>
                        {user?.organizationDetails?.website || 'None'}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">Email: </span>
                        {user?.email}
                      </div>
                    </div>
                  </div>

                  {/* Quick NGO Actions */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-[#0F2B48] mb-2">
                        Community Operations
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Publish upcoming donation requirements, volunteer calls, or view incoming pledges from community donors.
                      </p>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setShowCampaignModal(true)}
                        className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#0F2B48] hover:bg-emerald-600 transition-colors text-center"
                      >
                        Create New Campaign
                      </button>
                      <button
                        onClick={() => setShowDriveModal(true)}
                        className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors text-center"
                      >
                        Post Volunteer Drive
                      </button>
                    </div>
                  </div>
                </div>

                {/* Received Donations Log */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-base text-[#0F2B48]">
                      Received Community Donations & Pledges
                    </h3>
                  </div>

                  {allDonations.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No donations recorded in database yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-50 uppercase text-[11px] font-bold text-slate-500 border-b border-slate-200">
                          <tr>
                            <th className="px-5 py-3">Date</th>
                            <th className="px-5 py-3">Donor Name</th>
                            <th className="px-5 py-3">Type</th>
                            <th className="px-5 py-3">Location</th>
                            <th className="px-5 py-3">Contribution</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {allDonations.slice(0, 10).map((don) => (
                            <tr key={don._id} className="hover:bg-slate-50/70">
                              <td className="px-5 py-3">
                                {new Date(don.date || don.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-5 py-3 font-semibold text-slate-900">
                                {don.name}
                              </td>
                              <td className="px-5 py-3 capitalize">{don.donationType}</td>
                              <td className="px-5 py-3">{don.location}</td>
                              <td className="px-5 py-3 font-bold text-emerald-700">
                                {don.donationType === 'money' ? `₹${don.amount}` : 'Item Pledge'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VOLUNTEER DRIVES */}
        {activeTab === 'volunteers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#0F2B48]">
                {isNGO ? 'Hosted Volunteer Drives & Registered Volunteers' : 'Available Volunteer Drives'}
              </h3>
              {isNGO && (
                <button
                  onClick={() => setShowDriveModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  + Post New Drive
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {volunteerDrives.map((drive) => (
                <div
                  key={drive._id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-700 mb-1.5">
                      <span>{drive.causeCategory}</span>
                      <span className="text-slate-500 font-normal">{drive.date}</span>
                    </div>

                    <h4 className="text-base font-bold text-[#0F2B48]">{drive.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{drive.location}</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {drive.description}
                    </p>

                    {isNGO && drive.volunteersRegistered?.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="text-xs font-bold text-slate-700 mb-1.5">
                          Registered Applicants ({drive.volunteersRegistered.length}):
                        </div>
                        <ul className="text-xs text-slate-600 space-y-1">
                          {drive.volunteersRegistered.map((v, i) => (
                            <li key={i} className="flex items-center justify-between bg-slate-50 px-2.5 py-1 rounded-sm">
                              <span className="font-medium text-slate-800">{v.name} ({v.email})</span>
                              <span className="text-[10px] text-emerald-700 font-bold">Confirmed</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Slots: <strong>{drive.openSlots || 15}</strong> open
                    </span>
                    {!isNGO && (
                      <Link
                        to="/volunteer"
                        className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
                      >
                        Participate
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CAMPAIGNS (NGO ONLY) */}
        {activeTab === 'campaigns' && isNGO && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#0F2B48]">Active Managed Campaigns</h3>
              <button
                onClick={() => setShowCampaignModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F2B48] hover:bg-emerald-600"
              >
                + Launch New Campaign
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {campaigns.map((camp) => (
                <div
                  key={camp._id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase">
                      {camp.category}
                    </span>
                    <h4 className="font-bold text-base text-[#0F2B48] mt-1 line-clamp-2">
                      {camp.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3">
                      {camp.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex justify-between font-bold mb-1">
                      <span>Raised: ₹{camp.raisedAmount?.toLocaleString('en-IN')}</span>
                      <span className="text-slate-500">
                        Goal: ₹{camp.targetAmount?.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(((camp.raisedAmount || 0) / (camp.targetAmount || 1)) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CREATE CAMPAIGN MODAL (FOR NGO) */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#0F2B48]">Launch Community Campaign</h3>
              <button
                onClick={() => setShowCampaignModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {campMsg.error && (
              <div className="mt-3 p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold">
                {campMsg.error}
              </div>
            )}
            {campMsg.success && (
              <div className="mt-3 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold">
                {campMsg.success}
              </div>
            )}

            <form onSubmit={handleCreateCampaign} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  value={campaignForm.title}
                  onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                  placeholder="e.g. Flood Relief Essentials & Dry Rations"
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={campaignForm.category}
                    onChange={(e) => setCampaignForm({ ...campaignForm, category: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300"
                  >
                    <option value="Hunger & Nutrition">Hunger & Nutrition</option>
                    <option value="Children & Education">Children & Education</option>
                    <option value="Healthcare Access">Healthcare Access</option>
                    <option value="Community Support">Community Support</option>
                    <option value="Disaster Relief">Disaster Relief</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={campaignForm.targetAmount}
                    onChange={(e) => setCampaignForm({ ...campaignForm, targetAmount: e.target.value })}
                    placeholder="e.g. 150000"
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location / Districts *
                </label>
                <input
                  type="text"
                  required
                  value={campaignForm.location}
                  onChange={(e) => setCampaignForm({ ...campaignForm, location: e.target.value })}
                  placeholder="e.g. Rajkot & Western Outskirts"
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description & Community Need *
                </label>
                <textarea
                  required
                  rows="3"
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                  placeholder="Explain what the funds will be used for..."
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={campSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  {campSubmitting ? 'Publishing...' : 'Publish Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST VOLUNTEER DRIVE MODAL (FOR NGO) */}
      {showDriveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#0F2B48]">Post New Volunteer Opportunity</h3>
              <button
                onClick={() => setShowDriveModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {driveMsg.error && (
              <div className="mt-3 p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold">
                {driveMsg.error}
              </div>
            )}
            {driveMsg.success && (
              <div className="mt-3 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold">
                {driveMsg.success}
              </div>
            )}

            <form onSubmit={handleCreateDrive} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Drive Title *
                </label>
                <input
                  type="text"
                  required
                  value={driveForm.title}
                  onChange={(e) => setDriveForm({ ...driveForm, title: e.target.value })}
                  placeholder="e.g. Weekend Books & Stationery Distribution"
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cause Category
                  </label>
                  <select
                    value={driveForm.causeCategory}
                    onChange={(e) => setDriveForm({ ...driveForm, causeCategory: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300"
                  >
                    <option value="Child Education">Child Education</option>
                    <option value="Food Security">Food Security</option>
                    <option value="Healthcare Outreach">Healthcare Outreach</option>
                    <option value="Environment">Environment & Greenery</option>
                    <option value="Community Service">Community Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Open Slots
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={driveForm.openSlots}
                    onChange={(e) => setDriveForm({ ...driveForm, openSlots: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date & Schedule *
                  </label>
                  <input
                    type="text"
                    required
                    value={driveForm.date}
                    onChange={(e) => setDriveForm({ ...driveForm, date: e.target.value })}
                    placeholder="e.g. Next Saturday, 10 AM - 2 PM"
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={driveForm.location}
                    onChange={(e) => setDriveForm({ ...driveForm, location: e.target.value })}
                    placeholder="e.g. Rajkot Municipal School #4"
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description of Activities *
                </label>
                <textarea
                  required
                  rows="3"
                  value={driveForm.description}
                  onChange={(e) => setDriveForm({ ...driveForm, description: e.target.value })}
                  placeholder="Detail the volunteer tasks..."
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDriveModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={driveSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  {driveSubmitting ? 'Posting...' : 'Post Volunteer Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
