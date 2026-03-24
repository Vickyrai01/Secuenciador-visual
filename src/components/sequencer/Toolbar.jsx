import React, { useRef } from 'react';
import { Box, IconButton, Typography, Slider, Button } from '@mui/material';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import StopRounded from '@mui/icons-material/StopRounded';
import FileUploadRounded from '@mui/icons-material/FileUploadRounded';

export default function Toolbar({ 
  isPlaying, 
  onTogglePlay, 
  onStop, 
  bpm, 
  onBpmChange, 
  onAudioUpload,
  currentTime,
  duration
}) {
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      width: '100%',
      color: 'var(--text-primary)'
    }}>
      {/* Carga de Archivo */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <input
          type="file"
          accept="audio/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              onAudioUpload(e.target.files[0]);
            }
          }}
        />
        <Button 
          variant="contained" 
          startIcon={<FileUploadRounded />}
          onClick={handleFileClick}
          sx={{ 
            bgcolor: 'var(--bg-surface-elevated)', 
            color: 'var(--text-primary)',
            '&:hover': { bgcolor: 'var(--color-accent)', color: '#000' },
            textTransform: 'none',
            borderRadius: '8px'
          }}
        >
          Cargar Track
        </Button>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
          {duration > 0 ? `${formatTime(currentTime)} / ${formatTime(duration)}` : 'No track loaded'}
        </Typography>
      </Box>

      {/* Controles de Playback Centrales */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={onStop} sx={{ color: 'var(--text-primary)' }}>
          <StopRounded />
        </IconButton>
        <IconButton 
          onClick={onTogglePlay} 
          sx={{ 
            color: isPlaying ? 'var(--color-pause)' : 'var(--color-play)',
            bgcolor: 'var(--bg-surface-elevated)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
          }}
        >
          {isPlaying ? <PauseRounded fontSize="large" /> : <PlayArrowRounded fontSize="large" />}
        </IconButton>
      </Box>

      {/* BPM Input */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="subtitle2" sx={{ color: 'var(--text-secondary)' }}>BPM:</Typography>
        <input 
          type="number" 
          value={bpm}
          onChange={(e) => onBpmChange(e.target.value)}
          style={{ 
            width: '60px', 
            background: 'var(--bg-main)', 
            border: '1px solid var(--bg-surface-elevated)',
            color: 'var(--color-accent)',
            padding: '4px 8px',
            borderRadius: '4px',
            textAlign: 'center',
            fontWeight: 'bold',
            outline: 'none'
          }} 
        />
      </Box>
    </Box>
  );
}
