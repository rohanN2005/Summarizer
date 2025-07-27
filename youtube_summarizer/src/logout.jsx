import * as React from 'react';
import { Box, Link, Avatar, CircularProgress } from '@mui/material';

export default function Logout() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/userinfo');
        if (!res.ok) throw new Error('Failed to fetch user info');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      {loading ? (
        <CircularProgress size={32} />
      ) : user?.picture ? (
        <Link href="/logout" sx={{ display: 'inline-block' }}>
          <Avatar
            alt={user.name}
            src={user.picture}
            sx={{ width: 40, height: 40, cursor: 'pointer' }}
          />
        </Link>
      ) : (
        <Link
          href="/logout"
          underline="hover"
          color="primary"
          sx={{ fontWeight: 500 }}
        >
          Logout
        </Link>
      )}
    </Box>
  );
}