import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE } from '../context/AuthContext';
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineChatAlt2,
  HiOutlineCheckCircle,
} from 'react-icons/hi';

export default function Contact() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!email) setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim() || !/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          message: message.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit contact form');
      }

      setSuccess('Thank you! Your message has been received by the HopeSphere community team.');
      setMessage('');
      if (!user) {
        setName('');
        setEmail('');
      }
    } catch (err) {
      setError(err.message || 'Server error, please try again later');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F2B48]">
            Contact HopeSphere Support
          </h1>
          <p className="text-sm text-slate-600">
            Have questions about donating, onboarding your NGO, or organizing a volunteer drive? We're here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0F2B48] to-[#0A1E36] text-white p-8 rounded-2xl shadow-xl space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white">
                Contact Information
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Reach our volunteer coordination desk or nonprofit verification team directly.
              </p>
            </div>

            <div className="space-y-6 text-sm text-slate-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-emerald-400">
                  <HiOutlineMail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-slate-400">
                    Email Inquiries
                  </div>
                  <div className="font-bold text-white mt-0.5">support@hopesphere.org</div>
                  <div className="text-xs text-slate-400">Response within 24 hours</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-emerald-400">
                  <HiOutlinePhone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-slate-400">
                    Helpline
                  </div>
                  <div className="font-bold text-white mt-0.5">+91 98765 43210</div>
                  <div className="text-xs text-slate-400">Mon-Sat, 9:00 AM – 6:00 PM IST</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-emerald-400">
                  <HiOutlineLocationMarker className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-slate-400">
                    Headquarters
                  </div>
                  <div className="font-bold text-white mt-0.5">HopeSphere Community Hub</div>
                  <div className="text-xs text-slate-400">Rajkot & Western Outreach Centers, Gujarat, India</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-xs text-emerald-300 leading-relaxed">
              <strong>NGO Representative Notice:</strong> For expedited organization onboarding and field verification requests, please include your NGO Trust registration number in your message.
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-md">
            <h3 className="text-xl font-bold text-[#0F2B48] mb-1">
              Send Us a Message
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Fill in the form below and a team coordinator will respond promptly.
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Your Message *
                </label>
                <textarea
                  required
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our community team help you?"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50/50"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-[#0F2B48] hover:bg-emerald-600 transition-all shadow-md disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <HiOutlineChatAlt2 className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}