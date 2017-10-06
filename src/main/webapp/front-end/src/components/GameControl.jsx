import React from 'react';
import { connect } from 'react-redux';
import { Map, List} from 'immutable';
import {
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { startGame, updateCursorPosition, logHistory } from '../actions.js';
import GamePaletteContainer from './GamePalette.jsx';
import GameMenuContainer from './GameMenu.jsx';
import CalibrateContainer from './Calibrate.jsx';
import { MOUSE, EYES, TOBII4C } from '../utilities.js'


class GameControl extends React.Component {

  constructor(props) {
    super(props);


    this.isTobii = this.isTobii.bind(this);
    this.startLoggingHistory = this.startLoggingHistory.bind(this);
    this.gameInProgress = this.gameInProgress.bind(this);
  }

  isTobii(e, topOffset, leftOffset, updateCursorPosition) {
    if(this.props.gameInput == TOBII4C){
       const coordinates = e.data.split("\t")
       const resolutionMultiplier = 1
       updateCursorPosition(coordinates[1]*resolutionMultiplier - leftOffset - window.screenX - (window.outerWidth - window.innerWidth), coordinates[2]*resolutionMultiplier - topOffset - window.screenY - (window.outerHeight - window.innerHeight));
    }
  }

  gameInProgress() {
    return this.props.gameInProgress
  }

  startLoggingHistory() {
      const logHistory = this.props.logHistory
      const inProgress = this.gameInProgress
      var interval = setInterval(function() {
        if(inProgress()){
            logHistory()
        }
      }, 20);
  }

  componentDidMount(props) {

    const gameContainer = document.getElementById("gameContainer")
    const topOffset = gameContainer.offsetTop
    const leftOffset = gameContainer.offsetLeft

    this.startLoggingHistory()

    const updateCursorPosition = this.props.updateCursorPosition

    webgazer.setRegression('ridge') /* currently must set regression and tracker */
            .setTracker('clmtrackr')
            .setGazeListener(function(data, elapsedTime) {
        if (data == null) {
            return;
        }

        var xprediction = data.x - leftOffset; //these x coordinates are relative to the viewport
        var yprediction = data.y - topOffset; //these y coordinates are relative to the viewport
        updateCursorPosition(xprediction, yprediction)
    })


    new WebSocket("ws://10.211.55.3:2222/").onmessage = (e) => this.isTobii(e, topOffset, leftOffset, updateCursorPosition)
  }



  render() {

    var filler = ""
    if(this.props.gameInProgress){
        if(!this.props.calibrated && this.props.gameInput == EYES){
            filler = <CalibrateContainer />
        } else {
            filler = <GamePaletteContainer />
        }
    } else {
        filler = <GameMenuContainer />
    }

    return <div id="gameContainer" ref={gameContainer => {this.gameContainer = gameContainer}}>{filler}</div>
  }
};

const mapStateToProps = state => {
  return {
    gameInProgress: state.getIn(['game','gameInProgress']),
    gameInput: state.get('gameInput'),
    calibrated: state.get('calibrated')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    completedCurrentTarget: () => {
        return dispatch(completedCurrentTarget())
    },
    updateCursorPosition: (x, y) => {
        return dispatch(updateCursorPosition(x, y))
    },
    logHistory: () => {
        return dispatch(logHistory())
    }
  }
}

const GameControlContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameControl)

export default GameControlContainer