import botMasterLogo from './assets/botmaster.svg'

function App(): JSX.Element {
  return (
    <>
      <img alt="logo" className="logo" src={botMasterLogo} />
      <div className="text">
        <span className="botmaster">BotMaster</span> Assistant
      </div>
      <div className="creator">Developed by Josias Junior</div>
    </>
  )
}

export default App
