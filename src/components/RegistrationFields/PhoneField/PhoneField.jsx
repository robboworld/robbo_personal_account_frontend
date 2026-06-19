import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import PropTypes from 'prop-types'
import PhoneInput from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en.json'
import ru from 'react-phone-number-input/locale/ru.json'
import 'react-phone-number-input/style.css'

import RobboPhoneCountrySelect from './RobboPhoneCountrySelect'

const PHONE_LABELS = { en, ru }

function getPhoneInputLabels(locale) {
  const base = locale?.startsWith('ru') ? 'ru' : 'en'
  return PHONE_LABELS[base] || en
}

const PhoneField = ({
  name,
  value,
  label,
  helpText,
  errorMessage,
  onChange,
  onBlur,
  onFocus,
}) => {
  const intl = useIntl()
  const [hasFocus, setHasFocus] = useState(false)
  const latestValueRef = useRef(value)
  const phoneLabels = useMemo(() => getPhoneInputLabels(intl.locale), [intl.locale])
  const countrySelectAriaLabel = intl.formatMessage({ id: 'registration.robbo.phone.country.aria' })

  useEffect(() => {
    latestValueRef.current = value
  }, [value])

  const handleFocus = () => {
    setHasFocus(true)
    if (onFocus) {
      onFocus(name)
    }
  }

  const handleBlur = () => {
    setHasFocus(false)
    if (onBlur) {
      onBlur(name, latestValueRef.current ?? '')
    }
  }

  const handleChange = nextValue => {
    const normalizedValue = nextValue ?? ''
    latestValueRef.current = normalizedValue
    onChange(name, normalizedValue)
  }

  return (
    <div className={`registration-field${errorMessage ? ' registration-field--invalid' : ''}`}>
      <label className='registration-field__label' htmlFor={name}>{label}</label>
      <PhoneInput
        className='robbo-phone-input form-group__form-field'
        name={name}
        value={value || undefined}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        defaultCountry='RU'
        international
        labels={phoneLabels}
        countrySelectComponent={RobboPhoneCountrySelect}
        countrySelectProps={{
          'aria-label': countrySelectAriaLabel,
        }}
        numberInputProps={{
          id: name,
          autoComplete: 'tel',
          inputMode: 'tel',
          'aria-invalid': Boolean(errorMessage),
        }}
      />
      {hasFocus && helpText && (
        <div className='registration-field__help'>{helpText}</div>
      )}
      {errorMessage && (
        <div className='registration-field__error' id={`${name}-error`}>{errorMessage}</div>
      )}
    </div>
  )
}

PhoneField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  helpText: PropTypes.string,
  errorMessage: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
}

PhoneField.defaultProps = {
  value: '',
  helpText: '',
  errorMessage: '',
  onBlur: null,
  onFocus: null,
}

export default PhoneField
