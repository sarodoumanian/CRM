import { pool } from "../app.js";
import { v4 } from "uuid";

export default {
  findAllUsers: () => {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT id, fname, lname, username, email, role, gender, date_of_birth, profile_picture, joined_at FROM user ORDER BY joined_at`, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  findUserByUsername: (username) => {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM user WHERE username=?`, [username], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
  },
  findUserById: (id) => {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM user WHERE id=?`, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
  },
  createUser: (fname, lname, username, email, password, role, gender, date_of_birth) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO user(id, fname, lname, username, email, password, role, gender, date_of_birth)
      VALUES(?,?,?,?,?,?,?,?,?)`,
        [v4(), fname, lname, username, email, password, role, gender, date_of_birth],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },
  updatePicture: (path, id) => {
    return new Promise((resolve, reject) => {
      pool.query(`UPDATE user SET profile_picture=? WHERE id=?`, [path, id], (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  },
  searchUser: (txt) => {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM user WHERE fname Like ? OR lname LIKE ? OR username LIKE ? OR email LIKE ?`, [`${txt}%`, `${txt}%`, `${txt}%`, `${txt}%`], (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  },
  updatePassword: (hashed, id) => {
    return new Promise((resolve, reject) => {
      pool.query(`UPDATE user SET password=? WHERE id=?`, [hashed, id], (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  },
  updateFname: (id, fname) => {
    return new Promise((resolve, reject) => {
      pool.query(`UPDATE user SET fname=? WHERE id=?`, [fname, id], (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  },
  updateLname: (id, lname) => {
    return new Promise((resolve, reject) => {
      pool.query(`UPDATE user SET lname=? WHERE id=?`, [lname, id], (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  },
  updateUsername: (id, username) => {
    return new Promise((resolve, reject) => {
      pool.query(`UPDATE user SET username=? WHERE id=?`, [username, id], (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  },
  updateEmail: (id, email) => {
    return new Promise((resolve, reject) => {
      pool.query(`UPDATE user SET email=? WHERE id=?`, [email, id], (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  },
  updateRole: (id, role) => {
    return new Promise((resolve, reject) => {
      pool.query(`UPDATE user SET role=? WHERE id=?`, [role, id], (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  },
  deleteUser: (id) => {
    return new Promise((resolve, reject) => {
      pool.query(`DELETE FROM user WHERE id=?`, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
};
