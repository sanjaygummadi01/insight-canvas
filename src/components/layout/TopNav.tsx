import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Search, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface TopNavProps {
  onMenuClick: () => void;
  isSidebarCollapsed: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ onMenuClick, isSidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const profile = user?.profile;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header 
      className={`fixed top-0 right-0 h-16 bg-card/80 backdrop-blur-sm border-b border-border z-30 transition-all duration-300 ${
        isSidebarCollapsed ? 'left-16' : 'left-64'
      }`}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search analytics..."
              className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {profile?.avatarImage ? (
                <img 
                  src={profile.avatarImage} 
                  alt={profile.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-sm font-medium text-primary-foreground">
                  {profile?.avatar || 'U'}
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">{profile?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{profile?.role || 'Member'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-card rounded-lg border border-border shadow-lg animate-scale-in">
                <a href="/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                  View Profile
                </a>
                <a href="/settings" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                  Settings
                </a>
                <div className="border-t border-border my-2" />
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
