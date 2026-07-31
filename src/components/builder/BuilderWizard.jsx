import { useForm, FormProvider } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useWizardStore, STEPS } from '../../store/useWizardStore';
import { builderDefaultValues, contactSchema, occasionSchema, dateKnownSchema, daysCountSchema, daysArraySchema } from '../../schemas/builderSchema';
import { ProgressRail } from '../ui/ProgressRail';
import { StepContact } from './StepContact';
import { StepOccasion } from './StepOccasion';
import { StepDateKnown } from './StepDateKnown';
import { StepDayCount } from './StepDayCount';
import { StepDayDetails } from './StepDayDetails';
import { StepAddons } from './StepAddons';
import { StepCalculator } from './StepCalculator';
import { StepGenerate } from './StepGenerate';

const STEP_COMPONENTS = {
  contact: StepContact,
  occasion: StepOccasion,
  dateKnown: StepDateKnown,
  dayCount: StepDayCount,
  dayDetails: StepDayDetails,
  addons: StepAddons,
  calculator: StepCalculator,
  generate: StepGenerate,
};

// Maps each step to the zod schema (and how to slice/prefix form values) used
// to validate it before advancing. Steps not listed here have no required
// fields and always pass.
const STEP_VALIDATORS = {
  contact: (values) => ({ schema: contactSchema, data: values.contact, prefix: 'contact.' }),
  occasion: (values) => ({ schema: occasionSchema, data: { occasion: values.occasion }, prefix: '' }),
  dateKnown: (values) => ({
    schema: dateKnownSchema,
    data: { dateKnown: values.dateKnown, weddingDate: values.weddingDate },
    prefix: '',
  }),
  dayCount: (values) => ({ schema: daysCountSchema, data: { dayCount: values.dayCount }, prefix: '' }),
  dayDetails: (values) => ({ schema: daysArraySchema, data: { days: values.days }, prefix: '' }),
};

async function validateStep(stepKey, getValues, setError, clearErrors) {
  const validatorFn = STEP_VALIDATORS[stepKey];
  if (!validatorFn) return true;

  clearErrors();
  const values = getValues();
  const { schema, data, prefix } = validatorFn(values);
  const result = schema.safeParse(data);

  if (result.success) return true;

  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    setError(prefix + path, { type: 'manual', message: issue.message });
  });
  return false;
}

export function BuilderWizard() {
  const methods = useForm({ defaultValues: builderDefaultValues, mode: 'onSubmit' });
  const { stepIndex, goNext, goBack, goToStep } = useWizardStore();
  const currentStepKey = STEPS[stepIndex];
  const StepComponent = STEP_COMPONENTS[currentStepKey];

  const handleNext = async () => {
    const valid = await validateStep(currentStepKey, methods.getValues, methods.setError, methods.clearErrors);
    if (valid) goNext();
  };

  return (
    <FormProvider {...methods}>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
        <ProgressRail steps={STEPS} activeIndex={stepIndex} onSelect={goToStep} />

        <form onSubmit={(e) => e.preventDefault()}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepKey}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="glass-card p-6 sm:p-8"
            >
              <StepComponent />
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between">
            <button type="button" onClick={goBack} disabled={stepIndex === 0} className="btn-ghost">
              <ChevronLeft size={16} /> Back
            </button>

            {currentStepKey !== 'generate' && (
              <button type="button" onClick={handleNext} className="btn-gold">
                Continue <ChevronRight size={16} />
              </button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
