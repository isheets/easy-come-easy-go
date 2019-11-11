import React from 'react'
import TweetText from './../TweetText';
import TweetMedia from '../TweetMedia';

const QuoteTweet = () => {

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