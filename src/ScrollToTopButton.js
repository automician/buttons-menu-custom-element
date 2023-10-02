import React from 'react';
import './ScrollToTopButtonStyles.scss';
import ArrowImg from './images/arrow_up.png';

export default () => {

  return (
    <div className='scroll-button'>
      <img src={ArrowImg}
        alt="scroll to top button"
        className='scroll-button-img'
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
      />
    </div>
  )
}
