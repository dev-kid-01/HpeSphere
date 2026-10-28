const mongoose = require('mongoose');

const volunteerOpportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Opportunity title is required'],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    causeCategory: {
      type: String,
      required: true,
      default: 'Community Service',
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    timeCommitment: {
      type: String,
      default: 'Flexible / 4-6 hrs per week',
    },
    description: {
      type: String,
      required: true,
    },
    skillsNeeded: [{ type: String }],
    openSlots: {
      type: Number,
      default: 10,
    },
    volunteersRegistered: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        registeredAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['pending', 'confirmed'], default: 'confirmed' },
      },
    ],
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('VolunteerOpportunity', volunteerOpportunitySchema);
