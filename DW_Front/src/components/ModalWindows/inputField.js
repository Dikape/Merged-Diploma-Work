import React from 'react';

const renderRequireInput = ({ divClassName, rows, cols, input, isTextArea,
  disabled, label, type, meta: { touched, error } }) =>
    <div className={divClassName}>
      {isTextArea ?
        <textarea className="require-input" {...input} rows={rows} cols={cols} placeholder={label} disabled={disabled} />
        :
        <input className="require-input" {...input} disabled={disabled} placeholder={label} type={type} />
      }
      <span className="error-input">
        {touched && error ? error : ''}
      </span>
    </div>;

renderRequireInput.propTypes = {
  input: React.PropTypes.object.isRequired,
  disabled: React.PropTypes.bool,
  isTextArea: React.PropTypes.bool,
  label: React.PropTypes.string,
  type: React.PropTypes.string,
  divClassName: React.PropTypes.string,
  rows: React.PropTypes.number,
  cols: React.PropTypes.number,
  meta: React.PropTypes.object.isRequired
};
renderRequireInput.defaultProps = {
  disabled: false,
  isTextArea: false,
  label: '',
  type: '',
  divClassName: '',
  rows: 0,
  cols: 0
};
export default renderRequireInput;
