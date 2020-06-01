import axios from 'axios';
import { setAlert, ALERT_TYPES } from './alert'
import { 
    USER_LOADED, AUTH_ERROR,
    REGISTER_FAIL, REGISTER_SUCCESS,
    LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT
} from './types';
import setAuthToken from '../utils/setAuthToken';



// Load User
export const loadUser = () => async dispatch => {
    if (localStorage.getItem('token')) {
        setAuthToken(localStorage.getItem('token'))
    }

    try {
        const res = await axios.get('/api/auth')
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
        
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}



// Register user

export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ name, email, password })

    try {
        const res = await axios.post('/api/users', body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
        dispatch(loadUser());
    } catch (err) {

        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(err => dispatch(setAlert( {
                ...ALERT_TYPES.REGISTER_ERROR,
                msg: err.msg
            })));
        }
        dispatch({
            type: REGISTER_FAIL
        })
    }
};

// Login user

export const login = (email, password ) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ email, password })

    try {
        const res = await axios.post('/api/auth', body, config);
        console.log(res.data);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
    } catch (err) {
        //alert("err", JSON.stringify(err));
        const errors = err.response.data.errors;
        console.log(err);
        console.log(errors);
        if (errors) {
            errors.forEach(err => dispatch(setAlert( {
                ...ALERT_TYPES.LOGIN_ERROR,
                msg: err
            })));
        }
        dispatch({
            type: LOGIN_FAIL
        })
    }
}

export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    });
};