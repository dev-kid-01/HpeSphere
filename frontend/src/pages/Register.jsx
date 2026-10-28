import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../componants/Logo';
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlinePhone,
  HiOutlineOfficeBuilding,
  HiOutlineInformationCircle,
} from 'react-icons/hi';

export default function Register() {
  const [role, setRole] = useState('volunteer'); // 'volunteer' | 'ngo'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // NGO Specific Fields
  const [orgName, setOrgName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [focusArea, setFocusArea] = useState('Community Support');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!name.trim() || name.trim().length < 2) {
      setError('Please provide your full legal or representative name');
      return;
    }
    if (!email.trim() || !/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim())) {
      setError('Please provide a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!termsAccepted) {
      setError('You must accept the HopeSphere Terms & Community Guidelines');
      return;
    }

    if (role === 'ngo' && !orgName.trim()) {
      setError('Please provide the official Organization Name for your NGO');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      password,
      confirmPassword,
      role,
      termsAccepted,
      organizationDetails:
        role === 'ngo'
          ? {
              orgName: orgName.trim(),
              registrationNumber: registrationNumber.trim() || undefined,
              focusAreas: [focusArea],
              website: website.trim() || undefined,
              address: address.trim() || undefined,
            }
          : undefined,
    };

    try {
      const result = await register(payload);
      if (!result.success) {
        setError(result.error || 'Registration failed');
      } else {
        setSuccess('Account created successfully! Preparing your workspace...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 700);
      }
    } catch (err) {
      setError('Unable to contact authentication server. Please check your network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 sm:p-10">
        <div className="text-center">
          <Logo size="lg" linkTo="/" className="justify-center mb-4" />
          <h2 className="text-2xl font-black tracking-tight text-[#0F2B48]">
            Create a HopeSphere Account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Join thousands of changemakers, volunteers, and certified nonprofits across India.
          </p>
        </div>

        {/* Account Type Selection */}
        <div className="mt-6 grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setRole('volunteer')}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
              role === 'volunteer'
                ? 'bg-white text-[#0F2B48] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Volunteer / Donor
          </button>
          <button
            type="button"
            onClick={() => setRole('ngo')}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
              role === 'ngo'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            NGO Representative
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0 animate-ping" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <HiOutlineUser className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kalpesh Parmar"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <HiOutlineMail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.org"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Phone (Optional) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <HiOutlinePhone className="w-5 h-5" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* NGO SPECIFIC ONBOARDING SECTION */}
          {role === 'ngo' && (
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-3.5 mt-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <HiOutlineOfficeBuilding className="w-4 h-4 text-emerald-600" />
                <span>Organization Onboarding Details</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official NGO Name *
                </label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Swasthya Seva Network"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registration / Trust ID
                  </label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. 12A/80G/TRUST-2024"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Focus Area
                  </label>
                  <select
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Community Support">Community Support</option>
                    <option value="Hunger & Nutrition">Hunger & Nutrition</option>
                    <option value="Children & Education">Children & Education</option>
                    <option value="Healthcare Access">Healthcare Access</option>
                    <option value="Disaster Relief">Disaster Relief</option>
                    <option value="Environment">Environment & Animals</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Website / Social Page
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example-ngo.org"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Requirement: Do not automatically mark an NGO as verified */}
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50/90 border border-amber-200/80 text-[11px] text-amber-800 leading-normal">
                <HiOutlineInformationCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Verification Notice:</strong> New NGO representative profiles are created in an initial unverified status. To maintain trust, HopeSphere coordinators verify NGO credentials before displaying the verified badge.
                </span>
              </div>
            </div>
          )}

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <HiOutlineLockClosed className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <HiOutlineEyeOff className="w-4 h-4" />
                  ) : (
                    <HiOutlineEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <HiOutlineLockClosed className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="pt-2 flex items-start">
            <input
              id="terms"
              type="checkbox"
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded-sm cursor-pointer"
            />
            <label htmlFor="terms" className="ml-2 block text-xs text-slate-600 cursor-pointer">
              I agree to the{' '}
              <Link to="/terms" className="text-emerald-700 font-semibold hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-emerald-700 font-semibold hover:underline">
                Privacy Policy
              </Link>
              , and confirm the details provided are accurate.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                <span>Creating your account...</span>
              </>
            ) : (
              'Create HopeSphere Account'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-600">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="font-bold text-[#0F2B48] hover:text-emerald-700 hover:underline"
          >
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
