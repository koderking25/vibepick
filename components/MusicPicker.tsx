
import React, { useState, useCallback, useEffect } from 'react';
import { MusicRecommendation } from '../types';
import { getMusicRecommendation } from '../services/geminiService';
import { MUSIC_MOODS, MUSIC_PLATFORMS, MUSIC_TEMPOS } from '../constants';
import Button from './Button';
import RecommendationCard from './RecommendationCard';
import VibeVisualizer from './VibeVisualizer';
import Spinner from './Spinner';

const useSessionState = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [state, setState] = useState<T>(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    useEffect(() => {
        window.sessionStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
};

const MusicPicker: React.FC = () => {
    const [mood, setMood] = useSessionState<string[]>('music_mood', []);
    const [platform, setPlatform] = useSessionState<string[]>('music_platform', []);
    const [tempo, setTempo] = useSessionState<string[]>('music_tempo', []);
    const [nostalgiaMode, setNostalgiaMode] = useSessionState<boolean>('music_nostalgia', false);
    
    const [recommendation, setRecommendation] = useState<MusicRecommendation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      // Logic to auto-enable nostalgia based on mood keywords
      const flatMood = mood.join(' ').toLowerCase();
      if (flatMood.includes('nostalgic') || flatMood.includes('80s')) {
        setNostalgiaMode(true);
      }
    }, [mood, setNostalgiaMode]);

    const toggleSelection = (item: string, currentList: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev =>
            prev.includes(item) ? prev.filter(p => p !== item) : [...prev, item]
        );
    };

    const fetchRecommendation = useCallback(async (isRandom = false) => {
        if (!isRandom && (mood.length === 0 || platform.length === 0 || tempo.length === 0)) {
            setError("Please select at least one mood, platform, and tempo.");
            return;
        }
        setError(null);
        setLoading(true);
        setRecommendation(null);
        setVisible(false);

        try {
            const result = await getMusicRecommendation({ mood, platform, tempo, nostalgiaMode, isRandom });
            setRecommendation(result);
            setTimeout(() => setVisible(true), 100);
        } catch (err) {
            setError("Oops! Couldn't catch that rhythm. Try another vibe 😄");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [mood, platform, tempo, nostalgiaMode]);
    
    const handleGetRecommendation = () => fetchRecommendation(false);
    const handleRandomPick = () => fetchRecommendation(true);

    const renderSelector = (title: string, options: readonly string[], selected: string[], onSelect: (option: string) => void) => (
        <div className="mb-6 animate-fadeIn" style={{ animationDelay: `${(Math.random() * 300)}ms`}}>
            <h3 className="text-xl font-semibold mb-3 text-blue-300">
                {title} <span className="text-xs font-normal text-gray-400 ml-2">(Pick multiple)</span>
            </h3>
            <div className="flex flex-wrap gap-2">
                {options.map(option => {
                    const isSelected = selected.includes(option);
                    return (
                        <button
                            key={option}
                            onClick={() => onSelect(option)}
                            className={`px-4 py-2 text-sm rounded-full border-2 transition-all duration-200 ${
                                isSelected
                                    ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                                    : 'bg-gray-700/50 border-gray-600 hover:border-blue-400 hover:text-blue-300'
                            }`}
                        >
                            {option}
                        </button>
                    )
                })}
            </div>
        </div>
    );
    
    return (
        <div className="w-full relative">
            <VibeVisualizer mood={mood} />
            <div className="bg-gray-800/50 p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm relative z-10">
                {!loading && !recommendation && (
                     <div className="animate-fadeIn">
                        {renderSelector(
                            "What's the music vibe?", 
                            MUSIC_MOODS, 
                            mood, 
                            (m) => toggleSelection(m, mood, setMood)
                        )}
                        {renderSelector(
                            "Your streaming choice?", 
                            MUSIC_PLATFORMS, 
                            platform, 
                            (p) => toggleSelection(p, platform, setPlatform)
                        )}
                        {renderSelector(
                            "Pick a tempo", 
                            MUSIC_TEMPOS, 
                            tempo, 
                            (t) => toggleSelection(t, tempo, setTempo)
                        )}
                        
                        <div className="flex items-center my-6 animate-fadeIn" style={{ animationDelay: `300ms`}}>
                            <input
                                type="checkbox"
                                id="nostalgia"
                                checked={nostalgiaMode}
                                onChange={(e) => setNostalgiaMode(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="nostalgia" className="ml-3 block text-sm font-medium text-gray-300">
                                Nostalgia Mode (only older music)
                            </label>
                        </div>

                        {error && <p className="text-red-400 text-center my-4">{error}</p>}
                        
                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                           <Button onClick={handleGetRecommendation} size="lg" className="w-full">Find My Song</Button>
                           <Button onClick={handleRandomPick} variant="secondary" size="lg" className="w-full">🎤 Surprise Me</Button>
                        </div>
                    </div>
                )}
                {loading && <Spinner text="Tuning into the right frequency..." />}
                {recommendation && (
                     <div className={`transition-opacity duration-700 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}>
                        <RecommendationCard recommendation={recommendation} type="music" onAnother={handleGetRecommendation} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MusicPicker;
