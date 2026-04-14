import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function RhythmPalette({ rhythms, activeRhythmId, onSelectRhythm, onAddRhythm, onChangeRhythmName, onChangeRhythmColor, onToggleRhythmStep, onDeleteRhythm }) {
  const stepLabels = ['1', 'Y', '2', 'Y', '3', 'Y', '4', 'Y'];

  return (
    <Box sx={{ 
      width: '30%', // Reducido al 30% 
      minWidth: '320px',
      maxWidth: '800px',
      borderRight: '1px solid var(--bg-main)',
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'var(--bg-surface)',
      overflowY: 'auto'
    }}>
      <Box sx={{ p: 2, height: 40, borderBottom: '1px solid var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', boxSizing: 'border-box' }}>
        <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontWeight: 'bold', letterSpacing: '0.1em' }}>
          RITMOS (1 COMPÁS)
        </Typography>
      </Box>

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {rhythms.map(rhythm => {
          const isActive = rhythm.id === activeRhythmId;
          return (
            <Box 
              key={rhythm.id}
              onClick={() => onSelectRhythm(rhythm.id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1.5,
                gap: 2,
                cursor: 'pointer',
                borderRadius: '6px',
                bgcolor: isActive ? 'rgba(255,255,255,0.05)' : 'var(--bg-surface-elevated)',
                border: isActive ? `1px solid ${rhythm.color}` : '1px solid transparent',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.08)'
                },
                transition: 'all 0.1s'
              }}
            >
              {/* Contenedor de Grilla del patrón */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
                
                {/* Fila superior: Nombres de paso (1 Y 2 Y...) */}
                <Box sx={{ display: 'flex', pl: '20px' }}>
                   {stepLabels.map((lbl, i) => (
                     <Box key={i} sx={{ flex: 1, display: 'flex', justifyContent: 'center', borderRight: i < 7 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                        <Typography variant="caption" sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{lbl}</Typography>
                     </Box>
                   ))}
                </Box>
                
                {/* Filas centrales: 3 instrumentos (HH, SD, BD) */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                   {rhythm.pattern.map((rowCells, rowIdx) => {
                     const instLabels = ['HH', 'SD', 'BD'];
                     return (
                       <Box key={rowIdx} sx={{ display: 'flex', alignItems: 'center' }}>
                         <Typography variant="caption" sx={{ width: '30px', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)', textAlign: 'right', mr: 1 }}>
                           {instLabels[rowIdx]}
                         </Typography>
                         <Box sx={{ display: 'flex', flex: 1, height: '100%', border: '1px solid rgba(255,255,255,0.2)' }}>
                           {rowCells.map((isOn, i) => (
                             <Box 
                               key={i}
                               onClick={(e) => {
                                 e.stopPropagation(); // Evitar selección del ritmo maestro solo por cambiar un pattern
                                 onToggleRhythmStep(rhythm.id, rowIdx, i);
                               }}
                               sx={{
                                 flex: 1,
                                 aspectRatio: '1 / 1',
                                 borderRight: i < 7 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                                 bgcolor: isOn ? 'var(--text-secondary)' : 'transparent',
                                 '&:hover': { bgcolor: isOn ? 'var(--text-primary)' : 'rgba(255,255,255,0.1)' }
                               }}
                             />
                           ))}
                         </Box>
                       </Box>
                     );
                   })}
                </Box>

                {/* Fila Inferior: Título Editable */}
                <Box sx={{ mt: 1 }}>
                  <input 
                    value={rhythm.name}
                    onChange={(e) => onChangeRhythmName(rhythm.id, e.target.value)}
                    style={{ 
                      fontWeight: isActive ? 'bold' : 'normal', 
                      background: 'transparent', 
                      border: 'none', 
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontSize: '1rem',
                      outline: 'none',
                      width: '100%',
                      fontFamily: 'inherit',
                      cursor: 'text',
                      textAlign: 'center',
                      textTransform: 'uppercase'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Box>
              </Box>

              {/* Selector de Color y previsualización */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                 <input 
                   type="color"
                   value={rhythm.color}
                   onChange={(e) => onChangeRhythmColor(rhythm.id, e.target.value)}
                   onClick={(e) => e.stopPropagation()}
                   style={{
                     width: '32px',
                     height: '32px',
                     padding: 0,
                     border: 'none',
                     borderRadius: '4px',
                     cursor: 'pointer',
                     background: 'transparent'
                   }}
                 />
                 <IconButton 
                   onClick={(e) => {
                     e.stopPropagation();
                     // Si el usuario confirma, lo eliminamos
                     if(window.confirm('¿Estás seguro de que deseas eliminar este ritmo? Esto borrará sus asignaciones en el mapa.')){
                        onDeleteRhythm(rhythm.id);
                     }
                   }}
                   size="small" 
                   sx={{ color: 'var(--text-secondary)', '&:hover': { color: '#f43f5e' } }}
                 >
                   <DeleteIcon fontSize="small" />
                 </IconButton>
              </Box>

            </Box>
          );
        })}

        <Box 
          onClick={onAddRhythm}
          sx={{ 
            p: 1.5, 
            textAlign: 'center', 
            borderRadius: '6px', 
            border: '1px dashed var(--text-secondary)',
            color: 'var(--text-secondary)', 
            cursor: 'pointer', 
            '&:hover': { color: 'var(--color-accent)', borderColor: 'var(--color-accent)' } 
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>+ NUEVO RITMO</Typography>
        </Box>
      </Box>
    </Box>
  );
}
