import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { makeStyles } from '@mui/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaper: {
    width: drawerWidth,
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperSmall: {
    width: theme.spacing(7),
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  content: {
    flexGrow: 1,
    backgroundColor: "#00f",
    padding: 3,
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleMouseEnter = () => {
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    setExpanded(false);
  };

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: expanded ? classes.drawerPaper : classes.drawerPaperSmall,
        }}
        anchor="left"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Toolbar />
        <List>
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Cadastro" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Agenda" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Resumo" />
          </ListItem>
        </List>
      </Drawer>
      {/* <main className={classes.content}> */}
        {/* <Toolbar /> */}
        {/* Add your main content here */}
      {/* </main> */}
    </div>
  );
};

export default Navbar;
