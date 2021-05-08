import axios from 'axios'
axios.defaults.timeout = 10000

const AdvAndSolarPrices = () => {
    return axios.get("https://rocky-cliffs-25615.herokuapp.com/api/SolarPrice_Advertise")
}

const Cars = () => {
    return axios.get("https://rocky-cliffs-25615.herokuapp.com/api/showCarModel")
}

export const getHomeData = () => {
    return async (dispatch) => {
        try {
            axios.all([
                AdvAndSolarPrices(), Cars()
            ])
                .then(axios.spread(
                    function (AdvAndSolarPrices, Cars) {
                        dispatch({
                            type: 'SET_HOME_DATA', payload: {
                                adv: AdvAndSolarPrices.data.advertise[0],
                                solarPrices: AdvAndSolarPrices.data.solar_price[0],
                                Cars: Cars.data
                            }
                        })

                    }
                )).catch(function (error) {
                    // console.log(error)
                    if (error.response && error.response.data && error.response.data.message) {
                        setTimeout(() => {
                            alert('Oops! ' + error.response.data.message);
                        }, 100);
                    } else {
                        setTimeout(() => {
                            alert('Oops! ' + "Network error");
                        }, 100);
                    }
                })
        } catch (error) {
            // console.log(error)
            setTimeout(() => {
                alert('Oops! ' + "Something went wrong");
            }, 100);
        }
    }

}