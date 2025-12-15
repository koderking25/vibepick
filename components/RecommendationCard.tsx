
import React from 'react';
import { WatchRecommendation, MusicRecommendation } from '../types';
import Button from './Button';
import { ShareIcon } from './icons/ShareIcon';
import { PlatformIcons } from './icons/PlatformIcons';

type RecommendationCardProps = {
  recommendation: WatchRecommendation | MusicRecommendation;
  type: 'watch' | 'music';
  onAnother: () => void;
};

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, type, onAnother }) => {
  const { primary, backups } = recommendation;
  
  const handleShare = () => {
    const textToShare = type === 'watch'
        ? `VibePick recommended I watch "${(primary as WatchRecommendation['primary']).title}". Check it out!`
        : `VibePick recommended I listen to "${(primary as MusicRecommendation['primary']).title}" by ${(primary as MusicRecommendation['primary']).artist}". What a vibe!`;

    if (navigator.share) {
        navigator.share({
            title: 'VibePick Recommendation',
            text: textToShare,
            url: window.location.href,
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(textToShare).then(() => {
            alert('Recommendation copied to clipboard!');
        });
    }
  };

  const renderWatchCard = (rec: WatchRecommendation['primary']) => (
    <>
      <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{rec.title}</h2>
      <div className="text-sm text-gray-400 mt-2 mb-4">
        <span>{rec.year}</span> &bull; <span>{rec.runtime}</span>
      </div>
      <p className="text-purple-300 italic mb-4">"{rec.moodMatch}"</p>
      <p className="text-gray-300 mb-6">{rec.description}</p>
      {rec.trailerUrl && (
        <a href={rec.trailerUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
          Watch Trailer
        </a>
      )}
    </>
  );

  const renderMusicCard = (rec: MusicRecommendation['primary']) => (
    <>
      <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">{rec.title}</h2>
      <p className="text-xl text-gray-300 mt-1 mb-4">{rec.artist}</p>
      <p className="text-blue-300 italic mb-4">"{rec.moodMatch}"</p>
      <p className="text-gray-400 mb-6">{rec.vibe}</p>
      <div className="flex flex-wrap gap-3 justify-center">
        {Object.entries(rec.links).map(([platform, link]) => {
          if (!link) return null;
          const Icon = PlatformIcons[platform as keyof typeof PlatformIcons];
          return (
            <a key={platform} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                {Icon && <Icon className="w-5 h-5" />} Open on {platform.charAt(0).toUpperCase() + platform.slice(1).replace('Music', ' Music')}
            </a>
          )
        })}
      </div>
    </>
  );

  return (
    <div className="text-center animate-fadeIn">
      <div className="bg-gray-900/50 p-6 md:p-8 rounded-2xl border border-gray-700 shadow-xl mb-6 relative">
        <button onClick={handleShare} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors" aria-label="Share recommendation">
            <ShareIcon className="w-6 h-6" />
        </button>
        {type === 'watch' ? renderWatchCard(primary as WatchRecommendation['primary']) : renderMusicCard(primary as MusicRecommendation['primary'])}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {backups.map((backup, index) => (
          <div key={index} className="bg-gray-800/70 p-4 rounded-lg border border-gray-700/50 animate-fadeIn" style={{ animationDelay: `${100 * (index + 1)}ms`}}>
            <h4 className="font-bold text-gray-200">{backup.title}</h4>
            <p className="text-sm text-gray-400">
              {type === 'watch' ? (backup as WatchRecommendation['backups'][0]).year : (backup as MusicRecommendation['backups'][0]).artist}
            </p>
          </div>
        ))}
      </div>

      <Button onClick={onAnother} size="lg" className="w-full sm:w-auto">
        Show Me Another
      </Button>
    </div>
  );
};

export default RecommendationCard;
