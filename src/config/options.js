export const OCCASIONS = [
  'Wedding',
  'Pre-Wedding',
  'Engagement',
  'Reception',
  'Haldi',
  'Mehendi',
  'Birthday',
  'Maternity',
  'Baby Shoot',
  'Other',
];

// Just suggestions shown as quick-fill chips — the ceremony field is free text
// so the client can always type something not on this list.
export const CEREMONY_SUGGESTIONS = [
  'Haldi',
  'Mehendi',
  'Sangeet',
  'Wedding Ceremony',
  'Reception',
  'Engagement',
  'Cocktail Party',
  'Vidaai',
];

export const BUSINESS = {
  name: 'Wedding Mantra Films',
  phone: '9288277233', // confirmed: +91 92882 77233
  whatsapp: '919288277233', // country code + number, digits only, for wa.me links
  instagram: '@weddingmantrafilms',
  website: 'www.weddingmantrafilms.com',
  email: 'weddingmantrafilms@gmail.com',
  address: '019, Near Lucky Garage, Chuna Bhatta, Kokar, Ranchi, Jharkhand 834001',
  tagline: 'Crafting Emotions Into Frames.',
};

// Alias used when seeding the Settings store's default state.
export const DEFAULT_BUSINESS = BUSINESS;
