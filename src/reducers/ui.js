const initialUI = {
    tweetIn: true,
    optionsIn: false,
    completeIn: true
}

const ui = (state = initialUI, action) => {
    switch (action.type) {
        case 'RESET':
            return initialUI;
        case 'TWEET_IN_TRUE':
            return {
                ...state,
                tweetIn: true
            }
        case 'TWEET_IN_FALSE':
            return {
                ...state,
                tweetIn: false
            }
        case 'OPTIONS_IN_TRUE':
            return {
                ...state,
                optionsIn: true

            }
        case 'OPTIONS_IN_FALSE':
            return {
                ...state,
                optionsIn: false

            }
        case 'TOGGLE_COMPLETE_IN':
            return {
                ...state,
                userToken: !state.completeIn
            }
        default:
            return state
    }
}

export default ui