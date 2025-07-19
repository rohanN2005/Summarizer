// src/Sidebar.jsx
import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

const drawerWidth = 240;

export default function Sidebar({ history, onSelect, onDelete }) {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(prev => !prev);
  };

  return (
    <>
      {/* The persistent drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
      >
        {/* Header bar with toggle button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            p: 1
          }}
        >
          <IconButton onClick={toggleDrawer} size="small">
            <MenuIcon />
          </IconButton>
          
        </Box>

        <Box>  
          <TextField fullWidth label="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}/>
        </Box>
        <Divider />

        {/* Your summaries list */}
        <List>
          <ListItem>
            <ListItemText
              primary="Summaries"
              sx={{ textAlign: 'center', width: '100%' }}
            />
          </ListItem>

          {history.map(item => (
            <ListItem
              key={item._id}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDelete(item._id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemButton onClick={() => onSelect(item)}>
                <ListItemText primary={item.Title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* When closed, show an “open” button at the same spot */}
      {!open && (
        <Box
          sx={{
            position: 'fixed',
            top: 8,
            left: 8,
            zIndex: theme => theme.zIndex.drawer + 1
          }}
        >
          <IconButton onClick={toggleDrawer} size="small">
            <MenuIcon />
          </IconButton>
        </Box>
      )}
    </>
  );
}

Sidebar.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      Title: PropTypes.string.isRequired 
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
