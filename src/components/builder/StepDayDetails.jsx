import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import clsx from 'clsx';
import { CEREMONY_SUGGESTIONS } from '../../config/options';
import { Toggle } from '../ui/Toggle';

const DURATIONS = [
  { key: '3-5', label: '3–5 Hours' },
  { key: '5-10', label: '5–10 Hours' },
  { key: 'full', label: 'Full Day' },
];

const SERVICE_TOGGLES = [
  { key: 'photographyRequired', label: 'Photography Required' },
  { key: 'cinematographyRequired', label: 'Cinematography Required' },
  { key: 'droneRequired', label: 'Drone Coverage' },
  { key: 'ledWall', label: 'LED Wall' },
  { key: 'liveStreaming', label: 'Live Streaming' },
  { key: 'reelsRequired', label: 'Instagram Reels' },
  { key: 'weddingFilmRequired', label: 'Wedding Film' },
  { key: 'albumRequired', label: 'Album' },
];

export function StepDayDetails() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { fields } = useFieldArray({ name: 'days' });
  const [activeDay, setActiveDay] = useState(0);

  const day = watch(`days.${activeDay}`);
  const dayErrors = errors.days?.[activeDay] || {};

  if (!fields.length) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-ivory">Tell us about each day</h2>
        <p className="mt-1 font-body text-sm text-ivory/50">Fill in the details for every function.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {fields.map((f, i) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveDay(i)}
            className={clsx(
              'rounded-full border px-4 py-1.5 font-body text-xs font-medium transition',
              activeDay === i ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-ivory/50 hover:border-gold/40'
            )}
          >
            Day {i + 1}
          </button>
        ))}
      </div>

      <div key={activeDay} className="glass-card space-y-5 p-5 sm:p-6">
        <div>
          <label className="field-label">Ceremony</label>
          <input
            className="field-input"
            list="ceremony-suggestions"
            placeholder="e.g. Mehendi"
            {...register(`days.${activeDay}.ceremony`)}
          />
          <datalist id="ceremony-suggestions">
            {CEREMONY_SUGGESTIONS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          {dayErrors.ceremony && <p className="field-error">{dayErrors.ceremony.message}</p>}
        </div>

        <div>
          <label className="field-label">Duration</label>
          <div className="grid grid-cols-3 gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => setValue(`days.${activeDay}.duration`, d.key, { shouldValidate: true })}
                className={clsx('choice-card', day?.duration === d.key && 'choice-card-active')}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label">Event Name</label>
            <input className="field-input" {...register(`days.${activeDay}.eventName`)} />
            {dayErrors.eventName && <p className="field-error">{dayErrors.eventName.message}</p>}
          </div>
          <div>
            <label className="field-label">Venue</label>
            <input className="field-input" {...register(`days.${activeDay}.venue`)} />
            {dayErrors.venue && <p className="field-error">{dayErrors.venue.message}</p>}
          </div>
          <div>
            <label className="field-label">Start Time</label>
            <input type="time" className="field-input" {...register(`days.${activeDay}.startTime`)} />
            {dayErrors.startTime && <p className="field-error">{dayErrors.startTime.message}</p>}
          </div>
          <div>
            <label className="field-label">End Time</label>
            <input type="time" className="field-input" {...register(`days.${activeDay}.endTime`)} />
            {dayErrors.endTime && <p className="field-error">{dayErrors.endTime.message}</p>}
          </div>
          <div>
            <label className="field-label">Indoor / Outdoor</label>
            <select className="field-input" {...register(`days.${activeDay}.indoorOutdoor`)}>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div>
            <label className="field-label">Approx. Guest Count</label>
            <input type="number" min="1" className="field-input" {...register(`days.${activeDay}.guestCount`)} />
            {dayErrors.guestCount && <p className="field-error">{dayErrors.guestCount.message}</p>}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {SERVICE_TOGGLES.map((t) => (
            <Toggle
              key={t.key}
              label={t.label}
              checked={!!day?.[t.key]}
              onChange={(val) => setValue(`days.${activeDay}.${t.key}`, val)}
            />
          ))}
        </div>

        <div>
          <label className="field-label">Extra Notes</label>
          <textarea rows={3} className="field-input resize-none" {...register(`days.${activeDay}.notes`)} />
        </div>
      </div>
    </div>
  );
}
