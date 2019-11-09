import React, { Fragment } from 'react'
import { useSelector } from "react-redux";

import Typing from 'react-typing-animation';

export var timeSinceTweet = function( tweetDateString ) {
  
    // Convert both dates to milliseconds
    var tweetDate = new Date(tweetDateString);
    var tweetTime = tweetDate.getTime();
    var nowDate = new Date();
    var nowTime = nowDate.getTime();
  
    // Calculate the difference in milliseconds
    var difference_ms = nowTime - tweetTime;
    //take out milliseconds
    difference_ms = difference_ms/1000;
    var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms/60; 
    var minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms/60; 
    var hours = Math.floor(difference_ms % 24);  
    var days = Math.floor(difference_ms/24);

    if(days > 0) {
        return days + "d"
    }
    else if(hours > 0) {
        return hours + "h"
    }
    else if(minutes > 0) {
        return minutes + "m"
    }
    else if(seconds > 0) {
        return seconds + "s"
    }
    else {
        return "0s"
    }
  }


const TweetInfo = (props) => {
    const curGame = useSelector(state => state.game.curGame);
    let curTweet = null;
    if(curGame !== null) {
        curTweet = curGame.curTweet;
    }
    let quote = props.quote;
    let tweetToRender;
    let classForTweetInfo;
    //check if we need to render quote tweet info or no
    if(quote === true) {
        tweetToRender = curTweet.quoteTweet;
        classForTweetInfo = "quote-tweet-info";
    }
    else {
        tweetToRender = curTweet;
        classForTweetInfo = "tweet-info"
    }
    let infoContent;
    if (tweetToRender !== null) {
        timeSinceTweet(tweetToRender.date);
     infoContent = (
            <div className={classForTweetInfo}>
                <h3 className={classForTweetInfo + "-name"}>{tweetToRender.user.name}</h3>
                <h4 className={classForTweetInfo + "-details"}>@{tweetToRender.user.handle} / {timeSinceTweet(tweetToRender.date)}</h4>
            </div>
        )
    }
    else {
     infoContent = (<p>curTweet not found</p>);
    }
    return (
        <Fragment>
             {infoContent}
        </Fragment>
    )
}

export default TweetInfo