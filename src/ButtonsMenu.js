import React, { useState } from 'react'
import './Style.scss'

export default ({ ...props }) => {
  const attributes = props.rootElement.attributes

  const selectorOfElementsToChange = attributes['change-selector'].value
  const attributeToChange = attributes['change-attribute'].value
  const valuesList = attributes['values'].value.split(',')
  const maybeAskedDefaultValue = attributes.default?.value

  const elementsToChange = document.querySelectorAll(selectorOfElementsToChange)
  const maybeHostDefaultValue =
    elementsToChange && elementsToChange[0].getAttribute(attributeToChange)
  const defaultValue =
    maybeHostDefaultValue || maybeAskedDefaultValue || valuesList[0]
  document
    .querySelectorAll(selectorOfElementsToChange)
    .forEach(element => element.setAttribute(attributeToChange, defaultValue))

  const storage = {
    _scopedAttributeNameToStore: `automician.ButtonsMenu.${selectorOfElementsToChange}.${attributeToChange}`,
    getAttributeValue() {
      return window.localStorage.getItem(this._scopedAttributeNameToStore)
    },
    setAttributeToChange(value) {
      window.localStorage.setItem(this._scopedAttributeNameToStore, value)
    },
  }

  if (!storage.getAttributeValue()) {
    storage.setAttributeToChange(defaultValue)
  }

  const valueFromStorage = storage.getAttributeValue()

  const [selectedValue, setSelectedValue] = useState(valueFromStorage)
  const state = { selectedValue, setSelectedValue }

  function changeAttributeValue(value) {
    document.querySelectorAll(selectorOfElementsToChange).forEach(element => {
      element.setAttribute(attributeToChange, value)
    })
    state.setSelectedValue(value)

    storage.setAttributeToChange(value)
  }

  return (
    <div className="button-hover">
      <div className="current-value">
        <span className="current-value-span">
          {state.selectedValue.toUpperCase()}
        </span>
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
