import store from './store.js';
import Cookies from 'js-cookie';
import { login, loginError, loginSuccess, loginClearInputs, checkAuthentication } from './actions.js';
var _ = require('lodash');

export const EYES = "eyes"
export const MOUSE = "mouse"


export var authenticationHeader = 'bee-session-key';
export var cookieName = 'BEE_SESS_KEY';

export function getSession() {
  return Cookies.get(cookieName);
}

export function setSession(session) {
  if (session == null) {
    Cookies.remove(cookieName);
  } else {
    Cookies.set(cookieName, session, { expires: 30 });
  }
}

export function authenticate() {
  var authentication = {};
  authentication[authenticationHeader] = Cookies.get(cookieName);
  return authentication;
}

export function isAuthenticated(){
    const sessionKey = getSession()
    return store.dispatch(checkAuthentication(sessionKey))
        .then(response => {
          if (response.error) {
            store.dispatch(loginError(response.error));
            return false;
          }

          const session = response.payload.headers[authenticationHeader];
          if (!session) {
            return false;
          }

          store.dispatch(loginSuccess(session));
          return true;
        });
}

export const tryLogin = (email, password) => {
  return store.dispatch(login(email, password))
    .then(response => {
      if (response.error) {
        store.dispatch(loginError(response.error));
        return false;
      }

      const session = response.payload.headers[authenticationHeader];
      if (!session) {
        return false;
      }

      store.dispatch(loginSuccess(session));
      return true;
    });
};

export function isNullLabel(label) {
  return label.labelValue == 0 && !label.point1x && !label.xCoordinate
}

export const ONTOLOGY_TYPE_BINARY = "BINARY"
export const ONTOLOGY_TYPE_FLOAT_RANGE = "FLOAT_RANGE"
export const ONTOLOGY_TYPE_INTEGER_RANGE = "INTEGER_RANGE"

export function ontologyDisplayName(ontology_type) {
    switch(ontology_type) {
        case ONTOLOGY_TYPE_BINARY:
            return "binary";
        case ONTOLOGY_TYPE_FLOAT_RANGE:
            return "floating point range";
        case ONTOLOGY_TYPE_INTEGER_RANGE:
            return "integer range";
        default:
            return false;
    }
}

export function isNumeric(n) {
    return isANumber(parseFloat(n));
}

export function isANumber(n) {
    if(n == 0){
        return true
    }
    return n && !isNaN(n) && isFinite(n) && !writingDecimal(n) && !writingNegative(n);
}

export function couldBeNumeric(n) {
    return n && (writingDecimal(n) || isNumeric(n) || writingNegative(n) )
}

export function writingDecimal(n) {
    return String(n).match(/^-?\d+\.$/)
}

export function writingNegative(n){
    return n=="-"
}

export function validMinMax(min, max) {
    if(isNumeric(min) && isNumeric(max)) {
        return Number(min) < Number(max);
    }
    return false
}

export function valueInRange(value, min, max) {
    if(isNumeric(value) && isNumeric(min) && isNumeric(max)){
        return value <= max && value >= min
    }
    return false
}

export function sum(collection) {
  return collection.reduce((sum, x) => sum + x, 0)
}