
import React from 'react';
import { WatchIcon } from './icons/WatchIcon';
import { MusicIcon } from './icons/MusicIcon';

interface LandingPageProps {
  onSelect: (page: 'watch' | 'music') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelect }) => {
  return (
    <div className="text-center animate-fadeIn">
      <h2 className="text-4xl md:text-6xl font-extrabold mb-4">What's the vibe today?</h2>
      <p className="text-lg md:text-xl text-gray-400 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
        Instantly find the perfect movie, show, or song to match your mood. No more endless scrolling.
      </p>
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        <button
          onClick={() => onSelect('watch')}
          className="group flex-1 p-8 rounded-2xl bg-gray-800/50 hover:bg-purple-500/20 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105"
        >
          <WatchIcon className="w-16 h-16 mx-auto text-purple-400 group-hover:text-purple-300 transition-colors" />
          <span className="mt-4 block text-3xl font-bold">Watch</span>
          <span className="mt-1 block text-gray-400">Movies, Shows, Anime & More</span>
        </button>
        <button
          onClick={() => onSelect('music')}
          className="group flex-1 p-8 rounded-2xl bg-gray-800/50 hover:bg-blue-500/20 border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105"
        >
          <MusicIcon className="w-16 h-16 mx-auto text-blue-400 group-hover:text-blue-300 transition-colors" />
          <span className="mt-4 block text-3xl font-bold">Listen</span>
           <span className="mt-1 block text-gray-400">Songs, Playlists & Artists</span>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
