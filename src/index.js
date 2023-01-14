import React from 'react'
import * as ReactDOM from 'react-dom/client'
import { register } from 'react-to-html-element'
import ButtonsMenu from './ButtonsMenu'

register(ButtonsMenu, 'buttons-menu', React, ReactDOM)

register(
  ({ children }) => <div style={{ position: 'fixed' }}>{children}</div>,
  'fixed-layout',
  React,
  ReactDOM,
)

register(
  ({ children, style }) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...style,
      }}
    >
      {children}
    </div>
  ),
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
    console.log('space', grow)
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
