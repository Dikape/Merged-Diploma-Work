const LOAD = 'redux-example/map/LOAD';
const LOAD_REGIONS_SUCCESS = 'redux-example/map/LOAD_REGIONS_SUCCESS';
const LOAD_OBJECTS_SUCCESS = 'redux-example/map/LOAD_OBJECTS_SUCCESS';
const LOAD_CATEGOIRES_SUCCESS = 'redux-example/map/LOAD_CATEGOIRES_SUCCESS';
const LOAD_CONTRACT_TYPES_SUCCESS = 'redux-example/map/LOAD_CONTRACT_TYPES_SUCCESS';
const LOAD_HOLDERS_SUCCESS = 'redux-example/map/LOAD_HOLDERS_SUCCESS';
const LOAD_OWNERSHIP_FORMS_SUCCESS = 'redux-example/map/LOAD_OWNERSHIP_FORMS_SUCCESS';
const LOAD_PEOPLE_CATEGORIES_SUCCESS = 'redux-example/map/LOAD_PEOPLE_CATEGORIES_SUCCESS';
const LOAD_PEOPLES_SUCCESS = 'redux-example/map/LOAD_PEOPLES_SUCCESS';
const TOGGLE_MARKER_DISPLAY = 'redux-example/map/TOGGLE_MARKER_DISPLAY';
const SET_REGION_TO_DISPLAY = 'redux-example/map/SET_REGION_TO_DISPLAY';
const SET_CATEGORIES_TO_DISPLAY = 'redux-example/map/SET_CATEGORIES_TO_DISPLAY';
const SET_PEOPLE_CATEGORIES_TO_DISPLAY = 'redux-example/map/SET_PEOPLE_CATEGORIES_TO_DISPLAY';
const SET_CONTRACT_TYPE_TO_DISPLAY = 'redux-example/map/SET_CONTRACT_TYPE_TO_DISPLAY';
const LOAD_FAIL = 'redux-example/map/LOAD_FAIL';

const initialState = {
  loading: false,
  loaded: false,
  regions: [],
  objects: [],
  categories: [],
  contractTypes: [],
  holders: [],
  ownershipForms: [],
  peopleCategories: [],
  peoples: [],
  mapCenter: { lat: 50.454090, lng: 30.524743 },
  regionToDisplay: 1,
  categoriesToDisplay: [],
  peopleCategoriesToDisplay: [],
  contractTypesToDisplay: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_REGIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        regions: action.result
      };
    case LOAD_OBJECTS_SUCCESS: {
      const objectsList = action.result.map(element => ({...element, showInfo: 0}));
      return {
        ...state,
        loading: false,
        loaded: true,
        objects: objectsList
      };
    }
    case LOAD_CATEGOIRES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        categories: action.result
      };
    case LOAD_CONTRACT_TYPES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        contractTypes: action.result
      };
    case LOAD_HOLDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        holders: action.result
      };
    case LOAD_OWNERSHIP_FORMS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        ownershipForms: action.result
      };
    case LOAD_PEOPLE_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        peopleCategories: action.result
      };
    case LOAD_PEOPLES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        peoples: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        data: null
      };
    case TOGGLE_MARKER_DISPLAY: {
      const markerId = action.id;
      const objectsList = [...state.objects];
      const markerObject = objectsList.find(element => element.id === markerId);
      markerObject.showInfo = markerObject.showInfo === 1 ? 0 : 1;
      return {
        ...state,
        objects: objectsList
      };
    }
    case SET_REGION_TO_DISPLAY:
      return {
        ...state,
        mapCenter: { lat: action.lat, lng: action.lng },
        regionToDisplay: action.regionToDisplay
      };
    case SET_CATEGORIES_TO_DISPLAY:
      const currentCategories = [...state.categoriesToDisplay];
      const categoryId = action.categoryId;
      const categoriesArray = currentCategories.includes(categoryId) ?
        currentCategories.filter(element => element !== categoryId) :
        [...currentCategories, categoryId];
      return {
        ...state,
        categoriesToDisplay: categoriesArray
      };
    case SET_PEOPLE_CATEGORIES_TO_DISPLAY:
      const currentPeopleCategories = [...state.peopleCategoriesToDisplay];
      const peopleCategoryId = action.categoryId;
      const peopleCategoriesArray = currentPeopleCategories.includes(peopleCategoryId) ?
        currentPeopleCategories.filter(element => element !== peopleCategoryId) :
        [...currentPeopleCategories, peopleCategoryId];
      return {
        ...state,
        peopleCategoriesToDisplay: peopleCategoriesArray
      };
    case SET_CONTRACT_TYPE_TO_DISPLAY:
      const currentContractTypes = [...state.contractTypesToDisplay];
      const contractTypeId = action.contractTypeId;
      const contractsArray = currentContractTypes.includes(contractTypeId) ?
        currentContractTypes.filter(element => element !== contractTypeId) :
        [...currentContractTypes, contractTypeId];
      return {
        ...state,
        contractTypesToDisplay: contractsArray
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function loadRegions() {
  return {
    types: [LOAD, LOAD_REGIONS_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('http://diploma-investment-map.herokuapp.com/api/regions/')
  };
}

export function loadObjects() {
  return {
    types: [LOAD, LOAD_OBJECTS_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('http://diploma-investment-map.herokuapp.com/api/objects/')
  };
}

export function loadCategories() {
  return {
    types: [LOAD, LOAD_CATEGOIRES_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('http://diploma-investment-map.herokuapp.com/api/category/')
  };
}

export function loadContractTypes() {
  return {
    types: [LOAD, LOAD_CONTRACT_TYPES_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('http://diploma-investment-map.herokuapp.com/api/contract_type/')
  };
}

export function loadHolders() {
  return {
    types: [LOAD, LOAD_HOLDERS_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('http://diploma-investment-map.herokuapp.com/api/holders/')
  };
}

export function loadOwnershipForms() {
  return {
    types: [LOAD, LOAD_OWNERSHIP_FORMS_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('http://diploma-investment-map.herokuapp.com/api/ownership_forms/')
  };
}

export function loadPeopleCategories() {
  return {
    types: [LOAD, LOAD_PEOPLE_CATEGORIES_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('http://diploma-investment-map.herokuapp.com/api/people_categories/')
  };
}

export function loadPeoples() {
  return {
    types: [LOAD, LOAD_PEOPLES_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('http://diploma-investment-map.herokuapp.com/api/peoples/')
  };
}

export function toggleMarkerDisplay(id) {
  return {
    type: TOGGLE_MARKER_DISPLAY,
    id
  };
}

export function setRegionToDisplay(lat, lng, regionToDisplay) {
  return {
    type: SET_REGION_TO_DISPLAY,
    lat,
    lng,
    regionToDisplay
  };
}

export function setCategoriesToDisplay(categoryId) {
  return {
    type: SET_CATEGORIES_TO_DISPLAY,
    categoryId
  };
}

export function setPeopleCategoriesToDisplay(categoryId) {
  return {
    type: SET_PEOPLE_CATEGORIES_TO_DISPLAY,
    categoryId
  };
}

export function setContractTypeToDisplay(contractTypeId) {
  return {
    type: SET_CONTRACT_TYPE_TO_DISPLAY,
    contractTypeId
  };
}

