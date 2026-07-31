import { useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { emptyDay } from '../../schemas/builderSchema';

export function StepDayCount() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({ name: 'days' });

  const dayCount = Number(watch('dayCount')) || 1;

  useEffect(() => {
    const diff = dayCount - fields.length;
    if (diff > 0) {
      for (let i = 0; i < diff; i += 1) append({ ...emptyDay });
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i += 1) remove(fields.length - 1 - i);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayCount]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-3xl text-ivory">How many event days?</h2>
        <p className="mt-1 font-body text-sm text-ivory/50">
          Count every function you'd like covered — Haldi, Mehendi, the wedding day itself, reception, and so on.
        </p>
      </div>

      <div className="max-w-xs">
        <label className="field-label">Number of Days</label>
        <select className="field-input" {...register('dayCount')}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'Day' : 'Days'}
            </option>
          ))}
        </select>
        {errors.dayCount && <p className="field-error">{errors.dayCount.message}</p>}
      </div>
    </div>
  );
}
