import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

const MarketingOptIn = ({ checked, errorMessage, onChange, onBlur, onFocus }) => (
  <div
    className={`registration-checkbox form-field--checkbox${errorMessage ? ' registration-checkbox--invalid' : ''}`}
  >
    <label className='registration-checkbox__label'>
      <input
        type='checkbox'
        className='registration-checkbox__input'
        id='marketing-emails-opt-in'
        name='marketing_emails_opt_in'
        checked={Boolean(checked)}
        onChange={event => onChange(event.target.checked)}
        onBlur={onBlur}
        onFocus={onFocus}
        aria-invalid={Boolean(errorMessage)}
      />
      <span className='registration-checkbox__text'>
        <FormattedMessage id='registration.opt.in.label' />
      </span>
    </label>
    {errorMessage && (
      <div className='registration-field__error'>{errorMessage}</div>
    )}
  </div>
)

MarketingOptIn.propTypes = {
  checked: PropTypes.bool,
  errorMessage: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
}

MarketingOptIn.defaultProps = {
  checked: false,
  errorMessage: '',
  onBlur: null,
  onFocus: null,
}

export default MarketingOptIn
