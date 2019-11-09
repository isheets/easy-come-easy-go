const intialUser = {
    isAuthenticated: false,
    userDetails: null,
    userToken: null
}

const user = (state = intialUser, action) => {
    switch(action.type) {
        case 'RESET':
            return intialUser
        case 'SET_AUTHENTICATION':
            return {
                ...state,
                isAuthenticated: action.isAuthenticated
            }
        case 'SET_USER':
            return {
                ...state,
                userDetails: action.user

            }
        case 'SET_TOKEN':
            return {
                ...state,
                userToken: action.token
            }
        default:
            return state
    }
}

export default user