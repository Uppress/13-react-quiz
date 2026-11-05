import styles from './ErrorMessage.module.css'

function ErrorMessage({ message, onRetry, onBack, compact = false }) {
  return (
    <div className={`${styles.error} ${compact ? styles.compact : ''}`} role="alert">
      {!compact && <span className={styles.icon} aria-hidden="true">☁</span>}
      <p>{message}</p>
      <div className={styles.actions}>
        {onRetry && (
          <button className={styles.retry} onClick={onRetry} type="button">
            Try again
          </button>
        )}
        {onBack && (
          <button className={styles.back} onClick={onBack} type="button">
            Change settings
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage
