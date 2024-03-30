import { useState } from 'react'

import { ThemeProvider } from './components/ThemeProvider/theme-provider'
import Welcome from './components/Welcome'

function App(): JSX.Element {
  const [welcome, setWelcome] = useState(true)
  setTimeout(() => {
    setWelcome(true)
  }, 3000)

  return (
    <ThemeProvider defaultTheme="dark" storageKey="botmaster-ui-theme">
      {welcome ? <Welcome /> : null}
    </ThemeProvider>
  )
}

export default App
