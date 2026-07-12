'use client'

import { useState } from 'react'
import { Icon } from '@/components/ui/icon'

interface Faq {
  pregunta: string
  respuesta: string
}

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
      {faqs.map((faq, i) => {
        const open = openIndex === i
        return (
          <div key={faq.pregunta}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-gray-800"
            >
              {faq.pregunta}
              <span
                className={`shrink-0 text-gray-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
              >
                <Icon name="chevron-down" size={16} aria-hidden="true" />
              </span>
            </button>
            {open && <p className="px-4 pb-3 text-sm text-gray-500">{faq.respuesta}</p>}
          </div>
        )
      })}
    </div>
  )
}
