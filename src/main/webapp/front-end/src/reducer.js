import { Map, List, is } from 'immutable';
import Immutable from 'immutable';
import { getSession, setSession } from './utilities';
import { MOUSE, EYES } from './utilities.js'

const uuidv1 = require('uuid/v1');

const maxScore = 5;

export var history = []

function cleanState() {

  const cleanState = Map({
    cursorPosition: Map({x: null, y: null, timestamp: null}),
    mousePosition: Map({x: null, y: null}),
    targetPosition: Map({x: null, y: null}),
    completedCurrentTarget: false,
    game: Map({score: 0, gameClock: 0, gameInProgress: false}),
    maxScore: maxScore,
    gameInput: MOUSE,
    calibrated: false,
    targetSize: 50,
    frame: 0
  });

  history = []

  return cleanState;
}

function updateCursorPosition(state, position) {
    const updatedPosition = Immutable.fromJS(position)
    const now = new Date()
    const withTimeStamp = updatedPosition.set('timestamp', now)
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

    const entry = {
        cursorPositionX: cursorPosition.get('x'),
        cursorPositionY: cursorPosition.get('y'),
        mousePositionX: mousePosition.get('x'),
        mousePositionY: mousePosition.get('y'),
        targetPositionStartX: targetPosition.get('x'),
        targetPositionStartY: targetPosition.get('y'),
        targetPositionEndX: targetPosition.get('x') + targetSize,
        targetPositionEndY: targetPosition.get('y') + targetSize,
        frame: frame,
        timestamp: now
    }

    const newState = state.set('frame', state.get('frame') + 1)

    history.push(entry)

    return newState
}

function updateTargetPosition(state, position) {
    const newState = state.set('targetPosition', Immutable.fromJS(position))
    return newState.set('completedCurrentTarget', false)
}

function completedCurrentTarget(state){
    const updatedScore = state.setIn(['game','score'], state.getIn(['game', 'score']) + 1)
    return updatedScore.set('completedCurrentTarget', true)
}

function startGame(state) {
    const gameInput = state.get('gameInput')
    const newState = cleanState()
    const withInput = newState.set('gameInput', gameInput) //EWWW
    return withInput.setIn(['game', 'gameInProgress'], true)
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
    default:
      return state;
  }
};
