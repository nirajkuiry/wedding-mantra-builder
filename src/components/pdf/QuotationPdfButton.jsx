import { PDFDownloadLink } from '@react-pdf/renderer';
import { FileText } from 'lucide-react';
import { QuotationDocument } from './QuotationDocument';

// This file statically imports @react-pdf/renderer, which is a large
// library. Consumers should import this component with React.lazy() so it
// loads in its own chunk only when the user reaches the final step —
// keeping the initial page bundle small and the app fast to open.
export default function QuotationPdfButton({ formData, priceResult, business, fileName, className }) {
  return (
    <PDFDownloadLink
      document={<QuotationDocument formData={formData} priceResult={priceResult} docType="Quotation" business={business} />}
      fileName={fileName}
      className={className}
    >
      {({ loading }) => (
        <>
          <FileText size={16} /> {loading ? 'Preparing…' : 'Download Quotation PDF'}
        </>
      )}
    </PDFDownloadLink>
  );
}
