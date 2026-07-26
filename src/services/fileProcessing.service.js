const path = require("path");

const File = require("../models/file.model");
const { getParser } = require("./persers/parserFactory");

const processFile = async (file, user) => {
    let savedFile = null;

    try {
        // Save metadata
        savedFile = await File.create({
            originalName: file.originalname,
            fileName: file.filename,
            path: file.path,
            mimeType: file.mimetype,
            size: file.size,
            uploadedBy: user.userId,
        });

        // Get parser
        const extension = path.extname(file.originalname);

        const parser = getParser(extension);

        // Parse file
        const { text } = await parser.parse(file.path);

        return {
            file: savedFile,
            text,
        };

    } catch (error) {

        // Rollback MongoDB document
        if (savedFile) {
            await File.findByIdAndDelete(savedFile._id);
        }

        throw error;
    }
};

module.exports = {
    processFile,
};