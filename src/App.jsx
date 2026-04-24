import React, { useState, useRef, useEffect, useMemo } from "react";
import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import "./App.css";
import Toolbar from "./components/sequencer/Toolbar.jsx";
import TrackList from "./components/sequencer/TrackList.jsx";
import TrackGrid from "./components/sequencer/TrackGrid.jsx";
import RhythmPalette from "./components/sequencer/RhythmPalette.jsx";

// Un AudioPlayer invisible que maneja la lógica
const HiddenAudioPlayer = React.memo(function HiddenAudioPlayer({ src, isPlaying, onTimeUpdate, onDurationLoaded, onEnded, stopTrigger }) {
  // ... sin cambios en el audio player
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Auto-play prevented", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, src]);

  useEffect(() => {
    if (audioRef.current && stopTrigger > 0) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [stopTrigger]);

  if (!src) return null;

  return (
    <audio
      ref={audioRef}
      src={src}
      onTimeUpdate={() => onTimeUpdate(audioRef.current.currentTime)}
      onLoadedMetadata={() => onDurationLoaded(audioRef.current.duration)}
      onEnded={onEnded}
      style={{ display: "none" }}
    />
  );
});

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stopTrigger, setStopTrigger] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Memorizar y limpiar el Blob URL para no recrearlo en cada render
  const audioSrc = useMemo(() => {
    if (!audioFile) return null;
    if (typeof audioFile === 'string') return audioFile;
    return URL.createObjectURL(audioFile);
  }, [audioFile]);

  // Limpiar el blob cuando cambia el archivo
  useEffect(() => {
    return () => {
      if (audioSrc && typeof audioSrc !== 'string') {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [audioSrc]);

  // Estado global de ritmos (paleta con pattern de 8 pasos para "1 Y 2 Y 3 Y 4 Y", con 3 filas: HH, SD, BD)
  const defaultPattern = Array(8).fill(false);
  const defaultGrid = () => [[...defaultPattern], [...defaultPattern], [...defaultPattern]];

  const [rhythms, setRhythms] = useState([
    { id: 'r1', name: 'RITMO 1', color: '#1db954', pattern: defaultGrid() },
    { id: 'r2', name: 'RITMO 2', color: '#d81b60', pattern: defaultGrid() },
    { id: 'r3', name: 'RITMO 3', color: '#1e88e5', pattern: defaultGrid() },
    { id: 'r4', name: 'RITMO 4', color: '#fdd835', pattern: defaultGrid() }
  ]);
  const [activeRhythmId, setActiveRhythmId] = useState('r1');

  // Funciones de la paleta
  const handleAddRhythm = () => {
    const newId = `r${Date.now()}`;
    // generar color aleatorio saturado y oscuro estilo neón p/ el tema DAW
    const hue = Math.floor(Math.random() * 360);
    const newColor = `hsl(${hue}, 80%, 60%)`;

    setRhythms(prev => [...prev, { id: newId, name: `RITMO ${prev.length + 1}`, color: newColor, pattern: defaultGrid() }]);
    setActiveRhythmId(newId);
  };
  const handleChangeRhythmName = (id, newName) => {
    setRhythms(prev => prev.map(r => r.id === id ? { ...r, name: newName } : r));
  };
  const handleChangeRhythmColor = (id, newColor) => {
    setRhythms(prev => prev.map(r => r.id === id ? { ...r, color: newColor } : r));
  };
  const handleToggleRhythmStep = (id, rowIdx, stepIdx) => {
    setRhythms(prev => prev.map(r => {
      if (r.id === id) {
        const newPattern = r.pattern.map(row => [...row]);
        newPattern[rowIdx][stepIdx] = !newPattern[rowIdx][stepIdx];
        return { ...r, pattern: newPattern };
      }
      return r;
    }));
  };

  const handleDeleteRhythm = (id) => {
    // Si queremos eliminar un ritmo, limpiamos también la grilla de aquellos cuadraditos que lo contenían
    setSections(prev => prev.map(sec => {
      const newGrid = sec.activeGrid.map(cellVal => {
        const rhythmId = typeof cellVal === 'object' && cellVal !== null ? cellVal.rhythmId : cellVal;
        const text = typeof cellVal === 'object' && cellVal !== null ? cellVal.text : '';
        if (rhythmId === id) {
          return text ? { rhythmId: null, text } : null;
        }
        return cellVal;
      });
      return { ...sec, activeGrid: newGrid };
    }));

    setRhythms(prev => {
      const remaining = prev.filter(r => r.id !== id);
      if (id === activeRhythmId) {
        // Asignamos otro que quede disponible, si no queda nada, setea null
        setActiveRhythmId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
  };


  // Estado para la estructura de la canción escalonada (mapa secuencial)
  const defaultLength = 8;
  const [sections, setSections] = useState([
    { name: "INTRO", color: "var(--color-intro)", length: defaultLength, activeGrid: Array(defaultLength).fill(null) },
    { name: "VERSO", color: "var(--color-verso)", length: defaultLength, activeGrid: Array(defaultLength).fill(null) },
    { name: "ESTRIBILLO", color: "var(--color-estro)", length: defaultLength, activeGrid: Array(defaultLength).fill(null) },
    { name: "PUENTE", color: "var(--color-puente)", length: defaultLength, activeGrid: Array(defaultLength).fill(null) },
  ]);

  // Efecto p/ cargar desde LocalStorage AL INICIO
  useEffect(() => {
    const draft = localStorage.getItem('visualSequencerDraft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.sections) setSections(parsed.sections);
        if (parsed.rhythms) setRhythms(parsed.rhythms);
        if (parsed.bpm) setBpm(parsed.bpm);
      } catch (e) {
        console.error("No se pudo cargar el borrador local", e);
      }
    } else {
      // Seeding inicial p/ testing visual solo la primera vez que entra
      setSections(prev => {
        const copy = [...prev];
        if (copy[0].activeGrid.length >= 4) {
          copy[0].activeGrid[0] = { rhythmId: 'r1', text: '' };
          copy[0].activeGrid[2] = { rhythmId: 'r2', text: 'FX' };
        }
        if (copy[1].activeGrid.length >= 8) {
          copy[1].activeGrid[1] = { rhythmId: 'r3', text: '' };
          copy[1].activeGrid[3] = { rhythmId: 'r3', text: '' };
          copy[1].activeGrid[5] = { rhythmId: 'r4', text: '' };
          copy[1].activeGrid[7] = { rhythmId: 'r4', text: '' };
        }
        return copy;
      });
    }
  }, []);

  // Efecto p/ Auto-guardar en LocalStorage ante cada cambio
  useEffect(() => {
    // Si todavía no se inicializaron partes de la data, no romperla
    if (sections.length > 0) {
      localStorage.setItem('visualSequencerDraft', JSON.stringify({ sections, rhythms, bpm }));
    }
  }, [sections, rhythms, bpm]);

  const handleTogglePlay = () => {
    if (!audioFile) {
      alert("Por favor, cargá un archivo de audio primero para poder reproducir.");
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setStopTrigger(prev => prev + 1);
  };

  // Cada cuadradito en TrackGrid es ahora un Compás entero (4 beats de negra)
  const stepDuration = useMemo(() => (60 / bpm) * 4, [bpm]);

  const currentStep = useMemo(() => {
    return Math.floor(currentTime / stepDuration);
  }, [currentTime, stepDuration]);

  // Posición continua en steps para el Playhead
  const currentStepFloat = useMemo(() => {
    return currentTime / stepDuration;
  }, [currentTime, stepDuration]);

  // Pinchamos o borramos con la herramienta activa
  const handleCellClick = (secIdx, stepIdx) => {
    setSections(prev => {
      const copy = [...prev];
      const secCopy = { ...copy[secIdx] };
      const newGrid = [...secCopy.activeGrid];

      const currentCellVal = newGrid[stepIdx];
      const currentRhythmId = typeof currentCellVal === 'object' && currentCellVal !== null ? currentCellVal.rhythmId : currentCellVal;
      const currentText = typeof currentCellVal === 'object' && currentCellVal !== null ? currentCellVal.text : '';

      // Si ya tiene el mismo ritmo, lo borra. Si no, o si está vacía, la pinta del nuevo ritmo conservando el texto
      if (currentRhythmId === activeRhythmId) {
        if (currentText) {
          newGrid[stepIdx] = { rhythmId: null, text: currentText };
        } else {
          newGrid[stepIdx] = null;
        }
      } else {
        newGrid[stepIdx] = { rhythmId: activeRhythmId, text: currentText };
      }

      secCopy.activeGrid = newGrid;
      copy[secIdx] = secCopy;
      return copy;
    });
  };

  const handleCellTextChange = (secIdx, stepIdx, newText) => {
    setSections(prev => {
      const copy = [...prev];
      const secCopy = { ...copy[secIdx] };
      const newGrid = [...secCopy.activeGrid];

      const currentCellVal = newGrid[stepIdx];
      const currentRhythmId = typeof currentCellVal === 'object' && currentCellVal !== null ? currentCellVal.rhythmId : currentCellVal;

      if (!newText && !currentRhythmId) {
        newGrid[stepIdx] = null;
      } else {
        // Guardamos el texto en mayúsculas y max 2 caracteres
        newGrid[stepIdx] = { rhythmId: currentRhythmId, text: newText.substring(0, 2).toUpperCase() };
      }

      secCopy.activeGrid = newGrid;
      copy[secIdx] = secCopy;
      return copy;
    });
  };

  const handleAddSection = () => {
    const defaultColor = "var(--color-accent)";
    const len = 8;
    setSections(prev => [
      ...prev,
      { name: `SECCIÓN ${prev.length + 1}`, color: defaultColor, length: len, activeGrid: Array(len).fill(null) }
    ]);
  };

  const handleChangeSectionLength = (secIdx, delta) => {
    setSections(prev => {
      const copy = [...prev];
      const sec = copy[secIdx];
      const newLen = Math.max(1, sec.length + delta);

      let newGrid = [...sec.activeGrid];
      if (newLen > sec.length) {
        newGrid = newGrid.concat(Array(newLen - sec.length).fill(null));
      } else {
        newGrid = newGrid.slice(0, newLen);
      }

      copy[secIdx] = { ...sec, length: newLen, activeGrid: newGrid };
      return copy;
    });
  };

  const handleChangeSectionName = (secIdx, newName) => {
    setSections(prev => {
      const copy = [...prev];
      copy[secIdx] = { ...copy[secIdx], name: newName };
      return copy;
    });
  };

  const handleExportProject = () => {
    const data = { sections, rhythms, bpm };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mi_secuencia.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportProject = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.sections) setSections(parsed.sections);
        if (parsed.rhythms) setRhythms(parsed.rhythms);
        if (parsed.bpm) setBpm(parsed.bpm);
        alert("Proyecto cargado exitosamente.");
      } catch (err) {
        alert("Error: El archivo .json elegido no es un proyecto válido o está corrupto.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app-container">
      <HiddenAudioPlayer
        src={audioSrc}
        isPlaying={isPlaying && audioFile}
        stopTrigger={stopTrigger}
        onTimeUpdate={setCurrentTime}
        onDurationLoaded={setDuration}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      />

      <header className="daw-header">
        <Toolbar
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onStop={handleStop}
          bpm={bpm}
          onBpmChange={setBpm}
          onAudioUpload={setAudioFile}
          currentTime={currentTime}
          duration={duration}
          onExportProject={handleExportProject}
          onImportProject={handleImportProject}
          onOpenPalette={() => setIsPaletteOpen(true)}
          isMobile={isMobile}
        />
      </header>

      <main className="daw-workspace">
        {isMobile ? (
          <Drawer
            anchor="left"
            open={isPaletteOpen}
            onClose={() => setIsPaletteOpen(false)}
            sx={{ '& .MuiDrawer-paper': { width: '85%', maxWidth: '350px', bgcolor: 'var(--bg-main)' }, zIndex: 1200 }}
          >
            <RhythmPalette
              rhythms={rhythms}
              activeRhythmId={activeRhythmId}
              onSelectRhythm={setActiveRhythmId}
              onAddRhythm={handleAddRhythm}
              onChangeRhythmName={handleChangeRhythmName}
              onChangeRhythmColor={handleChangeRhythmColor}
              onToggleRhythmStep={handleToggleRhythmStep}
              onDeleteRhythm={handleDeleteRhythm}
            />
          </Drawer>
        ) : (
          <RhythmPalette
            rhythms={rhythms}
            activeRhythmId={activeRhythmId}
            onSelectRhythm={setActiveRhythmId}
            onAddRhythm={handleAddRhythm}
            onChangeRhythmName={handleChangeRhythmName}
            onChangeRhythmColor={handleChangeRhythmColor}
            onToggleRhythmStep={handleToggleRhythmStep}
            onDeleteRhythm={handleDeleteRhythm}
          />
        )}

        <div className="daw-main" style={{ flex: 1, overflow: 'hidden' }}>
          <div className="track-list-container">
            <TrackList
              sections={sections}
              onAddSection={handleAddSection}
              onChangeLength={handleChangeSectionLength}
              onChangeName={handleChangeSectionName}
            />
          </div>
          <div className="grid-container">
            <TrackGrid
              sections={sections}
              rhythms={rhythms}
              currentStep={currentStep}
              currentStepFloat={currentStepFloat}
              onCellClick={handleCellClick}
              onCellTextChange={handleCellTextChange}
            />
          </div>
        </div>
      </main>

    </div>
  );
}

export default App;
