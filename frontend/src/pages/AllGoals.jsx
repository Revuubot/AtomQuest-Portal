import React, { useEffect, useState } from 'react';
import { api } from '../api';

const AllGoals = ({ user }) => {
  const [allSheets, setAllSheets] = useState([]);

  const loadData = async () => {
    const sheets = await api.getAllSheets();
    setAllSheets(sheets || []);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleUnlock = async (sheetId) => {
    if (window.confirm("Are you sure you want to unlock this sheet? It will be set to Returned state.")) {
      await api.updateGoalSheet(sheetId, { status: 'Returned' });
      loadData();
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h2>All Goals Overview</h2>
        <p style={{ color: 'var(--text-muted)' }}>Organization wide goal sheets.</p>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Status</th>
              <th>Weightage</th>
              <th>Score</th>
              <th>Admin Action</th>
            </tr>
          </thead>
          <tbody>
            {allSheets.map(s => (
              <tr key={s.id}>
                <td>{s.employeeName}</td>
                <td><span className={`status-badge \${s.status}`}>{s.status}</span></td>
                <td>{s.totalWeightage}%</td>
                <td>{s.overallScore}%</td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '5px 10px' }}>View</button>
                  {s.status === 'Approved' && (
                     <button className="btn btn-danger" style={{ padding: '5px 10px', marginLeft: '5px' }} onClick={() => handleUnlock(s.id)}>Unlock</button>
                  )}
                </td>
              </tr>
            ))}
            {allSheets.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No sheets found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllGoals;
