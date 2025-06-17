import React, { useState, useEffect } from 'react';
import { Smartphone, MonitorSmartphone, Music, Expand, ChevronUp, ChevronDown } from 'lucide-react';

export default function SpotifyDevices({ isPremium }) {
    const [devices, setDevices] = useState([]);
    const [expanded, setExpanded] = useState(false);

    const fetchDevices = async () => {
        try {
            const res = await fetch('https://music-recommender-api.onrender.com/player/devices', {
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setDevices(data.devices);
            }
        } catch (err) {
            console.error('[ERROR] Fetching devices:', err);
        }
    };

    const transferPlayback = async (deviceId) => {
        try {
            console.log(deviceId);

            const res = await fetch('https://music-recommender-api.onrender.com/player/transfer', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    device_ids: [deviceId], // ✅ correct key and correct format (array)
                }),

            });

            if (res.ok) {
                await fetchDevices(); // Refresh state
            } else {
                const error = await res.json();
                console.error('[TRANSFER ERROR]', error);
            }
        } catch (err) {
            console.error('[ERROR] Transferring playback:', err);
        }
    };

    useEffect(() => {
        if (isPremium) {
            fetchDevices();
        }
    }, [isPremium]);

    const getIcon = (type) => {
        switch (type) {
            case 'Smartphone':
                return <Smartphone className="w-4 h-4 mr-1 inline" />;
            case 'Computer':
                return <MonitorSmartphone className="w-4 h-4 mr-1 inline" />;
            default:
                return <Music className="w-4 h-4 mr-1 inline" />;
        }
    };

    const activeDevice = devices.find(d => d.is_active);

    return (
        <div className="p-2 border rounded bg-green-100 text-green-900">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center">
                    {getIcon(activeDevice?.type)}
                    <span className="font-semibold">{activeDevice?.name || "No Active Device"}</span>
                    <span className="text-xs ml-2 text-gray-600">({activeDevice?.type})</span>
                </div>
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>

            {expanded && (
                <div className="mt-2 space-y-2">
                    {devices.map((device) => (
                        <div
                            key={device.id}
                            className={`flex items-center justify-between px-2 py-1 rounded ${device.is_active ? 'bg-green-200' : 'bg-white hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center">
                                {getIcon(device.type)}
                                <div>
                                    <div className="font-medium">{device.name}</div>
                                    <div className="text-xs text-gray-600">{device.type}</div>
                                </div>
                            </div>
                            {!device.is_active && (
                                <button
                                    onClick={() => transferPlayback(device.id)}
                                    className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                >
                                    Transfer
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
