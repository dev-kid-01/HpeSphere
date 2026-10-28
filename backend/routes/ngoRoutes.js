const express = require('express');
const router = express.Router();
const User = require('../models/User');

const sampleNGOs = [
  {
    name: 'Akshaya Hope Initiative',
    category: 'Hunger Relief & Nutrition',
    location: 'Rajkot & Ahmedabad, Gujarat',
    established: 2018,
    mission: 'Eliminating childhood hunger and distributing hot nutritional meals to marginalized daily-wage families.',
    isVerified: true,
    website: 'https://akshayahope.example.org',
    image: '/asset/food.png',
    activeDrives: 4,
    volunteersCount: 320,
  },
  {
    name: 'Vidya Jyoti Foundation',
    category: 'Childhood Education & Literacy',
    location: 'Jamnagar & Surat, Gujarat',
    established: 2016,
    mission: 'Bridging the educational divide by supporting underprivileged children with digital tools, stationery, and tutoring.',
    isVerified: true,
    website: 'https://vidyajyoti.example.org',
    image: '/asset/education.png',
    activeDrives: 3,
    volunteersCount: 210,
  },
  {
    name: 'Swasthya Seva Network',
    category: 'Healthcare & Medical Outreach',
    location: 'Bhuj & Kutch District',
    established: 2019,
    mission: 'Delivering primary healthcare, health screenings, and lifesaving medicines directly to rural and nomadic tribal communities.',
    isVerified: true,
    website: 'https://swasthyaseva.example.org',
    image: '/asset/medical.png',
    activeDrives: 5,
    volunteersCount: 180,
  },
  {
    name: 'Green Roots Environmental Trust',
    category: 'Ecology & Urban Afforestation',
    location: 'Vadodara, Gujarat',
    established: 2021,
    mission: 'Leading community tree planting, water body revival, and ecological awareness programs across western India.',
    isVerified: true,
    website: 'https://greenroots.example.org',
    image: '/asset/img2.png',
    activeDrives: 2,
    volunteersCount: 140,
  },
  {
    name: 'Samarpan Animal Shelter & Care',
    category: 'Animal Welfare & Rescue',
    location: 'Ahmedabad, Gujarat',
    established: 2020,
    mission: 'Rescuing injured stray animals, providing medical treatment, rehabilitation, and finding loving adoptive homes.',
    isVerified: false, // Demo pending verification
    website: 'https://samarpan.example.org',
    image: '/asset/img3.png',
    activeDrives: 2,
    volunteersCount: 95,
  },
];

// GET /api/ngos
router.get('/', async (req, res) => {
  try {
    // Also fetch any real registered NGO users in the database
    const registeredNgos = await User.find({ role: 'ngo' }).select(
      'name email phone organizationDetails createdAt'
    );

    const userNgosFormatted = registeredNgos.map((ngo) => ({
      name: ngo.organizationDetails?.orgName || ngo.name,
      category: ngo.organizationDetails?.focusAreas?.[0] || 'Community Development',
      location: ngo.organizationDetails?.address || 'Community Partner',
      established: ngo.organizationDetails?.establishedYear || new Date(ngo.createdAt).getFullYear(),
      mission: ngo.organizationDetails?.mission || 'Dedicated partner working directly with HopeSphere to uplift communities.',
      isVerified: ngo.organizationDetails?.isVerified || false,
      website: ngo.organizationDetails?.website || '',
      image: '/asset/img1.png',
      activeDrives: 1,
      volunteersCount: 10,
    }));

    // Combine sample NGOs with registered NGOs
    const combined = [...sampleNGOs, ...userNgosFormatted];
    return res.status(200).json(combined);
  } catch (error) {
    console.error('Error fetching NGOs:', error);
    return res.status(500).json({ error: 'Failed to fetch NGOs' });
  }
});

module.exports = router;
