import React from 'react';
import { connect } from 'react-redux';
import { Map, List} from 'immutable';
import {
  Table,
  Button,
  ButtonGroup,
  FormGroup,
  Radio,
  ControlLabel
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { startGame, setGameInput } from '../actions.js';
import { MOUSE, EYES, TOBII4C } from '../utilities.js';
import {history} from '../reducer.js';


class GameMenu extends React.Component {

  constructor(props) {
    super(props);

    this.changeInput = this.changeInput.bind(this)
  }

  changeInput(e) {
    this.props.setGameInput(e.target.value)
  }

  componentDidMount() {
    if(document.getElementById('webgazerVideoFeed')){
        webgazer.pause()
    }
    if(document.getElementById('overlay')){
        document.body.removeChild(document.getElementById('overlay'));
    }
  }

  getHistoryCsv() {
    var csvContent = ["frame,timestamp,cursorPositionX,cursorPositionY,mousePositionX,mousePositionY,targetPositionStartX,targetPositionStartY,targetPositionEndX,targetPositionEndY"];
    history.forEach(function(e, index){
       var entryArray = [ e.frame,e.timestamp,e.cursorPositionX,e.cursorPositionY,e.mousePositionX,e.mousePositionY,e.targetPositionStartX,e.targetPositionStartY,e.targetPositionEndX,e.targetPositionEndY]
       var entryString = entryArray.join(",");
       csvContent.push(entryString)
    });

    const csv = csvContent.join("%0A")

    var a         = document.createElement('a');
    a.href        = 'data:attachment/csv,' + csv;
    a.target      = '_blank';
    a.download    = 'myFile.csv';

    document.body.appendChild(a);
    a.click();
  }

  render() {

    var gameOverMessage = <div><h1>Welcome to a Great Game!</h1></div>

    var gameOverText = "Darn! This is tough!"
    if(this.props.game.get('score') > 0) {
        if(this.props.game.get('score') == this.props.maxScore){
            gameOverText = "You win!"
        }
        gameOverMessage = <div className="text-xs-center">
            <h1>{gameOverText}</h1>
            <h3>Would you like to play again?</h3>
        </div>
    }

    var historyButton = null

    if(this.props.game.get('score') > 0) {
        historyButton = <Button onClick={this.getHistoryCsv}>Logs</Button>
    }

    return (
        <div id="game-menu" className="text-xs-center">
            {gameOverMessage}
            <FormGroup onChange={this.changeInput}>
              <ControlLabel><b>Control game with:</b></ControlLabel>
              <br />
              <Radio name="radioGroup" inline value={MOUSE} checked={this.props.gameInput == MOUSE}>
                Mouse
              </Radio>
              {' '}
              <Radio name="radioGroup" inline value={EYES} checked={this.props.gameInput == EYES}>
                Eyes
              </Radio>
              {' '}
              <Radio name="radioGroup" inline value={TOBII4C} checked={this.props.gameInput == TOBII4C}>
                Tobii 4C
              </Radio>
            </FormGroup>
            <Button onClick={this.props.startGame}>Start Game</Button>
            <br />
            {historyButton}
        </div>
    )
  }
};

const mapStateToProps = state => {
  return {
    game: state.get('game'),
    gameInput: state.get('gameInput'),
    maxScore: state.get('maxScore')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    startGame: () => {
        return dispatch(startGame())
    },
    setGameInput: (input) => {
        return dispatch(setGameInput(input))
    }
  }
}

const GameMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameMenu)

export default GameMenuContainer