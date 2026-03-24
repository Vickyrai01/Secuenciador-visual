import React from 'react';
import { Box } from '@mui/material';

const CELL_WIDTH = 40;
const CELL_HEIGHT = 60;

export default function TrackGrid({ sections, rhythms, currentStep, pixelPosition, onCellClick }) {
  const totalBeats = sections.reduce((acc, sec) => acc + sec.length, 0);

  // Determinamos en qué sección está el Playhead y cuál es su pixel continuo DENTRO de esa sección
  let accumulatedBeats = 0;
  let activeSectionIdx = -1;
  let localPixelPosition = 0;
  
  for (let i = 0; i < sections.length; i++) {
     const sec = sections[i];
     if (currentStep >= accumulatedBeats && currentStep < accumulatedBeats + sec.length) {
       activeSectionIdx = i;
       localPixelPosition = pixelPosition - (accumulatedBeats * CELL_WIDTH);
       break;
     }
     accumulatedBeats += sec.length;
  }
  if (activeSectionIdx === -1 && currentStep >= totalBeats && totalBeats > 0) {
     activeSectionIdx = sections.length - 1;
     localPixelPosition = sections[sections.length - 1].length * CELL_WIDTH;
  }

  return (
    <Box sx={{ position: 'relative', minWidth: '100%', pb: 4 }}>
      {/* Regla de tiempo superior */}
      <Box sx={{ 
        height: 40, 
        borderBottom: '1px solid var(--bg-surface-elevated)',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        bgcolor: 'var(--bg-surface)',
        zIndex: 5
      }}>
        {/* Renderizamos la regla (ahora limitada a 10 bloques por renglón máximo) */}
        {Array.from({ length: 10 }).map((_, i) => (
           <Box key={i} sx={{ width: CELL_WIDTH, display: 'flex', justifyContent: 'center', borderLeft: i === 0 ? 'none' : '1px solid var(--bg-surface-elevated)', height: '100%', boxSizing: 'border-box', alignItems:'center' }}>
             <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{i + 1}</span>
           </Box>
        ))}
      </Box>

      {/* Grilla de secciones (Alineadas TODAS a la izquierda, con salto cada 10) */}
      <Box sx={{ position: 'relative' }}>
        {sections.map((sec, secIdx) => {
          const offsetBeats = sections.slice(0, secIdx).reduce((acc, s) => acc + s.length, 0);
          const isThisSectionActive = activeSectionIdx === secIdx;
          
          // Dividir la grilla en pedazos de a 10
          const rows = [];
          for (let i = 0; i < sec.length; i += 10) {
             rows.push(sec.activeGrid.slice(i, i + 10));
          }

          // En qué fila de esta sección está el playhead y su x position
          const localBeatFloat = localPixelPosition / CELL_WIDTH;
          const playheadRowIdx = Math.floor(localBeatFloat / 10);
          const playheadX = (localBeatFloat % 10) * CELL_WIDTH;
          
          return (
            <Box key={secIdx} sx={{ 
              display: 'flex', 
              flexDirection: 'column', // Apilamos los renglones
              borderBottom: '1px solid var(--bg-surface-elevated)',
              position: 'relative',
              transition: 'height 0.2s'
            }}>
              
              {rows.map((rowCells, rowIdx) => (
                 <Box key={rowIdx} sx={{ display: 'flex', height: CELL_HEIGHT, position: 'relative' }}>
                    
                    {/* Playhead Local para este renglón en específico */}
                    {isThisSectionActive && playheadRowIdx === rowIdx && (
                      <Box sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: playheadX,
                        width: 2,
                        height: CELL_HEIGHT, 
                        bgcolor: 'var(--color-play)',
                        zIndex: 10,
                        boxShadow: '0 0 8px var(--color-play)'
                      }} />
                    )}
                    
                    {/* Celdas activas/inactivas polícromas */}
                    {rowCells.map((cellState, cellIdx) => {
                      const stepIdx = (rowIdx * 10) + cellIdx;
                      // cellState ahora trae null (vacío) o 'r1', 'r2' (ID del ritmo)
                      const activeRhythm = cellState ? rhythms.find(r => r.id === cellState) : null;
                      const isActive = !!activeRhythm;
                      const bgColor = isActive ? activeRhythm.color : 'rgba(0,0,0,0.2)';
                      
                      const isPlayingNow = isThisSectionActive && (currentStep - offsetBeats) === stepIdx;
                      
                      return (
                        <Box 
                          key={stepIdx}
                          onClick={() => onCellClick(secIdx, stepIdx)}
                          sx={{
                            width: CELL_WIDTH,
                            minWidth: CELL_WIDTH,
                            flexShrink: 0,
                            boxSizing: 'border-box',
                            height: '100%',
                            borderRight: '1px solid var(--bg-surface-elevated)',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            bgcolor: bgColor,
                            opacity: isActive ? (isPlayingNow ? 1 : 0.7) : 1,
                            boxShadow: isPlayingNow ? `inset 0 0 10px #fff, 0 0 15px ${isActive ? bgColor : sec.color}` : 'none',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: isActive ? bgColor : 'var(--bg-surface-elevated)',
                              opacity: 0.9
                            },
                            transition: 'opacity 0.1s'
                          }}
                        />
                      );
                    })}
                 </Box>
              ))}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
