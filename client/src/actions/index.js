import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  DEAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE,
  FETCH_PROFILE_DATA
} from './types'

const ROOT_URL = 'http://localhost:3090';

export function signupUser({ email, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/signup`, { email, password })
      .then(response => {
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        browserHistory.push('/profile');
      })
      .catch(error => dispatch(authError(error.response.data.error)));
  }
}

export function loginUser({ email, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/login`, { email, password })
      .then(response => {
        // console.log('response data inside loginUser = ', response);
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        browserHistory.push('/profile');
      })
      .catch(() => {
        dispatch(authError('Bad Login Info'));
      });
  }
}

export function signoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('uId');
  return { type: DEAUTH_USER };
}


export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function fetchMessage() {
  return function(dispatch) {
    axios.get(ROOT_URL, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        console.log('response inside fetchMessage ... ', response);
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        })
      })
  }
}

export function fetchProfileData() {
  var id = localStorage.getItem('userId');
  return function(dispatch) {
    axios.get(`${ROOT_URL}/profile/${id}`, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        console.log('response inside getProfileData ... ', response);
        dispatch({
          type: FETCH_PROFILE_DATA,
          payload: response.data
        })
      })
  }
}
