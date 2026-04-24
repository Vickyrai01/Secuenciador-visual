import React, { useState } from 'react';
import { Box } from '@mui/material';

const CELL_HEIGHT = 72;

export default function TrackGrid({ sections, rhythms, currentStep, currentStepFloat, onCellClick, onCellTextChange }) {
  const [editingCell, setEditingCell] = useState(null); // { secIdx, stepIdx }
  const totalBeats = sections.reduce((acc, sec) => acc + sec.length, 0);

  // Determinamos en qué sección está el Playhead y cuál es su paso continuo DENTRO de esa sección
  let accumulatedBeats = 0;
  let activeSectionIdx = -1;
  let localStepFloat = 0;
  
  for (let i = 0; i < sections.length; i++) {
     const sec = sections[i];
     if (currentStep >= accumulatedBeats && currentStep < accumulatedBeats + sec.length) {
       activeSectionIdx = i;
       localStepFloat = currentStepFloat - accumulatedBeats;
       break;
     }
     accumulatedBeats += sec.length;
  }
  if (activeSectionIdx === -1 && currentStep >= totalBeats && totalBeats > 0) {
     activeSectionIdx = sections.length - 1;
     localStepFloat = sections[sections.length - 1].length;
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
        zIndex: 5,
        minWidth: 'max-content'
      }}>
        {/* Renderizamos la regla (ahora limitada a 10 bloques por renglón máximo) */}
        {Array.from({ length: 10 }).map((_, i) => (
           <Box key={i} sx={{ width: 'var(--cell-width, 48px)', minWidth: 'var(--cell-width, 48px)', flexShrink: 0, display: 'flex', justifyContent: 'center', borderLeft: i === 0 ? 'none' : '1px solid var(--bg-surface-elevated)', height: '100%', boxSizing: 'border-box', alignItems:'center' }}>
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
          const playheadRowIdx = Math.floor(localStepFloat / 10);
          const playheadX_calc = `calc(var(--cell-width, 48px) * ${localStepFloat % 10})`;
          
          return (
            <Box key={secIdx} sx={{ 
              display: 'flex', 
              flexDirection: 'column', // Apilamos los renglones
              borderBottom: '1px solid var(--bg-surface-elevated)',
              position: 'relative',
              transition: 'height 0.2s',
              minWidth: 'max-content'
            }}>
              
              {rows.map((rowCells, rowIdx) => (
                 <Box key={rowIdx} sx={{ display: 'flex', height: CELL_HEIGHT, position: 'relative', minWidth: 'max-content' }}>
                    
                    {/* Playhead Local para este renglón en específico */}
                    {isThisSectionActive && playheadRowIdx === rowIdx && (
                      <Box sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: playheadX_calc,
                        width: 2,
                        height: CELL_HEIGHT, 
                        bgcolor: 'var(--color-play)',
                        zIndex: 10,
                        boxShadow: '0 0 8px var(--color-play)'
                      }} />
                    )}
                    
                    {/* Celdas activas/inactivas polícromas, siempre renderizamos 10 cuadraditos físicos para no dejar vacíos visuales */}
                    {Array.from({ length: 10 }).map((_, cellIdx) => {
                      const stepIdx = (rowIdx * 10) + cellIdx;
                      const isOutOfBound = cellIdx >= rowCells.length;
                      
                      let activeRhythmId = null;
                      let cellText = '';
                      let bgColor = 'transparent';
                      let isActive = false;
                      
                      if (!isOutOfBound) {
                        const cellState = rowCells[cellIdx];
                        const cellObj = typeof cellState === 'object' && cellState !== null ? cellState : { rhythmId: cellState, text: '' };
                        activeRhythmId = cellObj.rhythmId;
                        cellText = cellObj.text || '';
                        
                        const activeRhythm = activeRhythmId ? rhythms.find(r => r.id === activeRhythmId) : null;
                        isActive = !!activeRhythm;
                        bgColor = isActive ? activeRhythm.color : 'rgba(0,0,0,0.2)';
                      } else {
                        // Estas celdas están por fuera del 'length' lógico, son grisadas/bloqueadas visualmente
                        bgColor = 'transparent';
                      }
                      
                      
                      const isPlayingNow = isThisSectionActive && (currentStep - offsetBeats) === stepIdx;
                      const isEditingThisCell = editingCell && editingCell.secIdx === secIdx && editingCell.stepIdx === stepIdx;
                      
                      return (
                        <Box 
                          key={stepIdx}
                          onDoubleClick={() => !isOutOfBound && setEditingCell({ secIdx, stepIdx })}
                          onClick={() => {
                             if (!isEditingThisCell && !isOutOfBound) onCellClick(secIdx, stepIdx);
                          }}
                          sx={{
                            width: 'var(--cell-width, 48px)',
                            minWidth: 'var(--cell-width, 48px)',
                            flexShrink: 0,
                            boxSizing: 'border-box',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            borderRight: '1px solid var(--bg-surface-elevated)',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            bgcolor: bgColor,
                            opacity: isActive ? (isPlayingNow ? 1 : 0.7) : 1,
                            boxShadow: isPlayingNow && !isOutOfBound ? `inset 0 0 10px #fff, 0 0 15px ${isActive ? bgColor : sec.color}` : 'none',
                            cursor: isOutOfBound ? 'default' : 'pointer',
                            '&:hover': isOutOfBound ? {} : {
                              bgcolor: isActive ? bgColor : 'var(--bg-surface-elevated)',
                              opacity: 0.9
                            },
                            transition: 'opacity 0.1s'
                          }}
                        >
                          {isEditingThisCell ? (
                            <input 
                              autoFocus
                              maxLength={2}
                              value={cellText}
                              onChange={e => onCellTextChange(secIdx, stepIdx, e.target.value)}
                              onBlur={() => setEditingCell(null)}
                              onKeyDown={e => e.key === 'Enter' && setEditingCell(null)}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                textAlign: 'center', 
                                background: 'transparent', 
                                border: 'none', 
                                color: '#ffffff', 
                                fontSize: '14px', 
                                fontWeight: 'bold',
                                outline: 'none'
                              }}
                            />
                          ) : (
                            <span style={{ 
                              color: 'rgba(255,255,255,0.9)', 
                              fontWeight: 'bold', 
                              fontSize: '14px',
                              letterSpacing: '1px',
                              pointerEvents: 'none'
                            }}>
                              {cellText}
                            </span>
                          )}
                        </Box>
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
