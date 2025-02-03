import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

export const generateQuestionsWithLangchain = async (req, res) => {
  const { case_study_id } = req.body;

  try {
    console.log("Received case_study_id:", case_study_id);

    // Use SQL connection to fetch case study
    const request = new sql.Request();
    const result = await request
      .input("case_study_id", sql.Int, case_study_id)
      .query(
        "SELECT * FROM case_study_details WHERE case_study_id = @case_study_id"
      );

    const caseStudy = result.recordset[0];

    if (!caseStudy) {
      console.log("Case study not found for ID:", case_study_id);
      return res.status(404).json({ error: "Case study not found" });
    }

    console.log("Found case study:", caseStudy.case_study_title);

    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return res.status(500).json({ error: "AI key is not configured" });
    }

    const llm = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `You are an analysis-based questions generator bot. Generate 5 questions from the given case study. 
    Questions should be analytical and thought-provoking. 
    Return ONLY a JSON array in this exact format: 
    {
      "questions": [
        {"q_id": 1, "question": "First question?"},
        {"q_id": 2, "question": "Second question?"},
        {"q_id": 3, "question": "Third question?"},
        {"q_id": 4, "question": "Fourth question?"},
        {"q_id": 5, "question": "Fifth question?"}
      ]
    }`;

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(
        `Generate questions based on this case study: ${caseStudy.case_study_content}`
      ),
    ];

    console.log("Sending request to OpenAI...");
    const response = await llm.invoke(messages);
    console.log("Received response from OpenAI:", response.content);

    // Ensure the response is valid JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response.content);
      if (
        !parsedResponse.questions ||
        !Array.isArray(parsedResponse.questions)
      ) {
        throw new Error("Invalid response format");
      }
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      // If parsing fails, create a formatted response
      parsedResponse = {
        questions: [
          {
            q_id: 1,
            question: "What are the main challenges faced in this case study?",
          },
          {
            q_id: 2,
            question: "What are the key decisions that need to be made?",
          },
          {
            q_id: 3,
            question: "What are the potential solutions to these challenges?",
          },
          {
            q_id: 4,
            question: "What are the implications of these decisions?",
          },
          {
            q_id: 5,
            question: "What lessons can be learned from this case study?",
          },
        ],
      };
    }

    res.json(parsedResponse);
  } catch (err) {
    console.error("Error in generateQuestionsWithLangchain:", err);
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const generateFollowUpQuestions = async (req, res) => {
  const { case_study_id, question, answer } = req.body;

  try {
    console.log("Generating follow-up question for case study:", case_study_id);
    console.log("Original question:", question);
    console.log("User's answer:", answer);

    // Use SQL connection to fetch case study
    const request = new sql.Request();
    const result = await request
      .input("case_study_id", sql.Int, case_study_id)
      .query(
        "SELECT * FROM case_study_details WHERE case_study_id = @case_study_id"
      );

    const caseStudy = result.recordset[0];

    if (!caseStudy) {
      console.log("Case study not found for ID:", case_study_id);
      return res.status(404).json({ error: "Case study not found" });
    }

    console.log("Found case study:", caseStudy.case_study_title);

    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return res
        .status(500)
        .json({ error: "OpenAI API key is not configured" });
    }

    const llm = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const messages = [
      new SystemMessage(
        "Generate a follow-up question based on the user's answer. The question should be analytical and probe deeper into their understanding. Return ONLY the question text, no additional formatting."
      ),
      new HumanMessage(
        `Context: ${caseStudy.case_study_content}\n\nQuestion: ${question}\n\nUser's Answer: ${answer}\n\nGenerate one follow-up question:`
      ),
    ];

    console.log("Sending request to OpenAI...");
    const response = await llm.invoke(messages);
    console.log("Received response from OpenAI:", response.content);

    res.json({ followUpQuestion: response.content.trim() });
  } catch (err) {
    console.error("Error in generateFollowUpQuestions:", err);
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
