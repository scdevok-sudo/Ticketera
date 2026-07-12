const STEPS = [1, 2, 3]

export function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center justify-center gap-1 px-4 py-6">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
              step < currentStep
                ? 'bg-[#1A6B40] text-white'
                : step === currentStep
                  ? 'bg-brand-naranja text-white'
                  : 'border border-zinc-300 bg-white text-zinc-400'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`h-0.5 w-10 sm:w-20 ${step < currentStep ? 'bg-[#1A6B40]' : 'bg-zinc-300'}`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
