import React from 'react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200/80 space-y-6">
        <h1 className="text-3xl font-black text-[#0F2B48]">Terms of Service</h1>
        <p className="text-xs text-slate-500">Effective Date: October 2026 • HopeSphere Platform</p>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Welcome to HopeSphere. By accessing or using our platform, you agree to comply with and be bound by these Terms of Service.
          </p>
          <h3 className="font-bold text-base text-[#0F2B48] pt-2">1. User Accounts & Responsibilities</h3>
          <p>
            Users must provide accurate, current, and complete information during registration. Users are responsible for maintaining the confidentiality of account credentials.
          </p>
          <h3 className="font-bold text-base text-[#0F2B48] pt-2">2. NGO Representative Conduct & Verification</h3>
          <p>
            Nonprofit organizations registering on HopeSphere must submit valid trust or society registrations. New NGO accounts undergo administrative review prior to obtaining verified partner status. Any misrepresentation will result in immediate termination.
          </p>
          <h3 className="font-bold text-base text-[#0F2B48] pt-2">3. Donations & Volunteer Drives</h3>
          <p>
            HopeSphere facilitates direct connections between donors, volunteers, and nonprofits. Contributions are deployed toward grassroots social initiatives in accordance with published campaign objectives.
          </p>
        </div>
      </div>
    </div>
  );
}
