import ScoreBoard from './ScoreBoard.jsx'
import styles from './ResultScreen.module.css'

function ResultScreen({ score, totalQuestions, onRestart }) {
  return (
    <section className={styles.result} aria-labelledby="result-title">
      <div className={styles.confetti} aria-hidden="true">
        <span>✦</span><span>✳</span><span>•</span><span>✧</span><span>•</span>
      </div>
      <div className={styles.resultIcon} aria-hidden="true">🎉</div>
      <span className={styles.eyebrow}>THAT&apos;S A WRAP</span>
      <h1 id="result-title">Look at that <span>bright mind!</span></h1>
      <p className={styles.subtitle}>You showed up, gave it a go, and that&apos;s worth celebrating.</p>

      <div className={styles.resultCard}>
        <ScoreBoard score={score} totalQuestions={totalQuestions} compact />
        <div className={styles.message}>
          <span aria-hidden="true">🌱</span>
          <p>Every quiz is a chance to learn something new. Keep that curiosity going!</p>
        </div>
        <button className={styles.restartButton} onClick={onRestart} type="button">
          Play again <span aria-hidden="true">↗</span>
        </button>
      </div>
      <p className={styles.signoff}>Your brain says thanks <span aria-hidden="true">♥</span></p>
    </section>
  )
}

export default ResultScreen
