import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../componants/Logo';
import {
  HiOutlineHeart,
  HiOutlineGlobeAlt,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
} from 'react-icons/hi';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Logo size="lg" linkTo={null} className="justify-center mb-2" />
          <h1 className="text-3xl sm:text-5xl font-black text-[#0F2B48] tracking-tight">
            Our Mission: Compassion In Action
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            HopeSphere was founded on a simple truth: meaningful social change happens when people connect directly with transparent grassroots initiatives.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0F2B48] flex items-center justify-center">
              <HiOutlineGlobeAlt className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-[#0F2B48]">Community-First</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We empower local nonprofits that understand neighborhood realities, avoiding top-heavy administrative overhead.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <HiOutlineShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F2B48]">Strict Verification</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We never fabricate certifications. Every participating NGO is verified with documentation and real field checks before earning verified standing.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <HiOutlineUserGroup className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F2B48]">Direct Volunteerism</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Connecting willing hands with physical opportunities: packaging meals, teaching kids, or helping at mobile health clinics.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 sm:p-12 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2B48]">
            Why HopeSphere Was Created
          </h2>
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <p>
              Across India, thousands of small, honest nonprofit organizations work tirelessly every single day without the massive marketing budgets of corporate charities. At the same time, millions of compassionate citizens and students want to help, but don't know who to trust or where their contributions actually end up.
            </p>
            <p>
              HopeSphere bridges this gap by offering a modern, transparent digital platform. Donors can choose targeted campaigns, volunteers can register for weekend drives in seconds, and verified grassroots NGOs can share updates directly from the ground.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Ready to take part in our mission?
            </div>
            <div className="flex gap-3">
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Join as Volunteer / NGO
              </Link>
              <Link
                to="/donate"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
