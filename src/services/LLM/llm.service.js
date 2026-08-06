const { generateWithGroq } = require("./groq.service");
const { generateWithGemini } = require("./gemini.service");

const generateResponse = async (prompt) => {

    try {

        console.log("Using Groq...");

        return await generateWithGroq(prompt);

    } catch (error) {

         console.log("Groq failed. Switching to Gemini...");
         if (error.status === 429) {
        throw new Error("LLM quota exceeded. Please try again later.");
    }


        return await generateWithGemini(prompt);
    }

};

module.exports = {
    generateResponse,
};