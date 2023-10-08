import React, { useLayoutEffect } from 'react'
import * as ReactDOM from 'react-dom/client'
import { register } from 'react-to-html-element'
import ButtonsMenu from './ButtonsMenu'
import ScrollToTopButton from './ScrollToTopButton'
import './Style.scss'

register(ButtonsMenu, 'buttons-menu', React, ReactDOM)
register(ScrollToTopButton, 'scroll-to-top', React, ReactDOM)

register(
  ({ rootElement, children }) => {
    rootElement.style.position = 'fixed'
    rootElement.style.left = '20px'
    rootElement.style.top = '15px'
    rootElement.style.display = 'flex'
    rootElement.style.flexDirection = 'column'
    rootElement.style.alignItems = 'flex-start'
    return <>{children}</>
  },
  'fixed-layout',
  React,
  ReactDOM,
)

register(
  ({ rootElement, children }) => {
    rootElement.style.display = 'flex'
    rootElement.style.flexDirection = 'row'
    rootElement.style.alignItems = 'center'
    useLayoutEffect(() => {
      document.dispatchEvent(new Event('FlexLayoutContentLoaded'))
    })
    return <>{children}</>
  },
  'flex-layout',
  React,
  ReactDOM,
)

register(
  ({ children, rootElement }) => {
    const {
      attributes: {
        grow: { value: grow },
      },
    } = rootElement
    rootElement.style.flex = grow
    return children || React.Component
  },
  'flex-fill',
  React,
  ReactDOM,
)

const FlexFillWithGrow =
  grow =>
  ({ children, rootElement }) => {
    rootElement.style.flex = grow
    return children || <React.Fragment />
  }

;[...Array(13).keys()].forEach(grow =>
  register(FlexFillWithGrow(grow), `flex-${grow}`, React, ReactDOM),
)
