import { useEffect, useState } from 'react'

import { ThemeProvider } from './components/ThemeProvider/theme-provider'
import Welcome from './components/Welcome'
import { ProcessesDataTable } from './components/ProcessesDataTable/data-table'
import { columns } from './components/ProcessesDataTable/columns'

function App(): JSX.Element {
  const [process, setProcesses] = useState([])
  const [welcome, setWelcome] = useState(true)

  useEffect(() => {
    window.electron.ipcRenderer.on('process-list', (_event, args) => {
      setProcesses(args)
      console.log(args)
    })

    return () => {
      window.electron.ipcRenderer.removeAllListeners('process-list')
    }
  })

  setTimeout(() => {
    setWelcome(false)
  }, 3000)

  return (
    <ThemeProvider defaultTheme="dark" storageKey="botmaster-ui-theme">
      {welcome ? <Welcome /> : <ProcessesDataTable columns={columns} data={process} />}
    </ThemeProvider>
  )
}

export default App
