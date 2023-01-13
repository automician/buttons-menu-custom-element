import React, { useState } from 'react'
import './Style.scss'

export default ({ ...props }) => {
  const attributes = props.rootElement.attributes

  const selectorOfElementsToChange = attributes['change-selector'].value
  const attributeToChange = attributes['change-attribute'].value
  const valuesList = attributes['values'].value.split(',')
  let askedDefaultValue
  if (attributes['default']) {
    askedDefaultValue = attributes['default'].value
  }
  let elementsToChange = document.getElementsByClassName(selectorOfElementsToChange)
  let hostDefaultValue

  for (let key of elementsToChange) {
    if(key.attributes[attributeToChange]) {
      hostDefaultValue = key.attributes[attributeToChange].value
    }
  }

  const defaultValue = hostDefaultValue || askedDefaultValue || valuesList[0]

  const storageCheck = window.localStorage.getItem('automician')

  if(!storageCheck) {
    setItemToStorage(attributeToChange, defaultValue)
  }

  let valueFromStorage = getItemFromStorage(attributeToChange)
  const [selectedValue, setSelectedValue] = useState(valueFromStorage)

  if (!valueFromStorage) {
    setSelectedValue(defaultValue)
    setItemToStorage(attributeToChange, defaultValue)
  }

  function changeAttributeValue(value) {
    document.querySelectorAll(selectorOfElementsToChange).forEach(element => {
      element[attributeToChange] = value
    })
    setSelectedValue(value)

    setItemToStorage(attributeToChange, value)
  }

  function getItemFromStorage(value) {
    return JSON.parse(window.localStorage.getItem('automician'))[value]
  }

  function setItemToStorage(attribute, value) {
    let automician = JSON.parse(window.localStorage.getItem('automician'))

    automician = {
      ...automician,
      [attribute]: value
    }

    window.localStorage.setItem('automician', JSON.stringify(automician))
  }

  return (
    <div className="button-hover">
      <div className="current-value">
        <span className="current-value-span">{selectedValue.toUpperCase()}</span>
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
