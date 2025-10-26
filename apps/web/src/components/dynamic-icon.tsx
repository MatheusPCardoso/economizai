import { LucideProps, icons } from 'lucide-react'

export type IconName = keyof typeof icons

interface DynamicIconProps extends LucideProps {
  name: IconName
}

const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const IconComponent = icons[name]

  if (!IconComponent) {
    const FallbackIcon = icons['Ban']
    return <FallbackIcon {...props} />
  }

  return <IconComponent {...props} />
}

export default DynamicIcon
