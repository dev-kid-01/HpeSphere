import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaHeart,
} from 'react-icons/fa';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A1E36] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="white" size="lg" linkTo="/" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mt-2">
              HopeSphere connects passionate volunteers, caring donors, and verified grassroots nonprofits to empower underprivileged children, alleviate hunger, and deliver critical medical outreach where it matters most.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="HopeSphere Facebook"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="HopeSphere Twitter"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="HopeSphere Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="HopeSphere LinkedIn"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/ngos" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Explore NGOs
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Active Campaigns
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Volunteer Drives
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Support a Cause
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Community */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Help & Contact
                </Link>
              </li>
              <li>
                <Link to="/signin" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Register as Volunteer / NGO
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <HiOutlineMail className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>support@hopesphere.org</span>
              </li>
              <li className="flex items-start gap-2.5">
                <HiOutlinePhone className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2.5">
                <HiOutlineLocationMarker className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Community Impact Hub, Gujarat, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {currentYear} HopeSphere. All rights reserved. Compassion in action for every community.
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with care & transparency</span>
            <FaHeart className="w-3.5 h-3.5 text-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}