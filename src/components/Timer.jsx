import { useEffect } from 'react'
import styles from './Timer.module.css'

function Timer({ seconds, onTick }) {
  useEffect(() => {
    const intervalId = window.setInterval(() => onTick(), 1000)
    return () => window.clearInterval(intervalId)
  }, [onTick])

  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  const time = `${minutes}:${String(remainder).padStart(2, '0')}`

  return (
    <div className={styles.timer} aria-label={`Time remaining: ${time}`}>
      <span className={styles.clock} aria-hidden="true">◷</span>
      <span>{time}</span>
    </div>
  )
}

export default Timer
