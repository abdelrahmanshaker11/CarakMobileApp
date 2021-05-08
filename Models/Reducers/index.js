import { combineReducers } from 'redux'

import AuthReducer from './AuthReducer'
import HomeReducer from './HomeReducer'


export default combineReducers({
   AuthReducer: AuthReducer,
   HomeReducer: HomeReducer,
})