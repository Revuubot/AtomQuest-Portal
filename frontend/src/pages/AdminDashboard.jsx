import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Users, LayoutDashboard, Database } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const AdminDashboard = ({ user }) => {
  const [allSheets, setAllSheets] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const sheets = await api.getAllSheets();
      setAllSheets(sheets || []);
      const u = await api.getAllUsers();
      setUsers(u || []);
    };
    fetchData();
  }, [user]);

  const statusCount = allSheets.reduce((acc, sheet) => {
    acc[sheet.status] = (acc[sheet.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusCount).map(key => ({
    name: key,
    value: statusCount[key]
  }));

  const COLORS = {
    'Draft': '#E9ECEF',
    'Submitted': '#FFBE0B',
    'Approved': '#38B000',
    'Returned': '#D00000'
  };

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h2>Welcome, {user.name}</h2>
        <p style={{ color: 'var(--text-muted)' }}>Admin Dashboard - Org Wide Metrics</p>
      </div>

      <div className="dashboard-grid">
        <div className="metric-card">
          <h3><Users size={16} style={{ display: 'inline', marginRight: '5px' }}/> Total Employees</h3>
          <div className="value">{users.filter(u => u.role === 'employee').length}</div>
        </div>
        <div className="metric-card">
          <h3><Database size={16} style={{ display: 'inline', marginRight: '5px' }}/> Total Goal Sheets</h3>
          <div className="value">{allSheets.length}</div>
        </div>
      </div>

      <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '20px' }}>
        <h3 style={{ marginBottom: '20px' }}>Goal Sheet Status Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-\${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
