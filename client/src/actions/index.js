import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  DEAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE,
  FETCH_USER_FEED_DATA,
  USER_UPDATE_V1,
  USER_UPDATE_CC,
  CREATE_GROUP,
  FETCH_GROUP_DATA,
  FETCH_ALL_GROUPS,
  FETCH_ALL_USERS,
  FETCH_PROFILE_DATA
} from './types'

const ROOT_URL = 'http://localhost:3090';


/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          SIGN-UP / LOG-IN / SIGN-OUT
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

export function signupUser({ email, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/signup`, { email, password })
      .then(response => {
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        browserHistory.push('/profile-feed');
      })
      .catch(error => dispatch(authError(error.response.data.error)));
  }
}

export function loginUser({ email, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/login`, { email, password })
      .then(response => {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        dispatch({ type: AUTH_USER });
        browserHistory.push('/profile-feed');
      })
      .catch(() => {
        dispatch(authError('Bad Login Info'));
      });
  }
}

export function signoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  return { type: DEAUTH_USER };
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          USER
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

export function userV1Details({ firstName, lastName, dob, userType }) {
  const id = localStorage.getItem('userId');
  const config = { headers: { authorization: localStorage.getItem('token') } };
  return function(dispatch) {
    axios.post(`${ROOT_URL}/profile/updateV1/${id}`, { firstName, lastName, dob, userType }, config)
      .then(response => {
        dispatch({ type: USER_UPDATE_V1, payload: response.data });
      })
      .catch(error => dispatch(authError(error.response.data.error)));
  }
}

export function userCCDetails({ ccName, ccN, ccE, ccV }) {
  const id = localStorage.getItem('userId');
  const config = { headers: { authorization: localStorage.getItem('token') } };
  return function(dispatch) {
    axios.post(`${ROOT_URL}/user/ccinfo/${id}`, { ccName, ccN, ccE, ccV }, config)
      .then(response => {
        dispatch({ type: USER_UPDATE_CC, payload: response.data });
      })
      .catch(error => dispatch(authError(error.response.data.error)));
  }
}

export function fetchUserFeedData() {
  const id = localStorage.getItem('userId');
  const config = { headers: { authorization: localStorage.getItem('token') } };
  return function(dispatch) {
    axios.get(`${ROOT_URL}/profile/${id}`, config)
      .then(response => {
        dispatch({
          type: FETCH_USER_FEED_DATA,
          payload: response.data
        })
      })
      .catch(() => { dispatch(authError('Could not Fetch Profile Data'));});
  }
}

export function fetchAllUsers() {
  const config = { headers: { authorization: localStorage.getItem('token') } };
  return function(dispatch) {
    axios.get(`${ROOT_URL}/all-users`, config)
      .then(response => {
        dispatch({
          type: FETCH_ALL_USERS,
          payload: response.data
        })
      })
      .catch(() => { dispatch(authError('Could not Fetch all the Users')); });
  }
}

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          PROFILE
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

export function fetchProfileData(profileId) {
  console.log('in fPD id = ', profileId);
  const config = { headers: { authorization: localStorage.getItem('token'), profileId: profileId } };
  return function(dispatch) {
    axios.get(`${ROOT_URL}/profile-data`, config)
      .then(response => {
        console.log('response = ', response);
        dispatch({
          type: FETCH_PROFILE_DATA,
          payload: response.data
        })
      })
      .catch(() => { dispatch(authError('Could not fetch this users profile data')); });
  }
}

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          GROUP
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

export function createGroup({ groupName }) {
  const id = localStorage.getItem('userId');
  const config = { headers: { authorization: localStorage.getItem('token') } };
  return function(dispatch) {
    axios.post(`${ROOT_URL}/create-group`, { groupName, id }, config)
      .then(response => {
        dispatch({
          type: CREATE_GROUP,
          payload: response.data
        });
        browserHistory.push('/group/' + response.data.group.name);
      })
      .catch(error => { dispatch(authError(error.response.data.error)); });
  }
}

export function fetchGroupData(groupName) {
  const config = { headers: { authorization: localStorage.getItem('token') } };
  return function(dispatch) {
    axios.get(`${ROOT_URL}/group/${groupName}`, config)
      .then(response => {
        dispatch({
          type: FETCH_GROUP_DATA,
          payload: response.data
        })
      })
      .catch(() => { dispatch(authError('Could not Fetch Group Data')); });
  }
}

export function fetchAllGroups() {
  const config = { headers: { authorization: localStorage.getItem('token') } };
  return function(dispatch) {
    axios.get(`${ROOT_URL}/groups`, config)
      .then(response => {
        dispatch({
          type: FETCH_ALL_GROUPS,
          payload: response.data
        });
      })
      .catch(() => { dispatch(authError('Could no Fetch All Groups')); });
  }
}

export function addUserToGroup(groupId) {
  const config = { headers: { authorization: localStorage.getItem('token') } };
  // const id = localStorage.getItem('userId');
  return function(dispatch) {
    // axios.post(`${ROOT_URL}/group-add-user`, { groupId, userId: id }, config)
    axios.post(`${ROOT_URL}/group-add-user`, { groupId }, config)
      .then(response => {
        dispatch({
          type: ADD_USER_TO_GROUP,
          payload: response.data
        });
      })
      .catch(() => { dispatch(authError('Could not add User to the Group')); });
  }
}

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          OTHER
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

export function fetchMessage() {
  const config = { headers: { authorization: localStorage.getItem('token') } };
  return function(dispatch) {
    axios.get(ROOT_URL, config)
      .then(response => {
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        })
      })
      .catch(() => { dispatch(authError('Could not Fetch Message')); });
  }
}
