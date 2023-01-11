import React, { useState } from 'react'
import './Style.scss'

export default ({ ...props }) => {
  const attributes = props.rootElement.attributes

  const selectorOfElementsToChange = attributes['change-selector'].value
  const attributeToChange = attributes['change-attribute'].value
  const defaultValue = attributes['default'].value
  const valuesList = attributes['values'].value.split(',')

  let valueFromStorage = window.localStorage.getItem(attributeToChange)
  const [selectedValue, setSelectedValue] = useState(valueFromStorage)

  if (!valueFromStorage) {
    setSelectedValue(defaultValue)
    window.localStorage.setItem(attributeToChange, defaultValue)
    valueFromStorage = window.localStorage.getItem(attributeToChange)
  }

  function changeAttributeValue(value) {
    document.querySelectorAll(selectorOfElementsToChange).forEach(element => {
      element[attributeToChange] = value
    })
    setSelectedValue(value)
    // TODO: store it scoped, not just item on localStorage,

    //       create some element for the current App,
    //       and store it there, like:
    // windows.localStorage.automician.buttonsMenu.setItem(attributeToChange, value)
    window.localStorage.setItem(attributeToChange, value)
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
            {value.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  )
}
