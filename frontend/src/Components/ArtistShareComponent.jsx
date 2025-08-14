import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Share2,
    Download,
    Copy,
    Twitter,
    Facebook,
    X,
    Check
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from './ui/dropdown-menu';

export const ShareArtistComponent = ({
    artistId,
    name,
    imageUrl,
    followers,
    popularity,
    genres = []
}) => {
    const canvasRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const shareUrl = `https://music-recommender-app.vercel.app/artist/${artistId}`;

    // Generate shareable image
    const generateShareImage = async () => {
        setIsGenerating(true);

        try {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            // Set canvas size
            canvas.width = 800;
            canvas.height = 600;

            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#1a1a1a');
            gradient.addColorStop(0.5, '#7c3aed'); // Purple theme for artists
            gradient.addColorStop(1, '#000000');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Load and draw artist image
            const img = new Image();
            img.crossOrigin = 'anonymous';

            return new Promise((resolve, reject) => {
                img.onload = () => {
                    try {
                        // Draw artist image as circle
                        const artSize = 250;
                        const artX = 75;
                        const artY = 175;

                        // Create circular clipping path
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(artX + artSize / 2, artY + artSize / 2, artSize / 2, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(img, artX, artY, artSize, artSize);
                        ctx.restore();

                        // Add ring around artist image
                        ctx.strokeStyle = '#7c3aed';
                        ctx.lineWidth = 6;
                        ctx.beginPath();
                        ctx.arc(artX + artSize / 2, artY + artSize / 2, artSize / 2 + 3, 0, Math.PI * 2);
                        ctx.stroke();

                        // Add shadow
                        ctx.shadowColor = 'rgba(124, 58, 237, 0.4)';
                        ctx.shadowBlur = 25;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 15;
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(artX + artSize / 2, artY + artSize / 2, artSize / 2 + 8, 0, Math.PI * 2);
                        ctx.stroke();
                        ctx.shadowColor = 'transparent';

                        // Artist name
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 42px Host Grotesk, Arial, sans-serif';
                        ctx.textAlign = 'left';

                        const maxNameWidth = 350;
                        const nameX = artX + artSize + 40;
                        const nameY = artY + 70;

                        // Wrap artist name if too long
                        const wrappedName = wrapText(ctx, name, maxNameWidth);
                        wrappedName.forEach((line, index) => {
                            ctx.fillText(line, nameX, nameY + (index * 20));
                        });

                        // Followers
                        ctx.fillStyle = '#ffffff';
                        ctx.font = '26px Host Grotesk, Arial, sans-serif';
                        ctx.fillText(`👥 ${followers.toLocaleString()} Followers`, nameX, nameY + 60);

                        // Popularity
                        if (popularity) {
                            ctx.fillStyle = popularity >= 80 ? '#22c55e' : '#eab308';
                            ctx.font = '24px Host Grotesk, Arial, sans-serif';
                            ctx.fillText(`⭐ Popularity: ${popularity}`, nameX, nameY + 100);

                            if (popularity >= 80) {
                                ctx.fillText('🔥', nameX + 200, nameY + 100);
                            }
                        }

                        // Genres (display first 3)
                        if (genres.length > 0) {
                            ctx.fillStyle = '#c084fc';
                            ctx.font = '20px Host Grotesk, Arial, sans-serif';
                            const displayGenres = genres.slice(0, 3);
                            const genresText = `🎵 ${displayGenres.join(' • ')}`;

                            // Wrap genres if too long
                            const wrappedGenres = wrapText(ctx, genresText, maxNameWidth);
                            wrappedGenres.forEach((line, index) => {
                                ctx.fillText(line, nameX, nameY + 135 + (index * 25));
                            });
                        }

                        // Artist badge/label
                        ctx.fillStyle = '#7c3aed';
                        ctx.fillRect(nameX, nameY + 180, 80, 30);
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 16px Host Grotesk, Arial, sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('ARTIST', nameX + 40, nameY + 200);
                        ctx.textAlign = 'left';

                        // App branding
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                        ctx.font = 'bold 22px Host Grotesk, Arial, sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('Discover More on GrooveEstrella', canvas.width / 2, canvas.height - 100);

                        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                        ctx.font = '16px Host Grotesk, Arial, sans-serif';
                        ctx.fillText(shareUrl, canvas.width / 2, canvas.height - 70);

                        // Decorative elements - musical symbols
                        drawMusicalSymbols(ctx, canvas.width, canvas.height);

                        setIsGenerating(false);
                        resolve(canvas);
                    } catch (error) {
                        setIsGenerating(false);
                        reject(error);
                    }
                };

                img.onerror = () => {
                    setIsGenerating(false);
                    reject(new Error('Failed to load artist image'));
                };

                img.src = imageUrl;
            });
        } catch (error) {
            setIsGenerating(false);
            console.error('Error generating share image:', error);
        }
    };

    // Helper function to wrap text
    const wrapText = (ctx, text, maxWidth) => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    };

    // Draw decorative musical symbols
    const drawMusicalSymbols = (ctx, width, height) => {
        ctx.fillStyle = 'rgba(124, 58, 237, 0.15)';

        // Musical symbols positioned around the canvas
        const symbols = [
            { x: width - 120, y: 60, type: 'note' },
            { x: width - 80, y: 100, type: 'treble' },
            { x: width - 150, y: height - 250, type: 'note' },
            { x: 50, y: 80, type: 'music' },
            { x: width - 60, y: height - 150, type: 'note' }
        ];

        symbols.forEach(symbol => {
            ctx.save();
            ctx.translate(symbol.x, symbol.y);

            if (symbol.type === 'note') {
                // Simple music note
                ctx.beginPath();
                ctx.arc(0, 0, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillRect(10, -24, 3, 24);
            } else if (symbol.type === 'treble') {
                // Simplified treble clef shape
                ctx.beginPath();
                ctx.arc(0, 0, 15, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(0, -10, 8, 0, Math.PI * 2);
                ctx.fill();
            } else if (symbol.type === 'music') {
                // Double music note
                ctx.beginPath();
                ctx.arc(-8, 0, 10, 0, Math.PI * 2);
                ctx.arc(8, 0, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillRect(-6, -20, 2, 20);
                ctx.fillRect(6, -20, 2, 20);
            }

            ctx.restore();
        });
    };

    // Download generated image
    const downloadImage = async () => {
        const canvas = await generateShareImage();
        if (canvas) {
            const link = document.createElement('a');
            link.download = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_artist_share.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    // Copy link to clipboard
    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    // Social media share functions
    const shareOnTwitter = () => {
        const text = `🎤 Check out ${name} on GrooveEstrella! Amazing artist with ${followers.toLocaleString()} followers.`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
    };

    const shareOnFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
    };

    const shareOnWhatsApp = () => {
        const text = `🎤 Check out ${name} on GrooveEstrella! ${shareUrl}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    // Native share API (if supported)
    const shareNative = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${name} - Artist Profile`,
                    text: `Check out this amazing artist on GrooveEstrella!`,
                    url: shareUrl
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        }
    };

    return (
        <>
            <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
                width={800}
                height={600}
            />

            <DropdownMenu className="noskip" >
                <DropdownMenuTrigger asChild>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white"
                        disabled={isGenerating}
                    >
                        <Share2 size={18} />
                    </motion.button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="bg-black/90 backdrop-blur-md text-white min-w-[200px] rounded-xl border border-white/20 p-2">
                    <DropdownMenuItem
                        onSelect={copyLink}
                        className="cursor-pointer px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {copied ? (
                            <>
                                <Check className="mr-2" size={16} />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="mr-2" size={16} />
                                Copy Link
                            </>
                        )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onSelect={downloadImage}
                        className="cursor-pointer px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
                        disabled={isGenerating}
                    >
                        <Download className="mr-2" size={16} />
                        {isGenerating ? 'Generating...' : 'Download Image'}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-2 bg-white/20" />

                    {navigator.share && (
                        <>
                            <DropdownMenuItem
                                onSelect={shareNative}
                                className="cursor-pointer px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Share2 className="mr-2" size={16} />
                                Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-2 bg-white/20" />
                        </>
                    )}

                    <DropdownMenuItem
                        onSelect={shareOnTwitter}
                        className="cursor-pointer px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="mr-2" size={16} />
                        Twitter/X
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onSelect={shareOnFacebook}
                        className="cursor-pointer px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <Facebook className="mr-2" size={16} />
                        Facebook
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onSelect={shareOnWhatsApp}
                        className="cursor-pointer px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.688" />
                        </svg>
                        WhatsApp
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};