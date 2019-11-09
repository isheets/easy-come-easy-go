import { useSelector, useDispatch } from 'react-redux'
import React from 'react';




//   fetchTimeline = () => {
//     //if this is the first request then don't include since_id
//     if (this.state.last_tweet == null) {
//       fetch(`http://localhost:4000/api/v1/timeline?aT=${this.state.user.twitterProvider.token}&aTS=${this.state.user.twitterProvider.tokenSecret}`, { headers: { "Content-Type": "application/json; charset=utf-8" } })
//         .then(res => res.json())
//         .then(response => {
//           //make sure it's not null
//           if (response) {
//             this.setState({ last_tweet: response[0].id });
//             this.setState({ parsedTweets: this.parseTweets(response), curTweet: 0 });
//             this.saveState();
//           }

//         })
//         .catch(err => {
//           console.log(err)
//         });
//     }
//     //else pass id of last tweet consumed as parameter in request
//     else {
//       fetch(`http://localhost:4000/api/v1/timeline?aT=${this.state.user.twitterProvider.token}&aTS=${this.state.user.twitterProvider.tokenSecret}&since=${this.state.last_tweet}`, { headers: { "Content-Type": "application/json; charset=utf-8" } })
//         .then(res => res.json())
//         .then(response => {
//           console.log(response);
//           //make sure it's not null
//           if (response) {
//             this.setState({ last_tweet: response[0].id });
//             this.setState({ parsedTweets: this.parseTweets(response), curTweet: 0 });
//             this.saveState();
//           }
//           else {
//             alert("No new tweets");
//           }

//         })
//         .catch(err => {
//           alert("sorry, there are no results for your search")
//         });
//     }
//   };