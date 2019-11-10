const initialUI = {
    tweetIn: true,
    optionsIn: false,
    showInfo: false,
    playSound: true
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
        case 'SHOW_INFO':
            return {
                ...state,
                showInfo: true
            }
        case 'HIDE_INFO':
            return {
                ...state,
                showInfo: false
            }
        case 'PLAY_SOUND':
            return {
                ...state,
                playSound: true
            }
        case 'MUTE_SOUND':
            return {
                ...state,
                playSound: false
            }
        default:
            return state
    }
}

export default ui