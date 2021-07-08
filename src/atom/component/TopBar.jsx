import React from 'react';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import useStyle from '../style/useStyle';

const TopBar = () => {
  const classes = useStyle();
  
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Tesseact React Test
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar;