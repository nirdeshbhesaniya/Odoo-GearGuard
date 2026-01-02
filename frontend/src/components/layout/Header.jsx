import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services';

const Header = () => {
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome back, {user?.name?.split(' ')[0] || user?.name || 'User'}!
          </h2>
          <p className="text-sm text-gray-500">
            Here's what's happening with your maintenance today
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiBell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-500 transition-colors"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white border-2 border-transparent group-hover:border-blue-400 transition-all shadow-sm">
                  <span className="text-sm font-semibold">
                    {user?.name ? (
                      user.name.split(' ').length > 1
                        ? `${user.name.split(' ')[0][0]}${user.name.split(' ')[1][0]}`.toUpperCase()
                        : user.name[0].toUpperCase()
                    ) : 'U'}
                  </span>
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'Member'}</p>
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fadeIn">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onClick={() => setShowProfile(false)}
                >
                  <FiUser className="w-4 h-4 mr-3" />
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    setShowProfile(false);
                    logout();
                  }}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
