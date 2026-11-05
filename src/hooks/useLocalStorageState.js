import { useEffect, useState } from 'react'

function useLocalStorageState(key, initial) {
  const getInitialValue = () => (
    typeof initial === 'function' ? initial() : initial
  )

  const [value, setValue] = useState(() => {
    try {
      const savedValue = window.localStorage.getItem(key)
      return savedValue === null ? getInitialValue() : JSON.parse(savedValue)
    } catch (error) {
      console.error(`Could not read "${key}" from localStorage.`, error)
      return getInitialValue()
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Could not save "${key}" to localStorage.`, error)
    }
  }, [key, value])

  return [value, setValue]
}

export default useLocalStorageState
