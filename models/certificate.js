const mongoose = require('mongoose');

const SingleCertificateSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lectureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    downloadUrl: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    score: {
        type: Number,
        min: 0,
        max: 100
    },
    status: {
        type: String,
        enum: ['pending', 'issued', 'revoked'],
        default: 'issued'
    },
    metadata: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
});

const MultipleCertificateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    certificates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SingleCertificate'
    }],
    totalCourses: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for better query performance
SingleCertificateSchema.index({ userId: 1, lectureId: 1 }, { unique: true });
MultipleCertificateSchema.index({ userId: 1 });

// Add a method to calculate grade
SingleCertificateSchema.methods.getGrade = function() {
    const score = this.score || 0;
    if (score >= 90) return 'A+ (Distinction)';
    if (score >= 80) return 'A (Excellent)';
    if (score >= 70) return 'B+ (Very Good)';
    if (score >= 60) return 'B (Good)';
    if (score >= 50) return 'C (Satisfactory)';
    return 'D (Pass)';
};

const SingleCertificate = mongoose.model('SingleCertificate', SingleCertificateSchema);
const MultipleCertificate = mongoose.model('MultipleCertificate', MultipleCertificateSchema);

module.exports = {
    SingleCertificate,
    MultipleCertificate
};
