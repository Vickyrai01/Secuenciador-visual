import React from 'react';
import { Box, Typography } from '@mui/material';

export default function TrackList({ sections, onAddSection, onChangeLength, onChangeName }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header Vacío para alinear con la regla de tiempo futura */}
      <Box sx={{ height: 40, borderBottom: '1px solid var(--bg-surface-elevated)' }} />
      
      {sections.map((sec, idx) => {
        // Calculamos cuántas filas (de 10 compases max) tendrá
        const rowCount = Math.ceil(sec.length / 10);
        
        return (
          <Box 
            key={idx} 
            sx={{ 
              height: rowCount * 72, 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              borderBottom: '1px solid var(--bg-main)',
              borderRight: `4px solid ${sec.color}`,
              transition: 'height 0.2s'
            }}
          >
            <input 
              value={sec.name}
              onChange={(e) => onChangeName(idx, e.target.value)}
              style={{ 
                fontWeight: 'bold', 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
                width: '100%', /* Changed to 100% to fit */
                maxWidth: '100px', /* Keeps original max width */
                fontFamily: 'inherit',
                textOverflow: 'ellipsis'
              }}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
               <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                  {sec.length} cp.
               </Typography>
               <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <span 
                    onClick={() => onChangeLength(idx, 1)} 
                    style={{ fontSize: '12px', cursor: 'pointer', color: 'var(--text-secondary)' }}
                  >
                    ▲
                  </span>
                  <span 
                    onClick={() => onChangeLength(idx, -1)} 
                    style={{ fontSize: '12px', cursor: 'pointer', color: 'var(--text-secondary)' }}
                  >
                    ▼
                  </span>
               </Box>
            </Box>
          </Box>
        );
      })}
      <Box sx={{ p: 2 }}>
        <Typography 
          onClick={onAddSection}
          variant="caption" 
          sx={{ color: 'var(--text-secondary)', cursor: 'pointer', '&:hover': { color: 'var(--color-accent)'} }}
        >
          + Agregar Sección
        </Typography>
      </Box>
    </Box>
  );
}
