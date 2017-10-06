import React from 'react';
import { Grid, Jumbotron, Button, Glyphicon } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import ControlBarContainer from './ControlBar.jsx';
import GameControlContainer from './GameControl.jsx';
import CalibrateContainer from './Calibrate.jsx';
import GameDataContainer from './GameData.jsx';


export default class Home extends React.Component {
  render() {

    return <div>
        <ControlBarContainer />
        <GameControlContainer />
      </div>;
  }
};
