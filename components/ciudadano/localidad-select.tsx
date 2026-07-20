'use client'

import { useId, useMemo, useRef, useState } from 'react'

interface LocalidadSelectProps {
  name: string
  id?: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
}

export function LocalidadSelect({
  name,
  id,
  value,
  onChange,
  options,
  placeholder,
}: LocalidadSelectProps) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((option) => option.toLowerCase().includes(q))
  }, [query, options])

  function handleSelect(option: string) {
    onChange(option)
    setQuery(option)
    setOpen(false)
  }

  function closeAndReset() {
    setOpen(false)
    setQuery(value)
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) closeAndReset()
      }}
    >
      <input
        id={id}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          onChange('')
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-[#1a1a1a] placeholder:text-[#9CA3AF] focus:border-brand-naranja focus:outline-none focus:ring-1 focus:ring-brand-naranja"
      />
      <input type="hidden" name={name} value={value} />
      {open && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-10 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
        >
          {filtered.length > 0 ? (
            filtered.map((option) => (
              <li key={option} role="option" aria-selected={option === value}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault() // evita que el input pierda foco antes del tap
                    handleSelect(option)
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault() // fallback para Safari iOS en listas scrolleables
                    handleSelect(option)
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-orange-50 active:bg-orange-100"
                >
                  {option}
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-zinc-400">Sin resultados</li>
          )}
        </ul>
      )}
    </div>
  )
}
