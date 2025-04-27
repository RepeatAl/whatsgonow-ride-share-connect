
import { toast } from "sonner";
import { MAX_FILE_SIZE, ALLOWED_TYPES } from "./constants";

export const validateFile = (file: File): boolean => {
  if (file.size > MAX_FILE_SIZE) {
    toast.error(`${file.name} ist größer als 2 MB`);
    return false;
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    toast.error(`${file.name} ist kein unterstütztes Format`);
    return false;
  }
  return true;
};
