import { hourHelpers as db } from "../helpers/index.js";

export default {
  CreateHour: async (req, res) => {
    const { hours } = req.body;
    const curDate = new Date().toISOString().split("T")[0];

    try {
      const loggedHours = await db.getTodaysHoursByLogginUser(req.user.id, curDate);
      if (loggedHours) return res.json({ errMsg: "you have already logged your hours for today" });
      await db.createHour(hours, curDate, req.user.id);
      const createdHour = await db.getTodaysHoursByLogginUser(req.user.id, curDate);
      res.status(201).json(createdHour);
    } catch (err) {
      console.log(err);
      res.status(200).json(err);
    }
  },
  GetAllHoursByLoggedinUser: async (req, res) => {
    try {
      const hours = await db.getHoursByLoggedInUser(req.user.id);
      res.status(200).json(hours);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  ApproveLoggedHours: async (req, res) => {
    const { id } = req.body;
    try {
      await db.approveHours(id);
      const pendingHours = await db.getAllPendingHours();
      res.status(200).json(pendingHours);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  GetPendingHours: async (req, res) => {
    try {
      const pendingHours = await db.getAllPendingHours();
      res.status(200).json(pendingHours);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  GetAllHoursByAllUser: async (req, res) => {
    try {
      const hours = await db.getAllHoursByAllUser();
      res.status(200).json(hours);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  GetAllHoursByUser: async (req, res) => {
    const { id } = req.params;
    try {
      const hours = await db.getHoursByUser(id);
      res.status(200).json(hours);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  DeleteHour: async (req, res) => {
    const { id } = req.params;
    try {
      await db.deleteHour(id);
      res.status(200).json({ msg: "deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
