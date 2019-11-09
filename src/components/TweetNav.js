import React from 'react'
import GameController from './../classes/GameController';
import { useDispatch, useSelector } from 'react-redux';
import { tweetOut, optionsOut, optionsIn, tweetIn } from '../actions';

import clickFile from './../sound/click.mp3';

let clickSound = new Audio(clickFile);

let gameController = new GameController();

let dispatch;



let animateAndNext = async (fail) => {
    clickSound.play();
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

const TweetNav = () => {

    dispatch = useDispatch();

    let curGame = useSelector(state => state.game.curGame);

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
            <h2>{message}</h2>
            <button onClick={() => animateAndNext(fail)}>NEXT &#x27AA;</button>
        </div>
    )
}

export default TweetNav