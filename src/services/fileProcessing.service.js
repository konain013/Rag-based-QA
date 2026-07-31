const path = require("path");

const File = require("../models/file.model");
const { getParser } = require("./persers/parserFactory");
const { splitIntoChunks } = require("./chunking/chunk.service");
const { generateEmbeddings } = require("./embeddings/embedding.service");
const { storeChunks } = require("./vectorStore/vectorstore.services");

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
    if (!text?.trim()) {
      throw new Error("No readable text found in the document.");
    }
  // Split text
    const chunks = await splitIntoChunks(text);

    // Generate embeddings
const chunkEmbeddings = await generateEmbeddings(chunks);

// Prepare metadata for PostgreSQL
const metadata = {
  originalName: savedFile.originalName,
  fileName: savedFile.fileName,
  mimeType: savedFile.mimeType,
  size: savedFile.size,
  extension,
};

// Store chunks in PostgreSQL
await storeChunks({
  mongoFileId: savedFile._id.toString(),
  userId: user.userId,
  metadata,
  chunks: chunkEmbeddings,
});
// console.log("Total Chunks:", chunks.length);

// chunks.forEach((chunk, index) => {
//     console.log(`\n----- Chunk ${index + 1} -----`);
//     console.log(chunk);
// });

    return {
      file: savedFile,
      text,
      chunks,
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
