import React, { useState } from 'react'
import './ScrollToTopButtonStyles.scss'
import ArrowImg from './images/arrow_up.png'
import { isDesktop } from 'react-device-detect'

export default () => {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop
    if (scrolled > 300) {
      setVisible(true)
    } else if (scrolled <= 300) {
      setVisible(false)
    }
  }

  if (isDesktop) {
    window.addEventListener('scroll', toggleVisible)
  }

  return (
    <div className="scroll-button">
      <img
        src={ArrowImg}
        alt="scroll to top button"
        className="scroll-button-img"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ display: visible ? 'inline' : 'none' }}
      />
    </div>
  )
}
