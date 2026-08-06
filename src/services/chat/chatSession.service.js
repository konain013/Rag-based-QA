const ChatSession = require("../../models/chat_session.model");

const getOrCreateSession = async ({ sessionId, userId }) => {

    if (sessionId) {
        const session = await ChatSession.findOne({
            _id: sessionId,
            userId,
        });

        if (!session) {
            throw new Error("Chat session not found.");
        }

        return session;
    }

    const session = await ChatSession.create({
        userId,
    });

    return session;
};

module.exports = {
    getOrCreateSession,
};