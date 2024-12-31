import {applyMiddleware, combineReducers, createStore} from 'redux';
import {thunk} from 'redux-thunk';
import authReducer from './Reducer/AuthReducer';
import jobReducer from './Reducer/JobViewReducer';
 
const rootReducer = combineReducers({
  auth: authReducer,
  Jobs: jobReducer,
 
});
 
const store = createStore(rootReducer, applyMiddleware(thunk));
 
export default store;
 