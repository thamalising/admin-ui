import "./MainView.css";
import React, { useState, useEffect } from 'react';
import {WardenView} from './WardenView';
import {LocationView} from './LocationView';
import {MapComponent} from '../components/MapComponent';
import {LoginView} from './LoginView';

import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LocalParkingIcon from '@material-ui/icons/LocalParking';
import LocationIcon from '@material-ui/icons/LocationOn';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 1250,
  },
}));

export function MainView() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [loginMode, setLoginMode] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  function onLoginSuccess()
  {
    setLoginMode(false);
  }

  function onLoginFailed()
  {
    setLoginMode(true);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab icon={<LocationIcon/>}/>
          <Tab icon={<LocalParkingIcon/>}/>
        </Tabs>
      </AppBar>
      { !loginMode && <SwipeableViews
        axis={'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <LocationView/>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <WardenView/>
        </TabPanel>
      </SwipeableViews>}

      {loginMode && <LoginView onLogged={onLoginSuccess} onFailed={onLoginFailed}/>}
    </div>
  );
}
