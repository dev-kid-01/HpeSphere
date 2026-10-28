import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth, API_BASE } from '../context/AuthContext';
import {
  HiOutlineHeart,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineCurrencyRupee,
  HiOutlineSparkles,
} from 'react-icons/hi';

export default function Donate() {
  const { user, token } = useAuth();
  const searchParams = new URLSearchParams(useLocation().search);
  const campaignParam = searchParams.get('campaign') || searchParams.get('ngo') || '';

  const [donationType, setDonationType] = useState('money');
  const [amount, setAmount] = useState('500');
  const [customAmount, setCustomAmount] = useState('');
  const [campaignTitle, setCampaignTitle] = useState(campaignParam);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState(user?.location || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (campaignParam) {
      setCampaignTitle(campaignParam);
    }
  }, [campaignParam]);

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!phone && user.phone) setPhone(user.phone);
      if (!location && user.location) setLocation(user.location);
    }
  }, [user]);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!phone.trim() || !/^\d{10}$/.test(phone.trim())) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (!date) {
      setError('Please select a donation date');
      return;
    }
    if (!location.trim()) {
      setError('Please provide your city or location');
      return;
    }
    if (!donationType) {
      setError('Please select a donation type');
      return;
    }

    const finalAmount = customAmount ? Number(customAmount) : Number(amount);
    if (donationType === 'money' && (!finalAmount || finalAmount <= 0)) {
      setError('Please select or specify a valid donation amount');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          date,
          location: location.trim(),
          donationType,
          amount: donationType === 'money' ? finalAmount : undefined,
          campaignTitle: campaignTitle.trim() || undefined,
          donorEmail: user?.email || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit donation');
      }

      setSuccess('Thank you for your generosity! Your donation has been recorded.');
      setShowPopup(true);
      // Reset form fields
      if (!user) {
        setName('');
        setPhone('');
        setLocation('');
      }
      setCustomAmount('');
    } catch (err) {
      setError(err.message || 'Server error, please try again later');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <HiOutlineSparkles className="w-4 h-4 text-emerald-600" />
            <span>HopeSphere Transparency Guarantee</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F2B48]">
            Support A Meaningful Cause
          </h1>
          <p className="text-sm text-slate-600">
            Every contribution directly funds meals, student learning essentials, and rural health clinics. 100% transparent.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Summary Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0F2B48] to-[#0A3C36] text-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase text-emerald-300 tracking-wider">
                Direct Impact
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                Where Your Contribution Goes
              </h3>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div>
                  <strong className="text-white">₹250</strong> sponsors complete high-protein meals for 5 undernourished students.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div>
                  <strong className="text-white">₹500</strong> supplies a student with notebooks, geometry sets, and storybooks for a full term.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div>
                  <strong className="text-white">₹1,000+</strong> supports mobile health checkups and basic diagnostics for remote families.
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-xs text-emerald-200">
              <HiOutlineShieldCheck className="w-6 h-6 flex-shrink-0" />
              <span>Full receipt logged to your HopeSphere account and accessible anytime.</span>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-md">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {error}
              </div>
            )}
            {success && !showPopup && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Target Campaign / Initiative */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Selected Cause / Campaign
                </label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="e.g. General Community Relief or Specific Campaign"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50/50"
                />
              </div>

              {/* Donation Type Pills */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Contribution Type *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'money', label: 'Funds' },
                    { id: 'food', label: 'Food' },
                    { id: 'clothing', label: 'Clothing' },
                    { id: 'education', label: 'Books' },
                    { id: 'medical', label: 'Medical' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setDonationType(t.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                        donationType === t.id
                          ? 'bg-[#0F2B48] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Selection (if Money) */}
              {donationType === 'money' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Contribution Amount (₹) *
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {['250', '500', '1000', '2500'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setAmount(val);
                          setCustomAmount('');
                        }}
                        className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                          amount === val && !customAmount
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        ₹{val}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    min="10"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount('');
                    }}
                    placeholder="Or enter custom amount in ₹"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              )}

              {/* Donor Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone Number (10 digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="\d{10}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Date & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    City / Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Rajkot, Gujarat"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Recording Contribution...</span>
                ) : (
                  <>
                    <HiOutlineHeart className="w-5 h-5" />
                    <span>Confirm & Submit Donation</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <HiOutlineCheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-[#0F2B48]">
              Thank You For Your Support!
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Your contribution has been successfully logged with HopeSphere. Our team ensures transparent deployment directly to community beneficiaries.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                to="/dashboard"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F2B48] hover:bg-emerald-600 transition-colors"
              >
                View In Dashboard
              </Link>
              <button
                onClick={() => setShowPopup(false)}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}