import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const drawerWidth = 240;

/**
 * A Material‑UI sidebar that lists history items with select and delete actions.
 *
 * param {{
 *   history: Array<{ _id: string, Title: string }>;
 *   onSelect: (item: { _id: string, Title: string }) => void;
 *   onDelete: (id: string) => void;
 * }} props
 */
export default function Sidebar({ history, onSelect, onDelete }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {/* If you have an AppBar, this Toolbar makes the list start below it */}
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {history.map((item) => (
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
      </Box>
    </Drawer>
  );
}

Sidebar.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      Title: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};