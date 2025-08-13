import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Share2, 
    Download, 
    Copy, 
    Twitter, 
    Facebook, 
    Instagram,
    X,
    Check
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '../ui/dropdown-menu';

export const ShareTrackComponent = ({
    trackId,
    title,
    artist,
    url, // album art
    popularity,
    explicit
}) => {
    const canvasRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const shareUrl = `https://music-recommender-app.vercel.app/track/${trackId}`;

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
            gradient.addColorStop(0.5, '#2d1b69');
            gradient.addColorStop(1, '#000000');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Load and draw album art
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    try {
                        // Draw album art with rounded corners effect
                        const artSize = 300;
                        const artX = 50;
                        const artY = 150;
                        
                        // Create rounded rectangle clipping path
                        ctx.save();
                        ctx.beginPath();
                        ctx.roundRect(artX, artY, artSize, artSize, 20);
                        ctx.clip();
                        ctx.drawImage(img, artX, artY, artSize, artSize);
                        ctx.restore();

                        // Add shadow to album art
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                        ctx.shadowBlur = 20;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 10;
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.roundRect(artX, artY, artSize, artSize, 20);
                        ctx.stroke();
                        ctx.shadowColor = 'transparent';

                        // Song title
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 36px Inter, Arial, sans-serif';
                        ctx.textAlign = 'left';
                        
                        const maxTitleWidth = 350;
                        const titleX = artX + artSize + 40;
                        const titleY = artY + 60;
                        
                        // Wrap title text if too long
                        const wrappedTitle = wrapText(ctx, title, maxTitleWidth);
                        wrappedTitle.forEach((line, index) => {
                            ctx.fillText(line, titleX, titleY + (index * 45));
                        });

                        // Artist names
                        ctx.fillStyle = '#b3b3b3';
                        ctx.font = '28px Inter, Arial, sans-serif';
                        const artistText = Array.isArray(artist) 
                            ? artist.map(a => a.name).join(', ')
                            : artist;
                        
                        const wrappedArtist = wrapText(ctx, artistText, maxTitleWidth);
                        wrappedArtist.forEach((line, index) => {
                            ctx.fillText(line, titleX, titleY + 100 + (index * 35));
                        });

                        // Popularity indicator
                        if (popularity) {
                            ctx.fillStyle = popularity >= 80 ? '#22c55e' : '#eab308';
                            ctx.font = '24px Inter, Arial, sans-serif';
                            ctx.fillText(`🎵 Popularity: ${popularity}`, titleX, titleY + 180);
                            
                            if (popularity >= 80) {
                                ctx.fillText('🔥', titleX + 200, titleY + 180);
                            }
                        }

                        // Explicit badge
                        if (explicit) {
                            ctx.fillStyle = '#ef4444';
                            ctx.fillRect(titleX, titleY + 200, 60, 25);
                            ctx.fillStyle = '#ffffff';
                            ctx.font = 'bold 14px Inter, Arial, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('E', titleX + 30, titleY + 217);
                            ctx.textAlign = 'left';
                        }

                        // App branding
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        ctx.font = '20px Inter, Arial, sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('Listen on MyApp', canvas.width / 2, canvas.height - 100);
                        
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                        ctx.font = '16px Inter, Arial, sans-serif';
                        ctx.fillText(shareUrl, canvas.width / 2, canvas.height - 70);

                        // Decorative elements
                        drawMusicNotes(ctx, canvas.width, canvas.height);

                        setIsGenerating(false);
                        resolve(canvas);
                    } catch (error) {
                        setIsGenerating(false);
                        reject(error);
                    }
                };
                
                img.onerror = () => {
                    setIsGenerating(false);
                    reject(new Error('Failed to load album art'));
                };
                
                img.src = url;
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

    // Draw decorative music notes
    const drawMusicNotes = (ctx, width, height) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        
        // Simple music note shapes
        const notes = [
            { x: width - 100, y: 50, size: 20 },
            { x: width - 150, y: 80, size: 15 },
            { x: width - 80, y: height - 200, size: 18 },
        ];

        notes.forEach(note => {
            ctx.beginPath();
            ctx.arc(note.x, note.y, note.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Note stem
            ctx.fillRect(note.x + note.size - 2, note.y - note.size * 2, 3, note.size * 2);
        });
    };

    // Download generated image
    const downloadImage = async () => {
        const canvas = await generateShareImage();
        if (canvas) {
            const link = document.createElement('a');
            link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_share.png`;
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
        const text = `🎵 Check out "${title}" by ${Array.isArray(artist) ? artist.map(a => a.name).join(', ') : artist}`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
    };

    const shareOnFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
    };

    const shareOnWhatsApp = () => {
        const text = `🎵 Check out "${title}" by ${Array.isArray(artist) ? artist.map(a => a.name).join(', ') : artist} ${shareUrl}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    // Native share API (if supported)
    const shareNative = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${title} - ${Array.isArray(artist) ? artist.map(a => a.name).join(', ') : artist}`,
                    text: `Check out this amazing track!`,
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
            
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white"
                        disabled={isGenerating}
                    >
                        <Share2 size={16} />
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
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.688"/>
                        </svg>
                        WhatsApp
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};