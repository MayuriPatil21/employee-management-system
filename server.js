
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Employee Management System API is running!");
});

// View all employees
app.get("/api/employees", (req, res) => {
    db.query("SELECT * FROM employees", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Add employee

app.post("/api/employees", (req, res) => {
    const { name, email, department, role, salary, joining_date } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            error: "Name and email are required"
        });
    }

    const sql = `INSERT INTO employees
        (name, email, department, role, salary, joining_date)
        VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(
        sql,
        [
            name,
            email,
            department || null,
            role || null,
            salary ?? null,
            joining_date || null
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: "Employee added successfully",
                id: result.insertId
            });
        }
    );
});


// Update employee
app.put("/api/employees/:id", (req, res) => {
    const { name, email, department, role, salary, joining_date } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            error: "Name and email are required"
        });
    }

    const sql = `UPDATE employees
        SET name = ?, email = ?, department = ?,
            role = ?, salary = ?, joining_date = ?
        WHERE id = ?`;

    db.query(
        sql,
        [
            name,
            email,
            department || null,
            role || null,
            salary ?? null,
            joining_date || null,
            req.params.id
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Employee not found"
                });
            }

            res.json({ message: "Employee updated successfully" });
        }
    );
});

// Delete employee
app.delete("/api/employees/:id", (req, res) => {
    db.query(
        "DELETE FROM employees WHERE id = ?",
        [req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Employee not found" });
            }
            res.json({ message: "Employee deleted successfully" });
        }
    );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
