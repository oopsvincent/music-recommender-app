import React, { useState, useRef, useEffect } from 'react';
import { Fan, Send, Music, Heart, Zap, Coffee, Headphones, ChevronDown, ChevronUp, Activity, Target } from 'lucide-react';
import { getMoodSuggestions } from '../../lib/chatAPI';
import { getSpotifyToken, fetchSpotifyData } from '../../hooks/useSpotify';
import { TrackCard } from '../CardComponents/TracksCard';

const sentAudio = new Audio('/audio/message-send.wav');
const receiveAudio = new Audio('/audio/message-receive.mp3');

const MusicChatbot = () => {

    async function getDataforCard(track) {
        const t = await getSpotifyToken();
        const data = await fetchSpotifyData(track, t);
        return data;
    }

    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: "Hi! I'm your music mood companion 🎵 Tell me how you're feeling or what you're doing, and I'll find the perfect songs for you!",
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recommendedSongs, setRecommendedSongs] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const messagesEndRef = useRef(null);
    const [trackData, setTrackData] = useState([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const moodSuggestions = [
        { text: "I'm feeling sad and need comfort", icon: <Heart className="w-4 h-4" /> },
        { text: "I need energy for my workout", icon: <Zap className="w-4 h-4" /> },
        { text: "Looking for chill study music", icon: <Coffee className="w-4 h-4" /> },
        { text: "Want something romantic", icon: <Heart className="w-4 h-4 text-red-400" /> },
        { text: "Need party vibes!", icon: <Music className="w-4 h-4" /> }
    ];

    const handleSendMessage = async (messageText = inputText) => {
        if (!messageText.trim()) return;

        const userMessage = {
            type: 'user',
            content: messageText.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        // Play sent sound
        try { sentAudio.currentTime = 0; sentAudio.play(); } catch (e) { }

        try {
            const data = await getMoodSuggestions(messageText.trim());
            console.log(data);

            if (!data) throw new Error('No response from API');

            const botMessage = {
                type: 'bot',
                content: data.bot_message || "Here are some suggestions based on your mood.",
                timestamp: new Date(),
                songs: data.recommended_songs || [],
                followUp: data.follow_up || '',
                analysis: data.analysis || { emotions: [data.mood] },
                genres: data.genres || [],
                confidence: data.analysis?.confidence || null,
                activities: data.analysis?.activities || [],
                randomizationSeed: data.randomization_seed || null
            };

            const trackPromises = botMessage.songs.map(track => getDataforCard(track));
            const allTrackData = await Promise.all(trackPromises);
            setTrackData(allTrackData);

            setMessages(prev => [...prev, botMessage]);
            setRecommendedSongs(data.recommended_songs || []);

            // Play receive sound
            try { receiveAudio.currentTime = 0; receiveAudio.play(); } catch (e) {
                console.log(e);
            }
        } catch (error) {
            const fallbackResponse = {
                type: 'bot',
                content: "Couldn't reach the music mood engine. Here's something calming meanwhile:",
                timestamp: new Date(),
                songs: ["Explosions in the Sky – Your Hand in Mine", "Bon Iver – Holocene", "Tycho – Awake"],
                followUp: "Try again in a bit?",
            };

            setMessages(prev => [...prev, fallbackResponse]);
            setRecommendedSongs(fallbackResponse.songs);

            // Play receive sound
            try { receiveAudio.currentTime = 0; receiveAudio.play(); } catch (e) {
                console.log(e);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const EmotionBadge = ({ emotion }) => {
        const colors = {
            'sad': 'bg-blue-100 text-blue-800',
            'happy': 'bg-yellow-100 text-yellow-800',
            'romantic': 'bg-pink-100 text-pink-800',
            'energetic': 'bg-orange-100 text-orange-800',
            'relaxed': 'bg-green-100 text-green-800',
            'motivated': 'bg-purple-100 text-purple-800'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[emotion] || 'bg-gray-100 text-gray-800'}`}>
                {emotion}
            </span>
        );
    };

    const GenreBadge = ({ genre }) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            {genre.replace('_', ' ')}
        </span>
    );

    const ActivityBadge = ({ activity }) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Activity className="w-3 h-3 inline mr-1" />
            {activity}
        </span>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col pb-16">
            {/* Header */}
            <div className="bg-black/60 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-white/80" />
                    <div>
                        <h2 className="text-white font-semibold text-base">GrooveBot</h2>
                        <p className="text-xs text-white/50">Minimal mood-based assistant</p>
                    </div>
                </div>

                <button
                    className="text-white cursor-pointer hover:text-red-400 transition-colors active:scale-90 transform animate-spin"
                    onClick={() => window.location.href = "/"}
                    title="Go Home"
                >
                    <Fan size={24} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 pb-32">
                {messages.map((message, index) => (
                    <div key={index} className={`text-sm ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block px-4 py-2 rounded-lg max-w-[85%] ${message.type === 'user'
                            ? 'ml-auto bg-blue-600 text-white rounded-br-none'
                            : 'bg-white/95 text-gray-900 rounded-bl-none shadow-lg'
                            }`}>
                            <p>{message.content}</p>

                            {/* Analysis Data */}
                            {message.analysis && (
                                <div className="mt-3 space-y-2">
                                    {/* Emotions */}
                                    {message.analysis.emotions?.length > 0 && (
                                        <div>
                                            <p className="text-xs font-medium text-gray-600 mb-1">😊 Emotions:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {message.analysis.emotions.map((emotion, i) => (
                                                    <EmotionBadge key={i} emotion={emotion} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Confidence */}
                                    {message.confidence !== null && message.confidence !== undefined && (
                                        <div className="flex items-center gap-1">
                                            <Target className="w-3 h-3 text-gray-500" />
                                            <span className="text-xs text-gray-600">
                                                Confidence: {Math.round(message.confidence * 100)}%
                                            </span>
                                        </div>
                                    )}

                                    {/* Activities */}
                                    {message.activities?.length > 0 && (
                                        <div>
                                            <p className="text-xs font-medium text-gray-600 mb-1">🎯 Activities:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {message.activities.map((activity, i) => (
                                                    <ActivityBadge key={i} activity={activity} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Genres */}
                                    {message.genres?.length > 0 && (
                                        <div>
                                            <p className="text-xs font-medium text-gray-600 mb-1">🎵 Genres:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {message.genres.map((genre, i) => (
                                                    <GenreBadge key={i} genre={genre} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Recommended Songs */}
                            {message.songs?.length > 0 && (
                                <div className="mt-4 bg-gray-50 text-gray-800 p-3 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                        <Music className="w-4 h-4 text-blue-500" />
                                        Recommended Songs ({message.songs.length})
                                    </p>

                                    {/* Grid Layout for Track Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-132 overflow-x-auto">
                                        {trackData.map((track, i) => (
                                            <div key={i} className="min-w-0">
                                                <TrackCard
                                                    url={track.url}
                                                    title={track.title}
                                                    artist={track.artists?.map((artist) => ({ name: artist.name, id: artist.id }))}
                                                    spoURL={track.spoURL}
                                                    YTURL={"https://youtube.com/search?query=" + encodeURIComponent(track.title + " - " + track.artists)}
                                                    popularity={track.popularity}
                                                    explicit={track.explicit}
                                                    trackURI={track.trackURI}
                                                    albumID={track.albumID}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Fallback: Show song names if TrackCard data is not available */}
                                    {trackData.length === 0 && (
                                        <div className="space-y-1">
                                            {message.songs.slice(0, 5).map((song, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm">
                                                    <Music className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                                    <span className="truncate">{song}</span>
                                                </div>
                                            ))}
                                            {message.songs.length > 5 && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    +{message.songs.length - 5} more songs
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Follow Up */}
                            {message.followUp && (
                                <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800 italic">
                                    💭 {message.followUp}
                                </div>
                            )}

                            {/* Debug Info (Optional) */}
                            {message.randomizationSeed && (
                                <div className="mt-2 text-[10px] text-gray-400">
                                    Seed: {message.randomizationSeed}
                                </div>
                            )}
                        </div>
                        <div className="text-[10px] text-white/60 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="text-left">
                        <div className="inline-block bg-white/80 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-sm">Finding perfect songs for you...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Sticky Bottom Container */}
            <div className="fixed bottom-16 left-0 right-0 bg-black/60 backdrop-blur-md border-t border-white/10">
                {/* Quick Suggestions */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showSuggestions ? 'max-h-auto opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="p-3 border-b border-white/10">
                        <p className="text-xs text-white/70 mb-2">Quick Suggestions</p>
                        <div className="flex flex-wrap gap-2">
                            {moodSuggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSendMessage(s.text)}
                                    disabled={isLoading}
                                    className="flex items-center gap-1 px-3 py-1 bg-white/10 text-white/80 rounded-full text-xs hover:bg-white/20 transition-colors transform hover:scale-105 active:scale-95"
                                >
                                    {s.icon}
                                    {s.text}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Input Box */}
                <div className="p-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowSuggestions(prev => !prev)}
                            className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                        >
                            {showSuggestions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Tell me how you're feeling..."
                            className="flex-1 px-3 py-2 bg-white/10 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/50"
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={isLoading || !inputText.trim()}
                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MusicChatbot;