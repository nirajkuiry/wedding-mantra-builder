import { X } from 'lucide-react';
import { formatINR } from '../../lib/calculatePrice';
import { leadDisplayName, leadServiceLabel, leadTotal } from '../../lib/reports';

export function LeadDetailPanel({ lead, statuses, deliveryStatuses, onClose, onUpdateStatus, onUpdateFields }) {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-black/60" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-ink p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-2xl text-ivory">{leadDisplayName(lead)}</h3>
            <p className="font-body text-xs text-ivory/50">{leadServiceLabel(lead)}</p>
          </div>
          <button type="button" onClick={onClose} className="text-ivory/40 hover:text-gold">
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 space-y-1 font-body text-sm text-ivory/70">
          <div>{lead.contact?.phone}</div>
          {lead.contact?.email && <div>{lead.contact.email}</div>}
          {lead.contact?.address && <div className="text-ivory/40">{lead.contact.address}</div>}
        </div>

        <div className="mt-5 glass-card p-4">
          <div className="font-body text-[11px] uppercase tracking-wide text-ivory/40">Total</div>
          <div className="font-display text-2xl text-gold">{formatINR(leadTotal(lead))}</div>
          <div className="mt-1 font-body text-xs text-ivory/50">
            {formatINR(lead.price?.advance || 0)} advance · {formatINR(lead.price?.remaining || 0)} balance
          </div>
        </div>

        <div className="mt-5">
          <label className="field-label">Pipeline Status</label>
          <select
            className="field-input"
            value={lead.status}
            onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5">
          <label className="field-label">Delivery Status</label>
          <select
            className="field-input"
            value={lead.deliveryStatus || 'Not Started'}
            onChange={(e) => onUpdateFields(lead.id, { deliveryStatus: e.target.value })}
          >
            {deliveryStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 grid gap-4">
          <div>
            <label className="field-label">Assigned Photographer</label>
            <input
              className="field-input"
              value={lead.assignedPhotographer || ''}
              onChange={(e) => onUpdateFields(lead.id, { assignedPhotographer: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Assigned Cinematographer</label>
            <input
              className="field-input"
              value={lead.assignedCinematographer || ''}
              onChange={(e) => onUpdateFields(lead.id, { assignedCinematographer: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Assigned Editor</label>
            <input
              className="field-input"
              value={lead.assignedEditor || ''}
              onChange={(e) => onUpdateFields(lead.id, { assignedEditor: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Google Drive Delivery Link</label>
            <input
              className="field-input"
              placeholder="https://drive.google.com/..."
              value={lead.driveLink || ''}
              onChange={(e) => onUpdateFields(lead.id, { driveLink: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Internal Notes</label>
            <textarea
              rows={3}
              className="field-input resize-none"
              value={lead.internalNotes || ''}
              onChange={(e) => onUpdateFields(lead.id, { internalNotes: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="field-label mb-2">Activity</div>
          <div className="space-y-2 border-l border-white/10 pl-4">
            {(lead.activity || [])
              .slice()
              .reverse()
              .map((a, i) => (
                <div key={i} className="font-body text-xs text-ivory/50">
                  <span className="text-ivory/30">{new Date(a.ts).toLocaleString('en-IN')}</span> — {a.message}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
