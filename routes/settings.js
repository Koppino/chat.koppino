const router = require("express").Router();
const { ensureAuthenticated } = require("../config/auth");
const settingsController = require("../controllers/SettingsController");
const multer = require("multer");
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `files/admin-${file.fieldname}-${req.user._id}.${ext}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Not a PDF File!!"), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

router.get("/", ensureAuthenticated, settingsController.getSettings);

router.get(
  "/change-avatar/",
  ensureAuthenticated,
  settingsController.getChange_avatar
);
router.post(
  "/change-avatar/",
  ensureAuthenticated,
  upload.single("file"),
  settingsController.change_avatar
);

module.exports = router;
