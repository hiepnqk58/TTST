const express = require("express");
const router = express.Router();
const membersController = require("../../controllers/MembersController");
const { apiLimiter } = require("../../../middlewares/rateLimit.middleware");
const { roleSuperAdmin } = require("../../../middlewares/role.middleware");
const { authenticate } = require("../../../middlewares/auth.middleware");
const { userValidation } = require("../../validations");
const validate = require("../../../middlewares/validate.middleware");

router.get(
  "/all",
  [authenticate, apiLimiter, roleSuperAdmin],
  membersController.getAll
);
router.get(
  "/detail",
  [authenticate, apiLimiter, roleSuperAdmin],
  membersController.getDetail
);
router.post(
  "/add",
  [
    authenticate,
    apiLimiter,
    roleSuperAdmin,
    validate(userValidation.addSchema),
  ],
  membersController.add
);
router.post(
  "/edit",
  [
    authenticate,
    apiLimiter,
    roleSuperAdmin,
    validate(userValidation.editSchema),
  ],
  membersController.edit
);
router.post(
  "/delete",
  [
    authenticate,
    apiLimiter,
    roleSuperAdmin,
    validate(userValidation.deleteSchema),
  ],
  membersController.delete
);

module.exports = router;
