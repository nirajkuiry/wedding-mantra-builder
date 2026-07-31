import { useFormContext } from 'react-hook-form';

export function StepContact() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-3xl text-ivory">Let's start with you</h2>
        <p className="mt-1 font-body text-sm text-ivory/50">
          So we know who to send your custom quotation to.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label">Full Name</label>
          <input className="field-input" placeholder="e.g. Aarav & Diya" {...register('contact.name')} />
          {errors.contact?.name && <p className="field-error">{errors.contact.name.message}</p>}
        </div>
        <div>
          <label className="field-label">Phone Number</label>
          <input className="field-input" placeholder="98XXXXXXXX" {...register('contact.phone')} />
          {errors.contact?.phone && <p className="field-error">{errors.contact.phone.message}</p>}
        </div>
        <div>
          <label className="field-label">Email (optional)</label>
          <input className="field-input" placeholder="you@email.com" {...register('contact.email')} />
          {errors.contact?.email && <p className="field-error">{errors.contact.email.message}</p>}
        </div>
        <div>
          <label className="field-label">Address (optional)</label>
          <input className="field-input" placeholder="City, State" {...register('contact.address')} />
        </div>
      </div>
    </div>
  );
}
