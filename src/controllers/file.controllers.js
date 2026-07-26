const fs = require("fs");
const path = require("path");
const File = require("../models/file.model");
const { getParser } = require("../services/persers/parserFactory");
const { processFile } = require("../services/fileProcessing.service");

// =========================
// Helper Functions
// =========================

const deletePhysicalFile = async (filePath) => {
  try {
    await fs.promises.unlink(path.resolve(filePath));
  } catch (err) {
    console.error("Failed to delete file:", err.message);
  }
};

const isAuthorized = (file, user) => {
  return (
    file.uploadedBy.toString() === user.userId.toString() ||
    user.role === "admin"
  );
};

// =========================
// Single File Upload
// =========================
const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const result = await processFile(req.file, req.user);

        console.log(result.text);

        return res.status(201).json({
            success: true,
            message: "File uploaded successfully.",
            data: result.file,
        });
    } catch (error) {
        if (req.file) {
            await deletePhysicalFile(req.file.path);
        }

        next(error);
    }
};

// =========================
// Multiple Files Upload
// =========================

const uploadMultipleFiles = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded",
            });
        }

        const results = [];

        for (const file of req.files) {
            const result = await processFile(file, req.user);

            console.log(result.text);

            results.push(result.file);
        }

        return res.status(201).json({
            success: true,
            message: "Files uploaded successfully.",
            data: results,
        });
    } catch (error) {
        if (req.files?.length) {
            await Promise.all(
                req.files.map((file) => deletePhysicalFile(file.path))
            );
        }

        next(error);
    }
};

// =========================
// Get All Files
// =========================

const getAllFiles = async (req, res, next) => {
  try {
    const filter =
      req.user.role === "admin" ? {} : { uploadedBy: req.user.userId };

    const files = await File.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// Download / View File
// =========================

const getFileById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (!isAuthorized(file, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this file",
      });
    }

    return res.download(path.resolve(file.path), file.originalName);
  } catch (error) {
    next(error);
  }
};

// =========================
// Delete File
// =========================

const deleteFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (!isAuthorized(file, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this file",
      });
    }

    await deletePhysicalFile(file.path);
    await File.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// Replace / Update File
// =========================

const updateFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const existingFile = await File.findById(id);

    if (!existingFile) {
      await deletePhysicalFile(req.file.path);

      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (!isAuthorized(existingFile, req.user)) {
      await deletePhysicalFile(req.file.path);

      return res.status(403).json({
        success: false,
        message: "Not authorized to update this file",
      });
    }

    // Delete old physical file
    await deletePhysicalFile(existingFile.path);

    // Update metadata
    existingFile.originalName = req.file.originalname;
    existingFile.fileName = req.file.filename;
    existingFile.path = req.file.path;
    existingFile.mimeType = req.file.mimetype;
    existingFile.size = req.file.size;

    await existingFile.save();

    return res.status(200).json({
      success: true,
      message: "File updated successfully",
      data: existingFile,
    });
  } catch (error) {
    if (req.file) {
      await deletePhysicalFile(req.file.path);
    }

    next(error);
  }
};

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  getAllFiles,
  getFileById,
  deleteFile,
  updateFile,
};
