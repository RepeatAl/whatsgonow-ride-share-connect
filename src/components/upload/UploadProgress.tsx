
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  current: number;
  total: number;
  progress: number;
}

export function UploadProgress({ current, total, progress }: UploadProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{current}/{total} Fotos hochgeladen</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
}
