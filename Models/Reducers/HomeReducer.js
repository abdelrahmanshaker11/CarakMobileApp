const initialState = {
    adv: null,
    solarPrices: null,
    Cars: []
}

export default (state = initialState, action) => {
    switch (action.type) {

        case 'SET_HOME_DATA':
            return {
                ...state,
                adv: action.payload.adv,
                solarPrices: action.payload.solarPrices,
                Cars: action.payload.Cars,
            }

        default:
            return state
    }
};