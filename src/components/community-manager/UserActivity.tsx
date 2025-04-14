
import ActivityTable from "./ActivityTable";

interface UserActivityProps {
  region: string;
}

const UserActivity = ({ region }: UserActivityProps) => {
  return <ActivityTable region={region} />;
};

export default UserActivity;
