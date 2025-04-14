
interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="p-4 text-center text-muted-foreground">
      {message}
    </div>
  );
};

export default EmptyState;
