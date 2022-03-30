import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import auth from "../auth/auth.js";
import ejs from "ejs";
import db from "../helpers/hourHelpers.js";
import pdf from "html-pdf";
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get("/:id", auth.manAuth, async (req, res) => {
  const hours = await db.getHoursByUser(req.params.id);
  let total = 0;
  hours.forEach((h) => (total += h.hours));

  ejs.renderFile(path.join(__dirname, "../views/", "pdf.ejs"), { hours, total }, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      pdf.create(data).toFile("report.pdf", function (err, data) {
        if (err) {
          res.send(err);
        } else {
          res.sendFile(path.join(__dirname, "../report.pdf"));
        }
      });
    }
  });
});

export default router;
