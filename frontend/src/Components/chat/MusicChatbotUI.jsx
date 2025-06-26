import React, { useState, useRef, useEffect } from 'react';
import { Fan, Send, Music, Heart, Zap, Coffee, Headphones, ChevronDown, ChevronUp } from 'lucide-react';
import { getMoodSuggestions } from '../../lib/chatAPI';

const sentAudio = new Audio('/audio/message-send.wav');
const receiveAudio = new Audio('/audio/message-receive.mp3');

const MusicChatbot = () => {
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
  try { sentAudio.currentTime = 0; sentAudio.play(); } catch (e) {}

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
      analysis: { emotions: [data.mood] }
    };

    setMessages(prev => [...prev, botMessage]);
    setRecommendedSongs(data.recommended_songs || []);

    // Play receive sound
    try { receiveAudio.currentTime = 0; receiveAudio.play(); } catch (e) {console.log(e);
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
    try { receiveAudio.currentTime = 0; receiveAudio.play(); } catch (e) {console.log(e);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col pb-16">
      {/* Header */}
      <div className="bg-black/60 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        {/* Left side: Icon and titles */}
        <div className="flex items-center gap-2">
          <Headphones className="w-5 h-5 text-white/80" />
          <div>
            <h2 className="text-white font-semibold text-base">GrooveBot</h2>
            <p className="text-xs text-white/50">Minimal mood-based assistant</p>
          </div>
        </div>

        {/* Right side: House icon */}
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
            <div className={`inline-block px-4 py-2 rounded-lg max-w-[80%] ${
              message.type === 'user'
                ? 'ml-auto bg-blue-600 text-white rounded-br-none'
                : 'bg-white/90 text-gray-900 rounded-bl-none shadow-sm'
            }`}>
              <p>{message.content}</p>
              {message.analysis?.emotions && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {message.analysis.emotions.map((emotion, i) => (
                    <EmotionBadge key={i} emotion={emotion} />
                  ))}
                </div>
              )}
              {message.songs?.length > 0 && (
                <div className="mt-3 bg-gray-100 text-gray-800 text-xs p-2 rounded">
                  <p className="font-medium text-gray-600 mb-1">🎵 Recommended:</p>
                  {message.songs.slice(0, 3).map((song, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Music className="w-3 h-3 text-blue-500" />
                      <span>{song}</span>
                    </div>
                  ))}
                </div>
              )}
              {message.followUp && (
                <p className="text-xs text-gray-600 mt-2 italic">{message.followUp}</p>
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
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showSuggestions ? 'max-h-auto opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="p-3 border-b border-white/10">
            <p className="text-xs text-white/70 mb-2">Quick Suggestions</p>
            <div className="flex flex-wrap gap-2">
              {moodSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(s.text)}
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