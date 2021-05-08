import AsyncStorage from '@react-native-community/async-storage';

export const SaveUser = (usr, token) => {
    return (dispatch) => {
        console.log(usr, token)
        dispatch({ type: 'SAVE_USER', payload: { User: usr, Token: token} })
    }
}

export const logOut = () => {
    return (dispatch) => {
        AsyncStorage.clear()
        dispatch({ type: 'LOGOUT' })
    }
}