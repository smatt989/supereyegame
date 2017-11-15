import React from 'react';
import { connect } from 'react-redux';
import { Map, List} from 'immutable';
import {
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { completedCurrentTarget, endGame } from '../actions.js';


class ControlBar extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {

    const gameDetailsStyleClass = this.props.gameInProgress ? "should-display" : 'should-hide'

    const scoreBoardStyleClass = this.props.showScore ? "should-display" : 'should-hide'

    return (
        <div id="control-bar">
            <h1>The Greatest Game</h1>
            <div className={gameDetailsStyleClass} id="game-details">
                <h3 className={scoreBoardStyleClass}>{this.props.frame}</h3>
                <h3 className={scoreBoardStyleClass}>Score: {this.props.score}</h3>
                <Button bsSize="small" onClick={this.props.endGame}>Give Up</Button>
            </div>
        </div>
    )
  }
};

const mapStateToProps = state => {
  return {
    score: state.getIn(['game', 'score'], 0),
    gameInProgress: state.getIn(['game', 'gameInProgress']),
    frame: state.get('frame'),
    showScore: state.getIn(['game', 'showScore'])
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    completedCurrentTarget: () => {
        return dispatch(completedCurrentTarget())
    },
    endGame: () => {
        return dispatch(endGame())
    }
  }
}

const ControlBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlBar)

export default ControlBarContainer