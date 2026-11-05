import styles from './ScoreBoard.module.css'

function ScoreBoard({ score, totalQuestions, compact = false }) {
  return (
    <aside className={`${styles.scoreboard} ${compact ? styles.compact : ''}`} aria-label="Quiz score">
      <div className={styles.title}>
        <span className={styles.titleIcon} aria-hidden="true">✧</span>
        <span>YOUR SCORE</span>
      </div>
      <div className={styles.score}>{score}<span>/{totalQuestions}</span></div>
      <div className={styles.encouragement}>
        {score > 0 ? 'You’re on a roll!' : 'Every try counts!'}
        <span aria-hidden="true">{score > 0 ? ' ✨' : ' 🌱'}</span>
      </div>
      <div className={styles.miniTrack} aria-hidden="true">
        <span style={{ width: `${totalQuestions ? Math.min((score / totalQuestions) * 100, 100) : 0}%` }} />
      </div>
    </aside>
  )
}

export default ScoreBoard
