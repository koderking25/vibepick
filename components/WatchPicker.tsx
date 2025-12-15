
import React, { useState, useEffect, useCallback } from 'react';
import { WatchRecommendation } from '../types';
import { getWatchRecommendation } from '../services/geminiService';
import { WATCH_MOODS, WATCH_PLATFORMS, WATCH_TIMES, WATCH_TYPES } from '../constants';
import Button from './Button';
import RecommendationCard from './RecommendationCard';
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


const WatchPicker: React.FC = () => {
    const [mood, setMood] = useSessionState<string[]>('watch_mood', []);
    const [platforms, setPlatforms] = useSessionState<string[]>('watch_platforms', []);
    const [time, setTime] = useSessionState<string | null>('watch_time', null);
    const [type, setType] = useSessionState<string | null>('watch_type', null);
    const [age, setAge] = useSessionState<'any' | 'older' | 'newer'>('watch_age', 'any');
    
    const [recommendation, setRecommendation] = useState<WatchRecommendation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);

    const toggleSelection = (item: string, currentList: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev =>
            prev.includes(item) ? prev.filter(p => p !== item) : [...prev, item]
        );
    };

    const fetchRecommendation = useCallback(async (isRandom = false) => {
        if (!isRandom && (mood.length === 0 || platforms.length === 0 || !time || !type)) {
            setError("Please select at least one option for each category.");
            return;
        }
        setError(null);
        setLoading(true);
        setRecommendation(null);
        setVisible(false);

        try {
            const result = await getWatchRecommendation({ mood, platforms, time, type, age, isRandom });
            setRecommendation(result);
            setTimeout(() => setVisible(true), 100);
        } catch (err) {
            setError("Oops! Couldn't find a vibe for that. Try another mix 😄");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [mood, platforms, time, type, age]);
    
    const handleGetRecommendation = () => fetchRecommendation(false);
    const handleRandomPick = () => fetchRecommendation(true);

    const renderSelector = (title: string, options: readonly string[], selected: string | string[] | null, onSelect: (option: string) => void, isMulti = false) => (
        <div className="mb-6 animate-fadeIn" style={{ animationDelay: `${(Math.random() * 300)}ms`}}>
            <h3 className="text-xl font-semibold mb-3 text-purple-300">
                {title} {isMulti && <span className="text-xs font-normal text-gray-400 ml-2">(Pick multiple)</span>}
            </h3>
            <div className="flex flex-wrap gap-2">
                {options.map(option => {
                    const isSelected = isMulti ? (selected as string[]).includes(option) : selected === option;
                    return (
                        <button
                            key={option}
                            onClick={() => onSelect(option)}
                            className={`px-4 py-2 text-sm rounded-full border-2 transition-all duration-200 ${
                                isSelected
                                    ? 'bg-purple-500 border-purple-500 text-white shadow-lg'
                                    : 'bg-gray-700/50 border-gray-600 hover:border-purple-400 hover:text-purple-300'
                            }`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
    
    return (
        <div className="w-full">
            <div className="bg-gray-800/50 p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
                {!loading && !recommendation && (
                    <div className="animate-fadeIn">
                        {renderSelector(
                            "What's your mood?", 
                            WATCH_MOODS, 
                            mood, 
                            (m) => toggleSelection(m, mood, setMood), 
                            true
                        )}
                        {renderSelector(
                            "Where are you watching?", 
                            WATCH_PLATFORMS, 
                            platforms, 
                            (p) => toggleSelection(p, platforms, setPlatforms), 
                            true
                        )}
                        {renderSelector("How much time you got?", WATCH_TIMES, time, setTime)}
                        {renderSelector("What type of content?", WATCH_TYPES, type, setType)}

                         <div className="mb-6 animate-fadeIn" style={{ animationDelay: `400ms`}}>
                            <h3 className="text-xl font-semibold mb-3 text-purple-300">New or old?</h3>
                            <div className="flex flex-wrap gap-2">
                                {(['Any', 'Older', 'Newer'] as const).map(option => (
                                    <button key={option} onClick={() => setAge(option.toLowerCase() as 'any' | 'older' | 'newer')}
                                        className={`px-4 py-2 text-sm rounded-full border-2 transition-all duration-200 ${
                                            age === option.toLowerCase()
                                                ? 'bg-purple-500 border-purple-500 text-white shadow-lg'
                                                : 'bg-gray-700/50 border-gray-600 hover:border-purple-400 hover:text-purple-300'
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-center my-4">{error}</p>}
                        
                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                           <Button onClick={handleGetRecommendation} size="lg" className="w-full">Find My Vibe</Button>
                           <Button onClick={handleRandomPick} variant="secondary" size="lg" className="w-full">🎲 Spin the Reel</Button>
                        </div>
                    </div>
                )}
                {loading && <Spinner text="Picking the perfect vibe for you..." />}
                {recommendation && (
                    <div className={`transition-opacity duration-700 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}>
                        <RecommendationCard recommendation={recommendation} type="watch" onAnother={handleGetRecommendation} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchPicker;
