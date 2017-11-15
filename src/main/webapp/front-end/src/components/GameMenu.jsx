import React from 'react';
import { connect } from 'react-redux';
import { Map, List} from 'immutable';
import {
  Table,
  Button,
  ButtonGroup,
  FormGroup,
  Radio,
  ControlLabel,
  FormControl,
  Panel,
  ButtonToolbar
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { startGame, setGameInput, setShowScore, setShowTracker, setShowTargetHighlight, setMaxOffset } from '../actions.js';
import { MOUSE, EYES, TOBII4C } from '../utilities.js';
import {history} from '../reducer.js';


class GameMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {open: false}

    this.changeInput = this.changeInput.bind(this)
    this.showScoreChange = this.showScoreChange.bind(this)
    this.showTrackerChange = this.showTrackerChange.bind(this)
    this.showTargetHighlightChange = this.showTargetHighlightChange.bind(this)
    this.changeOffsetMax = this.changeOffsetMax.bind(this)

    this.setGameSetting = this.setGameSetting.bind(this)
    this.startGame1 = this.startGame1.bind(this)
    this.startGame2 = this.startGame2.bind(this)
    this.startGame3 = this.startGame3.bind(this)

    this.getHistoryCsv = this.getHistoryCsv.bind(this)
  }

  changeInput(e) {
    this.props.setGameInput(e.target.value)
  }

  showScoreChange(e){
    this.props.setShowScore(e.target.value == 'visible')
  }

  showTrackerChange(e){
    this.props.setShowTracker(e.target.value)
  }

  showTargetHighlightChange(e) {
    this.props.setShowTargetHighlight(e.target.value == 'visible')
  }

  changeOffsetMax(e) {
    this.props.setMaxOffset(parseInt(e.target.value))
  }

  componentDidMount() {
    if(document.getElementById('webgazerVideoFeed')){
        webgazer.pause()
    }
    if(document.getElementById('overlay')){
        document.body.removeChild(document.getElementById('overlay'));
    }
  }

  setGameSetting(targetHighlight, maxOffset, showTracker, showScore) {
    this.props.setShowTargetHighlight(targetHighlight);
    this.props.setMaxOffset(maxOffset);
    this.props.setShowTracker(showTracker);
    this.props.setShowScore(showScore);
    this.props.startGame();
  }

  startGame1() {
    this.setGameSetting(false, 0, 'hidden', false)
  }

  startGame2() {
    this.setGameSetting(false, 15, 'intermittent', false)
  }

  startGame3() {
    this.setGameSetting(false, 15, 'visible', false)
  }

  getHistoryCsv() {
    var csvContent = ["frame,timestamp,cursorPositionX,cursorPositionY,targetPositionX,targetPositionY,offsetX,offsetY,trackerOn"];
    history.forEach(function(e, index){
       var entryArray = [ e.frame,e.timestamp,e.cursorPositionX,e.cursorPositionY,e.targetPositionX,e.targetPositionY,e.offsetX,e.offsetY,e.trackerOn]
       var entryString = entryArray.join(",");
       csvContent.push(entryString)
    });

    const csv = csvContent.join("%0A")

    const offsetMax = this.props.offsetMax
    const gameInput = this.props.gameInput
    const showTracker = this.props.game.get('showTracker')
    const showScore = this.props.game.get('showScore')
    const showTargetHighlight = this.props.game.get('showTargetHighlight')


    var a         = document.createElement('a');
    a.href        = 'data:attachment/csv,' + csv;
    a.target      = '_blank';
    a.download    = gameInput+showScore+showTracker+showTargetHighlight+offsetMax+'.csv';

    document.body.appendChild(a);
    a.click();
  }

  render() {

    var gameOverMessage = <div><h1>Welcome to a Great Game!</h1></div>

    var gameOverText = "Darn!"
    if(this.props.started) {
        const score = "Score: "+this.props.game.get('score')
        if(this.props.game.get('targets') >= this.props.maxTargets){
            gameOverText = "Good game!"
        }
        gameOverMessage = <div className="text-xs-center">
            <h1>{gameOverText +" "+score}</h1>
            <h3>Would you like to play again?</h3>
        </div>
    }

    var historyButton = null

    if(this.props.started) {
        historyButton = <Button onClick={this.getHistoryCsv}>Logs</Button>
    }

    return (
        <div id="game-menu" className="text-xs-center">
            {gameOverMessage}
            <form>
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
            </form>
            <form>
              <ButtonGroup>
                <Button onClick={this.startGame1}>Game 1</Button>
                <Button onClick={this.startGame2}>Game 2</Button>
                <Button onClick={this.startGame3}>Game 3</Button>
              </ButtonGroup>
            </form>
            <br />
            <Button onClick={ ()=> this.setState({ open: !this.state.open })}>
              Settings
            </Button>
            <Panel collapsible expanded={this.state.open}>
            <form>
                <FormGroup onChange={this.showScoreChange}>
                  <ControlLabel><b>Live Scoreboard:</b></ControlLabel>
                  <br />
                  <Radio name="radioGroup" inline value={'visible'} checked={this.props.game.get('showScore')}>
                    Visible
                  </Radio>
                  {' '}
                  <Radio name="radioGroup" inline value={'hidden'} checked={!this.props.game.get('showScore')}>
                    Hidden
                  </Radio>
                </FormGroup>
            </form>
            <form>
                <FormGroup onChange={this.showTrackerChange}>
                  <ControlLabel><b>Tracker Indicator:</b></ControlLabel>
                  <br />
                  <Radio name="radioGroup" inline value={'visible'} checked={this.props.game.get('showTracker') == 'visible'}>
                    Visible
                  </Radio>
                  {' '}
                  <Radio name="radioGroup" inline value={'hidden'} checked={this.props.game.get('showTracker') == 'hidden'}>
                    Hidden
                  </Radio>
                  {' '}
                  <Radio name="radioGroup" inline value={'intermittent'} checked={this.props.game.get('showTracker') == 'intermittent'}>
                    Intermittent
                  </Radio>
                </FormGroup>
            </form>
            <form>
                <FormGroup onChange={this.showTargetHighlightChange}>
                  <ControlLabel><b>Highlight Target:</b></ControlLabel>
                  <br />
                  <Radio name="radioGroup" inline value={'visible'} checked={this.props.game.get('showTargetHighlight')}>
                    On
                  </Radio>
                  {' '}
                  <Radio name="radioGroup" inline value={'hidden'} checked={!this.props.game.get('showTargetHighlight')}>
                    Off
                  </Radio>
                </FormGroup>
            </form>
            <form className="text-xs-center">
                <FormGroup>
                    <ControlLabel><b>Tracker Max Offset:</b></ControlLabel>
                    <br />
                    <FormControl className="offset-input" onChange={this.changeOffsetMax} value={this.props.offsetMax} style={{width: "150px"}} type="text" placeholder="0, 15, 100..." />
                </FormGroup>
             </form>
             </Panel>
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
    maxTargets: state.get('maxTargets'),
    started: state.get('started'),
    offsetMax: state.get('offsetMax')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    startGame: () => {
        return dispatch(startGame())
    },
    setGameInput: (input) => {
        return dispatch(setGameInput(input))
    },
    setShowScore: (show) => {
        return dispatch(setShowScore(show))
    },
    setShowTracker: (show) => {
        return dispatch(setShowTracker(show))
    },
    setShowTargetHighlight: (show) => {
        return dispatch(setShowTargetHighlight(show))
    },
    setMaxOffset: (maxOffset) => {
        return dispatch(setMaxOffset(maxOffset))
    }
  }
}

const GameMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameMenu)

export default GameMenuContainer