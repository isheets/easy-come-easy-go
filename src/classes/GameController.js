import FillBlank from './FillBlank';
import GuessAuthor from './GuessAuthor';
import store from '../index';
import {
  updateParsedTweets,
  updateCurGame,
  updateParsedFriends,
  setDataAndInitGame,
  tweetOut,
  optionsOut
} from "../actions";

var he = require('he');

/*
TODO:
handle rate-limiting or no new tweets - inside new game 
scrub URLS from quote tweets

BUGS:
double init on reload when tweets fetched more than six hours ago
*/

export default class GameController {

  //fetch data and create a new game
  async init() {
    console.log("init")
    let tweets = await this.fetchNewTweets();
    let friends = await this.fetchAllFriends();
    let newGame = await this.newGame(true, tweets, friends);
    let lastTweetFetched = null;
    if (tweets !== null && tweets.length > 0) {
      lastTweetFetched = tweets[tweets.length - 1].tweetID;
    }
    if (newGame && tweets && friends) {
      store.dispatch(setDataAndInitGame(newGame, friends, tweets, lastTweetFetched));
    }
    else {
      if (tweets === null) {
        newGame.type = 'NoTweets';
      }
      console.error('problem in GameController.init()');
      store.dispatch(setDataAndInitGame(newGame, friends, tweets, lastTweetFetched));
    }
    return Promise.resolve();
  }

  pickGame() {

  }

  async newGame(shouldReturn, tweets, friends) {
    console.log("creating new game");
    //determine FillBlank or GuessAuthor psuedo randomly and instantiate
    let state = store.getState();
    //get all the tweets
    let allTweets;
    if (tweets) {
      console.log('using tweets parameter');
      allTweets = tweets;
    }
    else {
      console.log('using tweets from state')
      allTweets = state.game.parsedTweets;
    }

    if (allTweets && allTweets.length > 0) {
      //remove the first one and save it (will be used to create new game)
      let firstTweet = allTweets.splice(0, 1);
      //determine FillBlank or GuessAuthor
      let randomNumber = pickRandomNumber();
      let newGame;
      if (randomNumber <= 2) {
        //instantiate FillBlank game
        newGame = new FillBlank(firstTweet[0])

        if (newGame.type === 'NoWords') {
          newGame = new GuessAuthor(firstTweet[0]);
          if (friends) {
            newGame.getRandomFriends(friends);
          }
          newGame.getRandomFriends();
        }
      }
      else {
        //instantiate GuessAuthor game and make sure we get some random friends
        newGame = new GuessAuthor(firstTweet[0]);
        if (friends) {
          newGame.getRandomFriends(friends);
        }
        newGame.getRandomFriends();
      }

      if (shouldReturn === true) {
        return newGame;
      }

      else {
        //call methods to update the store accordingly
        this.updateTweets(allTweets);
        this.updateGame(newGame);
      }


    }
    else {
      console.log("out of tweets, fetching more");
      let newTweets = await this.fetchNewTweets();
      console.log(newTweets);
      if (newTweets === null || Object.keys(newTweets).length < 1) {
        console.error('Out of tweets in GameController.newGame()');
        if (state.game.curGame !== null) {
          state.game.curGame.type = 'NoTweets';
        }
        else {
          state.game.curGame = {};
          state.game.curGame.type = 'NoTweets';
        }
        this.updateGame(state.game.curGame);
      }
      else {
        console.log('Got ' + Object.keys(newTweets).length - 1 + ' new tweets.')
        this.updateTweets(newTweets);
        this.newGame();
      }

    }
  }

  //method to handle when we can't get the tweets (either bad params, rate-limited, or simply no new tweets to fetch)
  failFetchTweets() {

  }

  newGuessAuthor(tweet) {
    console.log("couldn't extract words, constructing GuessAuthor");

    let newGame = new GuessAuthor(tweet);
    newGame.getRandomFriends(undefined, true);

    return // also updates the store
  }

  updateTweets(tweets) {
    let lastTweetFetched = null;
    if (tweets.length > 0) {
      lastTweetFetched = tweets[tweets.length - 1].tweetID;
    }
    store.dispatch(updateParsedTweets(tweets, lastTweetFetched));
  }


  //resolves after 1 second - need to adjust to accomodate different times
  async animateOut() {
    store.dispatch(tweetOut());
    store.dispatch(optionsOut());

    return new Promise(resolve => setTimeout(
      () => {
        resolve();
      }, 200
    ));
  }

  updateGame(newGame) {

    store.dispatch(updateCurGame(newGame));

  }

  async fetchNewTweets(updateStore) {

    let state = store.getState();
    console.log("fetchNewTweets");

    //only fetch if we have authenticated
    if (state.user.userDetails !== null) {
      //get our tokens from store
      let userToken = state.user.userDetails.twitterProvider.token;
      let userTokenSecret = state.user.userDetails.twitterProvider.tokenSecret;
      //get our last tweet id from store (null if first fetch)
      let lastTweetFetched = state.game.lastTweetFetched;

      if (userToken !== null && userTokenSecret !== null) {
        return await fetch(
          `http://slow-twitter.appspot.com/api/v1/timeline?aT=${userToken}&aTS=${userTokenSecret}${
          lastTweetFetched ? `&since=${lastTweetFetched}` : ``
          }`,
          { headers: { "Content-Type": "application/json; charset=utf-8" } }
        )
          .then(res => res.json())
          .then(response => {
            //make sure response not null
            if (response) {
              console.log(response);
              if (response.errors) {
                console.error('errors fetching new tweets');
                return null;
              }
              else {
                let parsedTweets = parseRawTweets(response);
                //push to store
                if (updateStore) {
                  this.updateTweets(parsedTweets)
                }
                else {
                  return parsedTweets;
                }
              }

            }
            else {
              return null;
            }
          })
          .catch(res => {
            console.log(res);
            return null;
          });
      } else {
        console.error("Cannot refreshFeed, bad args");

      }
    }
  }


  async fetchAllFriends() {
    let allUserData = [];

    //get first page of 20 users (wait for async fetch funtion)
    let response = await fetchFriends();
    console.log(response);
    let cursor;

    //get susequent pages of users
    while (response && !response.errors && response.next_cursor !== -1) {
      for (let user of response.users) {
        allUserData.push(user);
      }
      cursor = response.next_cursor_str;
      response = await fetchFriends(cursor);
      console.log(response);
    }

    //make sure we got some data
    if (allUserData.length > 0) {
      //send to parser function
      let parsedFriends = parseRawFriends(allUserData);
      //update store
      return Promise.resolve(parsedFriends);
    }
    else {
      console.error("allUserData empty after getAllFriends()");
      return Promise.resolve(null);
    }
  }

}

var pickRandomNumber = () => {
  return Math.floor(Math.random() * Math.floor(4));

}

const fetchFriends = async (cursor) => {

  let state = store.getState();

  let userToken = state.user.userDetails.twitterProvider.token;
  let userTokenSecret = state.user.userDetails.twitterProvider.tokenSecret;

  if (userToken !== null && userTokenSecret !== null) {
    return await fetch(
      `http://slow-twitter.appspot.com/api/v1/friends/list?aT=${userToken}&aTS=${userTokenSecret}${cursor ? `&cursor=${cursor}` : ``}`,
      { headers: { "Content-Type": "application/json; charset=utf-8" } }
    )
      .then(res => res.json())
      .then(response => {
        //make sure it's not null
        if (response.errors) {
          console.error('could not fetch response');
          console.error(response.errors);
          return null;
        }
        else return response;
      })
      .catch(err => {
        console.error(err);
        return null
      });
  }
  else {
    console.error("user not auth in fetchFriends()");
    return Promise.resolve();
  }

}

var parseRawFriends = (rawFriends) => {
  let parsedFriends = [];
  //make sure we got em
  if (rawFriends) {
    for (let user of rawFriends) {
      parsedFriends.push({
        name: user.name,
        pic: user.profile_image_url,
        handle: user.screen_name
      });
    }

    //push to store
    return parsedFriends;

  }

  else {
    console.error("rawFriends empty in parseRawFriends()")
  }
}

//take raw response from tweets and construct well-formed object with only needed info
const parseRawTweets = rawTweets => {
  let newTweets = [];
  //first tweet will have id of 0
  for (let tweet of rawTweets) {
    //throw out if the tweet is a retweet
    if (tweet.retweeted_status) {
      console.log("Tweet not parsed; is a retweet");
    } else if (tweet.in_reply_to_status_id !== null) {
      console.log("Tweet not parsed; is a reply");
    } else {
      //construct the object
      let newTweet = {};
      newTweet.date = tweet.created_at;
      newTweet.tweetID = tweet.id_str;
      newTweet.text = he.decode(tweet.full_text); //make sure that the text is unescaped
      newTweet.urls = null;
      if (tweet.entities.urls.length > 0) {
        newTweet.urls = tweet.entities.urls;
      }
      if (newTweet.urls !== null) {
        for (let url of newTweet.urls) {
          newTweet.text = newTweet.text.replace(url.url, "");
        }
      }

      newTweet.user = {};
      newTweet.user.name = tweet.user.name;
      newTweet.user.pic = tweet.user.profile_image_url;
      newTweet.user.handle = tweet.user.screen_name;

      //check for media of any type
      if (tweet.extended_entities) {
        newTweet.media = [];
        newTweet.hasMedia = true;
        for (let i = 0; i < tweet.extended_entities.media.length; i++) {
          newTweet.media[i] = {};
          newTweet.media[i].type = tweet.extended_entities.media[i].type;
          //remove the in-text media link from the tweet text
          newTweet.text = newTweet.text.replace(
            tweet.extended_entities.media[i].url,
            ""
          );
          if (newTweet.media[i].type === "photo") {
            newTweet.media[i].url =
              tweet.extended_entities.media[i].media_url_https;
          } else if (newTweet.media[i].type === "video") {
            newTweet.media[i].url =
              tweet.extended_entities.media[i].video_info.variants[0].url;
            newTweet.media[i].format =
              tweet.extended_entities.media[i].video_info.variants[0].content_type;
          } else if (newTweet.media[i].type === "animated_gif") {
            //render as a video
            newTweet.media[i].type = "video";
            newTweet.media[i].url =
              tweet.extended_entities.media[i].video_info.variants[0].url;
            newTweet.media[i].format =
              tweet.extended_entities.media[i].video_info.variants[0].content_type;
          }
          //NEED TO CHECK FOR OTHER TYPES OF MEDIA
        }
      } else {
        newTweet.hasMedia = false;
      }

      //check for quote tweet
      if (tweet.is_quote_status === true) {
        newTweet.isQuote = true;

        newTweet.quoteTweet = {};
        newTweet.quoteTweet.text = he.decode(tweet.quoted_status.full_text); //make sure string is unescaped
        newTweet.quoteTweet.date = tweet.quoted_status.created_at;
        newTweet.quoteTweet.tweetID = tweet.quoted_status.id_str;
        newTweet.quoteTweet.urls = null;
        if (tweet.quoted_status.entities.urls.length > 0) {
          newTweet.quoteTweet.urls = tweet.quoted_status.entities.urls;
        }
        if (newTweet.quoteTweet.urls !== null) {
          for (let url of newTweet.quoteTweet.urls) {
            newTweet.quoteTweet.text = newTweet.quoteTweet.text.replace(
              url.url,
              ""
            );
          }
        }

        newTweet.quoteTweet.user = {};
        newTweet.quoteTweet.user.name = tweet.quoted_status.user.name;
        newTweet.quoteTweet.user.pic =
          tweet.quoted_status.user.profile_image_url;
        newTweet.quoteTweet.user.handle = tweet.quoted_status.user.screen_name;

        //check for quote tweet media
        //check for media of any type
        if (tweet.quoted_status.extended_entities) {
          newTweet.quoteTweet.media = [{}];
          newTweet.quoteTweet.hasMedia = true;
          for (
            let i = 0;
            i < tweet.quoted_status.extended_entities.media.length;
            i++
          ) {
            //remove the in-text media link from the tweet text
            newTweet.quoteTweet.text = newTweet.quoteTweet.text.replace(
              tweet.quoted_status.extended_entities.media[i].url,
              ""
            );
            newTweet.quoteTweet.media[i] = {};
            if (newTweet.quoteTweet.media[i].type === "photo") {
              newTweet.quoteTweet.media[i].url =
                tweet.quoted_status.extended_entities.media[i].media_url_https;
            } else if (newTweet.quoteTweet.media[i].type === "video") {
              newTweet.quoteTweet.media[i].url =
                tweet.quoted_status.extended_entities.media[
                  i
                ].video_info.variants[0].url;
            }
          }
        } else {
          newTweet.quoteTweet.hasMedia = false;
        }
      } else {
        newTweet.isQuote = false;
      }

      //put at the beginning of newTweets[] for oldest tweets first only if we have text to work with
      if (newTweet.text.length > 0 && newTweet.isQuote === false) {
        newTweets.unshift(newTweet);
      } else if (newTweet.isQuote === true) {
        if (newTweet.text.length > 0 && newTweet.quoteTweet.text.length > 0) {
          newTweets.unshift(newTweet);
        }
      } else {
        console.log(
          "TWEET PROCESSED BUT HAD NO TEXT AT THE END OF parseRawTweets()"
        );
      }
    }
  }
  console.log(newTweets);

  return newTweets;

};