import React from 'react'
import { useSelector } from "react-redux";
import TweetText from './../TweetText';
import TweetMedia from '../TweetMedia';

const QuoteTweet = () => {
    let quoteTweet = useSelector(state => state.game.curGame.curTweet.quoteTweet);

    return(
        <div className="quote-tweet-grid">
            <div className="quote-tweet-content">
                <TweetText quote={true} />
                <TweetMedia />
            </div>
        </div>
    )
}

export default QuoteTweet