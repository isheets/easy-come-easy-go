import React from 'react'
import GameController from './../classes/GameController';
import { useDispatch, useSelector } from 'react-redux';
import { tweetOut, optionsOut, tweetIn } from '../actions';

import clickFile from './../sound/click.mp3';

let clickSound = new Audio(clickFile);

let gameController = new GameController();

let dispatch;



let animateAndNext = async (fail) => {
    if(playSound === true) {
        clickSound.play();
    }
    if (fail === true) {
        dispatch(optionsOut());
        setTimeout(function () {
            gameController.newGame()
            dispatch(tweetIn());
        }, 200);
    }
    else {
        dispatch(tweetOut());
        dispatch(optionsOut());
        setTimeout(function () {
            gameController.newGame()
        }, 200);
    }

}

let playSound = true;

const TweetNav = () => {

    dispatch = useDispatch();

    let curGame = useSelector(state => state.game.curGame);
    playSound = useSelector(state => state.ui.playSound);

    let message = 'Tweet completed.';

    let fail = false;

    if (curGame !== null) {
        if (curGame.type === 'Complete') {
            if (curGame.status === 'Fail') {
                fail = true;
                message = 'Fail. Keep moving.'
            }

        }
    }

    return (
        <div className="tweet-nav-wrapper">
            <h2 className='tweet-nav-title'>{message}</h2>
            <button className='tweet-nav-button small-text' onClick={() => animateAndNext(fail)}>NEXT &#x27AA;</button>
        </div>
    )
}

export default TweetNav