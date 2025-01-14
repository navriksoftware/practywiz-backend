import routers from "express";
import {
  CreateCaseStudyRazorPayOrder,
  fetchAllCaseStudyData,
  getCartTotalAmount,
  PayCaseStudyAmount,
  fetchPurchasedCaseStudies,
  fetchPurchasedCaseStudyById,
} from "../../Controllers/CaseStydiesControllers/CaseStudiesController.js";
let router = routers.Router();

//login
router.get("/all-list", fetchAllCaseStudyData);

router.post("/cart/get-total-amount", getCartTotalAmount);

router.post("/cart/create-order", CreateCaseStudyRazorPayOrder);

router.post("/cart/pay-case-study", PayCaseStudyAmount);

router.get("/purchased-case-studies", fetchPurchasedCaseStudies);

router.get("/purchased-case-studies/:id", fetchPurchasedCaseStudyById);

export default router;
