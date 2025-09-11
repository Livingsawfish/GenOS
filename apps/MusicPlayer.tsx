
import React, { useState, useRef, useEffect } from 'react';
import { MusicPlayerIcon } from '../components/icons';

interface MusicPlayerProps {
    initialContent?: string;
    filePath?: string;
}

const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const MusicPlayer: React.FC<MusicPlayerProps> = ({ initialContent, filePath }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        
        const setAudioData = () => {
            setDuration(audio.duration);
            setCurrentTime(audio.currentTime);
        }

        const setAudioTime = () => setCurrentTime(audio.currentTime);
        const handleEnd = () => setIsPlaying(false);

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', handleEnd);

        // Auto-play on open
        audio.play().then(() => setIsPlaying(true)).catch(e => console.error("Autoplay failed", e));


        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', handleEnd);
        }
    }, []);

    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = Number(e.target.value);
        if(audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    }

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(e.target.value);
        if(audioRef.current) {
            audioRef.current.volume = newVolume;
            setVolume(newVolume);
        }
    }

    const trackName = filePath?.split(/[/\\]/).pop() || 'Untitled Track';

    if (!initialContent) {
        return (
          <div className="h-full flex items-center justify-center bg-gray-900 rounded-b-lg text-red-400">
            No audio file loaded.
          </div>
        );
    }
    
    return (
        <div className="h-full flex flex-col items-center justify-center bg-gray-900/80 rounded-b-lg p-4 text-white">
            <audio ref={audioRef} src={initialContent} />
            <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <MusicPlayerIcon className="w-20 h-20 text-cyan-400"/>
            </div>
            <h2 className="text-lg font-semibold truncate max-w-full">{trackName}</h2>
            <p className="text-sm text-gray-400 mb-4">GeminiOS Music</p>
            
            <div className="w-full max-w-xs">
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleProgressChange}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer range-sm"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            <div className="flex items-center gap-4 my-4">
                <button className="p-2 rounded-full hover:bg-white/10" aria-label="Previous track" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M20.25 3.75h-16.5A.75.75 0 003 4.5v15a.75.75 0 00.75.75h16.5a.75.75 0 00.75-.75V4.5a.75.75 0 00-.75-.75zm-16.5 1.5h16.5v13.5H3.75V5.25z" /><path d="M12 8.25a.75.75 0 00-.75.75v6a.75.75 0 001.5 0v-6a.75.75 0 00-.75-.75zM9 9.75a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3a.75.75 0 00-.75-.75zM15 9.75a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3a.75.75 0 00-.75-.75z" /></svg>
                </button>
                <button onClick={handlePlayPause} className="p-4 bg-cyan-500 rounded-full hover:bg-cyan-600 shadow-lg" aria-label={isPlaying ? "Pause" : "Play"}>
                    {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
                    )}
                </button>
                <button className="p-2 rounded-full hover:bg-white/10" aria-label="Next track" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3.75 3.75h16.5a.75.75 0 01.75.75v15a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V4.5a.75.75 0 01.75-.75zM5.25 5.25v13.5h13.5V5.25H5.25z" /><path d="M12 8.25a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0v-6a.75.75 0 01.75.75zM9.75 9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75zM14.25 9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75z" /></svg>
                </button>
            </div>
            <div className="flex items-center gap-2 w-full max-w-xs">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer range-sm"
                    aria-label="Volume"
                />
            </div>
        </div>
    );
};

export default MusicPlayer;
