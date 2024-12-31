import {applyMiddleware, combineReducers, createStore} from 'redux';
import {thunk} from 'redux-thunk';
import authReducer from './Reducer/AuthReducer';
import JobViewController from './Action/JobViewController';
 
const rootReducer = combineReducers({
  auth: authReducer,
  Job: JobViewController,
 
});
 
const store = createStore(rootReducer, applyMiddleware(thunk));
 
export default store;
 