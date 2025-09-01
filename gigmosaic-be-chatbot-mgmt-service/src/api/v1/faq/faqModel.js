const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
    {
        faqId: {
            type: String,
            required: true,
            unique: true,
        },
        category: {
            type: String,
            enum: ['customer', 'provider', 'general'],
            required: true,
        },
        question: {
            type: String,
            required: true,
            trim: true,
            minlength: [1, 'Question cannot be empty'],
        },
        answer: {
            type: String,
            required: true,
            trim: true,
            minlength: [1, 'Answer cannot be empty'],
        },
        isEnabled: {
            type: Boolean,
            default: true,
        },
        user: {
            type: String,
            default: 'admin',
            trim: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// Add indexes for better query performance
faqSchema.index({ category: 1 });
faqSchema.index({ user: 1 });
faqSchema.index({ isEnabled: 1 });
faqSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Faq', faqSchema);
