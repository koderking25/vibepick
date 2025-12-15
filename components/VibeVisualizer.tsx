
import React from 'react';

interface VibeVisualizerProps {
  mood: string[] | null;
}

const MOOD_COLORS: { [key: string]: string[] } = {
  hype: ['from-red-500', 'to-yellow-500'],
  chill: ['from-blue-500', 'to-green-500'],
  sad: ['from-indigo-700', 'to-gray-800'],
  study: ['from-purple-600', 'to-blue-400'],
  gym: ['from-orange-500', 'to-red-600'],
  nostalgic: ['from-pink-500', 'to-purple-500'],
  romantic: ['from-rose-500', 'to-red-500'],
  '80s/90s/00s': ['from-teal-400', 'to-fuchsia-500'],
  default: ['from-gray-700', 'to-gray-800']
};

const VibeVisualizer: React.FC<VibeVisualizerProps> = ({ mood }) => {
  // Use the first selected mood to determine the theme, or default
  const primaryMood = mood && mood.length > 0 ? mood[0] : null;
  const moodKey = primaryMood ? Object.keys(MOOD_COLORS).find(key => primaryMood.toLowerCase().includes(key)) || 'default' : 'default';
  const [fromColor, toColor] = MOOD_COLORS[moodKey];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 blur-3xl opacity-30 dark:opacity-20">
      <div className={`absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br ${fromColor} rounded-full animate-float`}></div>
      <div className={`absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br ${toColor} rounded-full animate-float animation-delay-3000`}></div>
    </div>
  );
};

export default VibeVisualizer;
