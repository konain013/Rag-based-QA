const fs = require('fs');
const path = require('path');
const File = require('../models/file.model');

// Single file upload
const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            })
        }

        const file = await File.create({
            originalName: req.file.originalname,
            fileName: req.file.filename,
            path: req.file.path,
            mimeType: req.file.mimetype,
            size: req.file.size,
            uploadedBy: req.user._id
        })

        return res.status(201).json({
            success: true,
            message: "File uploaded successfully.",
            data: file
        });

    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error(err)
            })
        }
        next(error)
    }
}

// Multiple files upload
const uploadMultipleFiles = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            })
        }

        const filesData = req.files.map(file => ({
            originalName: file.originalname,
            fileName: file.filename,
            path: file.path,
            mimeType: file.mimetype,
            size: file.size,
            uploadedBy: req.user._id
        }))

        const savedFiles = await File.insertMany(filesData)

        return res.status(201).json({
            success: true,
            message: "Files uploaded successfully.",
            data: savedFiles
        });

    } catch (error) {
        if (req.files) {
            req.files.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) console.error(err)
                })
            })
        }
        next(error)
    }
}

// Get all files (own files only, unless admin)
const getAllFiles = async (req, res, next) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { uploadedBy: req.user._id };

        const files = await File.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: files.length,
            data: files
        });

    } catch (error) {
        next(error);
    }
}

// Get single file / download
const getFileById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        const isOwner = file.uploadedBy.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this file'
            });
        }

        return res.download(path.resolve(file.path), file.originalName);

    } catch (error) {
        next(error);
    }
}

// Delete file
const deleteFile = async (req, res, next) => {
    try {
        const { id } = req.params;

        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        const isOwner = file.uploadedBy.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this file'
            });
        }

        fs.unlink(path.resolve(file.path), async (err) => {
            if (err) {
                console.error(err);
            }

            await File.findByIdAndDelete(id);

            return res.status(200).json({
                success: true,
                message: 'File deleted successfully'
            });
        });

    } catch (error) {
        next(error);
    }
}

// Update file (replace)
const updateFile = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const existingFile = await File.findById(id);

        if (!existingFile) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error(err);
            });

            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        const isOwner = existingFile.uploadedBy.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error(err);
            });

            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this file'
            });
        }

        fs.unlink(path.resolve(existingFile.path), (err) => {
            if (err) console.error(err);
        });

        existingFile.originalName = req.file.originalname;
        existingFile.fileName = req.file.filename;
        existingFile.path = req.file.path;
        existingFile.mimeType = req.file.mimetype;
        existingFile.size = req.file.size;

        await existingFile.save();

        return res.status(200).json({
            success: true,
            message: 'File updated successfully',
            data: existingFile
        });

    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error(err);
            });
        }
        next(error);
    }
}

module.exports = {
    uploadFile,
    uploadMultipleFiles,
    getAllFiles,
    getFileById,
    deleteFile,
    updateFile
};