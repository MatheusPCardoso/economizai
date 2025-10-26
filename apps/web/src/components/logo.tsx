import Image, { type ImageProps } from 'next/image'

type LogoVariant = 'full' | 'icon' | 'wide'

const logoMap: Record<LogoVariant, { src: string; width: number; height: number }> = {
  full: {
    src: '/assets/images/full-logo.svg',
    width: 200,
    height: 80,
  },
  icon: {
    src: '/assets/images/icon-logo.webp',
    width: 50,
    height: 50,
  },
  wide: {
    src: '/assets/images/wide-logo.webp',
    width: 250,
    height: 60,
  },
}

type LogoProps = Omit<ImageProps, 'src' | 'alt'> & {
  variant?: LogoVariant
  alt?: string
}

const Logo = ({ variant = 'full', alt = 'Logo', className, ...props }: LogoProps) => {
  const logo = logoMap[variant]
  return (
    <Image
      src={logo.src}
      alt={alt}
      width={props.width || logo.width}
      height={props.height || logo.height}
      className={className}
      {...props}
    />
  )
}

export default Logo
