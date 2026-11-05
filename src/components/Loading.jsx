import styles from './Loading.module.css'

function Loading({ message, compact = false }) {
  return (
    <div className={`${styles.loading} ${compact ? styles.compact : ''}`} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}

export default Loading
