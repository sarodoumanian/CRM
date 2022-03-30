import { pool } from "../app.js";

export default {
  createHour: (hours, date, user_id) => {
    return new Promise((resolve, reject) => {
      pool.query(`INSERT INTO employee_hours(hours, date_of_work, user_id) VALUES(?,?,?)`, [hours, date, user_id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  getHoursByLoggedInUser: (user_id) => {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM employee_hours WHERE user_id=?`, [user_id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  getTodaysHoursByLogginUser: (user_id, date) => {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM employee_hours WHERE user_id=? AND date_of_work=?`, [user_id, date], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
  },
  approveHours: (id) => {
    return new Promise((resolve, reject) => {
      pool.query(`UPDATE employee_hours SET status="approved" WHERE id=?`, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  getAllPendingHours: () => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT e.hours, e.date_of_work, u.username, e.id FROM employee_hours e 
      JOIN user u ON u.id = e.user_id WHERE status="pending"
      `,
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },
  getAllHoursByAllUser: () => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT sum(hours) as total_hours, username, user_id FROM
        (  
        SELECT e.hours,  u.username, u.id as user_id, e.status FROM employee_hours e 
                JOIN user u ON u.id = e.user_id) t WHERE status="approved" GROUP BY username`,
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },
  getHoursByUser: (user_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        ` SELECT * FROM (SELECT  e.hours, e.date_of_work, e.status, u.username, e.id, u.id as user_id FROM employee_hours e 
          JOIN user u ON u.id = e.user_id) t WHERE status="approved" AND user_id=?`,
        [user_id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },
  deleteHour: (id) => {
    return new Promise((resolve, reject) => {
      pool.query(`DELETE FROM employee_hours WHERE id=?`, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
};
