
import { StyleSheet } from '@react-pdf/renderer';

// Define styles for PDF
export const invoiceStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '1px solid #ccc',
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    width: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#374151',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
    color: '#4B5563',
  },
  infoBox: {
    border: '1px solid #e5e7eb',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4B5563',
  },
  addressBox: {
    marginBottom: 20,
  },
  invoiceInfoBox: {
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  invoiceInfoColumn: {
    width: '48%',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
  },
  tableHeaderCell: {
    backgroundColor: '#f3f4f6',
    padding: 5,
    fontWeight: 'bold',
    flex: 1,
    color: '#374151',
    textAlign: 'center',
  },
  tableCell: {
    padding: 5,
    flex: 1,
    color: '#4B5563',
    textAlign: 'center',
  },
  tableCellLeft: {
    padding: 5,
    flex: 2,
    color: '#4B5563',
    textAlign: 'left',
  },
  tableCellRight: {
    padding: 5,
    flex: 1,
    color: '#4B5563',
    textAlign: 'right',
  },
  summaryBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginBottom: 20,
  },
  summaryColumn: {
    width: '40%',
  },
  summaryRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
  },
  summaryTotal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    paddingTop: 5,
  },
  note: {
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    color: '#4B5563',
  },
  footer: {
    marginTop: 20,
    borderTop: '1px solid #ccc',
    paddingTop: 10,
    fontSize: 10,
    color: '#6B7280',
  },
  bankDetails: {
    marginTop: 20,
    marginBottom: 20,
  },
});
