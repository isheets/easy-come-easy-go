import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import Typing from 'react-typing-animation';
import TweetProfilePic from "./../TweetProfilePic";
import AuthorBlank from "./AuthorBlank";

import Typist from 'react-typist';


const TweetText = props => {
	const game = useSelector(state => state.game.curGame);
	if (game !== null) {
		let curTweet = game.curTweet;

		//reset used indexes for every new tweet
		//usedIdx = [];

		let quote = props.quote;
		let textToRender;
		let urlsToRender = [];
		let tweetToRender;
		let classForTweetInfo;
		//check if we need to render quote tweet info or no
		if (quote === true) {
			tweetToRender = curTweet.quoteTweet;
			classForTweetInfo = "quote-tweet-info";
		}
		else {
			tweetToRender = curTweet;
			classForTweetInfo = "tweet-info"
		}
		let infoContent = null;
		let header = null;
		if (tweetToRender !== null) {
			infoContent = (
				<div className="info">
					<h3 className={classForTweetInfo + "-name"}>&#8213; {tweetToRender.user.name} <span className={classForTweetInfo + "-details"}> @{tweetToRender.user.handle}</span></h3>
				</div>
			)
		}
		else {
			console.error('no tweetToRender in TweetText')
		}

		//no need to extract words if it's a quote tweet
		if (quote === true) {
			textToRender = curTweet.quoteTweet.text;
			if (curTweet.quoteTweet.urls !== null) {
				for (let i = 0; i < curTweet.quoteTweet.urls.length; i++) {
					urlsToRender.push(
						<a target="_blank" href={curTweet.quoteTweet.urls[i].expanded_url} rel="noopener noreferrer" key={i}>
							&#x2197; {curTweet.quoteTweet.urls[i].display_url}
						</a>
					);
				}
			}
		}
		//extract words and such if its a fillblank game
		else if (game.type === 'FillBlank') {
			header = <h2 className="section-title">Complete the Tweet:</h2>
			textToRender = game.textToRender;
			console.log(textToRender);
			if (curTweet.urls !== null) {
				for (let i = 0; i < curTweet.urls.length; i++) {
					urlsToRender.push(
						<a target="_blank" href={curTweet.urls[i].expanded_url} rel="noopener noreferrer" key={i}>
							&#x2197; {curTweet.urls[i].display_url}
						</a>
					);
				}
			}
		}
		//no need to extract words if game is guess author
		else if (game.type === 'GuessAuthor') {
			infoContent = <AuthorBlank />;
			header = <h2 className="section-title">Guess the Author:</h2>
			textToRender = curTweet.text;
			urlsToRender = null;
			// if (curTweet.urls !== null) {
			// 	for (let i = 0; i < curTweet.urls.length; i++) {
			// 		urlsToRender.push(
			// 			<a target="_blank" href={curTweet.urls[i].expanded_url} rel="noopener noreferrer" key={i}>
			// 				&#x2197; {curTweet.urls[i].display_url}
			// 			</a>
			// 		);
			// 	}
			// }
		}
		else if (game.type === "Complete" || game.type === 'NoTweets') {
			textToRender = curTweet.text;
			if (curTweet.urls !== null) {
				for (let i = 0; i < curTweet.urls.length; i++) {
					urlsToRender.push(
						<a target="_blank" href={curTweet.urls[i].expanded_url} rel="noopener noreferrer" key={i}>
							&#x2197; {curTweet.urls[i].display_url}
						</a>
					);
				}
			}
		}
		else {
			console.error('Game type not recognized in TweetText');
		}

		let tweetDate = new Date(tweetToRender.date)

		return (
			<Fragment>
				{game.type === 'FillBlank' || game.type === 'GuessAuthor' && quote !== true ?
					<Fragment>
						{header}
						<h4 className="bold">Recieved at {tweetDate.toLocaleTimeString('en-US')} {tweetDate.toLocaleDateString('en-US')}</h4>
						<pre className="tweet-text">{textToRender}</pre>
						{infoContent}
						<div className="tweet-urls">{urlsToRender}</div>
					</Fragment>

					:

					<Fragment>
						<h4 className="bold">Recieved at {tweetDate.toLocaleTimeString('en-US')} {tweetDate.toLocaleDateString('en-US')}</h4>
						<pre className="tweet-text">{textToRender}</pre>
						{infoContent}
						<div className="tweet-urls">{urlsToRender}</div>
					</Fragment>
				}
			</Fragment>
		);
	}
	else return null;
};

export default TweetText;
