import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import inputField from './inputField';

const validate = (values) => {
  const requiredFields = ['first_name', 'last_name', 'email', 'login', 'password', 'submit_password'];
  const lengthFields = ['password', 'submit_password'];
  const mailFields = ['email'];
  const errors = {};
  requiredFields.map((field) => {
    if (!values[field]) {
      errors[field] = 'Поле обов\'язкове!';
      return errors[field];
    }
    return true;
  });
  lengthFields.map((field) => {
    if (values[field] && values[field].length <= 5) {
      errors[field] = 'Поле має містити щонайменше 6 символів!';
      return errors[field];
    }
    return true;
  });
  mailFields.map((field) => {
    if (values[field] && !values[field].match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{1,})$/i)) {
      errors[field] = 'Це поле має бути поштою';
    }
  });
  if (values.submit_password !== values.password) {
    errors.submit_password = 'Паролі не співпадають!';
  }
  return errors;
};

@reduxForm({
  form: 'registrationForm',
  validate
})
export default class RegistrationForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const { handleSubmit } = this.props;
    require('./RegistrationForm.scss');
    return (
      <div className="registration-modal">
        <div className="form-title">Реєстрація</div>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <div className="label">Ім'я:</div>
            <div className="field">
              <Field name="first_name" component={inputField} divClassName="input-text" />
            </div>
          </div>
          <div className="input-field">
            <div className="label">Прізвище:</div>
            <div className="field">
              <Field name="last_name" component={inputField} divClassName="input-text" />
            </div>
          </div>
          <div className="input-field">
            <div className="label">Пошта:</div>
            <div className="field">
              <Field name="email" component={inputField} divClassName="input-text" />
            </div>
          </div>
          <div className="input-field">
            <div className="label">Логін:</div>
            <div className="field">
              <Field name="login" component={inputField} divClassName="input-text" />
            </div>
          </div>
          <div className="input-field">
            <div className="label">Пароль:</div>
            <div className="field">
              <Field name="password" component={inputField} divClassName="input-text" type="password" />
            </div>
          </div>
          <div className="input-field">
            <div className="label">Підтвердження пароля:</div>
            <div className="field">
              <Field name="submit_password" component={inputField} divClassName="input-text" type="password" />
            </div>
          </div>
          <div
            onClick={handleSubmit((values) => { console.log('values', values); })}
            className="default-dark-button"
          >
            Зареєструватись
          </div>
        </form>
      </div>
    );
  }
}
