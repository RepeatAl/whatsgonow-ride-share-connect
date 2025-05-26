
import { toast } from "sonner";
import { MAX_VIDEO_FILE_SIZE, ALLOWED_VIDEO_TYPES } from "./videoConstants";

export const validateVideoFile = (file: File): boolean => {
  if (file.size > MAX_VIDEO_FILE_SIZE) {
    toast.error(`${file.name} ist größer als 50 MB`);
    return false;
  }
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    toast.error(`${file.name} ist kein unterstütztes Video-Format`);
    return false;
  }
  return true;
};
