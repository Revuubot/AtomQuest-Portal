import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, Activity, Users, Settings, LogOut, FileText, Share2, FileBarChart } from 'lucide-react';
import { api } from './api';

// Components (We will define them in the same file for brevity or separate files later. Let's do separate logical components)
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import MyGoals from './pages/MyGoals';
import Achievements from './pages/Achievements';
import ManagerDashboard from './pages/ManagerDashboard';
import TeamGoals from './pages/TeamGoals';
import AdminDashboard from './pages/AdminDashboard';
import AllGoals from './pages/AllGoals';

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();

  const getLinks = () => {
    switch (user.role) {
      case 'employee':
        return [
          { path: '/employee', icon: LayoutDashboard, label: 'Dashboard' },
          { path: '/employee/goals', icon: Target, label: 'My Goals' },
          { path: '/employee/achievements', icon: Activity, label: 'Achievements' },
        ];
      case 'manager':
        return [
          { path: '/manager', icon: LayoutDashboard, label: 'Dashboard' },
          { path: '/manager/team-goals', icon: Users, label: 'Team Goals' },
          { path: '/manager/check-ins', icon: FileText, label: 'Check-ins' },
          { path: '/manager/report', icon: FileBarChart, label: 'Team Report' },
        ];
      case 'admin':
        return [
          { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
          { path: '/admin/all-goals', icon: Target, label: 'All Goals' },
          { path: '/admin/shared', icon: Share2, label: 'Shared Goals' },
          { path: '/admin/settings', icon: Settings, label: 'Cycle Config' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">AtomQuest</div>
        <div className="user-info">
          <strong>{user.name}</strong>
          <div><span className={`role-badge ${user.role}`}>{user.role.toUpperCase()}</span></div>
        </div>
      </div>
      <ul className="nav-links">
        {getLinks().map(link => {
          const Icon = link.icon;
          return (
            <li key={link.path}>
              <Link to={link.path} className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}>
                <Icon size={18} />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div style={{ padding: '20px' }}>
        <button className="btn btn-danger" style={{ width: '100%' }} onClick={onLogout}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

const PrivateRoute = ({ children, allowedRoles, user, onLogout }) => {
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} />; // Redirect to their respective dashboard
  }
  return (
    <div className="app-container">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const handleLogin = (loggedInUser) => {
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <Login onLogin={handleLogin} />} />
        
        {/* Employee Routes */}
        <Route path="/employee" element={<PrivateRoute user={user} allowedRoles={['employee']} onLogout={handleLogout}><EmployeeDashboard user={user}/></PrivateRoute>} />
        <Route path="/employee/goals" element={<PrivateRoute user={user} allowedRoles={['employee']} onLogout={handleLogout}><MyGoals user={user}/></PrivateRoute>} />
        <Route path="/employee/achievements" element={<PrivateRoute user={user} allowedRoles={['employee']} onLogout={handleLogout}><Achievements user={user}/></PrivateRoute>} />

        {/* Manager Routes */}
        <Route path="/manager" element={<PrivateRoute user={user} allowedRoles={['manager']} onLogout={handleLogout}><ManagerDashboard user={user}/></PrivateRoute>} />
        <Route path="/manager/team-goals" element={<PrivateRoute user={user} allowedRoles={['manager']} onLogout={handleLogout}><TeamGoals user={user}/></PrivateRoute>} />
        <Route path="/manager/check-ins" element={<PrivateRoute user={user} allowedRoles={['manager']} onLogout={handleLogout}><div>Check-ins (WIP)</div></PrivateRoute>} />
        <Route path="/manager/report" element={<PrivateRoute user={user} allowedRoles={['manager']} onLogout={handleLogout}><div>Team Report (WIP)</div></PrivateRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<PrivateRoute user={user} allowedRoles={['admin']} onLogout={handleLogout}><AdminDashboard user={user}/></PrivateRoute>} />
        <Route path="/admin/all-goals" element={<PrivateRoute user={user} allowedRoles={['admin']} onLogout={handleLogout}><AllGoals user={user}/></PrivateRoute>} />
        <Route path="/admin/shared" element={<PrivateRoute user={user} allowedRoles={['admin']} onLogout={handleLogout}><div>Shared Goals (WIP)</div></PrivateRoute>} />
        <Route path="/admin/settings" element={<PrivateRoute user={user} allowedRoles={['admin']} onLogout={handleLogout}><div>Cycle Config (WIP)</div></PrivateRoute>} />

        {/* Default route */}
        <Route path="/" element={<Navigate to={user ? `/${user.role}` : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
