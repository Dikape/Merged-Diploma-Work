const SET_MODAL_TO_DISPLAY = 'redux-example/modal/SET_MODAL_TO_DISPLAY';
const SET_MODAL_NOT_TO_DISPLAY = 'redux-example/modal/SET_MODAL_NOT_TO_DISPLAY';

const initialState = {
  display: false,
  modalToDisplay: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_MODAL_NOT_TO_DISPLAY:
      return {
        ...state,
        display: false,
        modalToDisplay: null
      };
    case SET_MODAL_TO_DISPLAY:
      return {
        ...state,
        display: true,
        modalToDisplay: action.modalToDisplay
      };
    default:
      return state;
  }
}

export function modalHide() {
  return {
    type: SET_MODAL_NOT_TO_DISPLAY
  };
}

export function modalDisplay(name) {
  return {
    type: SET_MODAL_TO_DISPLAY,
    modalToDisplay: name
  };
}

