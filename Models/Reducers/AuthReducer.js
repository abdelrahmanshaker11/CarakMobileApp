const initialState = {
    User: null,
    Token: null
}

export default (state = initialState, action) => {
    switch (action.type) {

        case 'SAVE_USER':
            return {
                ...state,
                Processing: false,
                User: action.payload.User,
                Token: action.payload.Token,
            }

        case 'LOGOUT':
            return { ...state, User: null, Token: null }

        default:
            return state
    }
};