import axios from 'axios';
import {authenticatedSession, authenticationHeader, authenticate} from './utilities';

export const domain = CONFIG ? CONFIG.frontServer ? 'http://localhost:8080' : '' : '';

export function cleanState() {
  return {
    type: 'CLEAN_STATE'
  };
}

export function updateCursorPosition(x, y) {
  return {
    type: 'UPDATE_CURSOR_POSITION',
    position: {x: x, y: y}
  }
}

export function updateMousePosition(x, y) {
  return {
    type: 'UPDATE_MOUSE_POSITION',
    position: {x: x, y: y}
  }
}

export function updateTargetPosition(x, y) {
  return {
    type: 'UPDATE_TARGET_POSITION',
    position: {x:x, y: y}
  }
}

export function completedCurrentTarget(){
  return {
    type: 'COMPLETED_CURRENT_TARGET'
  }
}

export function startGame() {
   return {
     type: 'START_GAME'
   }
}

export function endGame() {
  return {
    type: 'END_GAME'
  }
}

export function doneCalibrating() {
  return {
    type: 'DONE_CALIBRATING'
  }
}

export function setGameInput(input) {
  return {
    type: 'SET_GAME_INPUT',
    input: input
  }
}

export function createUser(email, password) {
  const request = axios({
    method: 'post',
    url: `${domain}/users/create`,
    headers: {
      'email': email,
      'password': password
    }
  });

  return {
    type: 'CREATE_USER',
    payload: request
  };
}

export function createUserSuccess(loaded) {
  return {
    type: 'CREATE_USER_SUCCESS',
    payload: loaded
  };
}

export function createUserError(error) {
  return {
    type: 'CREATE_USER_ERROR',
    error: error
  };
}

export function logHistory() {
  return {
    type: 'LOG_HISTORY'
  }
}