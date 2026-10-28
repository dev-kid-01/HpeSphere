const express = require('express');
const router = express.Router();
const VolunteerOpportunity = require('../models/VolunteerOpportunity');
const { protect, requireRole } = require('../middleware/auth');

const initialOpportunities = [
  {
    title: 'Weekend Food Relief & Ration Kit Packaging',
    organization: 'Akshaya Hope Initiative',
    causeCategory: 'Food Security',
    location: 'Central Community Center, Rajkot',
    date: 'Upcoming Saturday, 9:00 AM - 1:00 PM',
    timeCommitment: '4 Hours',
    description: 'Help assemble hygiene and dry-ration relief boxes for 300+ families. Tasks include sorting grains, sealing packages, and loading distribution vehicles.',
    skillsNeeded: ['Teamwork', 'Packaging', 'Physical Stamina'],
    openSlots: 15,
    status: 'open',
  },
  {
    title: 'Youth Mentorship & English Reading Circle',
    organization: 'Vidya Jyoti Foundation',
    causeCategory: 'Education & Mentorship',
    location: 'Community Learning Hub, Jamnagar',
    date: 'Bi-weekly Sundays, 2:00 PM - 5:00 PM',
    timeCommitment: '3 Hours weekly',
    description: 'Support children from grades 3 to 8 with interactive storytelling, spoken English practice, and foundational math drills in small guided groups.',
    skillsNeeded: ['Patience', 'Basic English', 'Teaching / Empathy'],
    openSlots: 8,
    status: 'open',
  },
  {
    title: 'Preventive Health Camp Assistant',
    organization: 'Swasthya Seva Network',
    causeCategory: 'Healthcare Access',
    location: 'District Health Center, Bhuj',
    date: 'Next Saturday, 8:30 AM - 3:00 PM',
    timeCommitment: '6 Hours',
    description: 'Assist doctors and triage coordinators with patient token registration, vitals queue management, and distributing nutritional supplements.',
    skillsNeeded: ['Organization', 'Communication', 'Empathy'],
    openSlots: 10,
    status: 'open',
  },
  {
    title: 'Urban Green Belt Tree Planting Drive',
    organization: 'Green Roots Environmental Trust',
    causeCategory: 'Environment & Climate',
    location: 'Riverfront Park & Urban Forest Zone',
    date: 'Coming Sunday Morning, 7:00 AM - 10:30 AM',
    timeCommitment: '3.5 Hours',
    description: 'Join our mission to plant 500 indigenous saplings, install protective bamboo tree guards, and educate visitors on native biodiversity conservation.',
    skillsNeeded: ['Enthusiasm', 'Outdoor Work', 'Community Engagement'],
    openSlots: 25,
    status: 'open',
  },
];

// GET /api/volunteers
router.get('/', async (req, res) => {
  try {
    let opportunities = await VolunteerOpportunity.find({ status: 'open' }).sort({ createdAt: -1 });

    if (opportunities.length === 0) {
      opportunities = await VolunteerOpportunity.insertMany(initialOpportunities);
    }

    return res.status(200).json(opportunities);
  } catch (error) {
    console.error('Error fetching volunteer opportunities:', error);
    return res.status(500).json({ error: 'Failed to fetch volunteer opportunities' });
  }
});

// POST /api/volunteers (NGO only)
router.post('/', protect, requireRole('ngo', 'admin'), async (req, res) => {
  try {
    const { title, causeCategory, location, date, timeCommitment, description, skillsNeeded, openSlots } = req.body;

    if (!title || !location || !date || !description) {
      return res.status(400).json({ error: 'Required fields missing for volunteer opportunity' });
    }

    const opportunity = new VolunteerOpportunity({
      title: title.trim(),
      organization: req.user.organizationDetails?.orgName || req.user.name,
      ngoId: req.user._id,
      causeCategory: causeCategory || 'Community Service',
      location: location.trim(),
      date,
      timeCommitment: timeCommitment || 'Flexible',
      description: description.trim(),
      skillsNeeded: Array.isArray(skillsNeeded) ? skillsNeeded : skillsNeeded ? skillsNeeded.split(',').map(s => s.trim()) : [],
      openSlots: openSlots ? Number(openSlots) : 10,
    });

    await opportunity.save();
    return res.status(201).json({ message: 'Volunteer opportunity posted successfully', opportunity });
  } catch (error) {
    console.error('Error creating volunteer opportunity:', error);
    return res.status(500).json({ error: 'Failed to create volunteer opportunity' });
  }
});

// POST /api/volunteers/:id/apply (Join a drive)
router.post('/:id/apply', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required to register' });
    }

    const opportunity = await VolunteerOpportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ error: 'Volunteer opportunity not found' });
    }

    // Check if already registered
    const alreadyRegistered = opportunity.volunteersRegistered.some(
      (v) => v.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (alreadyRegistered) {
      return res.status(400).json({ error: 'You are already registered for this volunteer drive.' });
    }

    opportunity.volunteersRegistered.push({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : undefined,
      status: 'confirmed',
    });

    await opportunity.save();

    return res.status(200).json({
      message: 'Successfully registered for this volunteer drive! A confirmation notice has been logged.',
    });
  } catch (error) {
    console.error('Error joining volunteer drive:', error);
    return res.status(500).json({ error: 'Failed to submit registration' });
  }
});

module.exports = router;
