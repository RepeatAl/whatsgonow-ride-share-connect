
import { Link } from "react-router-dom";
import { ArrowRight, Package, Car, UserCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const userTypes = [
  {
    title: "For Package Senders",
    description: "Need to send something quickly, affordably, and securely? Find drivers already heading to your destination.",
    icon: <Package className="h-8 w-8 text-white" />,
    color: "from-brand-purple to-brand-blue",
    link: "/find-transport",
    linkText: "Send a Package"
  },
  {
    title: "For Drivers",
    description: "Turn empty space in your vehicle into extra income while you travel routes you're already taking.",
    icon: <Car className="h-8 w-8 text-white" />,
    color: "from-brand-blue to-cyan-500",
    link: "/offer-transport",
    linkText: "Become a Driver"
  },
  {
    title: "For Small Businesses",
    description: "Get flexible, same-day logistics without investing in your own delivery infrastructure.",
    icon: <UserCheck className="h-8 w-8 text-white" />,
    color: "from-cyan-500 to-emerald-500",
    link: "/business",
    linkText: "Business Solutions"
  },
  {
    title: "For Community Managers",
    description: "Become a local trust anchor, grow the whatsgonow community, and earn through referrals.",
    icon: <Users className="h-8 w-8 text-white" />,
    color: "from-emerald-500 to-brand-purple",
    link: "/community-managers",
    linkText: "Join as Manager"
  }
];

const UserGroups = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Who Can Use whatsgonow?
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            A platform for everyone in the logistics ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {userTypes.map((user, index) => (
            <div key={index} className="flex flex-col rounded-lg overflow-hidden shadow-sm">
              <div className={`p-6 bg-gradient-to-r ${user.color}`}>
                <div className="h-14 w-14 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-4">
                  {user.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{user.title}</h3>
              </div>
              <div className="p-6 bg-white flex-grow">
                <p className="text-gray-600">{user.description}</p>
                <div className="mt-6">
                  <Link to={user.link}>
                    <Button variant="outline" className="w-full">
                      {user.linkText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserGroups;
