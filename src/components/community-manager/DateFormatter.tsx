
interface DateFormatterProps {
  dateString: string;
}

const DateFormatter = ({ dateString }: DateFormatterProps) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('de-DE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  
  return <span>{formattedDate}</span>;
};

export default DateFormatter;
