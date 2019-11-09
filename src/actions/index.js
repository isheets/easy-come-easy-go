//called upon logout
export const logoutAndReset = () => ({
  type: 'RESET'
})

//action creator for updating the value of store.user.isAuthenticated
//expects isAuthenticated to be boolean
export const updateAuthentication = isAuthenticated => ({
  type: 'SET_AUTHENTICATION',
  isAuthenticated
})

//action creator for updating the user object in store.user.userDetails
//user expected to be object
export const updateUser = user => ({
  type: 'SET_USER',
  user
})

//action creator for updating the token string in store.user.userToken
//expects token to be a string
export const updateToken = token => ({
  type: 'SET_TOKEN',
  token
})

export const setDataAndInitGame = (curGame, parsedFriends, parsedTweets, lastTweetFetched) => ({
  type: 'INIT_GAME',
  curGame,
  parsedFriends,
  parsedTweets,
  lastTweetFetchDate: Date.now(),
  lastTweetFetched: lastTweetFetched
})

//action creator for setting the value of store.tweets.lastTweetFetched for timeline fetching management
//expects lastFetched to be a string (id of tweet)
export const updateLastTweetFetched = lastFetched => ({
  type: 'SET_LAST_TWEET_FETCHED',
  lastFetched
})

//updates array of objects for store.tweets.parsedTweets
//expects array of objects
export const updateParsedTweets = (parsedTweets, lastTweetFetched) => (
  {
  type: 'SET_PARSED_TWEETS',
  parsedTweets: parsedTweets,
  lastTweetFetchDate: Date.now(),
  lastTweetFetched: lastTweetFetched
})

export const updateCurGame = curGame => ({
  type: 'SET_CURRENT_GAME',
  curGame
})

export const updateParsedFriends = parsedFriends => ({
  type: 'SET_PARSED_FRIENDS',
  parsedFriends
})

export const toggleLBVisible = () => ({
  type: 'TOGGLE_LB_VISIBLE',
})

export const setLBSlide = (slideNum) => ({
  type: 'SET_LB_SLIDE',
  slideNum
})

export const tweetIn = () => ({
  type: 'TWEET_IN_TRUE'
})

export const tweetOut = () => ({
  type: 'TWEET_IN_FALSE'
})

export const optionsIn = () => ({
  type: 'OPTIONS_IN_TRUE'
})

export const optionsOut = () => ({
  type: 'OPTIONS_IN_FALSE'
})

export const toggleCompleteIn = () => ({
  type: 'TOGGLE_COMPLETE_IN'
})