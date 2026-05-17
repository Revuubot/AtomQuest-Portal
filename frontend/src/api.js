// Mock Data for AtomQuest Hackathon 1.0

// Users
export const users = [
  { id: '1', name: 'Aryan Sharma', role: 'employee', department: 'Engineering', managerId: '5' },
  { id: '2', name: 'Priya Nair', role: 'employee', department: 'Engineering', managerId: '5' },
  { id: '3', name: 'Rohan Mehta', role: 'employee', department: 'Sales', managerId: '6' },
  { id: '4', name: 'Sneha Iyer', role: 'employee', department: 'Sales', managerId: '6' },
  { id: '5', name: 'Kavya Reddy', role: 'manager', department: 'Engineering' },
  { id: '6', name: 'Vikram Joshi', role: 'manager', department: 'Sales' },
  { id: '7', name: 'Divya Pillai', role: 'admin', department: 'HR' }
];

export const cycles = [
  { id: '1', name: 'AtomQuest Hackathon 1.0', activeWindow: 'Goal Setting', isActive: true }
];

export let goalSheets = [
  { id: 'sheet1', employeeId: '1', cycleId: '1', status: 'Draft', totalWeightage: 60, overallScore: 0 },
  { id: 'sheet2', employeeId: '2', cycleId: '1', status: 'Submitted', totalWeightage: 100, overallScore: 0 },
  { id: 'sheet3', employeeId: '3', cycleId: '1', status: 'Approved', totalWeightage: 100, overallScore: 85.5 }
];

export let goals = [
  { id: 'g1', goalSheetId: 'sheet1', title: 'Complete Backend API', uomType: 'Numeric Higher Better', targetValue: 100, weightage: 30 },
  { id: 'g2', goalSheetId: 'sheet1', title: 'Write Tests', uomType: 'Numeric Higher Better', targetValue: 50, weightage: 30 },
  { id: 'g3', goalSheetId: 'sheet2', title: 'Design Figma', uomType: 'Timeline', targetDate: '2026-06-01', weightage: 50 },
  { id: 'g4', goalSheetId: 'sheet2', title: 'Frontend Build', uomType: 'Numeric Higher Better', targetValue: 100, weightage: 50 },
  { id: 'g5', goalSheetId: 'sheet3', title: 'Close Q1 Deals', uomType: 'Numeric Higher Better', targetValue: 50000, weightage: 60 },
  { id: 'g6', goalSheetId: 'sheet3', title: 'Zero escalations', uomType: 'Zero-based', targetValue: 0, weightage: 40 }
];

export let goalProgress = [
  { id: 'gp1', goalId: 'g5', quarter: 'Q1', actualValue: 45000, employeeComment: 'Almost there', managerComment: 'Good job', calculatedScore: 90 },
  { id: 'gp2', goalId: 'g6', quarter: 'Q1', actualValue: 0, employeeComment: 'No escalations', managerComment: 'Perfect', calculatedScore: 100 }
];

export let auditLogs = [];

const USE_MOCK = false;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- API Service Wrapper ---
export const api = {
  login: async (email, password) => {
    if (USE_MOCK) {
      const user = users.find(u => u.name.toLowerCase().replace(' ', '') + '@atomberg.com' === email || u.name === email);
      if (user) {
        return { token: 'mock-token', user };
      }
      throw new Error('Invalid credentials');
    }
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  getGoalsByEmployee: async (employeeId) => {
    if (USE_MOCK) {
      const sheet = goalSheets.find(s => s.employeeId === employeeId);
      if (!sheet) return [];
      return goals.filter(g => g.goalSheetId === sheet.id);
    }
    const res = await fetch(`${API_URL}/goals?employeeId=${employeeId}`);
    return res.json();
  },

  getGoalSheet: async (employeeId) => {
    if (USE_MOCK) {
      let sheet = goalSheets.find(s => s.employeeId === employeeId);
      if (!sheet) {
        sheet = { id: `new-sheet-${employeeId}`, employeeId, cycleId: '1', status: 'Draft', totalWeightage: 0, overallScore: 0 };
        goalSheets.push(sheet);
      }
      return sheet;
    }
    const res = await fetch(`${API_URL}/goal-sheets?employeeId=${employeeId}`);
    return res.json();
  },

  updateGoalSheet: async (sheetId, updates) => {
    if (USE_MOCK) {
      goalSheets = goalSheets.map(s => s.id === sheetId ? { ...s, ...updates } : s);
      return goalSheets.find(s => s.id === sheetId);
    }
    const res = await fetch(`${API_URL}/goal-sheets/${sheetId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  saveGoal: async (goalData) => {
    if (USE_MOCK) {
      if (goalData.id) {
        goals = goals.map(g => g.id === goalData.id ? { ...g, ...goalData } : g);
      } else {
        const newGoal = { ...goalData, id: `g${Date.now()}` };
        goals.push(newGoal);
      }
      return true;
    }
    const method = goalData.id ? 'PUT' : 'POST';
    const url = goalData.id ? `${API_URL}/goals/${goalData.id}` : `${API_URL}/goals`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalData)
    });
    return res.json();
  },

  deleteGoal: async (goalId) => {
    if (USE_MOCK) {
      goals = goals.filter(g => g.id !== goalId);
      return true;
    }
    const res = await fetch(`${API_URL}/goals/${goalId}`, { method: 'DELETE' });
    return res.json();
  },
  
  getTeamSheets: async (managerId) => {
    if (USE_MOCK) {
      const teamIds = users.filter(u => u.managerId === managerId).map(u => u.id);
      return goalSheets.filter(s => teamIds.includes(s.employeeId)).map(s => {
        const emp = users.find(u => u.id === s.employeeId);
        return { ...s, employeeName: emp.name };
      });
    }
    const res = await fetch(`${API_URL}/goal-sheets/team?managerId=${managerId}`);
    return res.json();
  },

  getAllUsers: async () => {
    if (USE_MOCK) return users;
    const res = await fetch(`${API_URL}/users`);
    return res.json();
  },
  
  getAllSheets: async () => {
    if (USE_MOCK) {
       return goalSheets.map(s => {
        const emp = users.find(u => u.id === s.employeeId);
        return { ...s, employeeName: emp.name };
      });
    }
    const res = await fetch(`${API_URL}/goal-sheets/all`);
    return res.json();
  }
};
