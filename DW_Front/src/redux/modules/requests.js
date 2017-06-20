const CALCULATE_INVESTMENT_START = 'redux-example/requests/CALCULATE_INVESTMENT_START';
const CALCULATE_INVESTMENT = 'redux-example/requests/CALCULATE_INVESTMENT';
const CALCULATE_INVESTMENT_FAIL = 'redux-example/requests/CALCULATE_INVESTMENT_FAIL';

const initialState = {
  investmentCalculating: false,
  calculateInvestmentResult: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CALCULATE_INVESTMENT_START:
      return {
        investmentCalculating: true
      };
    case CALCULATE_INVESTMENT:
      return {
        ...state,
        calculateInvestmentResult: action.result
      };
    case CALCULATE_INVESTMENT_FAIL:
      return {
        investmentCalculating: false
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function calculateInvestment(mapLon, mapLat, maxSize, categories) {
  console.log('mapLon, mapLat, maxSize, categories', mapLon, mapLat, maxSize, categories);
  return {
    types: [CALCULATE_INVESTMENT_START, CALCULATE_INVESTMENT, CALCULATE_INVESTMENT_FAIL],
    promise: (client) => client.post('http://diploma-investment-map.herokuapp.com/math/', {
      data: {
        'map_lon': mapLon,
        'map_lat': mapLat,
        'max_price': maxSize,
        'categories': categories
      }
    })
  };
}
