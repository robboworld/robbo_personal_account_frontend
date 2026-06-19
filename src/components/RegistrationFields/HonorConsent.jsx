import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import PropTypes from 'prop-types'

import { PRIVACY_POLICY_URL, TOS_AND_HONOR_CODE_URL } from '@/registration/constants'

const HonorConsent = ({ checked, errorMessage, onChange, onBlur, onFocus }) => {
  const intl = useIntl()

  return (
    <div
      className={`robbo-honor-consent registration-checkbox${errorMessage ? ' registration-checkbox--invalid' : ''}`}
      id='honor-code'
    >
      <label className='registration-checkbox__label'>
        <input
          type='checkbox'
          className='registration-checkbox__input'
          id='honor-code-tos'
          name='honor_code'
          checked={Boolean(checked)}
          onChange={event => onChange(event.target.checked)}
          onBlur={onBlur}
          onFocus={onFocus}
          aria-invalid={Boolean(errorMessage)}
        />
        <span className='registration-checkbox__text'>
          <FormattedMessage
            id='registration.robbo.honor.consent'
            values={{
              personalDataLink: (
                <a
                  className='inline-link'
                  href={TOS_AND_HONOR_CODE_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {intl.formatMessage({ id: 'registration.robbo.honor.personal_data' })}
                </a>
              ),
              privacyLink: (
                <a
                  className='inline-link'
                  href={PRIVACY_POLICY_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {intl.formatMessage({ id: 'registration.robbo.honor.privacy' })}
                </a>
              ),
            }}
          />
        </span>
      </label>
      {errorMessage && (
        <div className='registration-field__error'>{errorMessage}</div>
      )}
    </div>
  )
}

HonorConsent.propTypes = {
  checked: PropTypes.bool,
  errorMessage: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
}

HonorConsent.defaultProps = {
  checked: false,
  errorMessage: '',
  onBlur: null,
  onFocus: null,
}

export default HonorConsent
