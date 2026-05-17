import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Users, AlertCircle, FileBarChart } from 'lucide-react';

const ManagerDashboard = ({ user }) => {
  const [teamSheets, setTeamSheets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const sheets = await api.getTeamSheets(user.id);
      setTeamSheets(sheets || []);
    };
    fetchData();
  }, [user]);

  const pendingApprovals = teamSheets.filter(s => s.status === 'Submitted');

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h2>Welcome, {user.name}</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manager Dashboard</p>
      </div>

      <div className="dashboard-grid">
        <div className="metric-card">
          <h3><Users size={16} style={{ display: 'inline', marginRight: '5px' }}/> Team Size</h3>
          <div className="value">{teamSheets.length}</div>
        </div>
        <div className="metric-card">
          <h3><AlertCircle size={16} style={{ display: 'inline', marginRight: '5px' }}/> Pending Approvals</h3>
          <div className="value" style={{ color: pendingApprovals.length > 0 ? 'var(--warning)' : 'inherit' }}>
            {pendingApprovals.length}
          </div>
        </div>
        <div className="metric-card">
          <h3><FileBarChart size={16} style={{ display: 'inline', marginRight: '5px' }}/> Average Team Score</h3>
          <div className="value">
            {teamSheets.length ? (teamSheets.reduce((a, b) => a + b.overallScore, 0) / teamSheets.length).toFixed(1) : 0}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
