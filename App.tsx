
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import WatchPicker from './components/WatchPicker';
import MusicPicker from './components/MusicPicker';

type Page = 'landing' | 'watch' | 'music';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('landing');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-gray-900', 'text-white');
      document.body.classList.remove('bg-gray-100', 'text-gray-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('bg-gray-100', 'text-gray-900');
      document.body.classList.remove('bg-gray-900', 'text-white');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const renderPage = () => {
    switch (page) {
      case 'watch':
        return <WatchPicker />;
      case 'music':
        return <MusicPicker />;
      case 'landing':
      default:
        return <LandingPage onSelect={setPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Header onHome={() => setPage('landing')} theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {renderPage()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
