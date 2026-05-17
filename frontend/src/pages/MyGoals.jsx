import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Plus, Edit, Trash2, Send } from 'lucide-react';

const MyGoals = ({ user }) => {
  const [sheet, setSheet] = useState(null);
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({ title: '', uomType: 'Numeric Higher Better', targetValue: '', weightage: 10 });

  const loadData = async () => {
    const gs = await api.getGoalSheet(user.id);
    setSheet(gs);
    const g = await api.getGoalsByEmployee(user.id);
    setGoals(g);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const totalWeight = goals.reduce((acc, g) => acc + Number(g.weightage), 0);
  const canEdit = sheet?.status === 'Draft' || sheet?.status === 'Returned';

  const handleSave = async (e) => {
    e.preventDefault();
    if (goals.length >= 8 && !editingGoal) {
      alert("Max 8 goals allowed.");
      return;
    }
    await api.saveGoal({ ...formData, goalSheetId: sheet.id, id: editingGoal?.id });
    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this goal?")) {
      await api.deleteGoal(id);
      loadData();
    }
  };

  const handleSubmitSheet = async () => {
    if (totalWeight !== 100) {
      alert("Total weightage must be exactly 100%");
      return;
    }
    await api.updateGoalSheet(sheet.id, { status: 'Submitted', totalWeightage: totalWeight });
    loadData();
  };

  const openModal = (goal = null) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({ title: goal.title, uomType: goal.uomType, targetValue: goal.targetValue || '', weightage: goal.weightage });
    } else {
      setEditingGoal(null);
      setFormData({ title: '', uomType: 'Numeric Higher Better', targetValue: '', weightage: 10 });
    }
    setShowModal(true);
  };

  if (!sheet) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>My Goals</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>Total Weight: <strong style={{ color: totalWeight === 100 ? 'var(--success)' : 'var(--danger)' }}>{totalWeight}%</strong></span>
          {canEdit && <button className="btn btn-primary" onClick={() => openModal()}><Plus size={16}/> Add Goal</button>}
          {canEdit && <button className="btn btn-secondary" onClick={handleSubmitSheet}><Send size={16}/> Submit Sheet</button>}
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Target</th>
              <th>Weightage</th>
              {canEdit && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {goals.map(g => (
              <tr key={g.id}>
                <td>{g.title}</td>
                <td>{g.uomType}</td>
                <td>{g.uomType === 'Timeline' ? g.targetDate : g.targetValue}</td>
                <td>{g.weightage}%</td>
                {canEdit && (
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '5px', marginRight: '5px' }} onClick={() => openModal(g)}><Edit size={14}/></button>
                    <button className="btn btn-danger" style={{ padding: '5px' }} onClick={() => handleDelete(g.id)}><Trash2 size={14}/></button>
                  </td>
                )}
              </tr>
            ))}
            {goals.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No goals added yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingGoal ? 'Edit Goal' : 'Add Goal'}</h3>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="form-control" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>UoM Type</label>
                <select className="form-control" value={formData.uomType} onChange={e => setFormData({...formData, uomType: e.target.value})}>
                  <option value="Numeric Higher Better">Numeric Higher Better</option>
                  <option value="Numeric Lower Better">Numeric Lower Better</option>
                  <option value="Timeline">Timeline</option>
                  <option value="Zero-based">Zero-based</option>
                </select>
              </div>
              <div className="form-group">
                <label>Target</label>
                {formData.uomType === 'Timeline' ? (
                  <input type="date" className="form-control" required value={formData.targetValue} onChange={e => setFormData({...formData, targetValue: e.target.value})} />
                ) : (
                  <input type="number" className="form-control" required value={formData.targetValue} onChange={e => setFormData({...formData, targetValue: e.target.value})} />
                )}
              </div>
              <div className="form-group">
                <label>Weightage (%)</label>
                <input type="number" min="10" className="form-control" required value={formData.weightage} onChange={e => setFormData({...formData, weightage: Number(e.target.value)})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Goal</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGoals;
