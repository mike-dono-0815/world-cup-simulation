interface Props {
  code: string
  size?: number
}

export function Flag({ code, size = 28 }: Props) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={code}
      width={size}
      height={Math.round(size * 0.67)}
      style={{
        border: '1.5px solid rgba(27,26,20,0.35)',
        display: 'inline-block',
        objectFit: 'cover',
        flexShrink: 0,
      }}
    />
  )
}
