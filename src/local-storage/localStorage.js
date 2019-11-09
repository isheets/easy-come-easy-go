import FillBlank from './../classes/FillBlank';
import GuessAuthor from '../classes/GuessAuthor';

export const loadState = () => {
  console.log("ATTEMPTING TO LOAD STATE");
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    let parsedState = JSON.parse(serializedState);
    console.log(parsedState);
    //need to reconstruct the class instance based on persisted properties if it exists
    if (parsedState.game.curGame !== null) {
      let gameFromJson = {};
      if (parsedState.game.curGame.type === 'FillBlank') {
        gameFromJson = FillBlank.fromJSON(parsedState.game.curGame);
        console.log(gameFromJson);
        if(gameFromJson.type === 'NoWords') {
          gameFromJson = GuessAuthor.fromJSON(parsedState.game.curGame);
          gameFromJson.getRandomFriends(parsedState.game.parsedFriends, true);
        }
      }
      else if(parsedState.game.curGame.type === 'NoWords') {
        console.log('game type is NoWords, constructing GuessAuthor');
        gameFromJson = GuessAuthor.fromJSON(parsedState.game.curGame);
        gameFromJson.getRandomFriends(parsedState.game.parsedFriends, true);
      }
      else if (parsedState.game.curGame.type === 'GuessAuthor') {
        console.log('constructing new GuessAuthor game');
        gameFromJson = GuessAuthor.fromJSON(parsedState.game.curGame);
        gameFromJson.getRandomFriends(parsedState.game.parsedFriends, true);
      }
      else if(parsedState.game.curGame.type === 'Complete') {
        gameFromJson.type = 'Complete';
        gameFromJson.curTweet = parsedState.game.curGame.curTweet;
      }
      else if(parsedState.game.curGame.type === 'NoTweets') {
        gameFromJson.type = 'NoTweets';
        gameFromJson.curTweet = parsedState.game.curGame.curTweet;
      }
      else {
        console.error("Game type not caught in localStorage.js");
      }

      parsedState.game.curGame = gameFromJson;
    }
    return parsedState;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const saveState = (state) => {
  console.log("ATTEMPTING TO SAVE STATE");
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch {
    // ignore write errors
  }
};