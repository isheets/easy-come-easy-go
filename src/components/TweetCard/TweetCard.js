import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import TweetContent from "./TweetContent/TweetContent";
import "./TweetCard.css";




const TweetCard = () => {
  //hook into state to get the current tweet to display
  let game = useSelector(state => state.game.curGame);
  let content;

  let gridOrder = '';
  let gridSpan = '';

  if (game !== null) {
    let curTweet = game.curTweet;

    //make sure we have content to render
    if (curTweet !== null) {
      //render the info and everything if its FillBlank
      if (game.type === 'FillBlank') {
        content = (
          <Fragment>
            <TweetContent />
          </Fragment>
        );
      }
      //put in blank instead of info
      else if (game.type === 'GuessAuthor') {
        content = (
          <Fragment>
            <TweetContent />
          </Fragment>
        )
      }
      else if (game.type === 'Complete' || game.type === 'NoTweets') {
        content = (
          <Fragment>
            <TweetContent />
          </Fragment>
        );

        gridOrder = 'second'
        gridSpan = 'span-cols'
      }
      else {
        console.error('Game type not caught in TweetCard');
      }
    }

  }

  //no tweets view
  else {
    content = null;
  }

  return (<div className={'tweet ' + gridOrder + " " + gridSpan}>{content}</div>);
};

export default TweetCard;
