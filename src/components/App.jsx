import { useEffect, useReducer, useState } from 'react'
import ErrorMessage from './ErrorMessage.jsx'
import Loading from './Loading.jsx'
import Question from './Question.jsx'
import ResultScreen from './ResultScreen.jsx'
import StartScreen from './StartScreen.jsx'
import { decodeHtml, shuffle } from '../data/trivia.js'
import styles from './App.module.css'

const QUESTION_SECONDS = 15

const initialQuiz = {
  screen: 'start',
  settings: null,
  requestId: 0,
  questions: [],
  questionIndex: 0,
  score: 0,
  seconds: QUESTION_SECONDS,
  error: null,
}

function quizReducer(state, action) {
  switch (action.type) {
    case 'START':
      return {
        ...initialQuiz,
        screen: 'loading',
        settings: action.settings,
      }
    case 'RETRY':
      return { ...state, screen: 'loading', requestId: state.requestId + 1, error: null }
    case 'LOADED':
      return {
        ...state,
        screen: 'question',
        questions: action.questions,
        questionIndex: 0,
        score: 0,
        seconds: QUESTION_SECONDS,
        error: null,
      }
    case 'LOAD_ERROR':
      return { ...state, screen: 'error', error: action.error }
    case 'ANSWER': {
      if (state.screen !== 'question') return state
      const currentQuestion = state.questions[state.questionIndex]
      const score = state.score + Number(action.answer === currentQuestion.correctAnswer)
      if (state.questionIndex === state.questions.length - 1) {
        return { ...state, screen: 'result', score }
      }
      return {
        ...state,
        questionIndex: state.questionIndex + 1,
        score,
        seconds: QUESTION_SECONDS,
      }
    }
    case 'tick': {
      if (state.screen !== 'question') return state
      if (state.seconds > 1) return { ...state, seconds: state.seconds - 1 }
      if (state.questionIndex === state.questions.length - 1) {
        return { ...state, screen: 'result', seconds: 0 }
      }
      return {
        ...state,
        questionIndex: state.questionIndex + 1,
        seconds: QUESTION_SECONDS,
      }
    }
    case 'BACK_TO_START':
      return initialQuiz
    default:
      return state
  }
}

function getApiError(responseCode) {
  const messages = {
    1: 'No questions match those settings. Try another category or difficulty.',
    2: 'The trivia service did not accept those quiz settings. Please try again.',
    3: 'The trivia service could not find a session. Please try again.',
    4: 'The trivia service has run out of questions for this session. Please try again.',
    5: 'The trivia service is receiving too many requests. Wait a moment and try again.',
  }
  return messages[responseCode] ?? `The trivia service returned an unexpected response (${responseCode}).`
}

function App() {
  const [quiz, dispatch] = useReducer(quizReducer, initialQuiz)
  const [categories, setCategories] = useState([])
  const [categoryStatus, setCategoryStatus] = useState('loading')
  const [categoryError, setCategoryError] = useState(null)
  const [categoryRetry, setCategoryRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadCategories() {
      try {
        const response = await fetch('https://opentdb.com/api_category.php', {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Could not load categories (HTTP ${response.status}).`)

        const data = await response.json()
        if (!Array.isArray(data.trivia_categories) || data.trivia_categories.length === 0) {
          throw new Error('The trivia service returned an invalid category list.')
        }

        if (controller.signal.aborted) return
        setCategories(data.trivia_categories)
        setCategoryStatus('ready')
      } catch (error) {
        if (controller.signal.aborted || error.name === 'AbortError') return
        setCategoryError(error.message || 'Could not load categories. Please try again.')
        setCategoryStatus('error')
      }
    }

    loadCategories()
    return () => controller.abort()
  }, [categoryRetry])

  useEffect(() => {
    if (quiz.screen !== 'loading' || !quiz.settings) return undefined

    const controller = new AbortController()
    const params = new URLSearchParams({
      amount: String(quiz.settings.questionCount),
      category: String(quiz.settings.category),
      difficulty: quiz.settings.difficulty,
      type: 'multiple',
    })

    async function loadQuestions() {
      try {
        const response = await fetch(`https://opentdb.com/api.php?${params}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Could not load quiz questions (HTTP ${response.status}).`)

        const data = await response.json()
        if (controller.signal.aborted) return
        if (data.response_code !== 0) throw new Error(getApiError(data.response_code))
        if (!Array.isArray(data.results) || data.results.length === 0) {
          throw new Error('The trivia service did not return any questions. Please try again.')
        }

        const decodedQuestions = data.results.map((item, index) => {
          const correctAnswer = decodeHtml(item.correct_answer)
          return {
            id: index,
            text: decodeHtml(item.question),
            correctAnswer,
            answers: shuffle([
              correctAnswer,
              ...item.incorrect_answers.map(decodeHtml),
            ]),
          }
        })
        if (controller.signal.aborted) return
        dispatch({ type: 'LOADED', questions: decodedQuestions })
      } catch (error) {
        if (controller.signal.aborted || error.name === 'AbortError') return
        dispatch({
          type: 'LOAD_ERROR',
          error: error.message || 'Could not load quiz questions. Please try again.',
        })
      }
    }

    loadQuestions()
    return () => controller.abort()
  }, [quiz.screen, quiz.settings, quiz.requestId])

  function startQuiz(settings) {
    dispatch({ type: 'START', settings })
  }

  function restartQuiz() {
    dispatch({ type: 'BACK_TO_START' })
  }

  function retryCategories() {
    setCategoryError(null)
    setCategoryStatus('loading')
    setCategoryRetry((retry) => retry + 1)
  }

  const currentQuestion = quiz.questions[quiz.questionIndex]
  const selectedCategory = categories.find(
    (category) => category.id === Number(quiz.settings?.category),
  )

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <a
          className={styles.brand}
          href="#home"
          onClick={(event) => {
            event.preventDefault()
            restartQuiz()
          }}
          aria-label="Quizzy home"
        >
          <span className={styles.brandMark} aria-hidden="true">✳</span>
          <span>quizzy<span className={styles.brandPeriod}>.</span></span>
        </a>
        <span className={styles.headerNote}>
          <span className={styles.sparkle} aria-hidden="true">✦</span>
          A little brain break
        </span>
        <a className={styles.helpLink} href="mailto:hello@quizzy.example">
          Need a hint?
        </a>
      </header>

      {quiz.screen === 'start' && (
        <StartScreen
          categories={categories}
          categoryStatus={categoryStatus}
          categoryError={categoryError}
          onRetryCategories={retryCategories}
          onStart={startQuiz}
        />
      )}
      {quiz.screen === 'loading' && (
        <Loading message="Picking your questions..." />
      )}
      {quiz.screen === 'error' && (
        <ErrorMessage
          message={quiz.error}
          onRetry={() => dispatch({ type: 'RETRY' })}
          onBack={restartQuiz}
        />
      )}
      {quiz.screen === 'question' && currentQuestion && (
        <Question
          category={selectedCategory}
          difficulty={quiz.settings.difficulty}
          question={currentQuestion}
          questionNumber={quiz.questionIndex + 1}
          totalQuestions={quiz.questions.length}
          score={quiz.score}
          seconds={quiz.seconds}
          onAnswer={(answer) => dispatch({ type: 'ANSWER', answer })}
          dispatch={dispatch}
        />
      )}
      {quiz.screen === 'result' && (
        <ResultScreen
          score={quiz.score}
          totalQuestions={quiz.questions.length}
          onRestart={restartQuiz}
        />
      )}

      <footer className={styles.footer}>
        <span>Made for curious minds</span>
        <span className={styles.footerHeart} aria-label="with love">♥</span>
        <span>One question at a time</span>
      </footer>
    </main>
  )
}

export default App
