const { ensureAuthenticated } = require('../config/auth')
const chatController = require('../controllers/ChatController')
const router = require('express').Router()
const multer = require("multer");
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `files/msg-${Date.now()}-${req.user._id}.${ext}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "jpeg") {
    cb(null, true);
    
  } else if (file.mimetype.split("/")[1] === "png") {
      cb(null, true);
    }  else {
    cb(new Error("Not a JPG File!!"), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});


router.get('/chat-delete/:id', ensureAuthenticated, chatController.removeChatMessages)
router.post('/send-img/:id', ensureAuthenticated, upload.single("file"), chatController.sendImage)

router.get('/new-message', ensureAuthenticated, chatController.getNewMessage)
router.get('/:roomId', ensureAuthenticated, chatController.getChatRoom)
router.get('/', ensureAuthenticated, chatController.getChatView)
router.post('/:roomId', ensureAuthenticated, chatController.postMessage)

router.get('/test/:friendId',ensureAuthenticated,chatController.getChatR)
module.exports = router