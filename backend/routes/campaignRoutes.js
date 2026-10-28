const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const { protect, requireRole } = require('../middleware/auth');

// Default initial campaigns to seed if database is empty
const initialCampaigns = [
  {
    title: 'Warmth for Winter: Blankets & Winter Wear Drive',
    description: 'Providing winter essentials, high-grade blankets, and thermal clothing to homeless individuals and rural families facing extreme cold waves.',
    category: 'Community Support',
    ngoName: 'Swasthya Seva Network',
    targetAmount: 250000,
    raisedAmount: 185000,
    location: 'North & Western Regions',
    image: '/asset/img1.png',
    urgency: 'Urgent',
    donorsCount: 142,
    status: 'active',
  },
  {
    title: 'Nutrition Kits for Undernourished Children',
    description: 'Delivering monthly nutritional packs, protein supplements, and fresh ration supplies to over 500 children in semi-rural primary schools.',
    category: 'Hunger & Nutrition',
    ngoName: 'Akshaya Hope Initiative',
    targetAmount: 400000,
    raisedAmount: 310000,
    location: 'Gujarat & Maharashtra',
    image: '/asset/food.png',
    urgency: 'High',
    donorsCount: 228,
    status: 'active',
  },
  {
    title: 'Digital Classrooms & STEM Kits for Rural Schools',
    description: 'Equipping underprivileged public schools with tablets, interactive learning aids, and STEM laboratory starter kits for first-generation learners.',
    category: 'Children & Education',
    ngoName: 'Vidya Jyoti Foundation',
    targetAmount: 350000,
    raisedAmount: 215000,
    location: 'Multiple Districts',
    image: '/asset/education.png',
    urgency: 'Normal',
    donorsCount: 95,
    status: 'active',
  },
  {
    title: 'Mobile Health Clinics for Remote Villages',
    description: 'Deploying equipped healthcare vans staffed by volunteer doctors and nurses to provide free health checkups, diagnostics, and essential medicines.',
    category: 'Healthcare Access',
    ngoName: 'Swasthya Seva Network',
    targetAmount: 500000,
    raisedAmount: 380000,
    location: 'Rural Outposts',
    image: '/asset/medical.png',
    urgency: 'High',
    donorsCount: 310,
    status: 'active',
  },
];

// GET /api/campaigns
router.get('/', async (req, res) => {
  try {
    let campaigns = await Campaign.find({ status: 'active' }).sort({ createdAt: -1 });

    // Seed initial realistic campaigns if collection is empty
    if (campaigns.length === 0) {
      campaigns = await Campaign.insertMany(initialCampaigns);
    }

    return res.status(200).json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// POST /api/campaigns (NGO only)
router.post('/', protect, requireRole('ngo', 'admin'), async (req, res) => {
  try {
    const { title, description, category, targetAmount, location, urgency, image } = req.body;

    if (!title || !description || !targetAmount || !location) {
      return res.status(400).json({ error: 'Please provide all required campaign details' });
    }

    const campaign = new Campaign({
      title: title.trim(),
      description: description.trim(),
      category: category || 'Community Support',
      ngoName: req.user.organizationDetails?.orgName || req.user.name,
      ngoId: req.user._id,
      targetAmount: Number(targetAmount),
      raisedAmount: 0,
      location: location.trim(),
      image: image || '/asset/img1.png',
      urgency: urgency || 'Normal',
    });

    await campaign.save();
    return res.status(201).json({ message: 'Campaign created successfully', campaign });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// GET /api/campaigns/:id
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    return res.status(200).json(campaign);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch campaign details' });
  }
});

module.exports = router;
