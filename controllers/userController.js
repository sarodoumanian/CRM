import db from "../helpers/userHelpers.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default {
  FindAllUsers: async (req, res) => {
    try {
      const users = await db.findAllUsers();
      res.status(200).json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  Signin: async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await db.findUserByUsername(username);
      if (!user) return res.json({ errMsg: "username or password is incorrect" }).status(401);
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.json({ errMsg: "username or password is incorrect" }).status(401);
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: "5h" });
      res
        .cookie("token", token, { maxAge: 5 * 60 * 60 * 1000, httpOnly: true })
        .cookie("user_id", user.id, { maxAge: 5 * 60 * 60 * 1000 })
        .status(200)
        .json({ user });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  FindUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await db.findUserById(id);
      if (!user) return res.json({ errMsg: `no user with id=${id}` });
      delete user.password;
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  CreateUser: async (req, res) => {
    const { fname, lname, username, email, password, role, gender, date_of_birth } = req.body;
    try {
      const hashed = await bcrypt.hash(password, 8);
      await db.createUser(fname, lname, username, email, hashed, role, gender, date_of_birth);
      res.status(201).json("user created");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  UpdatePicture: async (req, res) => {
    try {
      if (!req.file) return;
      await db.updatePicture(req.file.filename, req.user.id);
      res.status(200);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  Search: async (req, res) => {
    try {
      const users = await db.searchUser(req.body.search);
      res.status(200).json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  Logout: (req, res) => {
    res.clearCookie("token").clearCookie("user_id").json("logged out");
  },
  ChangePassword: async (req, res) => {
    const { id, oldPassword, newPassword, confirmPassword } = req.body;
    try {
      const user = await db.findUserById(id);
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.json({ Msg: "Old password is incorrect" });
      if (newPassword !== confirmPassword) return res.json({ Msg: "new password and confirm password should be the same" });
      const hashed = await bcrypt.hash(newPassword, 8);
      await db.updatePassword(hashed, id);
      res.status(200).json({ Msg: "password changed" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  UpdateFname: async (req, res) => {
    const { id, fname } = req.body;
    if (!fname) return;
    try {
      await db.updateFname(id, fname);
      res.status(200).json("updated");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  UpdateLname: async (req, res) => {
    const { id, lname } = req.body;
    if (!lname) return;
    try {
      await db.updateLname(id, lname);
      res.status(200).json("updated");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  UpdateUsername: async (req, res) => {
    const { id, username } = req.body;
    if (!username) return;
    try {
      await db.updateUsername(id, username);
      res.status(200).json("updated");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  UpdateEmail: async (req, res) => {
    const { id, email } = req.body;
    if (!email) return;
    try {
      await db.updateEmail(id, email);
      res.status(200).json("updated");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  UpdateRole: async (req, res) => {
    const { id, role } = req.body;
    if (!role) return;
    try {
      await db.updateRole(id, role);
      res.status(200).json("updated");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  DeleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      await db.deleteUser(id);
      res.status(200).json("user deleted");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
