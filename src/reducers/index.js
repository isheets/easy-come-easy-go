import { combineReducers } from 'redux'
import user from './user'
import game from './game'
import lightbox from './lightbox'
import ui from './ui'

export default combineReducers({
  user,
  game,
  lightbox,
  ui
})