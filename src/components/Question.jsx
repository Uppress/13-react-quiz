import ProgressBar from './ProgressBar.jsx'
import ScoreBoard from './ScoreBoard.jsx'
import Timer from './Timer.jsx'
import styles from './Question.module.css'

function Question({
  category,
  difficulty,
  question,
  questionNumber,
  totalQuestions,
  score,
  seconds,
  onAnswer,
}) {
  const difficultyLabel = {
    easy: 'Easy peasy',
    medium: 'A little tricky',
    hard: 'Brain bender',
  }[difficulty]

  return (
    <section className={styles.questionScreen} aria-labelledby="question-title">
      <div className={styles.topline}>
        <div className={styles.categoryTag}>
          <span aria-hidden="true">✦</span>
          {category?.name ?? 'Trivia'}
          <span className={styles.tagDivider}>·</span>
          <span className={styles.difficulty}>{difficultyLabel}</span>
        </div>
        <Timer seconds={seconds} onTick={() => onAnswer(null)} />
      </div>

      <ProgressBar current={questionNumber} total={totalQuestions} />

      <div className={styles.content}>
        <div className={styles.questionCard}>
          <div className={styles.questionMeta}>
            <span>QUESTION {String(questionNumber).padStart(2, '0')}</span>
            <span className={styles.mood}>You&apos;ve got this <span aria-hidden="true">✦</span></span>
          </div>
          <h1 id="question-title">{question.text}</h1>
          <p className={styles.instruction}>Choose the answer that feels right.</p>

          <div className={styles.answers} role="group" aria-label="Answer choices">
            {question.answers.map((answer, index) => (
              <button
                className={styles.answer}
                key={`${question.id}-${answer}`}
                onClick={() => onAnswer(answer)}
                type="button"
              >
                <span className={styles.letter}>{String.fromCharCode(65 + index)}</span>
                <span>{answer}</span>
                <span className={styles.answerArrow} aria-hidden="true">↗</span>
              </button>
            ))}
          </div>

          <div className={styles.questionFooter}>
            <span><span aria-hidden="true">💡</span> Take your time</span>
            <span>{totalQuestions - questionNumber} {totalQuestions - questionNumber === 1 ? 'question' : 'questions'} left</span>
          </div>
        </div>

        <div className={styles.sideColumn}>
          <ScoreBoard score={score} totalQuestions={totalQuestions} />
          <div className={styles.encouragementCard}>
            <span className={styles.encouragementIcon} aria-hidden="true">🌼</span>
            <p>Little steps add up to big brain energy.</p>
            <span aria-hidden="true">— your quizzy buddy</span>
          </div>
        </div>
      </div>
      <p className={styles.demoNote}>Choose your answer before the timer runs out!</p>
    </section>
  )
}

export default Question
