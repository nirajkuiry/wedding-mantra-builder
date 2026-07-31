import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { leadDisplayName, leadServiceLabel } from '../../lib/reports';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function MonthCalendar({ events }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState(null);

  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const arr = [];
    for (let i = 0; i < startOffset; i += 1) arr.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) arr.push(new Date(year, month, d));
    return arr;
  }, [cursor]);

  const eventsByDay = (day) => (day ? events.filter((e) => sameDay(e.date, day)) : []);
  const selectedEvents = selectedDate ? eventsByDay(selectedDate) : [];
  const today = new Date();

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-display text-lg text-ivory">
          {cursor.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
            className="rounded-lg border border-white/10 p-1.5 text-ivory/50 hover:border-gold/40 hover:text-gold"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
            className="rounded-lg border border-white/10 p-1.5 text-ivory/50 hover:border-gold/40 hover:text-gold"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 font-body text-[10px] uppercase tracking-wide text-ivory/30">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1 text-center">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          const dayEvents = eventsByDay(day);
          const isToday = day && sameDay(day, today);
          const isSelected = day && selectedDate && sameDay(day, selectedDate);
          return (
            <button
              key={i}
              type="button"
              disabled={!day}
              onClick={() => setSelectedDate(day)}
              className={clsx(
                'aspect-square rounded-lg border text-left text-xs transition',
                !day && 'border-transparent',
                day && 'border-white/5 p-1.5 hover:border-gold/30',
                isToday && 'border-gold/40',
                isSelected && 'border-gold bg-gold/10'
              )}
            >
              {day && (
                <>
                  <div className={clsx('font-body', isToday ? 'text-gold' : 'text-ivory/60')}>{day.getDate()}</div>
                  {dayEvents.length > 0 && (
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-gold" title={`${dayEvents.length} event(s)`} />
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="font-body text-xs uppercase tracking-wide text-ivory/40">
            {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          {selectedEvents.length ? (
            <ul className="mt-2 space-y-1">
              {selectedEvents.map((e) => (
                <li key={e.lead.id} className="font-body text-sm text-ivory/70">
                  {leadDisplayName(e.lead)} — {leadServiceLabel(e.lead)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 font-body text-xs text-ivory/30">No shoots scheduled.</p>
          )}
        </div>
      )}
    </div>
  );
}
