import styles from './StartScreen.module.css'
import ErrorMessage from './ErrorMessage.jsx'
import Loading from './Loading.jsx'

function StartScreen({
  categories,
  defaultSettings,
  highScore,
  categoryStatus,
  categoryError,
  onRetryCategories,
  onStart,
}) {
  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onStart({
      category: formData.get('category'),
      difficulty: formData.get('difficulty'),
      questionCount: Number(formData.get('questionCount')),
    })
  }

  return (
    <section className={styles.start} aria-labelledby="welcome-title">
      <div className={styles.intro}>
        <span className={styles.eyebrow}>
          <span aria-hidden="true">✦</span> YOUR DAILY DOSE OF CURIOUS
        </span>
        <h1 id="welcome-title">
          Ready to give your
          <br />
          brain a <span>little play?</span>
        </h1>
        <p>Pick your vibe, trust your gut, and see what you know.</p>
        <div className={styles.doodle} aria-hidden="true">✳</div>
      </div>

      <form className={styles.setupCard} onSubmit={handleSubmit}>
        <div className={styles.cardHeading}>
          <div>
            <h2>Make it yours</h2>
            <p>Set up your perfect little quiz.</p>
          </div>
          <div className={styles.headingSide}>
            <span className={styles.cardIcon} aria-hidden="true">✎</span>
            <span className={styles.highScore}>Best: {highScore}</span>
          </div>
        </div>

        <fieldset className={styles.categoryField}>
          <legend>Pick a category</legend>
          {categoryStatus === 'loading' && (
            <Loading message="Loading categories..." compact />
          )}
          {categoryStatus === 'error' && (
            <ErrorMessage
              message={categoryError}
              onRetry={onRetryCategories}
              compact
            />
          )}
          {categoryStatus === 'ready' && (
            <div className={styles.categoryGrid}>
              {categories.map((category, index) => (
                <label
                  className={`${styles.categoryOption} ${styles[['mint', 'lilac', 'peach', 'blue'][index % 4]]}`}
                  key={category.id}
                >
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    defaultChecked={
                      String(defaultSettings.category) === String(category.id) ||
                      (!categories.some((item) => String(item.id) === String(defaultSettings.category)) && index === 0)
                    }
                  />
                  <span className={styles.categoryIcon} aria-hidden="true">
                    {category.name.toLowerCase().includes('science') ? '🔬' :
                      category.name.toLowerCase().includes('animal') ? '🐾' :
                        category.name.toLowerCase().includes('computer') ? '💻' : '✦'}
                  </span>
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <div className={styles.selectRow}>
          <label className={styles.selectField}>
            <span>Difficulty</span>
            <select name="difficulty" defaultValue={defaultSettings.difficulty}>
              <option value="easy">Easy peasy</option>
              <option value="medium">A little tricky</option>
              <option value="hard">Brain bender</option>
            </select>
          </label>
          <label className={styles.selectField}>
            <span>Questions</span>
            <select name="questionCount" defaultValue={String(defaultSettings.questionCount)}>
              <option value="5">5 questions</option>
              <option value="10">10 questions</option>
              <option value="15">15 questions</option>
            </select>
          </label>
        </div>

        <button className={styles.startButton} type="submit" disabled={categoryStatus !== 'ready'}>
          Let&apos;s play <span aria-hidden="true">→</span>
        </button>
        <p className={styles.finePrint}>
          <span aria-hidden="true">☀</span> No pressure. Just for fun.
        </p>
      </form>

      <div className={styles.bottomNote}>
        <span aria-hidden="true">☻</span>
        <p>Curiosity looks good on you.</p>
        <span aria-hidden="true">✦</span>
      </div>
    </section>
  )
}

export default StartScreen
