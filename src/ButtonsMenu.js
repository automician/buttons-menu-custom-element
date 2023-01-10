import React, { useState } from 'react'
import './Style.scss'

export default ({ ...props }) => {
  const attributes = props.rootElement.attributes

  const changedAttribute = attributes['change-attribute'].value
  const defaultValue = attributes['default'].value
  const valuesList = attributes['values-per-button'].value
    .split(',')
    .map(el => el.toUpperCase())

  let valueFromStorage = window.localStorage.getItem(changedAttribute)
  const [selectedValue, setSelectedValue] = useState(valueFromStorage)

  if (!valueFromStorage) {
    setSelectedValue(defaultValue.toUpperCase())
    window.localStorage.setItem(changedAttribute, defaultValue.toUpperCase())
    valueFromStorage = window.localStorage.getItem(changedAttribute)
    window.location.href = changeSearchParams(valueFromStorage)
  }

  function changeAttributeValue(value) {
    setSelectedValue(value)
    window.localStorage.setItem(changedAttribute, value)

    window.location.href = changeSearchParams(value)
  }

  function changeSearchParams(value) {
    const path = window.location.href
    const searchParamsStart = path.split('').indexOf('?')
    const searchParams = path.slice(searchParamsStart)
    const ampersandIndex = searchParams.indexOf('&')

    const attributeIndex = searchParams
      .toLowerCase()
      .indexOf(changedAttribute.toLocaleLowerCase())
    const valueStartIndex = attributeIndex + changedAttribute.length + 1
    const startStr = searchParams.slice(0, valueStartIndex)
    let endStr

    if (valueStartIndex < ampersandIndex) {
      endStr = searchParams.slice(ampersandIndex)
    } else {
      endStr = ''
    }

    const newSearchParam = startStr + value.toLowerCase() + endStr

    return newSearchParam
  }

  return (
    <div className="button-hover">
      <div className="current-value">
        <span className="current-value-span">{selectedValue}</span>
      </div>
      <div className="values-list">
        {valuesList.map(value => (
          <div
            value
            key={value}
            className="values-list-item"
            onClick={() => changeAttributeValue(value)}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  )
}
