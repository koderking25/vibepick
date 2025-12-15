
import { GoogleGenAI, Type } from "@google/genai";
import { WatchRecommendation, MusicRecommendation } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // This is a fallback for development environments where process.env might not be configured.
  // In a production environment, the key should always be present.
  console.warn("API_KEY is not set. Please set it in your environment variables.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const watchSchema = {
  type: Type.OBJECT,
  properties: {
    primary: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "The full title of the movie or show." },
        year: { type: Type.INTEGER, description: "The release year." },
        runtime: { type: Type.STRING, description: "The total runtime, e.g., '2h 16m' or '45m'." },
        description: { type: Type.STRING, description: "A one or two-sentence, compelling description." },
        trailerUrl: { type: Type.STRING, description: "A direct URL to a YouTube trailer." },
        moodMatch: { type: Type.STRING, description: "A short, creative reason why this matches the user's mood." },
      },
      required: ["title", "year", "runtime", "description", "trailerUrl", "moodMatch"],
    },
    backups: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          year: { type: Type.INTEGER },
          runtime: { type: Type.STRING },
        },
        required: ["title", "year", "runtime"],
      },
    },
  },
  required: ["primary", "backups"],
};

const musicSchema = {
    type: Type.OBJECT,
    properties: {
        primary: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "The song title." },
                artist: { type: Type.STRING, description: "The primary artist's name." },
                moodMatch: { type: Type.STRING, description: "A short reason this song fits the mood." },
                vibe: { type: Type.STRING, description: "A brief description of the song's genre or vibe." },
                links: {
                    type: Type.OBJECT,
                    properties: {
                        spotify: { type: Type.STRING, description: "Direct URL to the song on Spotify." },
                        appleMusic: { type: Type.STRING, description: "Direct URL to the song on Apple Music." },
                        youtube: { type: Type.STRING, description: "Direct URL to the song on YouTube/YouTube Music." },
                        deezer: { type: Type.STRING, description: "Direct URL to the song on Deezer." },
                    },
                },
            },
            required: ["title", "artist", "moodMatch", "vibe", "links"],
        },
        backups: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    artist: { type: Type.STRING },
                },
                required: ["title", "artist"],
            },
        },
    },
    required: ["primary", "backups"],
};

export const getWatchRecommendation = async (options: {
  mood: string[];
  platforms: string[];
  time: string | null;
  type: string | null;
  age: 'any' | 'older' | 'newer';
  isRandom: boolean;
}): Promise<WatchRecommendation> => {
    let prompt = `You are VibePick, an expert entertainment recommendation engine. A user wants a recommendation for something to watch.
    
    Find one perfect recommendation and 2-3 backup recommendations. The recommendations must be real and well-known.`;

    if (options.isRandom) {
        prompt += "\nThey've asked for a completely random pick, so surprise them with something great from any category!";
    } else {
        prompt += `
        Here are their preferences:
        - Mood(s): ${options.mood.join(', ')}
        - Available Platforms: ${options.platforms.join(', ')}
        - Time Available: ${options.time}
        - Content Type: ${options.type}
        - Age Preference: ${options.age} releases.`;
    }
    
    prompt += `\nEnsure the recommendations are available on at least one of the specified platforms. The primary recommendation must have a valid YouTube trailer URL.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: watchSchema,
            temperature: 0.8,
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as WatchRecommendation;
};

export const getMusicRecommendation = async (options: {
  mood: string[];
  platform: string[];
  tempo: string[];
  nostalgiaMode: boolean;
  isRandom: boolean;
}): Promise<MusicRecommendation> => {
    let prompt = `You are VibePick, an expert music recommendation engine. A user wants a song recommendation.
    
    Find one perfect song recommendation and 2 backup recommendations. The songs must be real and have valid links on streaming platforms.`;

    if (options.isRandom) {
        prompt += "\nThey've asked for a completely random song, so pick an amazing track from any genre or era!";
    } else {
        prompt += `
        Here are their preferences:
        - Vibe/Mood(s): ${options.mood.join(', ')}
        - Preferred Platform(s): ${options.platform.join(', ')}
        - Tempo: ${options.tempo.join(', ')}`;
        if (options.nostalgiaMode) {
            prompt += `\n- Special Request: They are in 'Nostalgia Mode', so please pick music released before the year 2010.`;
        }
    }
    
    prompt += `\nFor the primary recommendation, provide direct links to the song on Spotify, Apple Music, YouTube, and Deezer if available.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: musicSchema,
            temperature: 0.9,
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as MusicRecommendation;
};
