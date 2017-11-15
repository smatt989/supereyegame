import React from 'react';
import { connect } from 'react-redux';
import { Map, List} from 'immutable';
import {
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { updateCursorPosition, updateTargetPosition, updateMousePosition, endGame, logHistory, completedCurrentTarget, setTrackerOn } from '../actions.js';
import TargetBoxContainer from './TargetBox.jsx';
import { MOUSE, EYES, TOBII4C } from '../utilities.js'

class GamePalette extends React.Component {

  constructor(props) {
    super(props);

    this.state = {logInterval: null, timeout: null, trackerTimeout: null}

    this.updateCursorPosition = this.updateCursorPosition.bind(this)
    this.updateMousePosition = this.updateMousePosition.bind(this)
    this.cursorIsInTarget = this.cursorIsInTarget.bind(this)
    this.startLoggingHistory = this.startLoggingHistory.bind(this)
    this.gameInProgress = this.gameInProgress.bind(this)
    this.setTargetTimeout = this.setTargetTimeout.bind(this)
    this.stopTargetTimeout = this.stopTargetTimeout.bind(this)
    this.setTrackerTimeout = this.setTrackerTimeout.bind(this)
    this.setTrackerHideTimeout = this.setTrackerHideTimeout.bind(this)
    this.stopTrackerTimeout = this.stopTrackerTimeout.bind(this)
  }

  setTargetTimeout() {
    const maxTimePerTarget = this.props.maxTimePerTarget
    const completeTarget = this.props.completeCurrentTarget
    this.setState({timeout: setTimeout(function() {
        completeTarget()
    }, maxTimePerTarget)})
  }

  stopTargetTimeout() {
    this.setState({timeout: clearTimeout(this.state.timeout)})
  }

  setTrackerTimeout() {
    const maxTimePerTarget = this.props.maxTimePerTarget
    const possibleRange = (maxTimePerTarget - 750) * 0.5
    const flashOnTime = (Math.random() * possibleRange) + (maxTimePerTarget * 0.2)

    const setTrackerHideTimeout = () => this.setTrackerHideTimeout(750)
    const setTrackerOn = this.props.setTrackerOn

    this.setState({trackerTimeout: setTimeout(function(){
        setTrackerOn(true)
        setTrackerHideTimeout()
    }, flashOnTime)})
  }

  setTrackerHideTimeout(millis) {
    const setTrackerOn = this.props.setTrackerOn
    this.setState({trackerTimeout: setTimeout(function() {
        setTrackerOn(false)
    }, millis)})
  }

  stopTrackerTimeout() {
    this.setState({trackerTimeout: clearTimeout(this.state.trackerTimeout)})
  }

  updateCursorPosition(e) {
    const x = e.pageX - e.currentTarget.offsetLeft
    const y = e.pageY - e.currentTarget.offsetTop
    this.props.updateCursorPosition(x, y)
  }

  updateMousePosition(e) {
    const x = e.pageX - e.currentTarget.offsetLeft
    const y = e.pageY - e.currentTarget.offsetTop
    this.props.updateMousePosition(x, y)
  }

  cursorIsInTarget() {
    const cursorX = this.props.cursorPosition.get('x', 0)
    const cursorY = this.props.cursorPosition.get('y', 0)

    const targetX = this.props.targetPosition.get('x', 0) - this.props.targetSize / 2
    const targetY = this.props.targetPosition.get('y', 0) - this.props.targetSize / 2

    const inTarget = targetX < cursorX && targetX + this.props.targetSize > cursorX && targetY < cursorY && targetY + this.props.targetSize > cursorY

    return inTarget
  }

  moveTarget() {
    if(this.palette) {

        const width = this.palette.offsetWidth
        const height = this.palette.offsetHeight
        const size = this.props.targetSize

        const targetX = this.props.targetPosition.get('x')
        const targetY = this.props.targetPosition.get('y')

        const newTarget = this.generateSquareCoordinates(width, height, size, targetX, targetY)

        this.props.updateTargetPosition(newTarget.x, newTarget.y)
        this.setTargetTimeout()

        if(this.props.showTracker == 'intermittent'){
            this.setTrackerTimeout()
        }
    }
  }

  generateSquareCoordinates(screenWidth, screenHeight, targetSize, oldTargetX, oldTargetY) {

    var xDiff = 0
    var yDiff = 0

    var newX, newY

    while(xDiff < targetSize || yDiff < targetSize){
        newX = Math.round(Math.random() * (screenWidth - 2 * targetSize)) + targetSize
        newY = Math.round(Math.random() * (screenHeight - 2 * targetSize)) + targetSize

        xDiff = Math.abs(newX - oldTargetX)
        yDiff = Math.abs(newY - oldTargetY)
    }

    return {x: newX, y: newY}
  }

  componentDidMount() {

    this.props.setTrackerOn(this.props.showTracker == 'visible')

    this.startLoggingHistory()
    this.moveTarget()

    var video = document.getElementById("webgazerVideoFeed");
    if(video){
        video.style.visibility = "hidden";
    }
    var overlay = document.getElementById("overlay");
    if(overlay){
        overlay.style.visibility = "hidden";
    }
  }

  componentWillUnmount() {
    this.setState({logInterval: clearInterval(this.state.logInterval)})
    this.stopTargetTimeout()
    this.stopTrackerTimeout()
  }

  componentDidUpdate() {
    if(this.props.completedCurrentTarget){
        this.moveTarget()
    }
    if(this.props.game.get('targets') >= this.props.maxTargets) {
        this.props.endGame()
    }
  }

  gameInProgress() {
    return this.props.gameInProgress
  }

  startLoggingHistory() {
      const logHistory = this.props.logHistory
      const inProgress = this.gameInProgress
      this.setState({logInterval: setInterval(function() {
        if(inProgress()){
            logHistory()
        }
      }, 20)});
  }

  render() {

    const ballStyle = {
        top: this.props.cursorPosition.get('y',0) - 5,
        left: this.props.cursorPosition.get('x',0) - 5
    }

    const updateCursor = this.updateCursorPosition
    const updateMouse = this.updateMousePosition
    const cursorIsInTarget = this.cursorIsInTarget

    const gameInput = this.props.gameInput

    const targetPosition = this.props.targetPosition

    const mouseMove = function(e) {
        if(gameInput == MOUSE){
            updateCursor(e)
        }
        //updateMouse(e)
    }

    const trackerStyle = this.props.trackerOn ? 'should-show' : 'should-hide'

    return (
      <div ref={palette => {this.palette = palette}} onMouseMove={mouseMove} id="game-palette">
          <TargetBoxContainer inTarget={cursorIsInTarget()} />
          <div style={ballStyle} className={trackerStyle} id="cursor-ball">
          </div>
      </div>
    )
  }
};

const mapStateToProps = state => {
  return {
    cursorPosition: state.get('cursorPosition'),
    targetPosition: state.get('targetPosition'),
    targetSize: state.get('targetSize'),
    completedCurrentTarget: state.get('completedCurrentTarget'),
    game: state.get('game'),
    maxTargets: state.get('maxTargets'),
    gameInput: state.get('gameInput'),
    gameInProgress: state.getIn(['game','gameInProgress']),
    maxTimePerTarget: state.get('maxTimePerTarget'),
    showTracker: state.getIn(['game', 'showTracker']),
    trackerOn: state.get('trackerOn')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateCursorPosition: (x, y) => {
        return dispatch(updateCursorPosition(x, y))
    },
    updateMousePosition: (x, y) => {
        return dispatch(updateMousePosition(x, y))
    },
    updateTargetPosition: (x, y) => {
        return dispatch(updateTargetPosition(x, y))
    },
    endGame: () => {
        return dispatch(endGame())
    },
    completeCurrentTarget: () => {
        return dispatch(completedCurrentTarget())
    },
    logHistory: () => {
        return dispatch(logHistory())
    },
    setTrackerOn: (trackerOn) => {
        return dispatch(setTrackerOn(trackerOn))
    }
  }
}

const GamePaletteContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GamePalette)

export default GamePaletteContainer