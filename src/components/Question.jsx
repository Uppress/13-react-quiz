import { useEffect } from 'react'
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
  selectedAnswer,
  feedback,
  dispatch,
}) {
  const difficultyLabel = {
    easy: 'Easy peasy',
    medium: 'A little tricky',
    hard: 'Brain bender',
  }[difficulty]

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName))
      ) return

      if (/^[1-4]$/.test(event.key)) {
        event.preventDefault()
        const answer = question.answers[Number(event.key) - 1]
        if (answer !== undefined) dispatch({ type: 'SELECT_ANSWER', answer })
      } else if (event.key === 'Enter' && selectedAnswer !== null) {
        event.preventDefault()
        dispatch({ type: 'NEXT' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch, question, selectedAnswer])

  return (
    <section className={styles.questionScreen} aria-labelledby="question-title">
      <div className={styles.topline}>
        <div className={styles.categoryTag}>
          <span aria-hidden="true">✦</span>
          {category?.name ?? 'Trivia'}
          <span className={styles.tagDivider}>·</span>
          <span className={styles.difficulty}>{difficultyLabel}</span>
        </div>
        <Timer seconds={seconds} dispatch={dispatch} />
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
                className={`${styles.answer} ${selectedAnswer === answer ? styles.selectedAnswer : ''}`}
                key={`${question.id}-${answer}`}
                onClick={() => dispatch({ type: 'SELECT_ANSWER', answer })}
                type="button"
                aria-pressed={selectedAnswer === answer}
              >
                <span className={styles.letter}>{String.fromCharCode(65 + index)}</span>
                <span>{answer}</span>
                <span className={styles.answerArrow} aria-hidden="true">↗</span>
              </button>
            ))}
          </div>

          <p className={styles.feedback} role="status" aria-live="polite" aria-atomic="true">
            {feedback}
          </p>

          <div className={styles.questionFooter}>
            <span><span aria-hidden="true">💡</span> Take your time</span>
            <button
              className={styles.nextButton}
              disabled={selectedAnswer === null}
              onClick={() => dispatch({ type: 'NEXT' })}
              type="button"
            >
              {questionNumber === totalQuestions ? 'See results' : 'Next question'}
              <span aria-hidden="true">→</span>
            </button>
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
