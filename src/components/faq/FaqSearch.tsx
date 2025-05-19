
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface FaqSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const FaqSearch = ({ searchQuery, setSearchQuery }: FaqSearchProps) => {
  const { t } = useTranslation('faq');
  
  return (
    <div className="relative mb-8">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
      <Input
        type="search"
        placeholder={t('search.placeholder')}
        className="pl-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default FaqSearch;
