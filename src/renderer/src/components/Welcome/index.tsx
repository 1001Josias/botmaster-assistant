import { GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'
import BotMasterLogo from '@renderer/components/BotMasterLogo'

export default function Welcome(): JSX.Element {
  return (
    <>
      <BotMasterLogo className="w-32 h-32 select-none drop-shadow-logo transition: duration-300 mt-36" />
      <div className="text">
        <span className="botmaster">BotMaster</span> Assistant
      </div>
      <div className="flex flex-row flex-nowrap">
        <div className=" mt-2 font-semibold text-sm">Developed by Josias Junior</div>
        <a href="https://github.com/1001josias" target="_blank" rel="noopener noreferrer">
          <GitHubLogoIcon className="ml-2 mt-2 w-5 h-5" />
        </a>
        <a
          href="https://www.linkedin.com/in/josias-da-paix%C3%A3o-junior-534718203"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInLogoIcon className="ml-2 mt-2 w-5 h-5" />
        </a>
      </div>
      <div className="mt-6 text-sm">Initializing...</div>
    </>
  )
}
