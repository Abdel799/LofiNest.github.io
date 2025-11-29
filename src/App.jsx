import { useRef, useState, useEffect } from 'react';
import Dashboard from './Dashboard/Dashboard.jsx'
import Music from './Music/Music.jsx'
import Chatbot from './Chatbot/Chatbot.jsx'
import Calendar from './Calendar/Calendar.jsx'
import Notes from './Notes/Notes.jsx'
import StudyJam from './StudyJam/StudyJam.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useMemo } from "react";
import { TimerProvider } from './TimerContext.jsx';

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isYouTubeReady, setIsYouTubeReady] = useState(false)
  
  const youtubePlayerRef = useRef(null)
  const playerIntervalRef = useRef(null)
  const shouldPlayRef = useRef(false) // Track intended play state

  const gifs = ["2gif.gif", "bear.gif", "chill.gif", "gif.gif", "gif4.gif", "gif5.gif", "gif8.gif", "gif9.gif", "night.gif"]

  const randomGif = useMemo(() => {
    const index = Math.floor(Math.random() * gifs.length);
    return gifs[index];
  }, []);

  const songs = [
    {name: "Hip Hop Radio 📚", youtubeId: 'jfKfPfyJRdk', img: '/Lofi-1.jpg'},
    {name: "Jazz Radio 🎵", youtubeId: 'HuFYqnbVbzY', img: '/Lofi-1.jpg'},
    {name: "Chill Beats Radio 🌙", youtubeId: '28KRPhVzCus', img: '/Lofi-1.jpg'},
    {name: "Study Beats Radio 📖", youtubeId: '1oDrJba2PSs', img: '/Lofi-1.jpg'},
    {name: "Synthwave Radio 🌆", youtubeId: '4xDzrJKXOOY', img: '/Lofi-1.jpg'},
    {name: "Calm Radio 🌊", youtubeId: 'E_XmwjgRLz8', img: '/Lofi-1.jpg'}
  ];

  // Load YouTube IFrame API on mount
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube API loaded');
        setIsYouTubeReady(true);
      };
    } else if (window.YT && window.YT.Player) {
      setIsYouTubeReady(true);
    }
  }, []);

  // Initialize YouTube player
  useEffect(() => {
    if (isYouTubeReady && !youtubePlayerRef.current) {
      youtubePlayerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: songs[0].youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
        },
        events: {
          onReady: () => {
            console.log('YouTube player ready');
          },
          onStateChange: (event) => {
            // Only update UI state when player actually changes, not from our commands
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              shouldPlayRef.current = true;
              startTimeTracking();
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              // Only set to false if we're not trying to play
              if (!shouldPlayRef.current) {
                setIsPlaying(false);
              }
              stopTimeTracking();
            } else if (event.data === window.YT.PlayerState.ENDED) {
              nextSong();
            }
          },
        },
      });
    }
  }, [isYouTubeReady]);

  // Track current time and duration
  const startTimeTracking = () => {
    if (playerIntervalRef.current) return;
    
    playerIntervalRef.current = setInterval(() => {
      if (youtubePlayerRef.current && youtubePlayerRef.current.getCurrentTime) {
        const current = youtubePlayerRef.current.getCurrentTime();
        const dur = youtubePlayerRef.current.getDuration();
        setCurrentTime(current);
        setDuration(dur);
      }
    }, 100);
  };

  const stopTimeTracking = () => {
    if (playerIntervalRef.current) {
      clearInterval(playerIntervalRef.current);
      playerIntervalRef.current = null;
    }
  };

  // Handle song changes
  useEffect(() => {
    if (youtubePlayerRef.current && youtubePlayerRef.current.loadVideoById) {
      const wasPlaying = shouldPlayRef.current;
      
      stopTimeTracking();
      setCurrentTime(0);
      
      // Keep the playing state if it was playing
      if (wasPlaying) {
        setIsPlaying(true); // Keep UI showing play state
      }

      // Load new video and auto-play if needed
      if (wasPlaying) {
        youtubePlayerRef.current.loadVideoById({
          videoId: songs[currentSong].youtubeId,
          startSeconds: 0
        });
        // Player will auto-start due to loadVideoById behavior
      } else {
        youtubePlayerRef.current.cueVideoById({
          videoId: songs[currentSong].youtubeId,
          startSeconds: 0
        });
      }
    }
  }, [currentSong]);

  const handlePlay = async () => {
    shouldPlayRef.current = true;
    setIsPlaying(true); // Update UI immediately
    if (youtubePlayerRef.current && youtubePlayerRef.current.playVideo) {
      youtubePlayerRef.current.playVideo();
    }
  };

  const handlePause = () => {
    shouldPlayRef.current = false;
    setIsPlaying(false); // Update UI immediately
    if (youtubePlayerRef.current && youtubePlayerRef.current.pauseVideo) {
      youtubePlayerRef.current.pauseVideo();
    }
  };

  const nextSong = () => {
    setCurrentSong((index) => {
      if (index >= songs.length - 1) { 
        return 0;
      } else { 
        return index + 1;
      }
    })
  }

  const prevSong = () => {
    setCurrentSong((index) => {
      if (index == 0) { 
        return songs.length - 1;
      } else { 
        return index - 1;
      }
    })
  }

  const updateBar = (e) => {
    const bar = e.currentTarget
    const clickPos = e.nativeEvent.offsetX
    const barWidth = bar.clientWidth
    const clickPercent = clickPos / barWidth
    const newTime = clickPercent * duration 

    if (youtubePlayerRef.current && youtubePlayerRef.current.seekTo) {
      youtubePlayerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimeTracking();
    };
  }, []);

  // Music player props to pass down
  const musicProps = {
    isPlaying,
    currentSong,
    currentTime,
    duration,
    songs,
    handlePlay,
    handlePause,
    nextSong,
    prevSong,
    updateBar
  };

  return (
    <>
      <TimerProvider>
        <Router>
          <Dashboard/>
        
          {/* Hidden YouTube player */}
          <div id="youtube-player" style={{ display: 'none' }} />

          <Routes>
            <Route path="/" element={
              <>
                <div className="gif-background" style={{ backgroundImage: `url(${randomGif})` }}>
                  <h1 className="intro">Welcome!</h1>
                  <Music {...musicProps} />
                </div>
              </>
            } />

            <Route path="/chat" element={<Chatbot />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/studyjam" element={<StudyJam />} />
          </Routes>
       
        </Router>
      </TimerProvider>
      
    </>
  );
}

export default App