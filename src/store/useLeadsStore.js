import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { insertLeadToSupabase, isSupabaseConfigured } from '../lib/supabaseClient';

// Matches the Booking Status list from the CRM spec.
export const PIPELINE_STATUSES = [
  'New Lead',
  'Follow-up',
  'Quotation Sent',
  'Negotiation',
  'Confirmed',
  'Advance Paid',
  'Shooting Completed',
  'Editing',
  'Album Designing',
  'Delivered',
  'Closed',
];

export const DELIVERY_STATUSES = ['Not Started', 'In Editing', 'Ready for Review', 'Delivered'];

/**
 * Stands in for the CRM's permanent lead storage. Every submitted package
 * is kept in localStorage (via zustand's `persist`) so nothing is lost even
 * before Supabase is wired up — and every save also attempts a Supabase
 * insert so the switch-over is seamless once VITE_SUPABASE_URL /
 * VITE_SUPABASE_ANON_KEY are set in .env.
 */
export const useLeadsStore = create(
  persist(
    (set, get) => ({
      leads: [],

      addLead: async (leadData) => {
        const now = new Date().toISOString();
        const lead = {
          id: crypto.randomUUID(),
          createdAt: now,
          status: 'New Lead',
          assignedEditor: '',
          assignedPhotographer: '',
          assignedCinematographer: '',
          deliveryStatus: 'Not Started',
          driveLink: '',
          internalNotes: '',
          activity: [{ ts: now, message: 'Lead created' }],
          ...leadData,
        };

        set((state) => ({ leads: [lead, ...state.leads] }));

        if (isSupabaseConfigured) {
          const { error } = await insertLeadToSupabase(lead);
          if (error) {
            console.error('Failed to sync lead to Supabase, kept locally:', error.message);
          }
        }

        return lead;
      },

      updateLeadStatus: (id, status) =>
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id
              ? {
                  ...l,
                  status,
                  activity: [...(l.activity || []), { ts: new Date().toISOString(), message: `Status changed to "${status}"` }],
                }
              : l
          ),
        })),

      updateLeadFields: (id, partial) =>
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, ...partial } : l)),
        })),

      removeLead: (id) => set((state) => ({ leads: state.leads.filter((l) => l.id !== id) })),
    }),
    { name: 'wmf-leads-storage' }
  )
);
