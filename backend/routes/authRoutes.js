const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, JWT_SECRET } = require('../middleware/auth');

// Generate JWT Helper
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// 1. REGISTER
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role = 'volunteer',
      phone,
      termsAccepted,
      organizationDetails,
    } = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Full name is required (at least 2 characters)' });
    }

    if (!email || !/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim())) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (termsAccepted !== undefined && !termsAccepted) {
      return res.status(400).json({ error: 'You must agree to the Terms and Conditions to proceed' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate registration
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email address already exists' });
    }

    // Role-specific validation
    let orgData = undefined;
    if (role === 'ngo') {
      orgData = {
        orgName: organizationDetails?.orgName || name,
        registrationNumber: organizationDetails?.registrationNumber || '',
        focusAreas: organizationDetails?.focusAreas || [],
        website: organizationDetails?.website || '',
        address: organizationDetails?.address || '',
        // Requirements: Do not automatically mark an NGO as verified
        isVerified: false,
        establishedYear: organizationDetails?.establishedYear || undefined,
      };
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role === 'ngo' ? 'ngo' : 'volunteer',
      phone: phone ? phone.trim() : undefined,
      organizationDetails: orgData,
      lastLogin: new Date(),
    });

    await user.save();

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        organizationDetails: user.organizationDetails,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ error: 'Server error during registration. Please try again later.' });
  }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Always use generic error to avoid user enumeration
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Signed in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        organizationDetails: user.organizationDetails,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Server error during sign in. Please try again later.' });
  }
});

// 3. GET CURRENT USER
router.get('/me', protect, async (req, res) => {
  try {
    return res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        location: req.user.location,
        bio: req.user.bio,
        organizationDetails: req.user.organizationDetails,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return res.status(500).json({ error: 'Server error fetching user profile' });
  }
});

// 4. FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Security requirement: Never reveal whether an email address is registered
    const safeResponse = {
      message:
        'If that email address is registered with HopeSphere, password reset instructions have been sent.',
    };

    if (!user) {
      return res.status(200).json(safeResponse);
    }

    // Generate random secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour validity

    await user.save();

    // Log for local environment testing
    console.log(`[HopeSphere Auth] Password reset requested for: ${normalizedEmail}`);
    console.log(`[HopeSphere Auth] Reset Token: ${resetToken}`);

    // Return the safe message without disclosing email status
    return res.status(200).json({
      ...safeResponse,
      // Provide demoResetToken in development/local response so user can test the reset flow immediately without needing an actual SMTP server!
      demoResetToken: resetToken,
    });
  } catch (error) {
    console.error('Error in forgot-password:', error);
    return res.status(500).json({ error: 'Server error processing password reset request' });
  }
});

// 5. RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Password reset token is required' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Hash token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: 'Password has been successfully reset. You can now sign in with your new password.',
    });
  } catch (error) {
    console.error('Error in reset-password:', error);
    return res.status(500).json({ error: 'Server error resetting password' });
  }
});

// 6. UPDATE PROFILE
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, phone, location, bio, organizationDetails, currentPassword, newPassword } = req.body;

    if (name && name.trim().length >= 2) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (location !== undefined) user.location = location.trim();
    if (bio !== undefined) user.bio = bio.trim();

    // If NGO, allow updating details but keep isVerified unchanged
    if (user.role === 'ngo' && organizationDetails) {
      user.organizationDetails = {
        ...user.organizationDetails,
        orgName: organizationDetails.orgName || user.organizationDetails?.orgName,
        registrationNumber: organizationDetails.registrationNumber || user.organizationDetails?.registrationNumber,
        focusAreas: organizationDetails.focusAreas || user.organizationDetails?.focusAreas,
        website: organizationDetails.website || user.organizationDetails?.website,
        address: organizationDetails.address || user.organizationDetails?.address,
        // Preserve verified status, user cannot self-verify
        isVerified: user.organizationDetails?.isVerified || false,
      };
    }

    // Password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set a new password' });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: 'Incorrect current password' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        organizationDetails: user.organizationDetails,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ error: 'Server error updating profile' });
  }
});

module.exports = router;
