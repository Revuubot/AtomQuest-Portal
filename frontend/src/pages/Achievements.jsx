import React, { useEffect, useState } from 'react';
import { api } from '../api';

const Achievements = ({ user }) => {
  const [goals, setGoals] = useState([]);
  const [sheet, setSheet] = useState(null);

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

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h2>Achievements Logging (Q1)</h2>
        <p style={{ color: 'var(--text-muted)' }}>Log your actuals. Goals must be Approved by Manager to log achievements.</p>
      </div>

      {sheet.status !== 'Approved' ? (
        <div style={{ background: '#FFF3CD', color: '#856404', padding: '15px', borderRadius: '6px' }}>
          Your goal sheet is currently in <strong>{sheet.status}</strong> status. It needs to be Approved to log achievements.
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Goal Title</th>
                <th>Target</th>
                <th>Actual (Q1)</th>
                <th>Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {goals.map(g => (
                <tr key={g.id}>
                  <td>{g.title}</td>
                  <td>{g.targetValue}</td>
                  <td><input type="number" className="form-control" style={{ width: '100px' }} placeholder="Value" /></td>
                  <td>-</td>
                  <td><button className="btn btn-secondary">Save</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Achievements;
