
import React from 'react';
import { SunIcon, MoonIcon } from './icons/ThemeIcons';

interface HeaderProps {
  onHome: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHome, theme, toggleTheme }) => {
  return (
    <header className="py-4 px-6 shadow-md bg-white/5 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1
          className="text-2xl md:text-3xl font-bold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          onClick={onHome}
        >
          VibePick
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon className="w-6 h-6 text-purple-400" /> : <SunIcon className="w-6 h-6 text-yellow-400" />}
        </button>
      </div>
    </header>
  );
};

export default Header;

