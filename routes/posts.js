const express = require("express");
const User = require("../models/User");
const router = express.Router();
const commentController = require("../controllers/CommentController");
const { ensureAuthenticated } = require("../config/auth");
const postController = require("../controllers/PostController");
let fileCount = 0;
const multer = require("multer");
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    fileCount++;
    cb(
      null,
      `files/postFile-${Math.floor(Math.random() * 10)}${Math.floor(
        Math.random() * 10
      )}${Math.floor(Math.random() * 10)}-${
        req.user._id
      }-${Date.now().toString()}-${fileCount}.${ext}`
    );
  },
});
const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.split("/")[1] === "jpeg" ||
    file.mimetype.split("/")[1] === "png" ||
    file.mimetype.split("/")[1] === "mpeg" ||
    file.mimetype.split("/")[1] === "avi" ||
    file.mimetype.split("/")[1] === "mp4" ||
    file.mimetype.split("/")[1] === "mov"
  ) {
    cb(null, true);
  } else {
    cb(null, true);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

router.get("/add-post", ensureAuthenticated, postController.getAddPost);

router.post(
  "/add-post",
  ensureAuthenticated,
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "files", maxCount: 8 },
  ]),
  postController.addPost
);
router.post(
  "/add-comment/:postId",
  ensureAuthenticated,
  commentController.postComment
);

router.get('/:postId', postController.getPost)

router.get('/add-like/:postId', ensureAuthenticated , postController.addLike);

module.exports = router;
