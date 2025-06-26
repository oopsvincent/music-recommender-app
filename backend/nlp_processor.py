import re
import json
from collections import Counter, defaultdict
import random
import logging
from typing import List, Dict, Tuple, Optional, Union

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MusicNLPProcessor:
    def __init__(self):
        # Emotion mapping to database genres (cleaned up duplicates)
        self.emotion_genre_mapping = {
            "sad": ["sad_music", "blues_music", "melancholy_music"],
            "happy": ["happy_music", "pop_music", "party_music"],
            "romantic": ["romantic_music", "rnb_music", "jazz_music"],
            "energetic": ["workout_music", "electronic_music", "rock_music"],
            "relaxed": ["focus_music", "instrumental_music", "classical_music"],
            "nostalgic": ["blues_music", "jazz_music", "classical_music"],
            "motivated": ["motivational_music", "workout_music", "rap_music"],
            "party": ["party_music", "electronic_music", "pop_music"],
            "melancholy": ["melancholy_music", "sad_music", "blues_music"],
            "focus": ["focus_music", "instrumental_music", "classical_music"],
        }

        # Improved emotion keywords with better organization and reduced false positives
        self.emotion_keywords = {
            "sad": [
                "sad",
                "depressed",
                "down",
                "blue",
                "crying",
                "heartbroken",
                "lonely",
                "upset",
                "hurt",
                "low",
                "miserable",
                "gloomy",
                "devastated",
                "broken",
                "disappointed",
                "hopeless",
                "grief",
                "sorrow",
                "despair",
                "melancholic",
                "tearful",
                "weeping",
            ],
            "happy": [
                "happy",
                "joyful",
                "excited",
                "cheerful",
                "glad",
                "upbeat",
                "positive",
                "elated",
                "thrilled",
                "ecstatic",
                "delighted",
                "overjoyed",
                "euphoric",
                "blissful",
                "jubilant",
                "gleeful",
            ],
            "energetic": [
                "energetic",
                "pumped",
                "hyped",
                "active",
                "intense",
                "powerful",
                "strong",
                "adrenaline",
                "boost",
                "motivation",
                "energy",
                "beast mode",
                "fired up",
                "charged",
                "dynamic",
                "vigorous",
            ],
            "romantic": [
                "love",
                "romantic",
                "crush",
                "valentine",
                "intimate",
                "romance",
                "affection",
                "passion",
                "relationship",
                "boyfriend",
                "girlfriend",
                "husband",
                "wife",
                "partner",
                "soulmate",
                "sweetheart",
                "darling",
                "beloved",
                "anniversary",
                "proposal",
                "honeymoon",
            ],
            "relaxed": [
                "chill",
                "relax",
                "calm",
                "peaceful",
                "meditation",
                "zen",
                "quiet",
                "tranquil",
                "serene",
                "mellow",
                "soothing",
                "unwind",
                "decompress",
                "breathe",
                "mindful",
                "ambient",
                "soft",
                "gentle",
                "laid back",
                "easygoing",
            ],
            "party": [
                "party",
                "club",
                "dancing",
                "celebration",
                "fun",
                "wild",
                "night out",
                "dance",
                "nightclub",
                "disco",
                "rave",
                "festival",
                "concert",
                "turn up",
                "lit",
                "banging",
                "banger",
                "groove",
                "vibe",
            ],
            "motivated": [
                "motivated",
                "determined",
                "driven",
                "ambitious",
                "focused",
                "goal",
                "achieve",
                "success",
                "hustle",
                "grind",
                "push",
                "dedication",
                "commitment",
                "persistence",
                "winner",
            ],
            "nostalgic": [
                "nostalgic",
                "memories",
                "remember",
                "past",
                "childhood",
                "throwback",
                "old times",
                "reminisce",
                "vintage",
                "classic",
                "retro",
                "old school",
                "yesteryear",
            ],
            "melancholy": [
                "melancholy",
                "bittersweet",
                "wistful",
                "pensive",
                "contemplative",
                "reflective",
                "introspective",
                "thoughtful",
                "somber",
                "moody",
            ],
        }

        # Activity context mapping (removed 'focus' conflict)
        self.activity_mapping = {
            "workout": ["workout_music", "electronic_music", "motivational_music"],
            "gym": ["workout_music", "electronic_music", "motivational_music"],
            "exercise": ["workout_music", "electronic_music", "motivational_music"],
            "running": ["workout_music", "electronic_music", "motivational_music"],
            "cardio": ["workout_music", "electronic_music", "motivational_music"],
            "lifting": ["workout_music", "rock_music", "motivational_music"],
            "study": ["focus_music", "instrumental_music", "classical_music"],
            "studying": ["focus_music", "instrumental_music", "classical_music"],
            "working": ["focus_music", "instrumental_music", "classical_music"],
            "homework": ["focus_music", "instrumental_music", "classical_music"],
            "reading": ["focus_music", "instrumental_music", "classical_music"],
            "coding": ["focus_music", "instrumental_music", "electronic_music"],
            "programming": ["focus_music", "instrumental_music", "electronic_music"],
            "party": ["party_music", "electronic_music", "pop_music"],
            "celebration": ["party_music", "pop_music", "happy_music"],
            "driving": ["rock_music", "pop_music", "rap_music"],
            "road trip": ["rock_music", "pop_music", "classic_music"],
            "cooking": ["jazz_music", "rnb_music", "pop_music"],
            "cleaning": ["pop_music", "electronic_music", "motivational_music"],
            "sleeping": ["instrumental_music", "classical_music", "ambient_music"],
            "relaxing": ["instrumental_music", "classical_music", "jazz_music"],
            "date": ["romantic_music", "jazz_music", "rnb_music"],
        }

        # Sentiment analysis fallback (without TextBlob dependency)
        self.positive_indicators = [
            "good",
            "great",
            "awesome",
            "fantastic",
            "wonderful",
            "amazing",
            "excellent",
            "perfect",
            "love",
            "best",
        ]
        self.negative_indicators = [
            "bad",
            "awful",
            "terrible",
            "horrible",
            "worst",
            "hate",
            "suck",
            "disappointing",
            "frustrating",
        ]

        # Explicit content detection
        self.explicit_words = {
            # Profanity
            "fuck",
            "fucking",
            "shit",
            "damn",
            "hell",
            "ass",
            "bitch",
            "bastard",
            "crap",
            "piss",
            "cock",
            "dick",
            "pussy",
            "whore",
            "slut",
            "fag",
            # Common variants and leetspeak
            "f*ck",
            "f**k",
            "sh*t",
            "sh**",
            "d*mn",
            "b*tch",
            "a**",
            "h*ll",
            "fck",
            "sht",
            "dmn",
            "btch",
            "fuk",
            "shyt",
            "fcking",
            "fking",
            # Drug references
            "weed",
            "marijuana",
            "cannabis",
            "pot",
            "high",
            "stoned",
            "blazed",
            "joint",
            "blunt",
            "bong",
            "smoke",
            "lit",
            "dope",
            "hash",
            "cocaine",
            "coke",
            "crack",
            "meth",
            "heroin",
            "pills",
            "molly",
            "ecstasy",
            "acid",
            "lsd",
            "shrooms",
            "xanax",
            "adderall",
            # Violence references
            "kill",
            "murder",
            "die",
            "death",
            "blood",
            "gun",
            "shoot",
            "knife",
            "violence",
            "fight",
            "beat up",
            "assault",
            "attack",
            "war",
            "bomb",
            # Sexual content (mild detection)
            "sex",
            "sexual",
            "porn",
            "nude",
            "naked",
            "erotic",
            "orgasm",
            "masturbate",
            "horny",
            "sexy",
            "seduction",
            "kinky",
            "fetish",
        }
        # Compile regex patterns for better performance
        self._compile_patterns()

        # Context-based explicit phrases (more sophisticated detection)
        self.explicit_phrases = [
            r"\b(?:getting|get)\s+(?:high|stoned|blazed|lit)\b",
            r"\b(?:smoking|smoke)\s+(?:weed|pot|joint|blunt)\b",
            r"\b(?:doing|taking|popping)\s+(?:drugs|pills|molly|ecstasy)\b",
            r"\b(?:fuck|fucking)\s+(?:up|around|with)\b",
            r"\b(?:beat|kill|murder)\s+(?:someone|somebody|them)\b",
            r"\b(?:party|partying)\s+(?:hard|wild|crazy)\b",  # Often drug-related context
            r"\b(?:hookup|hook\s+up|one\s+night\s+stand)\b",
            r"\b(?:strip|stripper|pole\s+dancing)\b",
        ]

        # Compile explicit phrase patterns
        self.explicit_phrase_patterns = [
            re.compile(pattern, re.IGNORECASE) for pattern in self.explicit_phrases
        ]

        # Genre mapping for explicit content
        self.explicit_genre_mapping = {
            "profanity": ["rap_music", "rock_music"],
            "drugs": ["rap_music", "rock_music", "blues_music"],
            "violence": ["rock_music", "rap_music"],
            "sexual": ["rnb_music", "rap_music", "pop_music"],
            "party_explicit": [
                "party_music",
                "rap_music",
                "electronic_music",
                "pop_music",
            ],
        }

    def _compile_patterns(self):
        """Pre-compile regex patterns for better performance"""
        self.emotion_patterns = {}
        self.activity_patterns = {}

        # Compile emotion patterns (with safety check)
        if hasattr(self, "emotion_keywords") and self.emotion_keywords:
            for emotion, keywords in self.emotion_keywords.items():
                if keywords:  # Check if keywords list is not empty
                    pattern = (
                        r"\b(?:"
                        + "|".join(re.escape(keyword) for keyword in keywords)
                        + r")\b"
                    )
                    self.emotion_patterns[emotion] = re.compile(pattern, re.IGNORECASE)

        # Compile activity patterns (with safety check)
        if hasattr(self, "activity_mapping") and self.activity_mapping:
            for activity, _ in self.activity_mapping.items():
                pattern = r"\b" + re.escape(activity) + r"\b"
                self.activity_patterns[activity] = re.compile(pattern, re.IGNORECASE)

        # Compile explicit word pattern for performance (with safety check)
        if hasattr(self, "explicit_words") and self.explicit_words:
            explicit_words_pattern = (
                r"\b(?:"
                + "|".join(re.escape(word) for word in self.explicit_words)
                + r")\b"
            )
            self.explicit_pattern = re.compile(explicit_words_pattern, re.IGNORECASE)
        else:
            # Create a pattern that never matches if explicit_words is not defined or empty
            self.explicit_pattern = re.compile(r"(?!)", re.IGNORECASE)

        # Compile explicit content patterns (if you have explicit content mapping)
        if hasattr(self, "explicit_content_mapping") and self.explicit_content_mapping:
            self.explicit_content_patterns = {}
            for content_type, keywords in self.explicit_content_mapping.items():
                if keywords:  # Check if keywords list is not empty
                    pattern = (
                        r"\b(?:"
                        + "|".join(re.escape(keyword) for keyword in keywords)
                        + r")\b"
                    )
                    self.explicit_content_patterns[content_type] = re.compile(
                        pattern, re.IGNORECASE
                    )

    def preprocess_text(self, text: Union[str, None]) -> str:
        """Clean and normalize input text with robust error handling"""
        if not text or not isinstance(text, str):
            return ""

        try:
            # Basic cleaning
            text = text.lower().strip()

            # Handle common contractions
            contractions = {
                "i'm": "i am",
                "i'd": "i would",
                "i'll": "i will",
                "i've": "i have",
                "you're": "you are",
                "you'd": "you would",
                "you'll": "you will",
                "you've": "you have",
                "he's": "he is",
                "she's": "she is",
                "it's": "it is",
                "we're": "we are",
                "they're": "they are",
                "don't": "do not",
                "won't": "will not",
                "can't": "cannot",
            }

            for contraction, expansion in contractions.items():
                text = text.replace(contraction, expansion)

            # Remove special characters but preserve important punctuation temporarily
            text = re.sub(r"[^\w\s']", " ", text)
            # Normalize whitespace
            text = re.sub(r"\s+", " ", text)

            return text.strip()
        except Exception as e:
            logger.warning(f"Text preprocessing error: {e}")
            return ""

    def extract_emotions(self, text: str) -> List[str]:
        """Extract emotions using compiled regex patterns"""
        if not text:
            return []

        processed_text = self.preprocess_text(text)
        detected_emotions = []
        emotion_scores = defaultdict(int)

        # Use compiled patterns for better performance
        for emotion, pattern in self.emotion_patterns.items():
            matches = pattern.findall(processed_text)
            if matches:
                emotion_scores[emotion] += len(matches)

        # Simple sentiment analysis fallback if no emotions detected
        if not emotion_scores:
            positive_count = sum(
                1 for word in self.positive_indicators if word in processed_text
            )
            negative_count = sum(
                1 for word in self.negative_indicators if word in processed_text
            )

            if positive_count > negative_count and positive_count > 0:
                emotion_scores["happy"] = 1
            elif negative_count > positive_count and negative_count > 0:
                emotion_scores["sad"] = 1
            else:
                emotion_scores["relaxed"] = 1

        # Return emotions sorted by frequency, max 3
        detected_emotions = [
            emotion
            for emotion, _ in sorted(
                emotion_scores.items(), key=lambda x: x[1], reverse=True
            )[:3]
        ]

        return detected_emotions

    def extract_activities(self, text: str) -> List[str]:
        """Extract activity context using compiled regex patterns"""
        if not text:
            return []

        processed_text = self.preprocess_text(text)
        activities = []

        for activity, pattern in self.activity_patterns.items():
            if pattern.search(processed_text):
                activities.append(activity)

        return activities

    def detect_explicit_content(self, text: str) -> Dict:
        """Detect explicit content and categorize it"""
        if not text:
            return {
                "has_explicit": False,
                "categories": [],
                "words_found": [],
                "phrases_found": [],
                "severity": "none",
            }

        processed_text = self.preprocess_text(text)
        explicit_info = {
            "has_explicit": False,
            "categories": [],
            "words_found": [],
            "phrases_found": [],
            "severity": "none",
        }

        try:
            # Check for explicit words
            explicit_matches = self.explicit_pattern.findall(processed_text)
            if explicit_matches:
                explicit_info["has_explicit"] = True
                explicit_info["words_found"] = list(set(explicit_matches))

            # Check for explicit phrases
            for pattern in self.explicit_phrase_patterns:
                phrase_matches = pattern.findall(processed_text)
                if phrase_matches:
                    explicit_info["has_explicit"] = True
                    explicit_info["phrases_found"].extend(phrase_matches)

            # Categorize explicit content
            if explicit_info["has_explicit"]:
                categories = set()
                all_found = (
                    explicit_info["words_found"] + explicit_info["phrases_found"]
                )

                for item in all_found:
                    item_lower = item.lower()
                    # Categorize based on content
                    if any(
                        word in item_lower
                        for word in ["fuck", "shit", "damn", "bitch", "ass", "hell"]
                    ):
                        categories.add("profanity")
                    if any(
                        word in item_lower
                        for word in [
                            "weed",
                            "high",
                            "stoned",
                            "smoke",
                            "drug",
                            "pill",
                            "molly",
                        ]
                    ):
                        categories.add("drugs")
                    if any(
                        word in item_lower
                        for word in [
                            "kill",
                            "murder",
                            "violence",
                            "fight",
                            "gun",
                            "blood",
                        ]
                    ):
                        categories.add("violence")
                    if any(
                        word in item_lower
                        for word in ["sex", "porn", "nude", "horny", "hookup"]
                    ):
                        categories.add("sexual")
                    if any(
                        word in item_lower
                        for word in ["party hard", "party wild", "partying"]
                    ):
                        categories.add("party_explicit")

                explicit_info["categories"] = list(categories)

                # Determine severity
                severity_score = (
                    len(explicit_info["words_found"])
                    + len(explicit_info["phrases_found"]) * 2
                )
                if severity_score >= 5:
                    explicit_info["severity"] = "high"
                elif severity_score >= 3:
                    explicit_info["severity"] = "medium"
                else:
                    explicit_info["severity"] = "low"

            return explicit_info

        except Exception as e:
            logger.warning(f"Explicit content detection error: {e}")
            return {
                "has_explicit": False,
                "categories": [],
                "words_found": [],
                "phrases_found": [],
                "severity": "none",
            }

    def get_explicit_aware_genres(
        self,
        emotions: List[str],
        activities: Optional[List[str]] = None,
        explicit_info: Optional[Dict] = None,
    ) -> List[str]:
        """Get genre recommendations considering explicit content preferences"""
        # Get base recommendations
        base_genres = self.get_genre_recommendations(emotions, activities)

        # If no explicit content detected, return base recommendations
        if not explicit_info or not explicit_info.get("has_explicit", False):
            return base_genres

        # Add explicit-appropriate genres based on categories
        explicit_genres = []
        for category in explicit_info.get("categories", []):
            if category in self.explicit_genre_mapping:
                explicit_genres.extend(self.explicit_genre_mapping[category])

        # Combine and prioritize
        combined_genres = explicit_genres + base_genres

        # Remove duplicates while preserving order
        seen = set()
        result = []
        for genre in combined_genres:
            if genre not in seen:
                seen.add(genre)
                result.append(genre)

        return result[:5]  # Return top 5


import random
from collections import defaultdict
from typing import List, Optional


def get_genre_recommendations(
    self, emotions: List[str], activities: Optional[List[str]] = None
) -> List[str]:
    """Map emotions and activities to music genres with weighted scoring and add randomness to output"""
    genre_scores = defaultdict(int)

    # Primary recommendations based on emotions (higher weight)
    for emotion in emotions:
        if emotion in self.emotion_genre_mapping:
            for genre in self.emotion_genre_mapping[emotion]:
                genre_scores[genre] += 3

    # Secondary recommendations based on activities
    if activities:
        for activity in activities:
            if activity in self.activity_mapping:
                for genre in self.activity_mapping[activity]:
                    genre_scores[genre] += 2

    if genre_scores:
        # Group genres by score
        score_groups = defaultdict(list)
        for genre, score in genre_scores.items():
            score_groups[score].append(genre)

        # Sort scores descending, shuffle genres in each score group
        final_list = []
        for score in sorted(score_groups.keys(), reverse=True):
            random.shuffle(score_groups[score])  # Add randomness here
            final_list.extend(score_groups[score])

        return final_list[:5]  # Pick top 5 genres randomly within top scores
    else:
        # Shuffle fallback genres too
        fallback = ["trending_music", "top_music", "developers_choice_music"]
        random.shuffle(fallback)
        return fallback

    def calculate_confidence(
        self, emotions: List[str], activities: List[str], text: str
    ) -> float:
        """Calculate confidence score with more realistic bounds"""
        if not text:
            return 0.1

        base_score = 0.2  # Conservative base

        # Emotion confidence
        if emotions:
            emotion_boost = min(len(emotions) * 0.15, 0.4)  # Cap emotion boost
            base_score += emotion_boost

        # Activity confidence
        if activities:
            activity_boost = min(len(activities) * 0.1, 0.2)  # Cap activity boost
            base_score += activity_boost

        # Text length factor (longer text = more context)
        text_length_factor = min(len(text.split()) / 20, 0.2)  # Cap at 0.2
        base_score += text_length_factor

        return min(base_score, 0.9)  # Max confidence of 90%

    def process_user_message(self, message: Union[str, None]) -> Dict:
        """Main processing function with comprehensive error handling"""
        try:
            # Input validation
            if not message or not isinstance(message, str) or len(message.strip()) == 0:
                return {
                    "emotions": [],
                    "activities": [],
                    "recommended_genres": [
                        "trending_music",
                        "top_music",
                        "developers_choice_music",
                    ],
                    "confidence": 0.1,
                    "processing_time": 0,
                    "text_length": 0,
                }

            import time

            start_time = time.time()

            # Process message
            emotions = self.extract_emotions(message)
            activities = self.extract_activities(message)
            explicit_info = self.detect_explicit_content(message)
            genres = self.get_explicit_aware_genres(emotions, activities, explicit_info)
            confidence = self.calculate_confidence(emotions, activities, message)

            processing_time = time.time() - start_time

            return {
                "emotions": emotions,
                "activities": activities,
                "explicit_content": explicit_info,
                "recommended_genres": genres,
                "confidence": round(confidence, 2),
                "processing_time": round(processing_time * 1000, 2),  # ms
                "text_length": len(message),
                "processed_text": self.preprocess_text(message),
            }

        except Exception as e:
            logger.error(f"Error processing message: {e}")
            return {
                "emotions": [],
                "activities": [],
                "explicit_content": {
                    "has_explicit": False,
                    "categories": [],
                    "words_found": [],
                    "phrases_found": [],
                    "severity": "none",
                },
                "recommended_genres": [
                    "trending_music",
                    "top_music",
                    "developers_choice_music",
                ],
                "confidence": 0.1,
                "error": str(e),
                "processing_time": 0,
                "text_length": 0,
            }

    def generate_response(self, analysis_result: Dict, user_message: str = "") -> Dict:
        """Generate conversational response with better personalization"""
        try:
            emotions = analysis_result.get("emotions", [])
            activities = analysis_result.get("activities", [])
            genres = analysis_result.get("recommended_genres", [])
            confidence = analysis_result.get("confidence", 0.1)
            explicit_info = analysis_result.get("explicit_content", {})

            # Handle explicit content in response
            has_explicit = explicit_info.get("has_explicit", False)
            explicit_severity = explicit_info.get("severity", "none")

            # Handle low confidence or no emotions
            if confidence < 0.3 or not emotions:
                base_message = "I'd love to help you discover the perfect music! Could you tell me more about your current mood or what you're planning to do?"
                if has_explicit and explicit_severity in ["medium", "high"]:
                    base_message += " I notice you might be looking for music with explicit content - I can recommend tracks that match that vibe."

                return {
                    "message": base_message,
                    "genres": (
                        genres[:3]
                        if genres
                        else ["trending_music", "top_music", "developers_choice_music"]
                    ),
                    "follow_up": "What's your vibe right now? Are you looking for something to match your mood or change it?",
                    "confidence": confidence,
                    "content_warning": has_explicit and explicit_severity == "high",
                }

            # Create personalized response
            response_parts = []

            # Emotion acknowledgment with explicit content consideration
            if emotions:
                emotion_text = self._format_emotions(emotions)
                if activities:
                    activity_text = self._format_activities(activities)
                    response_parts.append(
                        f"I can sense you're feeling {emotion_text} and looking for something for {activity_text}."
                    )
                else:
                    response_parts.append(
                        f"I can feel that {emotion_text} vibe from you."
                    )

                # Add explicit content acknowledgment if present
                if has_explicit:
                    if explicit_severity == "high":
                        response_parts.append(
                            "I understand you're looking for music with explicit content that matches your energy."
                        )
                    elif explicit_severity == "medium":
                        response_parts.append(
                            "I can include some edgier tracks in the mix."
                        )

            # Confidence-based response
            if confidence > 0.7:
                response_parts.append(
                    "I'm quite confident these songs will hit the right note:"
                )
            elif confidence > 0.5:
                response_parts.append(
                    "Here are some songs that should match your mood:"
                )
            else:
                response_parts.append(
                    "Let me suggest some music that might work for you:"
                )

            message = " ".join(response_parts)

            return {
                "message": message,
                "genres": genres[:3] if len(genres) >= 3 else genres,
                "follow_up": self._generate_follow_up(
                    emotions, activities, confidence, explicit_info
                ),
                "confidence": confidence,
                "personalization_level": (
                    "high"
                    if confidence > 0.6
                    else "medium" if confidence > 0.3 else "low"
                ),
                "content_warning": has_explicit and explicit_severity == "high",
                "explicit_detected": has_explicit,
            }

        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return {
                "message": "I'm here to help you find great music! What kind of mood are you in?",
                "genres": ["trending_music", "top_music", "developers_choice_music"],
                "follow_up": "Tell me about your current feelings or what you're planning to do.",
                "confidence": 0.1,
                "error": str(e),
            }

    def _format_emotions(self, emotions: List[str]) -> str:
        """Format emotions for natural language"""
        if not emotions:
            return "neutral"
        elif len(emotions) == 1:
            return emotions[0]
        elif len(emotions) == 2:
            return f"{emotions[0]} and {emotions[1]}"
        else:
            return f"{', '.join(emotions[:-1])}, and {emotions[-1]}"

    def _format_activities(self, activities: List[str]) -> str:
        """Format activities for natural language"""
        if not activities:
            return "general listening"
        elif len(activities) == 1:
            return activities[0]
        else:
            return f"{', '.join(activities[:-1])}, and {activities[-1]}"

    def _generate_follow_up(
        self,
        emotions: List[str],
        activities: List[str],
        confidence: float,
        explicit_info: Dict = None,
    ) -> str:
        """Generate contextual follow-up questions"""
        follow_ups = {
            "sad": "Would you like something to help process these feelings, or perhaps something uplifting?",
            "happy": "Want to keep this positive energy flowing with more upbeat tracks?",
            "romantic": "Looking for something intimate or more broadly love-themed?",
            "energetic": "Perfect for keeping that energy high! Need something specific for working out?",
            "relaxed": "Great for unwinding! Want pure instrumental or something with gentle vocals?",
            "motivated": "Love that drive! Want something to maintain that momentum?",
            "party": "Ready to get this party started? Need something danceable?",
            "nostalgic": "Those memories deserve the perfect soundtrack. Want classic hits or newer songs with vintage vibes?",
            "melancholy": "Sometimes we need music that understands. Want something contemplative?",
            "focus": "Perfect for productivity! Need something completely instrumental?",
        }

        # Check for explicit content influence on follow-up
        if explicit_info and explicit_info.get("has_explicit", False):
            explicit_severity = explicit_info.get("severity", "none")
            if explicit_severity in ["medium", "high"]:
                if confidence < 0.4:
                    return "I can include explicit content in the recommendations. Want me to adjust the intensity level?"
                elif emotions and emotions[0] in ["energetic", "party", "motivated"]:
                    return "Want me to include more explicit tracks that match this high-energy vibe?"

        if confidence < 0.4:
            return "How do these sound? I can adjust the recommendations based on your feedback!"

        if emotions and emotions[0] in follow_ups:
            return follow_ups[emotions[0]]
        elif activities:
            return f"These should work great for {activities[0]}! Want me to adjust for any specific preferences?"
        else:
            return "How do these recommendations feel? I can fine-tune them based on your feedback!"

    def get_statistics(self) -> Dict:
        """Get processor statistics"""
        return {
            "total_emotions": len(self.emotion_keywords),
            "total_activities": len(self.activity_mapping),
            "total_genres": len(
                set(
                    genre
                    for genres in self.emotion_genre_mapping.values()
                    for genre in genres
                )
            ),
            "emotion_keywords_count": {
                emotion: len(keywords)
                for emotion, keywords in self.emotion_keywords.items()
            },
            "version": "2.0",
        }


# Example usage and comprehensive testing
if __name__ == "__main__":
    processor = MusicNLPProcessor()

    # Comprehensive test cases
    test_messages = [
        "I'm feeling really sad and heartbroken today",
        "Need some pumped up music for my gym workout",
        "Want something romantic for my date tonight with my girlfriend",
        "I'm studying for exams and need focus music that won't distract me",
        "Having a party this weekend, need some banging tracks",
        "Feeling nostalgic about old times and childhood memories",
        "I'm motivated and ready to achieve my goals",
        "Just chilling and want to relax after a long day",
        "I love you so much, you're amazing and wonderful",  # Multiple emotions
        "I'm coding and programming but also feeling energetic",  # Activity + emotion
        "I'm so fucking pumped for this workout, need some sick beats",  # Explicit + energetic
        "Feeling like shit today, need some sad music to cry to",  # Explicit + sad
        "Party hard tonight, gonna get high and dance all night",  # Explicit party + drugs
        "Want some sexy music for tonight with my girl",  # Sexual content
        "Need music to help me focus while I'm high as hell",  # Drugs + focus conflict
        "",  # Empty message
        None,  # None test
        123,  # Non-string test
        "   ",  # Whitespace only
        "Hello how are you?",  # Neutral message
        "This is terrible and awful but I'm excited for the party tonight",  # Conflicting emotions
    ]

    print("=== MUSIC NLP PROCESSOR v2.0 TEST RESULTS ===\\n")

    for i, msg in enumerate(test_messages, 1):
        print(f"Test {i}: {repr(msg)}")
        print("-" * 50)

        try:
            # Process message
            result = processor.process_user_message(msg)
            response = processor.generate_response(result, str(msg) if msg else "")

            # Display results
            print(f"Emotions: {result['emotions']}")
            print(f"Activities: {result['activities']}")
            print(f"Explicit Content: {result.get('explicit_content', {})}")
            print(f"Genres: {result['recommended_genres']}")
            print(f"Confidence: {result['confidence']}")
            print(f"Processing Time: {result.get('processing_time', 0)}ms")
            print(f"Response: {response['message']}")
            print(f"Follow-up: {response['follow_up']}")
            if response.get("content_warning", False):
                print("⚠️  Content Warning: High explicit content detected")
            if "error" in result:
                print(f"Error: {result['error']}")

        except Exception as e:
            print(f"Test Error: {e}")

        print("\\n")

    # Display processor statistics
    print("=== PROCESSOR STATISTICS ===")
    stats = processor.get_statistics()
    for key, value in stats.items():
        print(f"{key}: {value}")
