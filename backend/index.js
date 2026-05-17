const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AtomQuest API is running' });
});

// Authentication Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  // Simplified for hackathon: check if user exists (ignoring password hash for mock setup)
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      // Generate dummy token
      res.json({
        token: 'mock-jwt-token-' + user.id,
        user: { id: user.id, name: user.name, role: user.role, email: user.email }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all goals for an employee
app.get('/api/goals', async (req, res) => {
  try {
    const { employeeId } = req.query;
    let query = 'SELECT * FROM goals';
    let params = [];
    
    if (employeeId) {
      query = `
        SELECT g.*, gs.status 
        FROM goals g 
        JOIN goal_sheets gs ON g.goal_sheet_id = gs.id 
        WHERE gs.employee_id = $1
      `;
      params.push(employeeId);
    }
    
    const result = await db.query(query, params);
    res.json(result.rows.map(g => ({
      id: g.id, goalSheetId: g.goal_sheet_id, title: g.title, description: g.description,
      uomType: g.uom_type, targetValue: g.target_value, targetDate: g.target_date, weightage: g.weightage,
      status: g.status
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a goal
app.post('/api/goals', async (req, res) => {
  try {
    const { goalSheetId, title, description, uomType, targetValue, targetDate, weightage } = req.body;
    const result = await db.query(
      'INSERT INTO goals (goal_sheet_id, title, description, uom_type, target_value, target_date, weightage) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [goalSheetId, title, description, uomType, targetValue, targetDate, weightage]
    );
    const g = result.rows[0];
    res.status(201).json({
      id: g.id, goalSheetId: g.goal_sheet_id, title: g.title, description: g.description,
      uomType: g.uom_type, targetValue: g.target_value, targetDate: g.target_date, weightage: g.weightage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a goal
app.put('/api/goals/:id', async (req, res) => {
  try {
    const { title, description, uomType, targetValue, targetDate, weightage } = req.body;
    const result = await db.query(
      'UPDATE goals SET title = COALESCE($1, title), description = COALESCE($2, description), uom_type = COALESCE($3, uom_type), target_value = COALESCE($4, target_value), target_date = COALESCE($5, target_date), weightage = COALESCE($6, weightage), updated_at = NOW() WHERE id = $7 RETURNING *',
      [title, description, uomType, targetValue, targetDate, weightage, req.params.id]
    );
    const g = result.rows[0];
    res.json({
      id: g.id, goalSheetId: g.goal_sheet_id, title: g.title, description: g.description,
      uomType: g.uom_type, targetValue: g.target_value, targetDate: g.target_date, weightage: g.weightage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a goal
app.delete('/api/goals/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM goals WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single goal sheet or create if it doesn't exist
app.get('/api/goal-sheets', async (req, res) => {
  try {
    const { employeeId } = req.query;
    if (!employeeId) return res.status(400).json({ error: 'employeeId required' });
    
    let result = await db.query('SELECT * FROM goal_sheets WHERE employee_id = $1', [employeeId]);
    if (result.rows.length === 0) {
      const cycleResult = await db.query('SELECT id FROM cycles LIMIT 1');
      const cycleId = cycleResult.rows.length > 0 ? cycleResult.rows[0].id : null;
      if (cycleId) {
        result = await db.query(
          'INSERT INTO goal_sheets (employee_id, cycle_id, status) VALUES ($1, $2, $3) RETURNING *',
          [employeeId, cycleId, 'Draft']
        );
      }
    }
    
    if (result.rows.length > 0) {
        const row = result.rows[0];
        res.json({
            id: row.id, employeeId: row.employee_id, cycleId: row.cycle_id,
            status: row.status, totalWeightage: row.total_weightage, overallScore: row.overall_score
        });
    } else {
        res.status(404).json({ error: 'Not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update goal sheet
app.put('/api/goal-sheets/:id', async (req, res) => {
  try {
    const { status, totalWeightage, overallScore } = req.body;
    const result = await db.query(
      'UPDATE goal_sheets SET status = COALESCE($1, status), total_weightage = COALESCE($2, total_weightage), overall_score = COALESCE($3, overall_score), updated_at = NOW() WHERE id = $4 RETURNING *',
      [status, totalWeightage, overallScore, req.params.id]
    );
    const row = result.rows[0];
    res.json({
      id: row.id, employeeId: row.employee_id, cycleId: row.cycle_id,
      status: row.status, totalWeightage: row.total_weightage, overallScore: row.overall_score
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get team sheets
app.get('/api/goal-sheets/team', async (req, res) => {
  try {
    const { managerId } = req.query;
    const result = await db.query(`
      SELECT gs.*, u.name as employee_name
      FROM goal_sheets gs
      JOIN users u ON gs.employee_id = u.id
      WHERE u.manager_id = $1
    `, [managerId]);
    res.json(result.rows.map(r => ({
        id: r.id, employeeId: r.employee_id, employeeName: r.employee_name,
        cycleId: r.cycle_id, status: r.status, totalWeightage: r.total_weightage, overallScore: r.overall_score
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all sheets (Admin)
app.get('/api/goal-sheets/all', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT gs.*, u.name as employee_name
      FROM goal_sheets gs
      JOIN users u ON gs.employee_id = u.id
    `);
    res.json(result.rows.map(r => ({
        id: r.id, employeeId: r.employee_id, employeeName: r.employee_name,
        cycleId: r.cycle_id, status: r.status, totalWeightage: r.total_weightage, overallScore: r.overall_score
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get users
app.get('/api/users', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users');
    res.json(result.rows.map(u => ({
        id: u.id, name: u.name, email: u.email, role: u.role,
        department: u.department, managerId: u.manager_id
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
