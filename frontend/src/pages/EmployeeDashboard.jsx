import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Target, Activity, CheckCircle, Clock } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const EmployeeDashboard = ({ user }) => {
  const [sheet, setSheet] = useState(null);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const gs = await api.getGoalSheet(user.id);
      setSheet(gs);
      const g = await api.getGoalsByEmployee(user.id);
      setGoals(g);
    };
    fetchData();
  }, [user]);

  if (!sheet) return <div>Loading...</div>;

  const chartData = goals.map(g => ({
    name: g.title.substring(0, 10) + '...',
    weight: g.weightage
  }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Welcome, {user.name}</h2>
        <span className={`status-badge ${sheet.status}`}>Sheet Status: {sheet.status}</span>
      </div>

      <div className="dashboard-grid">
        <div className="metric-card">
          <h3><Target size={16} style={{ display: 'inline', marginRight: '5px' }}/> Total Goals</h3>
          <div className="value">{goals.length}</div>
        </div>
        <div className="metric-card">
          <h3><CheckCircle size={16} style={{ display: 'inline', marginRight: '5px' }}/> Total Weightage</h3>
          <div className="value" style={{ color: sheet.totalWeightage === 100 ? 'var(--success)' : 'inherit' }}>
            {sheet.totalWeightage}%
          </div>
        </div>
        <div className="metric-card">
          <h3><Activity size={16} style={{ display: 'inline', marginRight: '5px' }}/> Overall Score</h3>
          <div className="value">{sheet.overallScore}%</div>
        </div>
        <div className="metric-card">
          <h3><Clock size={16} style={{ display: 'inline', marginRight: '5px' }}/> Active Window</h3>
          <div className="value">Goal Setting</div>
        </div>
      </div>

      <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '20px' }}>
        <h3 style={{ marginBottom: '20px' }}>Goal Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="weight" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
