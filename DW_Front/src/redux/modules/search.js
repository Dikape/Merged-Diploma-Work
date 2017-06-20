const TOGGLE_SEARCH_FIELD_DISPLAY = 'redux-example/search/TOGGLE_SEARCH_FIELD_DISPLAY';
const SET_QUERY = 'redux-example/search/SET_QUERY';
const SEARCH_START = 'redux-example/search/SEARCH_START';
const SEARCH_SUCCESS = 'redux-example/search/SEARCH_SUCCESS';
const SEARCH_FAIL = 'redux-example/search/SEARCH_FAIL';

const initialState = {
  searchFieldEnabled: false,
  searchResults: [],
  searchQuery: '',
  searching: false,
  searched: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_SEARCH_FIELD_DISPLAY:
      return {
        ...state,
        searchFieldEnabled: !state.searchFieldEnabled
      };
    case SET_QUERY:
      return {
        ...state,
        searchQuery: action.query
      };
    case SEARCH_START:
      return {
        ...state,
        searching: true
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        searchResults: action.result,
        searched: true
      };
    case SEARCH_FAIL:
      return {
        ...state,
        searchResults: [],
        searched: false
      };
    default:
      return state;
  }
}

export function toggleSearchFieldDisplay() {
  return {
    type: TOGGLE_SEARCH_FIELD_DISPLAY
  };
}

export function setQuery(query) {
  return {
    type: SET_QUERY,
    query
  };
}

export function findByQuery(searchQuery) {
  return {
    types: [SEARCH_START, SEARCH_SUCCESS, SEARCH_FAIL],
    promise: (client) => client.post('http://diploma-investment-map.herokuapp.com/api/search', {
      data: {
        'query': searchQuery
      }
    })
  };
}
