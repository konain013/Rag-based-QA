const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// console.log(process.env.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({
   model: "gemini-flash-latest"
});

const generateWithGemini = async (prompt) => {
    const result = await model.generateContent(prompt);

    return result.response.text();
};

module.exports = {
    generateWithGemini,
};