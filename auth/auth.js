import jwt from "jsonwebtoken";
import db from "../helpers/userHelpers.js";

export default {
  empAuth: async (req, res, next) => {
    const token = req.cookies.token;
    console.log("JWT token: " + req.cookies.token);
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decoded) {
        const user = await db.findUserById(decoded.id);
        req.user = user;
      } else {
        res.json("token expired");
      }
    } catch (err) {
      console.log(err);
    }

    return next();
  },
  manAuth: async (req, res, next) => {
    const token = req.cookies.token;
    console.log("JWT token: " + req.cookies.token);
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decoded) {
        const user = await db.findUserById(decoded.id);
        req.user = user;
      } else {
        res.json("token expired");
      }
    } catch (err) {
      console.log(err);
    }
    if (req.user.role === "manager") return next();
    else res.json("only managers can access this route");
  },
};
