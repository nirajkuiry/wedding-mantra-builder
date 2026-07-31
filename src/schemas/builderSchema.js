import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  phone: z
    .string()
    .min(10, 'Enter a valid phone number')
    .regex(/^[0-9+\s-]{10,15}$/, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email').or(z.literal('')).optional(),
  address: z.string().optional(),
});

export const occasionSchema = z.object({
  occasion: z.string().min(1, 'Please select an occasion'),
});

export const dateKnownSchema = z.object({
  dateKnown: z.enum(['yes', 'no'], { required_error: 'Please choose an option' }),
  weddingDate: z.string().optional(),
}).refine((data) => data.dateKnown === 'no' || (data.weddingDate && data.weddingDate.length > 0), {
  message: 'Please select a date',
  path: ['weddingDate'],
});

export const daysCountSchema = z.object({
  dayCount: z.coerce.number().min(1, 'Select at least 1 day').max(10, 'Maximum 10 days'),
});

export const daySchema = z.object({
  ceremony: z.string().min(1, 'Please enter or select a ceremony'),
  duration: z.enum(['3-5', '5-10', 'full'], { required_error: 'Select a duration' }),
  eventName: z.string().min(1, 'Event name is required'),
  venue: z.string().min(1, 'Venue is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  indoorOutdoor: z.enum(['indoor', 'outdoor', 'both']),
  guestCount: z.coerce.number().min(1, 'Enter approximate guest count'),
  photographyRequired: z.boolean().default(true),
  cinematographyRequired: z.boolean().default(true),
  droneRequired: z.boolean().default(false),
  ledWall: z.boolean().default(false),
  liveStreaming: z.boolean().default(false),
  reelsRequired: z.boolean().default(false),
  weddingFilmRequired: z.boolean().default(false),
  albumRequired: z.boolean().default(false),
  notes: z.string().optional(),
});

export const daysArraySchema = z.object({
  days: z.array(daySchema).min(1),
});

export const addonsSchema = z.object({
  photographers: z.enum(['1', '2', '3', '4']),
  cinematographers: z.enum(['1', '2', '3']),
  drone: z.enum(['none', '4k', 'fpv']),
  album: z.enum(['none', 'sheet20', 'sheet30', 'sheet40', 'crystal', 'acrylic', 'leather']),
  weddingFilm: z.enum(['none', 'highlight', 'min15', 'min30', 'documentary']),
  reels: z.enum(['none', 'r2', 'r4', 'r6', 'r10', 'unlimited']),
  extras: z.object({
    coupleShoot: z.boolean().default(false),
    sameDayEdit: z.boolean().default(false),
    familyBytes: z.boolean().default(false),
    liveStreaming: z.boolean().default(false),
    ledWall: z.boolean().default(false),
    coffeeMug: z.boolean().default(false),
    frames: z.boolean().default(false),
    verticalAlbum: z.boolean().default(false),
    candidAlbum: z.boolean().default(false),
  }),
});

// Full shape used to seed react-hook-form defaultValues.
export const builderDefaultValues = {
  contact: { name: '', phone: '', email: '', address: '' },
  occasion: '',
  dateKnown: undefined,
  weddingDate: '',
  dayCount: 1,
  days: [],
  addons: {
    photographers: '1',
    cinematographers: '1',
    drone: 'none',
    album: 'none',
    weddingFilm: 'none',
    reels: 'none',
    extras: {
      coupleShoot: false,
      sameDayEdit: false,
      familyBytes: false,
      liveStreaming: false,
      ledWall: false,
      coffeeMug: false,
      frames: false,
      verticalAlbum: false,
      candidAlbum: false,
    },
  },
};

export const emptyDay = {
  ceremony: '',
  duration: '3-5',
  eventName: '',
  venue: '',
  startTime: '',
  endTime: '',
  indoorOutdoor: 'outdoor',
  guestCount: '',
  photographyRequired: true,
  cinematographyRequired: true,
  droneRequired: false,
  ledWall: false,
  liveStreaming: false,
  reelsRequired: false,
  weddingFilmRequired: false,
  albumRequired: false,
  notes: '',
};
