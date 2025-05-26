
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FaqSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const FaqSearch = ({ searchQuery, setSearchQuery }: FaqSearchProps) => {
  const { t } = useTranslation('faq');

  return (
    <div className="relative max-w-md mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={t('search.placeholder', 'Durchsuche FAQs...')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 pr-4 py-2 w-full border-2 border-gray-200 focus:border-brand-orange"
      />
    </div>
  );
};

export default FaqSearch;
