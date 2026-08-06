const Message = require("../../models/message.model");

const saveUserMessage = async ({ sessionId, content }) => {
    return await Message.create({
        sessionId,
        role: "user",
        content,
    });
};

const saveAssistantMessage = async ({ sessionId, content }) => {
    return await Message.create({
        sessionId,
        role: "assistant",
        content,
    });
};

const getRecentMessages = async ({ sessionId, limit = 10 }) => {
    const messages = await Message.find({ sessionId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return messages.reverse();
};

module.exports = {
    saveUserMessage,
    saveAssistantMessage,
    getRecentMessages,
};