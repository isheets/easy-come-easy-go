import React, { Fragment } from 'react';
import { useSelector, useDispatch } from "react-redux";
import TweetText from "./TweetText";
import TweetMedia from "./TweetMedia";
import QuoteTweet from "./QuoteTweet/QuoteTweet";

import { CSSTransition } from 'react-transition-group';
import { tweetIn, optionsIn } from '../../../actions';

import printFile from './../../../sound/print.mp3';


let printSound = new Audio(printFile);

const TweetContent = () => {

    console.log('rendering content');

    const enterTransition = () => {
        dispatch(tweetIn());
    }

    const showOptions = () => {
        dispatch(optionsIn());
        printSound.pause();
    }

    
    const playSound = () => {
        printSound.play();
    }

    let curGame = useSelector(state => state.game.curGame);

    let animateToggle = useSelector(state => state.ui.tweetIn);

    let dispatch = useDispatch();

    let curTweet = null;
    if (curGame !== null) {
        curTweet = curGame.curTweet;
        if(curGame.type === 'Complete') {
            if(curGame.status === 'Fail') {
                showOptions();
                return null;
            }
        }
    }

    let content = null;

    let animation = 'slide-up';
    let animationDur = 1000;

    if (animateToggle === false) {
        animationDur = 200;
    }

    //make sure we have content to render
    if (curTweet !== null) {
        if(curGame.type === 'Complete') {
            animation = 'fade';
        }
        else if(curGame.type === 'NoTweets') {
            return null;
        }

        //check if we need to render a quote tweet
        if (curTweet.isQuote === true) {
            content = (
                <Fragment>
                    <TweetText />
                    <TweetMedia quote={false} />
                    <QuoteTweet />
                </Fragment>
            )
        }
        else {
            content = (
                <Fragment>
                    <TweetText />
                    <TweetMedia quote={false} />
                </Fragment>
            )
        }
    }

   

    return (
        <CSSTransition
            in={animateToggle}
            classNames={animation}
            appear={true}
            timeout={animationDur}
            onExited={()=> enterTransition()}
            onEntering={() => playSound()}
            onEntered={() => showOptions()}
        >
            <div className="tweet-content-wrapper torn">
                <div className="tweet-content">
                    {content}
                </div>
            </div>
        </CSSTransition>
    )
}

export default TweetContent