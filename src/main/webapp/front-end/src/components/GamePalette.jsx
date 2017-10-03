import React from 'react';
import { connect } from 'react-redux';
import { Map, List} from 'immutable';
import {
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { updateCursorPosition, updateTargetPosition, endGame } from '../actions.js';
import TargetBoxContainer from './TargetBox.jsx';
import { MOUSE, EYES, TOBII4C } from '../utilities.js'

class GamePalette extends React.Component {

  constructor(props) {
    super(props);

    this.updateCursorPosition = this.updateCursorPosition.bind(this)
    this.cursorIsInTarget = this.cursorIsInTarget.bind(this)
  }

  updateCursorPosition(e) {
    const x = e.pageX - e.currentTarget.offsetLeft
    const y = e.pageY - e.currentTarget.offsetTop
    this.props.updateCursorPosition(x, y)
  }

  cursorIsInTarget() {
    const cursorX = this.props.cursorPosition.get('x', 0)
    const cursorY = this.props.cursorPosition.get('y', 0)

    const targetX = this.props.targetPosition.get('x', 0)
    const targetY = this.props.targetPosition.get('y', 0)

    const inTarget = targetX < cursorX && targetX + this.props.targetSize > cursorX && targetY < cursorY && targetY + this.props.targetSize > cursorY

    //console.log(inTarget)
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
    }
  }

  generateSquareCoordinates(screenWidth, screenHeight, targetSize, oldTargetX, oldTargetY) {

    var xDiff = 0
    var yDiff = 0

    var newX, newY

    while(xDiff < targetSize || yDiff < targetSize){
        newX = Math.round(Math.random() * (screenWidth - targetSize))
        newY = Math.round(Math.random() * (screenHeight - targetSize))

        xDiff = Math.abs(newX - oldTargetX)
        yDiff = Math.abs(newY - oldTargetY)
    }

    return {x: newX, y: newY}
  }

  componentDidMount() {
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

  componentDidUpdate() {
    this.cursorIsInTarget()
    if(this.props.completedCurrentTarget){
        this.moveTarget()
    }
    if(this.props.game.get('score') >= this.props.maxScore) {
        this.props.endGame()
    }
  }

  render() {

    const ballStyle = {
        top: this.props.cursorPosition.get('y',0) - 5,
        left: this.props.cursorPosition.get('x',0) - 5
    }

    const updateCursor = this.updateCursorPosition
    const cursorIsInTarget = this.cursorIsInTarget

    const gameInput = this.props.gameInput

    const mouseMove = function(e) {
        if(gameInput == MOUSE){
            updateCursor(e)
        }
    }

    return (
      <div ref={palette => {this.palette = palette}} onMouseMove={mouseMove} id="game-palette">
          <TargetBoxContainer inTarget={cursorIsInTarget()} />
          <div style={ballStyle} id="cursor-ball">
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
    maxScore: state.get('maxScore'),
    gameInput: state.get('gameInput')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateCursorPosition: (x, y) => {
        return dispatch(updateCursorPosition(x, y))
    },
    updateTargetPosition: (x, y) => {
        return dispatch(updateTargetPosition(x, y))
    },
    endGame: () => {
        return dispatch(endGame())
    }
  }
}

const GamePaletteContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GamePalette)

export default GamePaletteContainer