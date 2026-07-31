import { useFormContext, Controller } from 'react-hook-form';
import { ChoiceCard } from '../ui/ChoiceCard';

export function StepDateKnown() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const dateKnown = watch('dateKnown');

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-3xl text-ivory">Have you decided on a date?</h2>
        <p className="mt-1 font-body text-sm text-ivory/50">
          No worries if not — we'll keep you on file and follow up closer to the time.
        </p>
      </div>

      <Controller
        name="dateKnown"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
            <ChoiceCard label="Yes" active={field.value === 'yes'} onClick={() => field.onChange('yes')} />
            <ChoiceCard
              label="Not Yet"
              sublabel="Save as future lead"
              active={field.value === 'no'}
              onClick={() => field.onChange('no')}
            />
          </div>
        )}
      />
      {errors.dateKnown && <p className="field-error">{errors.dateKnown.message}</p>}

      {dateKnown === 'yes' && (
        <div className="max-w-xs">
          <label className="field-label">Wedding / Event Date</label>
          <input type="date" className="field-input" {...register('weddingDate')} />
          {errors.weddingDate && <p className="field-error">{errors.weddingDate.message}</p>}
        </div>
      )}
    </div>
  );
}
