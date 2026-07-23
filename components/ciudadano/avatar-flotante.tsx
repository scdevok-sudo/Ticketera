'use client'

export function AvatarFlotante() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '16px',
        zIndex: 50,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '2.5px solid #FF7402',
        boxShadow: '0 2px 12px rgba(255, 116, 2, 0.35)',
        background: '#FFB002',
        pointerEvents: 'none',
      }}
    >
      <img
        src="/images/jose-corral1.png"
        alt="José Corral"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
        }}
      />
    </div>
  )
}
