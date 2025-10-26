import { ComponentProps } from 'react'
import DynamicIcon from './dynamic-icon'
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'
import { Virtuoso } from 'react-virtuoso'

interface SelectProps extends ComponentProps<typeof Select> {
  iconList: string[]
  field: {
    value: string
    onChange: (value: string) => void
  }
}

export const SelectVirtualized = ({ iconList, field }: SelectProps) => {
  return (
    <Select value={field.value} onValueChange={field.onChange}>
      <SelectTrigger className="flex w-1/5 h-full">
        {field.value ? (
          <DynamicIcon name={field.value as any} className="h-4 w-4" />
        ) : (
          <span className="text-muted-foreground">Ícone</span>
        )}
      </SelectTrigger>
      <SelectContent className="h-[300px] w-[220px]">
        <Virtuoso
          height={100}
          totalCount={iconList.length}
          itemContent={(index) => {
            const iconName = iconList[index]
            return (
              <SelectItem key={index} value={iconName}>
                <div className="flex items-center gap-2">
                  <DynamicIcon name={iconName as any} className="h-4 w-4" />
                  <span>{iconName}</span>
                </div>
              </SelectItem>
            )
          }}
        />
      </SelectContent>
    </Select>
  )
}
