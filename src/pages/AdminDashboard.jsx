import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Download, Settings as SettingsIcon } from 'lucide-react';
import { useLeadsStore, PIPELINE_STATUSES, DELIVERY_STATUSES } from '../store/useLeadsStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { StatCard } from '../components/admin/StatCard';
import { RevenueChart } from '../components/admin/RevenueChart';
import { PipelineBoard } from '../components/admin/PipelineBoard';
import { MonthCalendar } from '../components/admin/MonthCalendar';
import { ActivityFeed } from '../components/admin/ActivityFeed';
import { LeadDetailPanel } from '../components/admin/LeadDetailPanel';
import { formatINR } from '../lib/calculatePrice';
import {
  totalQuotedValue,
  totalPendingPayments,
  monthlyRevenue,
  upcomingEvents,
  groupByStatus,
  recentActivity,
  matchesSearch,
} from '../lib/reports';
import { exportLeadsCsv } from '../lib/exportCsv';

export default function AdminDashboard() {
  const leads = useLeadsStore((s) => s.leads);
  const updateLeadStatus = useLeadsStore((s) => s.updateLeadStatus);
  const updateLeadFields = useLeadsStore((s) => s.updateLeadFields);
  const business = useSettingsStore((s) => s.business);

  const [query, setQuery] = useState('');
  const [openLeadId, setOpenLeadId] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filteredLeads = useMemo(() => leads.filter((l) => matchesSearch(l, query)), [leads, query]);
  const groups = useMemo(() => groupByStatus(filteredLeads, PIPELINE_STATUSES), [filteredLeads]);
  const revenueData = useMemo(() => monthlyRevenue(leads), [leads]);
  const upcoming = useMemo(() => upcomingEvents(leads), [leads]);
  const activity = useMemo(() => recentActivity(leads), [leads]);
  const openLead = leads.find((l) => l.id === openLeadId) || null;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-ink/80 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2 font-body text-sm text-ivory/60 hover:text-gold">
            <ArrowLeft size={16} /> Back
          </Link>

          <div className="relative w-full max-w-sm">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search leads… (press /)"
              className="field-input !py-2 pl-9 text-sm"
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={() => exportLeadsCsv(filteredLeads)} className="btn-ghost !px-3 !py-2 text-xs">
              <Download size={13} /> Export CSV
            </button>
            <Link to="/settings" className="btn-ghost !px-3 !py-2 text-xs">
              <SettingsIcon size={13} />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div>
          <h1 className="font-display text-3xl text-ivory">{business.name} — Admin</h1>
          <p className="font-body text-sm text-ivory/50">
            {leads.length} lead{leads.length === 1 ? '' : 's'} on file, saved in this browser.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Leads" value={leads.length} />
          <StatCard label="Upcoming Shoots" value={upcoming.length} />
          <StatCard label="Total Quoted Value" value={formatINR(totalQuotedValue(leads))} />
          <StatCard label="Pending Payments" value={formatINR(totalPendingPayments(leads))} sublabel="Across active leads" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <RevenueChart data={revenueData} />
          <MonthCalendar events={upcoming} />
        </div>

        <div>
          <h2 className="mb-3 font-display text-2xl text-ivory">Lead Pipeline</h2>
          <PipelineBoard statuses={PIPELINE_STATUSES} groups={groups} onOpenLead={(lead) => setOpenLeadId(lead.id)} />
        </div>

        <ActivityFeed items={activity} />
      </div>

      <LeadDetailPanel
        lead={openLead}
        statuses={PIPELINE_STATUSES}
        deliveryStatuses={DELIVERY_STATUSES}
        onClose={() => setOpenLeadId(null)}
        onUpdateStatus={updateLeadStatus}
        onUpdateFields={updateLeadFields}
      />
    </div>
  );
}
