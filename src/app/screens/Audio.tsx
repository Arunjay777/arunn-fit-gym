import React, { useState } from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Headphones, Radio, ListMusic } from 'lucide-react';

export default function Audio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(75);

  const playlists = [
    {
      name: 'POWER LIFTING',
      tracks: 12,
      duration: '48 min',
      color: '#FF3366',
      icon: '💪',
      description: 'Heavy metal & hard rock for max strength'
    },
    {
      name: 'CARDIO ZONE',
      tracks: 20,
      duration: '72 min',
      color: '#00D4FF',
      icon: '⚡',
      description: 'High-energy EDM for endurance training'
    },
    {
      name: 'FOCUS FLOW',
      tracks: 15,
      duration: '60 min',
      color: '#10B981',
      icon: '🎯',
      description: 'Instrumental beats for concentration'
    },
    {
      name: 'WARM UP',
      tracks: 8,
      duration: '24 min',
      color: '#F59E0B',
      icon: '🔥',
      description: 'Upbeat tracks to get you moving'
    }
  ];

  const currentPlaylist = [
    { title: 'Eye of the Tiger', artist: 'Survivor', duration: '4:05' },
    { title: 'Till I Collapse', artist: 'Eminem', duration: '4:57' },
    { title: 'Thunderstruck', artist: 'AC/DC', duration: '4:52' },
    { title: 'Remember the Name', artist: 'Fort Minor', duration: '3:50' },
    { title: 'Lose Yourself', artist: 'Eminem', duration: '5:26' },
  ];

  const workoutMixes = [
    { name: 'Chest Day Beast Mode', bpm: 140, tracks: 18 },
    { name: 'Leg Day Crusher', bpm: 145, tracks: 16 },
    { name: 'HIIT Intensity', bpm: 160, tracks: 22 },
    { name: 'Recovery Vibes', bpm: 90, tracks: 12 },
  ];

  return (
    <div className="min-h-screen p-8">
      <TacticalHeader title="AUDIO SYSTEM" subtitle="WORKOUT MUSIC CONTROL CENTER" />

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2">
          <TacticalCard glow>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Music className="w-6 h-6" style={{ color: '#00D4FF' }} />
                <div className="font-mono font-bold text-sm" style={{ color: '#00D4FF' }}>NOW PLAYING</div>
              </div>
              <div className="font-mono text-3xl mb-2" style={{ color: '#FFFFFF' }}>
                {currentPlaylist[currentTrack].title}
              </div>
              <div className="font-mono text-lg" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>
                {currentPlaylist[currentTrack].artist}
              </div>
            </div>

            <div className="mb-6">
              <div className="w-full h-2 rounded mb-2" style={{ background: 'rgba(26, 26, 26, 0.6)' }}>
                <div className="h-full rounded" style={{ width: '45%', background: '#00D4FF' }} />
              </div>
              <div className="flex justify-between font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>
                <span>1:52</span>
                <span>{currentPlaylist[currentTrack].duration}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mb-6">
              <button className="p-3 rounded transition-all hover:bg-[rgba(0,212,255,0.1)]">
                <SkipBack className="w-6 h-6" style={{ color: '#00D4FF' }} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-6 rounded-full transition-all hover:bg-[rgba(0,212,255,0.2)]"
                style={{ background: '#00D4FF' }}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-[#030303]" />
                ) : (
                  <Play className="w-8 h-8 text-[#030303]" />
                )}
              </button>
              <button className="p-3 rounded transition-all hover:bg-[rgba(0,212,255,0.1)]">
                <SkipForward className="w-6 h-6" style={{ color: '#00D4FF' }} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <Volume2 className="w-5 h-5" style={{ color: '#00D4FF' }} />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 h-2 rounded appearance-none"
                style={{
                  background: `linear-gradient(to right, #00D4FF 0%, #00D4FF ${volume}%, rgba(26, 26, 26, 0.6) ${volume}%, rgba(26, 26, 26, 0.6) 100%)`
                }}
              />
              <span className="font-mono text-sm" style={{ color: '#00D4FF', width: '40px' }}>{volume}%</span>
            </div>
          </TacticalCard>

          <TacticalCard className="mt-6">
            <div className="mb-4 flex items-center gap-2">
              <ListMusic className="w-5 h-5" style={{ color: '#00D4FF' }} />
              <div className="font-mono font-bold text-sm" style={{ color: '#00D4FF' }}>CURRENT QUEUE</div>
            </div>
            <div className="space-y-2">
              {currentPlaylist.map((track, index) => (
                <div
                  key={index}
                  className={`p-3 rounded cursor-pointer transition-all ${index === currentTrack ? 'bg-[rgba(0,212,255,0.2)]' : 'hover:bg-[rgba(0,212,255,0.05)]'}`}
                  style={{ border: index === currentTrack ? '1px solid #00D4FF' : '1px solid rgba(255, 255, 255, 0.05)' }}
                  onClick={() => setCurrentTrack(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {index === currentTrack && isPlaying ? (
                        <div className="flex gap-1">
                          <div className="w-1 h-4 bg-[#00D4FF] animate-pulse" />
                          <div className="w-1 h-4 bg-[#00D4FF] animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <div className="w-1 h-4 bg-[#00D4FF] animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                      ) : (
                        <div className="w-8 text-center font-mono text-sm" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>
                          {index + 1}
                        </div>
                      )}
                      <div>
                        <div className="font-mono font-bold text-sm" style={{ color: index === currentTrack ? '#00D4FF' : '#FFFFFF' }}>
                          {track.title}
                        </div>
                        <div className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>
                          {track.artist}
                        </div>
                      </div>
                    </div>
                    <div className="font-mono text-sm" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>
                      {track.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TacticalCard>
        </div>

        <div className="space-y-6">
          <TacticalCard>
            <div className="mb-4 flex items-center gap-2">
              <Headphones className="w-5 h-5" style={{ color: '#00D4FF' }} />
              <div className="font-mono font-bold text-sm" style={{ color: '#00D4FF' }}>WORKOUT PLAYLISTS</div>
            </div>
            <div className="space-y-3">
              {playlists.map((playlist) => (
                <button
                  key={playlist.name}
                  className="w-full p-4 rounded text-left transition-all hover:bg-[rgba(0,212,255,0.1)]"
                  style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{playlist.icon}</div>
                    <div className="flex-1">
                      <div className="font-mono font-bold text-sm mb-1" style={{ color: playlist.color }}>
                        {playlist.name}
                      </div>
                      <div className="font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>
                        {playlist.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>
                    <span>{playlist.tracks} tracks</span>
                    <span>•</span>
                    <span>{playlist.duration}</span>
                  </div>
                </button>
              ))}
            </div>
          </TacticalCard>

          <TacticalCard>
            <div className="mb-4 flex items-center gap-2">
              <Radio className="w-5 h-5" style={{ color: '#00D4FF' }} />
              <div className="font-mono font-bold text-sm" style={{ color: '#00D4FF' }}>WORKOUT MIXES</div>
            </div>
            <div className="space-y-2">
              {workoutMixes.map((mix) => (
                <div
                  key={mix.name}
                  className="p-3 rounded"
                  style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <div className="font-mono font-bold text-sm mb-1" style={{ color: '#00D4FF' }}>
                    {mix.name}
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs" style={{ color: 'rgba(0, 212, 255, 0.5)' }}>
                    <span>{mix.bpm} BPM</span>
                    <span>•</span>
                    <span>{mix.tracks} tracks</span>
                  </div>
                </div>
              ))}
            </div>
          </TacticalCard>
        </div>
      </div>
    </div>
  );
}
