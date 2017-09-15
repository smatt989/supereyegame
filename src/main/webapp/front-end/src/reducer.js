import { Map, List, is } from 'immutable';
import Immutable from 'immutable';
import { getSession, setSession } from './utilities';
import { MOUSE, EYES } from './utilities.js'

const uuidv1 = require('uuid/v1');

const maxScore = 5;

function cleanState() {

  const cleanState = Map({
    cursorPosition: Map({x: null, y: null}),
    targetPosition: Map({x: null, y: null}),
    completedCurrentTarget: false,
    game: Map({score: 0, gameClock: 0, gameInProgress: false}),
    maxScore: maxScore,
    gameInput: MOUSE,
    calibrated: false,
    targetSize: 100
  });

  return cleanState;
}

function updateCursorPosition(state, position) {
    return state.set('cursorPosition', Immutable.fromJS(position))
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

export default function reducer(state = Map(), action) {
  switch (action.type) {
    case 'CLEAN_STATE':
      return cleanState();
    case 'UPDATE_CURSOR_POSITION':
      return updateCursorPosition(state, action.position);
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
    default:
      return state;
  }
};
