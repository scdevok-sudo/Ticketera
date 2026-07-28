import Image from 'next/image'

interface LogoJCProps {
  size?: number
  showText?: boolean
  textColor?: string
}

export function LogoJC({ size = 32, showText = false, textColor = '#2D3077' }: LogoJCProps) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/brand/logo-isotipo.png"
        alt="Unidos Construimos"
        width={size}
        height={size}
        className="shrink-0"
      />
      {showText && (
        <span className="font-extrabold" style={{ color: textColor, fontSize: size * 0.5 }}>
          Unidos Construimos
        </span>
      )}
    </div>
  )
}
