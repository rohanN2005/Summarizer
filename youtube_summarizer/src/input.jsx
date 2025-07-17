// src/InputBar.jsx
import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Divider,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BuildIcon from '@mui/icons-material/Build';
import MicIcon from '@mui/icons-material/Mic';

const drawerWidth = 0; // not used for bottom bar

/**
 * A Material‑UI input bar with URL entry, submit on Enter, and loading state.
 *
 * @param {{
 *   onSubmit: (url: string) => void,
 *   loading: boolean
 * }} props
 */
export default function InputBar({ onSubmit, loading }) {
  const [url, setUrl] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url || loading) return;
    onSubmit(url);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        px: 2,
        py: 1,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 10,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: 800,
          borderRadius: '999px',
        }}
      >
        <IconButton size="small" disabled={loading}>
          <AddIcon />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <Button
          startIcon={<BuildIcon />}
          size="small"
          disabled={loading}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Tools
        </Button>

        <InputBase
          sx={{ ml: 1, flex: 1, fontSize: '0.95rem' }}
          placeholder="Paste video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          inputProps={{ 'aria-label': 'video url input' }}
          disabled={loading}
        />

        <IconButton size="small" disabled={loading}>
          <MicIcon />
        </IconButton>

        {/* hidden submit button to enable Enter key */}
        <button type="submit" disabled={loading || !url} style={{ display: 'none' }}>
          Go
        </button>
      </Paper>
    </Box>
  );
}

InputBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

InputBar.defaultProps = {
  loading: false,
};
