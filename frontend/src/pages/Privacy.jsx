import React from 'react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200/80 space-y-6">
        <h1 className="text-3xl font-black text-[#0F2B48]">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Effective Date: October 2026 • HopeSphere Platform</p>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            At HopeSphere, we respect your privacy and are committed to safeguarding personal information collected across our platform.
          </p>
          <h3 className="font-bold text-base text-[#0F2B48] pt-2">1. Information We Collect</h3>
          <p>
            We collect user names, emails, contact numbers, and optional organization details provided voluntarily during registration, donation submission, or volunteer applications. Passwords are never stored in plain text and are hashed using bcrypt.
          </p>
          <h3 className="font-bold text-base text-[#0F2B48] pt-2">2. How We Use Information</h3>
          <p>
            Your information is used strictly to coordinate volunteer opportunities, log donation receipts, communicate service updates, and authenticate user accounts. We never sell, rent, or trade personal data to third parties.
          </p>
          <h3 className="font-bold text-base text-[#0F2B48] pt-2">3. Security</h3>
          <p>
            We implement industry-standard encryption, JSON Web Tokens with expiry, secure password hashing, and server-side authorization controls to protect your data.
          </p>
        </div>
      </div>
    </div>
  );
}
