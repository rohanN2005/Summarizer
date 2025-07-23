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
import AttachmentIcon from '@mui/icons-material/Attachment';

const drawerWidth = 0; // not used for bottom bar

/**
 * A Material‑UI input bar with URL entry, submit on Enter, and loading state.
 *
 * param {{
 *   onSubmit: (url: string) => void,
 *   loading: boolean
 * }} props
 */
export default function InputBar({ onSubmit, loading, onUpload }) {
  const [url, setUrl] = React.useState('');
  const fileInputRef = React.useRef(null); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url || loading) return;
    onSubmit(url);
  };

  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onUpload(file);
    e.target.value = null;
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
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <IconButton
        onClick={handleAttachClick}
        disabled={loading}
        aria-label="Attach file"
      >
        <AttachmentIcon />
      </IconButton>

        <InputBase
          sx={{ ml: 1, flex: 1, fontSize: '0.95rem' }}
          placeholder="Paste video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          inputProps={{ 'aria-label': 'video url input' }}
          disabled={loading}
        />

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
