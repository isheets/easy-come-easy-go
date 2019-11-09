import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import FsLightbox from 'fslightbox-react';

import { setLBSlide, toggleLBVisible } from "./../../../actions";

let dispatch;

var showSlide = slide => {
  dispatch(toggleLBVisible());
  dispatch(setLBSlide(slide));
};

const TweetMedia = props => {
  let quote = props.quote;

  let curGame = useSelector(state => state.game.curGame);
  let curTweet = null;
  if (curGame !== undefined) {
    curTweet = curGame.curTweet;
  }

  let curSlide = useSelector(state => state.lightbox.slide);
  let lbVisible = useSelector(state => state.lightbox.isVisible);

  dispatch = useDispatch();
  let tweetWithMedia = null;

  //check if tweet with media we are rendering is quote or orginial

  if (quote === true) {
    tweetWithMedia = curTweet.quote;
  } else {
    tweetWithMedia = curTweet;
  }
  let content = null;

  let numMedia = 0;

  let mediaURLs = [];
  let imgAr = [];
  if (tweetWithMedia !== null) {
    if (tweetWithMedia.hasMedia) {
      const mediaAr = tweetWithMedia.media;
      console.log(mediaAr);
      numMedia = mediaAr.length;
      //we have some media to render!
      for (let i = 0; i < mediaAr.length; i++) {
        let media = mediaAr[i];
        mediaURLs.push(media.url);
        if (media.type === "photo" || media.type === "animated_gif") {
          imgAr.push(
            <img key={i} src={media.url} alt="" className={"tweet-media-item tweet-media-item-" + i} onClick={() => showSlide(i)}></img>
          );
        } else if (media.type === "video") {
          imgAr.push(
            <video
              width="426"
              height="240"
              controls
              className="tweet-media-item fit"
              key={i}
            >
              <source src={media.url} type={media.format}></source>
              Your browser does not support inline video viewing.
            <a href={media.url}>Click here to view.</a>
            </video>
          );
        } else {
          console.error(
            "Media Type not caught in switch statement: " + media.type
          );
        }
      }
      console.log(mediaURLs);
      content = (
        <div className={"tweet-media-grid-" + numMedia}>
          {imgAr}

          <FsLightbox toggler={lbVisible} slide={curSlide} sources={mediaURLs} />
        </div>
      );
      console.log(content);
    } else {
      content = null;
    }
  }
  else {
    content = null;
  }

  //return <div className={`tweet-media-${numMedia}`}>{content}</div>;
  return <Fragment>{content}</Fragment>;
};

export default TweetMedia;
