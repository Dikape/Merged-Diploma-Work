import reactCookie from 'react-cookie';

const LOGIN = 'redux-example/auth/LOGIN';
const LOGIN_SUCCESS = 'redux-example/auth/LOGIN_SUCCESS';
const LOGIN_SUCCESS_FROM_COOKIE = 'redux-example/auth/LOGIN_SUCCESS_FROM_COOKIE';
const LOGIN_FAIL = 'redux-example/auth/LOGIN_FAIL';
const LOGOUT = 'redux-example/auth/LOGOUT';
const LOGOUT_SUCCESS = 'redux-example/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'redux-example/auth/LOGOUT_FAIL';

const initialState = {
  loggingIn: false,
  loggedIn: false,
  token: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      reactCookie.save('token', action.result.token, { path: '/', maxAge: 36000000 });
      return {
        ...state,
        loggingIn: false,
        token: action.result,
        loggedIn: true
      };
    case LOGIN_SUCCESS_FROM_COOKIE:
      return {
        ...state,
        loggingIn: false,
        token: action.token,
        loggedIn: true
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        token: null,
        loggedIn: false
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function loginFromCookie() {
  const savedToken = reactCookie.load('token');
  return {
    type: LOGIN_SUCCESS_FROM_COOKIE,
    token: savedToken
  };
}

export function login(username, password) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('http://diploma-investment-map.herokuapp.com/auth/token', {
      data: {
        'username': username,
        'password': password
      }
    })
  };
}

export function logout() {
  reactCookie.remove('token');
  return {
    type: LOGOUT_SUCCESS
  };
}
