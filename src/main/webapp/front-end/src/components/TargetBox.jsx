import React from 'react';
import { connect } from 'react-redux';
import { Map, List} from 'immutable';
import {
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { completedCurrentTarget, incrementScore } from '../actions.js';


class TargetBox extends React.Component {

  constructor(props) {
    super(props);

    this.state = {timer: null, interval: null}

    this.timerTick = this.timerTick.bind(this)
    this.setTimer = this.setTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.updateTimer = this.updateTimer.bind(this)
  }

  componentDidMount() {
    this.resetTimer()
  }

  componentDidUpdate() {
    this.updateTimer()
  }

  componentWillUnmount() {
    this.stopTimer()
  }

  timerTick() {
    if(this.state.timer > 0){
        this.setState({timer: this.state.timer - 0.02})
    } else {
        this.props.incrementScore(1)
        this.resetTimer()
    }
  }

  resetTimer() {
    this.setState({timer: 0.1})
  }

  setTimer() {
    if(!this.state.interval){
        this.setState({interval: setInterval(this.timerTick, 20)});
    }
  }

  stopTimer() {
    if(this.state.interval){
        this.setState({interval: clearInterval(this.state.interval)})
        this.resetTimer()
    }
  }

  updateTimer() {
    if(this.props.inTarget) {
        this.setTimer()
    } else {
        this.stopTimer()
    }
  }

  render() {

    const targetStyleWidth = this.props.targetSize / 10
    const targetStyleHeight = this.props.targetSize

    const targetStyle = {
        top: this.props.targetPosition.get('y', 0) - targetStyleHeight / 2,
        left: this.props.targetPosition.get('x', 0) - targetStyleHeight / 2,
        height: targetStyleHeight + 'px',
        width: targetStyleHeight + 'px'

    }

    const targetCrossHorizontal = {
        left: 0,
        top: (targetStyleHeight - targetStyleWidth) / 2,
        height: targetStyleWidth+'px',
        width: targetStyleHeight+'px'
    }

    const targetCrossVertical = {
        top: 0,
        left: (targetStyleHeight - targetStyleWidth) / 2,
        width: targetStyleWidth+'px',
        height: targetStyleHeight+'px'
    }

    var timerText = ""
    if(this.props.inTarget){
        timerText = Math.abs(this.state.timer).toFixed(1)
    }

    var inTargetClass = ""

    if(this.props.inTarget && this.props.showTargetHighlight){
        inTargetClass = "in-target"
    }

    return (
      <div style={targetStyle} className={"target-box text-xs-center "+inTargetClass}>

        <div style={targetCrossVertical} className="target-box-vertical"></div>
        <div style={targetCrossHorizontal} className="target-box-horizontal"></div>
      </div>
    )
  }
};

const mapStateToProps = state => {
  return {
    targetPosition: state.get('targetPosition'),
    targetSize: state.get('targetSize'),
    showTargetHighlight: state.getIn(['game', 'showTargetHighlight'])
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    completedCurrentTarget: () => {
        return dispatch(completedCurrentTarget())
    },
    incrementScore: (points) => {
        return dispatch(incrementScore(points))
    }
  }
}

const TargetBoxContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TargetBox)

export default TargetBoxContainer