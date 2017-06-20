import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { modalHide } from 'redux/modules/modal';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';

@connect(
  state => ({
    modal: state.modal
  })
)
export default class ModalWindow extends Component {
  static propTypes = {
    modal: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  static defaultProps = {
    modal: {}
  };

  render() {
    const { modal } = this.props;
    const dispatch = this.context.store.dispatch;
    require('./ModalWindow.scss');
    return (
      <div
        className={`modal-container ${modal && modal.display ? 'modal-show' : ''}`}
        onClick={() => { dispatch(modalHide()); }}
      >
        {modal && modal.display ?
          <div className="modal-field-container" onClick={(event) => { event.stopPropagation(); }}>
            <i className="modal-close fa fa-close" onClick={() => { dispatch(modalHide()); }} />
            {modal.modalToDisplay === 'registration' && <RegistrationForm />}
            {modal.modalToDisplay === 'login' && <LoginForm />}
          </div>
          : <div />}
      </div>
    );
  }
}
