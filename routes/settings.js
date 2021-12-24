const commentController = require('../controllers/CommentController');
const router = require("express").Router();
const { ensureAuthenticated } = require("../config/auth");
const settingsController = require("../controllers/SettingsController");
const postController = require('../controllers/PostController')
let fileCount=0;
const multer = require("multer");
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    fileCount++;
    cb(null, `files/postFile-${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}-${req.user._id}-${Date.now().toString()}-${fileCount}.${ext}`);
  },
});
const multerStorageDva = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    fileCount++;
    cb(null, `files/admin-file-${req.user._id}.${ext}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "jpeg" || file.mimetype.split("/")[1] === "png" || file.mimetype.split("/")[1] === "mpeg" || file.mimetype.split("/")[1] === "avi" || file.mimetype.split("/")[1] === "mp4" || file.mimetype.split("/")[1] === "mov"){
    cb(null, true);
  } else {
    cb(null,true);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
const uploadDva = multer({storage:multerStorageDva,fileFilter: multerFilter})

router.get("/", ensureAuthenticated, settingsController.getSettings);

router.get(
  "/change-avatar/",
  ensureAuthenticated,
  settingsController.getChange_avatar
);
router.post(
  "/change-avatar/",
  ensureAuthenticated,
  uploadDva.single("file"),
  settingsController.change_avatar
);




module.exports = router;
