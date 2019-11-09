import React, { Fragment } from "react";
import TwitterLogin from "react-twitter-auth";
import {
  updateAuthentication,
  updateToken,
  updateUser,
  logoutAndReset
} from "./../actions";
import { useSelector, useDispatch } from "react-redux";

import TweetCard from "./TweetCard/TweetCard";
import TweetNav from "./TweetNav";
import DragOptions from "./DragOptions";
import Lives from './Lives';

import GameController from '../classes/GameController';

import { CSSTransition } from 'react-transition-group';

import clickFile from './../sound/click.mp3';
import printFile from './../sound/print.mp3';
import successFile from './../sound/success.mp3';

let clickSound = new Audio(clickFile);
let printSound = new Audio(printFile);
let successSound = new Audio(successFile);

let dispatch;

let gameController = new GameController();

const onFailedAuth = error => {
  console.log("Twitter auth failed :(");
  console.log(error);
};

const onSuccessAuth = async (response) => {
  const token = response.headers.get("x-auth-token");
  console.log(response);
  response.json().then(async user => {
    //successful auth, update store
    if (token) {
      console.log("User auth successful :)");
      successSound.play();

      //dispatch the user object to store
      dispatch(updateUser(user));
      //dispatch the token to store
      dispatch(updateToken(token));
      //dispatch action to update authentication to store
      dispatch(updateAuthentication(true));

    }
  });
};

const logout = () => {
  clickSound.play();
  //clear cache
  localStorage.removeItem('state');
  //set state to initial
  dispatch(logoutAndReset());
}


const App = () => {
  //get current state
  const user = useSelector(state => state.user);
  const game = useSelector(state => state.game);

  let animateOptions = useSelector(state => state.ui.optionsIn);

  let gameAdmin;
  let gridStyle = 'main-grid';
  let gridSpan = '';

  let animation = 'fade';
  let animationDur = 400;

  if (animateOptions === false) {
    animationDur = 200;
  }

  let welcome = false;


  if (user.isAuthenticated === true) {
    if (game.curGame !== null) {
      //we have a game
      const sixHours = 6 * 60 * 60 * 1000;
      if (Date.now() - game.lastTweetFetchDate > sixHours) {
        console.log("last fetched more than six hours ago, re-fetching and creating new game now now")
        gameController.init();

        game.curGame = null;
      }

      //show some administration like next button or refresh
      else if (game.curGame.type === 'Complete') {
        animation = 'scale';
        animationDur = 200;
        gameAdmin = (<TweetNav />);
        gridStyle = 'single';
        gridSpan = 'span';
      }
      else if (game.curGame.type === 'NoTweets') {
        //this should probably be a new component
        animation = 'none';
        gameAdmin = (
          <div className='no-new-tweets'>
            <h2>No new tweets to fetch.</h2>
            <h3>Try again later.</h3>
            <button
              onClick={() => {
                clickSound.play();
                gameController.newGame();
              }}
              className="button"
            >
              RETRY
          </button>
          </div>
        );

        gridStyle = 'single';
        gridSpan = 'span';
      }
    }
    else {
      gameController.init();
    }
  }


  //check to see if we need to refresh

  //init reference to dispatch
  dispatch = useDispatch();


  let content = null;

  console.log("using " + animation + ' for options animation');

  if (user.isAuthenticated && game.curGame !== null) {
    content = (
      <div className="page-wrapper">
        <div className="top-bar">
          <div className="title">
            <h1>EASY COME, EASY GO</h1>
          </div>
          <div className="user-info">
            <img src={user.userDetails.img} alt='your profile picture' className='user-pic'></img>
            <h3 className='user-name'>{user.userDetails.name}</h3>
            <button className="small-text log-out" onClick={() => logout()}>LOG OUT</button>
          </div>
        </div>
        <div className={"main-flex " + gridStyle}>
          <TweetCard />
          <CSSTransition
            in={animateOptions}
            classNames={animation}
            timeout={animationDur}
          >
            <div className={"main-grid-col-2 " + gridSpan + " " + animation}>
              {game.curGame.type === 'Complete' || game.curGame.type === 'NoTweets' ?
                <Fragment>
                  <div className="span">{gameAdmin}</div>
                </Fragment>
                :
                <Fragment>
                  <DragOptions />
                  <Lives />
                </Fragment>
              }
            </div>
          </CSSTransition>
        </div>
      </div>
    );

  }

  //loading after authentication
  else if (user.isAuthenticated) {
    content = (
      <div className="page-wrapper">
        <div className="top-bar">
          <div className="title">
            <h1>SLOW TWITTER</h1>
          </div>
          <div className="user-info">
            <img src={user.userDetails.img} alt='your profile picture' className='user-pic'></img>
            <h3 className='user-name'>{user.userDetails.name}</h3>
            <button className="small-text log-out" onClick={() => logout()}>LOG OUT</button>
          </div>
        </div>
        <div id="noTrespassingOuterBarG">
          <div id="noTrespassingFrontBarG" class="noTrespassingAnimationG">
            <div class="noTrespassingBarLineG"></div>
            <div class="noTrespassingBarLineG"></div>
            <div class="noTrespassingBarLineG"></div>
            <div class="noTrespassingBarLineG"></div>
            <div class="noTrespassingBarLineG"></div>
            <div class="noTrespassingBarLineG"></div>
          </div>
        </div>
      </div>
    );

  }

  //initial view not signed in
  else {
    content = (
      <div className="page-wrapper">
        <CSSTransition
            in={true}
            classNames={'fade-slow'}
            timeout={1000}
            appear={true}
          >
        <div className="top-bar">
          <div className="title">
            <h1>SLOW TWITTER</h1>
          </div>
          <div className="user-info">
            <TwitterLogin
              loginUrl="http://slow-twitter.appspot.com/api/v1/auth/twitter"
              onFailure={onFailedAuth}
              onSuccess={onSuccessAuth}
              requestTokenUrl="http://slow-twitter.appspot.com/api/v1/auth/twitter/reverse"
              className="twitter-login-button small-text"
              text="SIGN IN TO TWITTER"
              showIcon={false}
            />
          </div>
        </div>
        </CSSTransition>
        <div className={"main-flex rel"}>
          <CSSTransition
            in={true}
            classNames={'slide-up-slow'}
            appear={true}
            timeout={2000}
            onEntering={() => printSound.play()}
            onEntered={() => printSound.pause()}
          >
            <div className="welcome-message-wrapper">
              <div className="welcome-message">
                <h2 className='section-title'>Welcome to Slow Twitter.</h2>
                <p>This site will transform your Twitter feed into a series of mini-games.</p>
                <p>Login to your Twitter account get started.</p>
              </div>
            </div>
          </CSSTransition>
        </div>
      </div>

    );
  }


  return <Fragment>{content}</Fragment>;
};
export default App;
