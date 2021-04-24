import React, { useState, useEffect } from 'react';
import "./Timer.css";

const Timer = (props) => {
  const [seconds, setSeconds] = useState(10);
  const [isActive, setIsActive] = useState(false);

  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(30);
    setIsActive(false);
  }

  useEffect(() => {
    let interval = null;
    if (props.stop === 'stop'){
        setIsActive(false)
    }
    if (isActive) {
      if(seconds === 0){
        props.end();
      }
      else{
        interval = setInterval(() => {
            setSeconds(seconds => seconds - 1);
          }, 1000);
      }
    } else if (!isActive && seconds !== 30) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <div className="timer">
      <div className="time">
        {seconds}s
      </div>
      <div className="row">
        <button className={`button button-primary button-primary-${isActive ? 'active' : 'inactive'}`} onClick={toggle}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button className="button" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;