const { askQuestion } = require("../services/chat/chat.service");

const chat = async (req, res, next) => {
    try {
        const { question , fileId , userId, sessionId} = req.body;
        // console.log(question)
        // console.log(typeof question)

        const relevantChunks = await askQuestion({
            question,
            userId,
            fileId,
            sessionId,
        });

        return res.status(200).json({
            success: true,
            message: "Relevant chunks retrieved successfully.",
            data:relevantChunks ,
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    chat,
};