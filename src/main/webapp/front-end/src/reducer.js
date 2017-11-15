import { Map, List, is } from 'immutable';
import Immutable from 'immutable';
import { getSession, setSession } from './utilities';
import { MOUSE, EYES } from './utilities.js'

const uuidv1 = require('uuid/v1');

const maxTargets = 10;
const targetSeconds = 5;
const targetSize = 50;
const offsetMax = 0;
const showTracker = 'visible';
const trackerOn = true;
const showScore = true;
const showTargetHighlight = true;

export var history = []

function cleanState() {

  const cleanState = Map({
    cursorPosition: Map({x: null, y: null, timestamp: null}),
    mousePosition: Map({x: null, y: null}),
    targetPosition: Map({x: null, y: null}),
    inputOffsets: Map({x: 0, y: 0}),
    completedCurrentTarget: false,
    started: false,
    game: Map({score: 0, targets: 0, gameClock: 0, gameInProgress: false, currentTargetClock: 0, showTracker: showTracker, showScore: showScore, showTargetHighlight: showTargetHighlight}),
    trackerOn: trackerOn,
    maxTargets: maxTargets,
    offsetMax: offsetMax,
    maxTimePerTarget: targetSeconds * 1000,
    gameInput: MOUSE,
    calibrated: false,
    targetSize: targetSize,
    frame: 0
  });

  history = []

  return cleanState;
}

function updateCursorPosition(state, position) {
    const updatedPosition = Immutable.fromJS(position)
    const withXOffset = updatedPosition.set('x', updatedPosition.get('x') + state.getIn(['inputOffsets', 'x'], 0))
    const withYOffset = withXOffset.set('y', updatedPosition.get('y') + state.getIn(['inputOffsets', 'y'], 0))
    const now = new Date()
    const withTimeStamp = withYOffset.set('timestamp', now)
    const newState = state.set('cursorPosition', withTimeStamp)
    return newState
}

function updateMousePosition(state, position) {
    return state.set('mousePosition', Immutable.fromJS(position))
}

function createHistoryEntry(state) {
    const now = new Date().getTime()
    const cursorPosition = state.get('cursorPosition')
    const targetPosition = state.get('targetPosition')
    const mousePosition = state.get('mousePosition')
    const targetSize = state.get('targetSize')
    const frame = state.get('frame')
    const inputOffsets = state.get('inputOffsets')
    const trackerOn = state.get('trackerOn')

    const entry = {
        cursorPositionX: cursorPosition.get('x'),
        cursorPositionY: cursorPosition.get('y'),
        //mousePositionX: mousePosition.get('x'),
        //mousePositionY: mousePosition.get('y'),
        //targetPositionStartX: targetPosition.get('x'),
        //targetPositionStartY: targetPosition.get('y'),
        //targetPositionEndX: targetPosition.get('x') + targetSize,
        //targetPositionEndY: targetPosition.get('y') + targetSize,
        targetPositionX: targetPosition.get('x'),
        targetPositionY: targetPosition.get('y'),
        offsetX: inputOffsets.get('x'),
        offsetY: inputOffsets.get('y'),
        frame: frame,
        timestamp: now,
        trackerOn: trackerOn
    }

    const newState = state.set('frame', state.get('frame') + 1)

    history.push(entry)

    return newState
}

function updateTargetPosition(state, position) {
    const newState = state.set('targetPosition', Immutable.fromJS(position))

    const offset = newState.get('offsetMax')

    const updatedOffsets = updateInputOffsets(newState, Math.round(Math.random() * offset * 2) - offset, Math.round(Math.random() * offset * 2) - offset)
    return updatedOffsets.set('completedCurrentTarget', false)
}

function completedCurrentTarget(state){
    const updatedScore = incrementScore(state, 1)
    const updatedTargets = updatedScore.setIn(['game', 'targets'], updatedScore.getIn(['game', 'targets']) + 1);
    return updatedTargets.set('completedCurrentTarget', true)
}

function startGame(state) {
    const newState = cleanState()
    const withInput = newState.set('gameInput', state.get('gameInput')) //EWWW
    const withMaxOffset = withInput.set('offsetMax', state.get('offsetMax'))
    const started = withMaxOffset.set('started', true)
    const showingScore = setShowScore(started, state.getIn(['game', 'showScore']))
    const showingTracker = setShowTracker(showingScore, state.getIn(['game', 'showTracker']))
    const showingTargetHighlight = setShowTargetHighlight(showingTracker, state.getIn(['game', 'showTargetHighlight']))
    return showingTargetHighlight.setIn(['game', 'gameInProgress'], true)
}

function endGame(state) {
    return state.setIn(['game', 'gameInProgress'], false)
}

function setGameInput(state, gameInput) {
    return state.set('gameInput', gameInput)
}

function doneCalibrating(state){
    return state.set('calibrated', true)
}

function createUser(state) {
  return state.set('createUser', Map({loading: true, error: null}));
}

function createUserSuccess(state, user) {
  return state.set('createUser', Map({loading: false, error: null}));
}

function createUserError(state, error) {
  return state.set('createUser', Map({loading: false, error: Immutable.fromJS(error)}));
}

function logHistory(state) {
  return createHistoryEntry(state)
}

function incrementScore(state, points) {
  return state.setIn(['game','score'], state.getIn(['game', 'score']) + points)
}

function incrementCurrentTargetClock(state, millis) {
  return state.setIn(['game', 'currentTargetClock'], state.getIn(['game', 'currentTargetClock'] + millis))
}

function updateInputOffsets(state, x, y) {
  return state.set('inputOffsets', Map({x: x, y: y}))
}

function setShowScore(state, show) {
  return state.setIn(['game', 'showScore'], show)
}

function setShowTracker(state, show) {
  return state.setIn(['game', 'showTracker'], show)
}

function setShowTargetHighlight(state, show) {
  return state.setIn(['game', 'showTargetHighlight'], show)
}

function setMaxOffset(state, maxOffset) {
  return state.set('offsetMax', maxOffset)
}

function setTrackerOn(state, trackerOn) {
  return state.set('trackerOn', trackerOn)
}

export default function reducer(state = Map(), action) {
  switch (action.type) {
    case 'CLEAN_STATE':
      return cleanState();
    case 'UPDATE_CURSOR_POSITION':
      return updateCursorPosition(state, action.position);
    case 'UPDATE_MOUSE_POSITION':
      return updateMousePosition(state, action.position);
    case 'UPDATE_TARGET_POSITION':
      return updateTargetPosition(state, action.position);
    case 'COMPLETED_CURRENT_TARGET':
      return completedCurrentTarget(state);
    case 'START_GAME':
      return startGame(state);
    case 'END_GAME':
      return endGame(state);
    case 'DONE_CALIBRATING':
      return doneCalibrating(state);
    case 'SET_GAME_INPUT':
      return setGameInput(state, action.input);
    case 'CREATE_USER':
      return createUser(state);
    case 'CREATE_USER_SUCCESS':
      return createUserSuccess(state, action.email);
    case 'CREATE_USER_ERROR':
      return createUserError(state, action.error);
    case 'LOG_HISTORY':
      return logHistory(state);
    case 'INCREMENT_SCORE':
      return incrementScore(state, action.points);
    case 'INCREMENT_CURRENT_TARGET_CLOCK':
      return incrementCurrentTargetClock(state, action.millis);
    case 'UPDATE_INPUT_OFFSETS':
      return updateInputOffsets(state, action.x, action.y);
    case 'SET_SHOW_SCORE':
      return setShowScore(state, action.show);
    case 'SET_SHOW_TRACKER':
      return setShowTracker(state, action.show);
    case 'SET_SHOW_TARGET_HIGHLIGHT':
      return setShowTargetHighlight(state, action.show);
    case 'SET_MAX_OFFSET':
      return setMaxOffset(state, action.maxOffset);
    case 'SET_TRACKER_ON':
      return setTrackerOn(state, action.trackerOn);
    default:
      return state;
  }
};
