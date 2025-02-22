import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const llm = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Helper function to fetch a case study by its ID from the database.
const getCaseStudyById = async (case_study_id) => {
  const request = new sql.Request();
  const result = await request
    .input("case_study_id", sql.Int, case_study_id)
    .query(
      "SELECT * FROM case_study_details WHERE case_study_id = @case_study_id"
    );
  return result.recordset[0];
};

export const generateQuestionsWithLangchain = async (req, res) => {
  const { case_study_id } = req.body;

  try {
    console.log("Received case_study_id:", case_study_id);

    if (!case_study_id) {
      return res.status(400).json({ error: "case_study_id is required" });
    }

    const caseStudy = await getCaseStudyById(case_study_id);
    if (!caseStudy) {
      console.log("Case study not found for ID:", case_study_id);
      return res.status(404).json({ error: "Case study not found" });
    }

    console.log("Found case study:", caseStudy.case_study_title);

    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return res.status(500).json({ error: "AI key is not configured" });
    }

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

    // Validate and parse response JSON
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

    if (!case_study_id || !question || !answer) {
      return res
        .status(400)
        .json({ error: "Missing one or more required fields" });
    }

    const caseStudy = await getCaseStudyById(case_study_id);
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

export const checkFullAnalysisResult = async (req, res) => {
  const { case_study_id, analysisData } = req.body;

  try {
    if (!case_study_id || !analysisData || !Array.isArray(analysisData)) {
      return res.status(400).json({
        error: "Invalid input data",
        details: "Missing case study ID or analysis data",
      });
    }

    const caseStudy = await getCaseStudyById(case_study_id);
    if (!caseStudy) {
      return res.status(404).json({ error: "Case study not found" });
    }

    // Store user answers and questions in a structured format
    const formattedAnalysisData = analysisData.map((item) => ({
      mainQuestion: {
        question: item.question,
        answer: item.answer,
        followUps:
          item.followUps?.map((followUp) => ({
            question: followUp.question,
            answer: followUp.answer,
          })) || [],
      },
    }));

    // Prepare the prompt
    let promptText = `Case Study Content:\n${caseStudy.case_study_content}\n\n`;
    promptText += "Student's Analysis Responses:\n\n";

    formattedAnalysisData.forEach((item, index) => {
      promptText += `Main Question ${index + 1}:\n`;
      promptText += `Q: ${item.mainQuestion.question}\n`;
      promptText += `A: ${item.mainQuestion.answer}\n\n`;

      if (item.mainQuestion.followUps?.length > 0) {
        item.mainQuestion.followUps.forEach((followUp, fIdx) => {
          promptText += `Follow-up ${fIdx + 1}:\n`;
          promptText += `Q: ${followUp.question}\n`;
          promptText += `A: ${followUp.answer}\n\n`;
        });
      }
      promptText += "---\n\n";
    });

    const systemPrompt = `
You are an expert case study evaluator. Evaluate each response based on:
- Depth of analysis (understanding of core issues)
- Critical thinking (logical reasoning and problem-solving)
- Solution orientation (practical and actionable recommendations)
- Context understanding (industry and situation awareness)
- Expression clarity (clear and structured communication)
- Behavioral aspects (professionalism, ethics, profesior etc.)

Provide for EACH response:
1. A score (0-10)
2. Specific feedback highlighting strengths and areas for improvement
3. Constructive suggestions for enhancement

Score Structure:
- 0: if user put abusing content or non meaning full content in answer then give warning in feedback and N/A in strengths and improvements tell to user to give proper answer
- 0: If the response is irrelevant or not matchs, such as an answer that doesn't address the question, or if the answer is simply "I don't know." or user add answer in which he/she is not know Answer then give 0 score for those questions.
- 1-3: Poor analysis
- 4-7: Moderate analysis
- 8-10: Excellent analysis
- 10: If answer is perfect and not missed anything in user answer then give 10 score for those questions.

Format your response EXACTLY as this JSON:
{
  "evaluations": [
    {
      "mainQuestion": {
        "question": "exact question text",
        "answer": "User's entered answer of this question",
        "score": number,
        "feedback": "detailed constructive feedback",
        "strengths": "key strong points",
        "improvements": "specific areas to enhance"
      },
      "followUps": [
        {
          "question": "exact follow-up question text",
          "answer": "User's entered answer of this question",
          "score": number,
          "feedback": "detailed constructive feedback",
          "strengths": "key strong points",
          "improvements": "specific areas to enhance"
        }
      ]
    }
  ],
  "overallFeedback": "comprehensive summary of overall performance",
  "averageScore": number,
  "totalScore": number,
  "maximumScore": number
}`;

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(promptText),
    ];

    console.log("Requesting AI evaluation...");
    const aiResponse = await llm.invoke(messages);
    console.log("Received AI response");

    let evaluation;
    try {
      evaluation = JSON.parse(aiResponse.content);

      // Validate response structure
      if (!evaluation.evaluations || !Array.isArray(evaluation.evaluations)) {
        throw new Error("Invalid evaluation structure");
      }

      // Ensure user answers are included in the evaluation
      evaluation.evaluations = evaluation.evaluations.map((evalItem, index) => {
        const originalData = formattedAnalysisData[index];

        // Add user answer to main question
        evalItem.mainQuestion.answer = originalData.mainQuestion.answer;

        // Add user answers to follow-ups
        if (evalItem.followUps && originalData.mainQuestion.followUps) {
          evalItem.followUps = evalItem.followUps.map((followUp, fIdx) => ({
            ...followUp,
            answer: originalData.mainQuestion.followUps[fIdx]?.answer || "",
          }));
        }

        return evalItem;
      });

      // Calculate scores
      let totalScore = 0;
      let questionCount = 0;

      evaluation.evaluations.forEach((evalItem) => {
        // Add main question score
        totalScore += evalItem.mainQuestion.score;
        questionCount++;

        // Add follow-up scores
        if (evalItem.followUps) {
          evalItem.followUps.forEach((followUp) => {
            totalScore += followUp.score;
            questionCount++;
          });
        }
      });

      // Calculate average score if not provided
      evaluation.averageScore = totalScore / questionCount;

      // Calculate total and maximum scores
      evaluation.totalScore = totalScore;
      evaluation.maximumScore = questionCount * 10; // Since each question has max score of 10
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return res.status(500).json({
        error: "Failed to parse evaluation",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }

    // Add metadata
    const response = {
      ...evaluation,
      metadata: {
        evaluatedAt: new Date().toISOString(),
        caseStudyId: case_study_id,
        responseCount: analysisData.length,
      },
    };

    return res.json(response);
  } catch (error) {
    console.error("Error in checkFullAnalysisResult:", error);
    return res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export default {
  generateQuestionsWithLangchain,
  generateFollowUpQuestions,
  checkFullAnalysisResult,
};
