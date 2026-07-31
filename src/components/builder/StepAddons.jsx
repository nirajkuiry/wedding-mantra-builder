import { useFormContext, Controller } from 'react-hook-form';
import { ChoiceCard } from '../ui/ChoiceCard';
import { Toggle } from '../ui/Toggle';
import { useSettingsStore } from '../../store/useSettingsStore';
import { formatINR } from '../../lib/calculatePrice';

function OptionGroup({ title, name, options, control }) {
  return (
    <div>
      <label className="field-label">{title}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Object.entries(options).map(([key, opt]) => (
              <ChoiceCard
                key={key}
                label={opt.label}
                sublabel={opt.price ? formatINR(opt.price) : undefined}
                active={field.value === key}
                onClick={() => field.onChange(key)}
              />
            ))}
          </div>
        )}
      />
    </div>
  );
}

export function StepAddons() {
  const { control, setValue, watch } = useFormContext();
  const extras = watch('addons.extras');
  const rates = useSettingsStore((s) => s.pricing);

  return (
    <div className="space-y-7">
      <div>
        <h2 className="font-display text-3xl text-ivory">Choose your add-ons</h2>
        <p className="mt-1 font-body text-sm text-ivory/50">These apply across your entire event.</p>
      </div>

      <OptionGroup title="Photographers" name="addons.photographers" options={rates.photographers} control={control} />
      <OptionGroup title="Cinematographers" name="addons.cinematographers" options={rates.cinematographers} control={control} />
      <OptionGroup title="Drone" name="addons.drone" options={rates.drone} control={control} />
      <OptionGroup title="Album" name="addons.album" options={rates.albums} control={control} />
      <OptionGroup title="Wedding Film" name="addons.weddingFilm" options={rates.weddingFilm} control={control} />
      <OptionGroup title="Instagram Reels" name="addons.reels" options={rates.reels} control={control} />

      <div>
        <label className="field-label">Optional Extras</label>
        <div className="grid gap-2 sm:grid-cols-2">
          {Object.entries(rates.extras).map(([key, opt]) => (
            <Toggle
              key={key}
              label={`${opt.label} — ${formatINR(opt.price)}`}
              checked={!!extras?.[key]}
              onChange={(val) => setValue(`addons.extras.${key}`, val)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
