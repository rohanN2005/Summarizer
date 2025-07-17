// src/Logout.jsx
import * as React from 'react'
import { Box, Link } from '@mui/material'

export default function Logout() {
  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: (theme) => theme.zIndex.drawer + 1, // sit above the permanent drawer
      }}
    >
      <Link
        href="/logout"
        underline="hover"
        color="primary"
        sx={{ fontWeight: 500 }}
      >
        Logout
      </Link>
    </Box>
  )
}