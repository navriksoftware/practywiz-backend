import routers from "express";
let router = routers.Router();
import {
  changeUserPassword,
  forgotPassword,
  GoogleLogin,
  login,
  MentorFirstRegister,
  resetPassword,
} from "../../Controllers/AuthControllers/AuthControllers.js";
import {
  verifyPasswordUserToken,
  verifyUserToken,
} from "../../Middleware/Authentication.js";

//login
router.post("/login", login);
//login
router.post("/mentor/register", MentorFirstRegister);
// changing the password from dashboard
router.post("/change/password", verifyUserToken, changeUserPassword);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", verifyPasswordUserToken, resetPassword);

router.post("/google-login", GoogleLogin);
export default router;
