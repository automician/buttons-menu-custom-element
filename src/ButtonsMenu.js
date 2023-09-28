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

  const url = new URL(window.location.href)
  const valueInSearchParams = url.searchParams.get(attributeToChange)
  //for local running use selectorOfElementsToChange.split('-')[1] instead of attributeToChange
  if (valuesList.includes(valueInSearchParams)) {
    storage.setAttributeToChangeValue(valueInSearchParams)
  }

  const valueFromStorage = storage.getAttributeToChangeValue()
  const isContentLoadedPromise = shouldWeRenderOnEvent
    ? new Promise((resolve, reject) => {
        document.addEventListener(maybeContainerizedContentLoadedEvent, () => {
          resolve()
        })
      })
    : Promise.resolve()

  const changeElementsAttribute = value =>
    document.querySelectorAll(selectorOfElementsToChange).forEach(element => {
      if (element.hasAttribute(attributeToChange)) {
        element.attributes[attributeToChange].value = value.toLowerCase()
      } else {
        element.setAttribute(attributeToChange, value.toLowerCase())
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
          document.dispatchEvent(new Event('FlexAndButtonsLoaded')),
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
      {!!valueInSearchParams ||
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
      </div>}
    </div>
  )
}
