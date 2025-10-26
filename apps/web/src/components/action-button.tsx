import { SquarePen, Trash2 } from 'lucide-react'

interface ActionButtonsProps {
  rowId: string
  onEdit: (id: string) => void
  onDelete?: (id: string) => void
}

const ActionButtons = ({ rowId, onEdit, onDelete }: ActionButtonsProps) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <SquarePen
        size={20}
        className="text-muted-foreground cursor-pointer"
        onClick={() => onEdit(rowId)}
      />
      {onDelete && (
        <Trash2
          size={20}
          className="text-muted-foreground cursor-pointer"
          onClick={() => onDelete(rowId)}
        />
      )}
    </div>
  )
}

export default ActionButtons
