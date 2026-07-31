import { useFormContext, Controller } from 'react-hook-form';
import { OCCASIONS } from '../../config/options';
import { ChoiceCard } from '../ui/ChoiceCard';

export function StepOccasion() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-3xl text-ivory">What are we celebrating?</h2>
        <p className="mt-1 font-body text-sm text-ivory/50">Choose the occasion you'd like us to cover.</p>
      </div>

      <Controller
        name="occasion"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {OCCASIONS.map((occ) => (
              <ChoiceCard key={occ} label={occ} active={field.value === occ} onClick={() => field.onChange(occ)} />
            ))}
          </div>
        )}
      />
      {errors.occasion && <p className="field-error">{errors.occasion.message}</p>}
    </div>
  );
}
