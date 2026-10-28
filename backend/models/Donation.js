const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\d{10}$/, 'Phone number must be 10 digits'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    donationType: {
      type: String,
      required: [true, 'Donation type is required'],
      enum: ['food', 'clothing', 'money', 'education', 'medical'],
    },
    amount: {
      type: Number,
      validate: {
        validator: function (value) {
          if (this.donationType === 'money') {
            return value > 0;
          }
          return true;
        },
        message: 'Amount must be a positive number when donationType is money',
      },
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    donorEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    campaignTitle: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'verified'],
      default: 'completed',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('Donation', donationSchema);
