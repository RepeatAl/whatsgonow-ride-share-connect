
import { Shield, TrendingUp, Leaf, Users } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      title: "Full Security & Insurance",
      description: "Every transaction and transport is verified, tracked, and fully insured for peace of mind.",
      icon: <Shield className="h-8 w-8 text-brand-blue" />
    },
    {
      title: "Monetize Your Regular Trips",
      description: "Turn your daily commute or planned journey into an opportunity to earn extra income.",
      icon: <TrendingUp className="h-8 w-8 text-brand-blue" />
    },
    {
      title: "Eco-friendly Solution",
      description: "Reduce carbon emissions by utilizing existing transportation rather than dedicated delivery vehicles.",
      icon: <Leaf className="h-8 w-8 text-brand-blue" />
    },
    {
      title: "Community-based Network",
      description: "Join our trusted network of community managers, drivers, and customers for better local logistics.",
      icon: <Users className="h-8 w-8 text-brand-blue" />
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Why Choose whatsgonow
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Benefits for everyone in our logistics ecosystem
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-purple to-brand-blue opacity-10 rounded-lg blur"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-brand-light mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{benefit.title}</h3>
                  <p className="mt-2 text-base text-gray-500">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
