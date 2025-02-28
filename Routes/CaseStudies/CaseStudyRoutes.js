import routers from "express";
import {
  CreateCaseStudyRazorPayOrder,
  fetchAllCaseStudyData,
  getCartTotalAmount,
  PayCaseStudyAmount,
  fetchPurchasedCaseStudies,
  fetchPurchasedCaseStudyById,
} from "../../Controllers/CaseStydiesControllers/CaseStudiesController.js";

import {
  generateQuestionsWithLangchain,
  generateFollowUpQuestions,
  checkFullAnalysisResult,
} from "../../Controllers/CaseStydiesControllers/langchainController.js";

import { connectWithCaseStudyConsultant } from "../../Controllers/CaseStydiesControllers/CaseStudiesController.js";

let router = routers.Router();

//login
router.get("/all-list", fetchAllCaseStudyData);

router.post("/cart/get-total-amount", getCartTotalAmount);

router.post("/cart/create-order", CreateCaseStudyRazorPayOrder);

router.post("/cart/pay-case-study", PayCaseStudyAmount);

router.get("/purchased-case-studies", fetchPurchasedCaseStudies);

router.get("/purchased-case-studies/:id", fetchPurchasedCaseStudyById);

router.post("/generate-questions", generateQuestionsWithLangchain);

router.post("/generate-follow-up-question", generateFollowUpQuestions);

router.post("/check-full-analysis-questions-result", checkFullAnalysisResult);

router.post("/connect-with-consultant", connectWithCaseStudyConsultant);

export default router;
