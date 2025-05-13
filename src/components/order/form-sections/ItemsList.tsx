
// Diese Datei wird durch die neue refaktorierte Version ersetzt und importiert jetzt einfach
// die neue ItemList-Komponente für die Abwärtskompatibilität
import { ItemList } from "./ItemDetailsSection/ItemList";
import { ItemDetails } from "./ItemDetailsSection/types";

interface ItemsListProps {
  items: ItemDetails[];
  onRemoveItem: (index: number) => void;
}

export const ItemsList: React.FC<ItemsListProps> = ({ items, onRemoveItem }) => {
  return <ItemList items={items} onRemoveItem={onRemoveItem} />;
};
