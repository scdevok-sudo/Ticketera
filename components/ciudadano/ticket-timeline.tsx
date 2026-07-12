import { TICKET_STAGES } from '@/lib/constants/tickets'

interface TicketEvent {
  id: string
  content: string | null
  new_status: string | null
  created_at: string | null
  is_internal: boolean | null
}

interface TicketTimelineProps {
  status: string
  events: TicketEvent[]
}

export function TicketTimeline({ status, events }: TicketTimelineProps) {
  const publicEvents = events.filter((e) => !e.is_internal)
  const currentIndex = TICKET_STAGES.findIndex((s) => s.key === status)

  return (
    <div>
      {TICKET_STAGES.map((stage, i) => {
        const event = publicEvents.find((e) => e.new_status === stage.key)
        const state = i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'pending'
        const isLast = i === TICKET_STAGES.length - 1

        return (
          <div key={stage.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  state === 'done'
                    ? 'bg-brand-naranja text-white'
                    : state === 'active'
                      ? 'animate-pulse bg-[#0C447C] text-white'
                      : 'border-2 border-zinc-300 bg-white text-zinc-400'
                }`}
              >
                {state === 'done' ? '✓' : i + 1}
              </div>
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 ${i < currentIndex ? 'bg-brand-naranja' : 'bg-zinc-200'}`}
                />
              )}
            </div>
            <div className={isLast ? 'pb-0' : 'pb-6'}>
              <p
                className={`text-sm font-semibold ${
                  state === 'pending' ? 'text-zinc-400' : 'text-zinc-800'
                }`}
              >
                {stage.label}
              </p>
              {event?.created_at && (
                <p className="mt-0.5 text-xs text-zinc-500">
                  {new Date(event.created_at).toLocaleString('es-AR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
              {event?.content && <p className="mt-1 text-sm text-zinc-600">{event.content}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
