import React, { useState, useEffect } from 'react'
import './Style.scss'

export default props => {
  const attributes = props.rootElement.attributes

  const selectorOfElementsToChange = attributes['change-selector'].value
  const attributeToChange = attributes['change-attribute'].value
  const valuesList = attributes['values'].value.split(',').map(value => value.trim())
  const maybeAskedDefaultValue = attributes.default?.value
  const maybeContainerizedContentLoadedEvent = attributes['on']?.value
  const shouldWeRenderOnEvent = !!maybeContainerizedContentLoadedEvent

  const storage = {
    _scopedAttributeNameToStore: `automician.ButtonsMenu.${selectorOfElementsToChange}.${attributeToChange}`,
    getAttributeToChangeValue() {
      return window.localStorage.getItem(this._scopedAttributeNameToStore)
    },
    setAttributeToChangeValue(value) {
      window.localStorage.setItem(this._scopedAttributeNameToStore, value)
    },
  }

  if (!storage.getAttributeToChangeValue()) {
    const elementsToChange = [
      ...document.querySelectorAll(selectorOfElementsToChange),
    ]

    const [hostsAttributeSamePrefilledValue] = elementsToChange.reduce(
      (sameValue, host) => {
        const areEqual = (arr1, arr2) =>
          JSON.stringify(arr1) === JSON.stringify(arr2)
        const sameValueWasCompromised = areEqual(sameValue, [])
        if (sameValueWasCompromised) {
          return sameValue
        }
        const hostDefault = host.getAttribute(attributeToChange) // todo: count when to get as host[attributeToChange]
        const sameValueWasSet = sameValue && sameValue.length > 0
        if (!sameValueWasSet) {
          // set sameValue first time!
          return [hostDefault]
        }

        if (sameValueWasSet && areEqual(sameValue, [hostDefault])) {
          // compromised!
          return []
        }

        return [hostDefault]
      },
      null, // default indicator of sameValue, i.e. => sameValueWasNotSet
    )

    const defaultValue =
      hostsAttributeSamePrefilledValue || maybeAskedDefaultValue || valuesList[0]

    storage.setAttributeToChangeValue(defaultValue)
  }

  const valueFromStorage = storage.getAttributeToChangeValue()

  const isContentLoadedPromise = shouldWeRenderOnEvent
    ? new Promise((resolve, reject) => {
        document.addEventListener(maybeContainerizedContentLoadedEvent, () =>
          resolve(),
        )
      })
    : Promise.resolve()

  const changeElementsAttribute = value =>
    document.querySelectorAll(selectorOfElementsToChange).forEach(element => {
      console.log('element', element)
      if (element.hasAttribute(attributeToChange)) {
        console.log('element[attributeToChange]1', element[attributeToChange])
        console.log('value1', value)
        element[attributeToChange] = value
      } else {
        console.log('element[attributeToChange]2', element[attributeToChange])
        console.log('value2', value)
        element.setAttribute(attributeToChange, value)
        console.log('element[attributeToChange]3', element[attributeToChange])
        console.log('value3', value)
      }
    })

  const [selectedValue, setSelectedValue] = useState(valueFromStorage)
  const state = { selectedValue, setSelectedValue }

  function changeAttributeValueHandler(value) {
    state.setSelectedValue(value)
    storage.setAttributeToChangeValue(value)
    changeElementsAttribute(value)
  }

  useEffect(
    () => {
      isContentLoadedPromise
        .then(
          loaded => changeElementsAttribute(valueFromStorage),
          notLoaded => changeElementsAttribute(valueFromStorage),
        )
        .catch(err => console.log(err))
    },
    [], // on mount render only
  )

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
            onClick={() => {
              changeAttributeValueHandler(value)
              document.dispatchEvent(new Event('changeLanguage'))
            }}
          >
            {value.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  )
}
