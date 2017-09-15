import React from 'react';
import { connect } from 'react-redux';
import { Map, List} from 'immutable';
import {
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { completedCurrentTarget } from '../actions.js';


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

  timerTick() {
    if(this.state.timer > 0){
        this.setState({timer: this.state.timer - 0.1})
    } else {
        this.props.completedCurrentTarget()
    }
  }

  componentDidUpdate() {
    this.updateTimer()
  }

  componentWillUnmount() {
    this.stopTimer()
  }

  resetTimer() {
    this.setState({timer: 1.0})
  }

  setTimer() {
    if(!this.state.interval){
        this.setState({interval: setInterval(this.timerTick, 100)});
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

    const targetStyle = {
        height: this.props.targetSize + 'px',
        width: this.props.targetSize + 'px',
        top: this.props.targetPosition.get('y', 0),
        left: this.props.targetPosition.get('x', 0)
    }

    var timerText = ""
    if(this.props.inTarget){
        timerText = Math.abs(this.state.timer).toFixed(1)
    }

    var inTargetClass = ""

    if(this.props.inTarget){
        inTargetClass = "in-target"
    }

    return (
      <div style={targetStyle} className={"target-box text-xs-center "+inTargetClass}>
        <h2>{timerText}</h2>
      </div>
    )
  }
};

const mapStateToProps = state => {
  return {
    targetPosition: state.get('targetPosition'),
    targetSize: state.get('targetSize')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    completedCurrentTarget: () => {
        return dispatch(completedCurrentTarget())
    }
  }
}

const TargetBoxContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TargetBox)

export default TargetBoxContainer