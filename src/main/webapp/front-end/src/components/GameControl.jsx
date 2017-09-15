import React from 'react';
import { connect } from 'react-redux';
import { Map, List} from 'immutable';
import {
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { startGame, updateCursorPosition } from '../actions.js';
import GamePaletteContainer from './GamePalette.jsx';
import GameMenuContainer from './GameMenu.jsx';
import CalibrateContainer from './Calibrate.jsx';
import { MOUSE, EYES } from '../utilities.js'


class GameControl extends React.Component {

  constructor(props) {
    super(props);

  }

  componentDidMount() {
    const gameContainer = this.gameContainer
    const topOffset = gameContainer.offsetTop
    const leftOffset = gameContainer.offsetLeft

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

    return <div ref={gameContainer => {this.gameContainer = gameContainer}}>{filler}</div>
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
    }
  }
}

const GameControlContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameControl)

export default GameControlContainer