import React, { useEffect, useState } from 'react';
import { api } from '../api';

const TeamGoals = ({ user }) => {
  const [teamSheets, setTeamSheets] = useState([]);

  const loadData = async () => {
    const sheets = await api.getTeamSheets(user.id);
    setTeamSheets(sheets || []);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleAction = async (sheetId, status) => {
    await api.updateGoalSheet(sheetId, { status });
    loadData();
  };

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h2>Team Goals</h2>
        <p style={{ color: 'var(--text-muted)' }}>Review and approve goal sheets.</p>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Status</th>
              <th>Total Weightage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamSheets.map(s => (
              <tr key={s.id}>
                <td>{s.employeeName}</td>
                <td><span className={`status-badge ${s.status}`}>{s.status}</span></td>
                <td>{s.totalWeightage}%</td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '5px 10px', marginRight: '10px' }}>Review</button>
                  {s.status === 'Submitted' && (
                    <>
                      <button className="btn btn-primary" style={{ padding: '5px 10px', marginRight: '5px', background: 'var(--success)' }} onClick={() => handleAction(s.id, 'Approved')}>Approve</button>
                      <button className="btn btn-danger" style={{ padding: '5px 10px' }} onClick={() => handleAction(s.id, 'Returned')}>Return</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {teamSheets.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center' }}>No team members found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamGoals;
