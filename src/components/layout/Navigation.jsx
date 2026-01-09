import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, TrendingUp, BookOpen, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Today' },
  { to: '/plan', icon: Calendar, label: 'Plan' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/library', icon: BookOpen, label: 'Library' },
  { to: '/profile', icon: User, label: 'Profile' }
];

export function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center
              w-16 h-full
              transition-colors duration-200
              ${isActive
                ? 'text-teal-400'
                : 'text-gray-400 hover:text-gray-600'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={24}
                  className={isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}
                />
                <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;
