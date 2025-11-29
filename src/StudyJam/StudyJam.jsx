import React, { useState } from 'react';
import { useTimer } from '../TimerContext.jsx';
import styles from './StudyJam.module.css'
import ModalPolo from './ModalPolo.jsx'

function StudyJam() {
  const { time, running, start, pause, reset, setTime } = useTimer();
  const [isOpen, setIsOpen] = useState(false);
  
  const formatTime = (num) => num.toString().padStart(2, '0');

  return (
    <>
      <div className={styles.wrapper}>
        <div>
          <div className={styles.poloFrame}>
            <h1>{formatTime(time.hour)}:{formatTime(time.minute)}:{formatTime(time.second)}</h1>
          </div>

          <div className={styles.setbuttons}>
            <button className={styles.timebuttons} onClick={() => setIsOpen(true)}>Set Time</button>
            <button className={styles.timebuttons} onClick={reset}>Reset</button>
            <button className={styles.timebuttons} onClick={start}>Start</button>
            <button className={styles.timebuttons} onClick={pause}>Pause</button>
          </div>
        </div>
      </div>

      <ModalPolo open={isOpen} onClose={() => setIsOpen(false)} add={(e) => setTime(e)} />
    </>
  );
}

export default StudyJam;
