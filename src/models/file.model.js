const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
    {
        originalName: {
            type: String,
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        },
        mimeType: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
    },
    { timestamps: true }
);

const File = mongoose.model('File', fileSchema);

module.exports = File;