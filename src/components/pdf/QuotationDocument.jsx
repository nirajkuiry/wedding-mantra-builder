import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { formatINR } from '../../lib/calculatePrice';

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: 'Helvetica', color: '#1a1a1a' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  logo: { width: 90, height: 49 },
  brandBlock: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brand: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#0B0B0B' },
  brandSub: { fontSize: 9, color: '#9C7A22', marginTop: 2 },
  docType: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#9C7A22', textAlign: 'right' },
  metaText: { fontSize: 9, color: '#555', textAlign: 'right', marginTop: 2 },
  hr: { borderBottomWidth: 1, borderBottomColor: '#D4AF37', marginVertical: 10 },
  sectionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 8, marginTop: 14, color: '#0B0B0B' },
  row: { flexDirection: 'row', marginBottom: 3 },
  label: { width: 110, color: '#666' },
  value: { flex: 1, color: '#111' },

  // Events & team schedule table
  table: { marginTop: 4, borderWidth: 1, borderColor: '#e5e5e5' },
  tHeadRow: { flexDirection: 'row', backgroundColor: '#0B0B0B' },
  tHeadCell: { color: '#D4AF37', fontSize: 9, fontFamily: 'Helvetica-Bold', padding: 6 },
  tRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#eee' },
  tCell: { fontSize: 9, padding: 6, color: '#222' },
  colDay: { flex: 1 },
  colDetail: { flex: 3.5 },

  // Package includes — clean bullet list instead of a dense grid table
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemBullet: { width: 10, fontSize: 9, color: '#D4AF37' },
  itemName: { flex: 1, fontSize: 9.5, color: '#222' },
  itemQty: { width: 34, fontSize: 9, color: '#888', textAlign: 'center' },
  itemPrice: { width: 80, fontSize: 9.5, color: '#111', textAlign: 'right', fontFamily: 'Helvetica-Bold' },

  totalsBox: { marginTop: 12, alignSelf: 'flex-end', width: 220 },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  totalsLabel: { color: '#555', fontSize: 9 },
  totalsValue: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#111' },
  grandRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#D4AF37' },
  grandLabel: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#0B0B0B' },
  grandValue: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#9C7A22' },

  terms: { marginTop: 18 },
  termItem: { fontSize: 8, color: '#555', marginBottom: 3, lineHeight: 1.4 },
  footer: { position: 'absolute', bottom: 24, left: 36, right: 36, textAlign: 'center', fontSize: 8, color: '#999' },
});

const TERMS = [
  '1. A 50% advance payment is required to confirm and lock the booking date; the remaining balance is due before final delivery.',
  '2. This quotation is valid for 15 days from the date of issue. Prices are subject to revision after this period.',
  '3. Travel, accommodation, and stay expenses for outstation events are charged separately unless stated otherwise.',
  '4. Any changes to event dates, duration, or scope after booking may affect the final price.',
  '5. Raw/unedited footage is not provided. Final edited deliverables follow the timeline agreed at booking.',
  '6. Cancellations made after advance payment are subject to the studio’s cancellation policy.',
];

export function QuotationDocument({ formData, priceResult, docType = 'Quotation', business }) {
  const { contact, occasion, weddingDate, days } = formData;
  const { lineItems, grandTotal, advance, remaining } = priceResult;
  const today = new Date().toLocaleDateString('en-IN');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.brandBlock}>
            <Image src="/assets/logo.png" style={styles.logo} />
            <View>
              <Text style={styles.brand}>{business.name}</Text>
              <Text style={styles.brandSub}>{business.instagram} · {business.phone}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.docType}>{docType}</Text>
            <Text style={styles.metaText}>Date: {today}</Text>
            <Text style={styles.metaText}>Ref: WMF-{Date.now().toString().slice(-6)}</Text>
          </View>
        </View>

        <View style={styles.hr} />

        <Text style={styles.sectionTitle}>Client Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{contact?.name || '-'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{contact?.phone || '-'}</Text>
        </View>
        {contact?.email ? (
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{contact.email}</Text>
          </View>
        ) : null}
        <View style={styles.row}>
          <Text style={styles.label}>Occasion</Text>
          <Text style={styles.value}>{occasion || '-'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Event Date</Text>
          <Text style={styles.value}>{weddingDate || 'To be confirmed'}</Text>
        </View>

        {days && days.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Events & Team Details</Text>
            <View style={styles.table}>
              <View style={styles.tHeadRow}>
                <Text style={[styles.tHeadCell, styles.colDay]}>Day</Text>
                <Text style={[styles.tHeadCell, styles.colDetail]}>Event Details</Text>
              </View>
              {days.map((d, i) => (
                <View style={styles.tRow} key={i}>
                  <Text style={[styles.tCell, styles.colDay]}>Day {i + 1}</Text>
                  <Text style={[styles.tCell, styles.colDetail]}>
                    {d.eventName || d.ceremony} — {d.venue} ({d.startTime}–{d.endTime}, {d.indoorOutdoor})
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Package & Products</Text>
        <View>
          {lineItems.map((li, i) => (
            <View style={styles.itemRow} key={i}>
              <Text style={styles.itemBullet}>•</Text>
              <Text style={styles.itemName}>{li.item}</Text>
              <Text style={styles.itemQty}>{li.qty ? `x${li.qty}` : ''}</Text>
              <Text style={styles.itemPrice}>{formatINR(li.total)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBox}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>50% Advance</Text>
            <Text style={styles.totalsValue}>{formatINR(advance)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Remaining Balance</Text>
            <Text style={styles.totalsValue}>{formatINR(remaining)}</Text>
          </View>
          <View style={styles.grandRow}>
            <Text style={styles.grandLabel}>Grand Total</Text>
            <Text style={styles.grandValue}>{formatINR(grandTotal)}</Text>
          </View>
        </View>

        <View style={styles.terms}>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
          {TERMS.map((t, i) => (
            <Text style={styles.termItem} key={i}>{t}</Text>
          ))}
        </View>

        <Text style={styles.footer}>
          {business.name} · {business.phone} · {business.website} · {business.instagram}
        </Text>
      </Page>
    </Document>
  );
}
