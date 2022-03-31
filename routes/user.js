import express from "express";
const router = express.Router();
import multer from "multer";
import { userController } from "../controllers/index.js";
import auth from "../auth/auth.js";

const multerConfig = {
  storage: multer.diskStorage({
    //Setup where the user's file will go
    destination: function (req, file, next) {
      next(null, "public/uploads/");
    },

    //Then give the file a unique name
    filename: function (req, file, next) {
      //console.log(file);
      const ext = file.mimetype.split("/")[1];
      next(null, +Date.now() + "." + file.originalname);
    },
  }),

  //A means of ensuring only images are uploaded.
  fileFilter: function (req, file, next) {
    if (!file) {
      next();
    }
    const image = file.mimetype.startsWith("image/");
    if (image) {
      console.log("photo uploaded");
      next(null, true);
    } else {
      console.log("file not supported");

      return next();
    }
  },
};

router.get("/", auth.manAuth, userController.FindAllUsers);

router.post("/signin", userController.Signin);

router.post("/", userController.CreateUser);

router.get("/logout", auth.empAuth, userController.Logout);

router.get("/:id", auth.empAuth, userController.FindUserById);

router.post("/search", auth.manAuth, userController.Search);

router.post("/uploadPic", auth.empAuth, multer(multerConfig).single("photo"), userController.UpdatePicture);

router.patch("/changePassword", auth.empAuth, userController.ChangePassword);

router.patch("/fname", auth.manAuth, userController.UpdateFname);

router.patch("/lname", auth.manAuth, userController.UpdateLname);

router.patch("/username", auth.manAuth, userController.UpdateUsername);

router.patch("/email", auth.manAuth, userController.UpdateEmail);

router.patch("/role", auth.manAuth, userController.UpdateRole);

router.delete("/:id", auth.manAuth, userController.DeleteUser);

export default router;
