import { ColumnDef } from '@tanstack/react-table'

import { PlayIcon } from '@radix-ui/react-icons'

import Button from '@renderer/components/Button'

export type Automation = {
  id: string
  name: string
  description: string
  key: string
  path: string
}

export const columns: ColumnDef<Automation>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }): React.ReactElement => {
      return <div>{row.original.name}</div>
    }
  },

  {
    header: 'Description',
    accessorKey: 'description'
  },
  {
    header: 'Start',
    id: 'start',
    cell: ({ row }): React.ReactElement => {
      window.electron.ipcRenderer.on(`${row.original.name}-finished`, (event, args) => {
        console.log(args)
        event.sender.send('ok')
      })
      return (
        <Button
          variant="ghost"
          size={'icon'}
          onClick={() => window.electron.ipcRenderer.send('run-process', row.original)}
          aria-label="name"
          className="rounded-full"
        >
          <PlayIcon width={18} height={18} />
        </Button>
      )
    }
  }
]
