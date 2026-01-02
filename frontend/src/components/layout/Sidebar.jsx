import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiTool,
  FiClipboard,
  FiCalendar,
  FiUsers,
  FiSettings,
  FiTrello,
  FiBarChart2,
  FiPieChart,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../config/constants';

const Sidebar = () => {
  const { user, hasRole } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard', roles: null },
    { to: '/kanban', icon: FiTrello, label: 'Kanban Board', roles: null },
    { to: '/requests', icon: FiClipboard, label: 'Requests', roles: null },
    { to: '/equipment', icon: FiTool, label: 'Equipment', roles: null },
    { to: '/calendar', icon: FiCalendar, label: 'Calendar', roles: null },
    { to: '/analytics', icon: FiPieChart, label: 'Analytics', roles: null },
    { to: '/reports', icon: FiBarChart2, label: 'Reports', roles: null },
    {
      to: '/teams',
      icon: FiUsers,
      label: 'Teams',
      roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
    },
    {
      to: '/users',
      icon: FiSettings,
      label: 'Users',
      roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || hasRole(item.roles),
  );

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-primary-400">GearGuard</h1>
        <p className="text-xs text-gray-400 mt-1">Maintenance Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm transition-colors ${isActive
                ? 'bg-primary-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
