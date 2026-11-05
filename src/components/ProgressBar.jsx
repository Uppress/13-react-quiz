import styles from './ProgressBar.module.css'

function ProgressBar({ current, total }) {
  const progress = total > 0 ? Math.min((current / total) * 100, 100) : 0

  return (
    <div className={styles.progress} aria-label={`Question ${current} of ${total}`}>
      <div className={styles.labels}>
        <span>YOUR PROGRESS</span>
        <span><strong>{current}</strong> / {total}</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
      >
        <span className={styles.fill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export default ProgressBar
