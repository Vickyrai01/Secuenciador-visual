import React, { useRef, useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import FastForwardRounded from "@mui/icons-material/FastForwardRounded";
import FastRewindRounded from "@mui/icons-material/FastRewindRounded";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";
import VolumeDownRounded from "@mui/icons-material/VolumeDownRounded";
import formatDuration from "../../logic/audioPlayerLogic.js";

const Widget = styled("div")(() => ({
  padding: 16,
  borderRadius: 16,
  width: 343,
  maxWidth: "100%",
  margin: "auto",
  position: "relative",
  zIndex: 1,
  backgroundColor: "rgba(255,255,255,0.4)",
  backdropFilter: "blur(40px)",
}));

const TinyText = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.6,
  fontWeight: 500,
  letterSpacing: 0.2,
});

export default function AudioPlayerMui({ audioFile }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [audioUrl, setAudioUrl] = useState(null);

  // Crea y limpia el blob URL cuando cambia el archivo
  useEffect(() => {
    if (!audioFile) {
      setAudioUrl(null);
      return;
    }
    if (typeof audioFile === "string") {
      setAudioUrl(audioFile);
      return;
    }
    const url = URL.createObjectURL(audioFile);
    setAudioUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [audioFile]);

  // Reset player when cambia el archivo
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audioUrl]);

  // Play/pause sync
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Slider mueve el audio
  const handleSliderChange = (_, value) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  // Volumen
  const handleVolumeChange = (_, value) => {
    setVolume(value / 100);
    if (audioRef.current) audioRef.current.volume = value / 100;
  };

  // Adelanta/retrocede 10s
  const handleRewind = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(
      0,
      audioRef.current.currentTime - 10,
    );
  };
  const handleForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(
      duration,
      audioRef.current.currentTime + 10,
    );
  };

  if (!audioUrl) return null;

  return (
    <Box sx={{ width: "100%", overflow: "hidden", position: "relative", p: 3 }}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={() => setIsPlaying(false)}
        style={{ display: "none" }}
      />
      <Widget>
        <Typography sx={{ fontWeight: 500, mb: 1 }}>Audio Player</Typography>
        <Slider
          aria-label="time-indicator"
          size="small"
          value={currentTime}
          min={0}
          step={0.01}
          max={duration}
          onChange={handleSliderChange}
          sx={{
            color: "rgba(0,0,0,0.87)",
            height: 4,
            "& .MuiSlider-thumb": { width: 12, height: 12 },
            "& .MuiSlider-rail": { opacity: 0.28 },
          }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: -2,
          }}
        >
          <TinyText>{formatDuration(currentTime)}</TinyText>
          <TinyText>-{formatDuration(duration - currentTime)}</TinyText>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <IconButton aria-label="previous" onClick={handleRewind}>
            <FastRewindRounded fontSize="large" />
          </IconButton>
          <IconButton
            aria-label={isPlaying ? "pause" : "play"}
            onClick={() => setIsPlaying((p) => !p)}
          >
            {isPlaying ? (
              <PauseRounded sx={{ fontSize: "2.5rem" }} />
            ) : (
              <PlayArrowRounded sx={{ fontSize: "2.5rem" }} />
            )}
          </IconButton>
          <IconButton aria-label="next" onClick={handleForward}>
            <FastForwardRounded fontSize="large" />
          </IconButton>
        </Box>
        <Stack
          spacing={2}
          direction="row"
          sx={{ mb: 1, px: 1 }}
          alignItems="center"
        >
          <VolumeDownRounded />
          <Slider
            aria-label="Volume"
            value={volume * 100}
            min={0}
            max={100}
            onChange={handleVolumeChange}
            sx={{
              color: "rgba(0,0,0,0.87)",
              "& .MuiSlider-thumb": {
                width: 16,
                height: 16,
                backgroundColor: "#fff",
              },
            }}
          />
          <VolumeUpRounded />
        </Stack>
      </Widget>
    </Box>
  );
}
