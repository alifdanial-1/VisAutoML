import { combineReducers } from "redux";
import modelReducer from "./modelReducer";
import tasksReducer from "./tasksReducer";
import learningProgressReducer from "./learningProgressReducer";

const rootReducer = combineReducers({
  model: modelReducer,
  tasks: tasksReducer,
  learningProgress: learningProgressReducer
});

export default rootReducer;
