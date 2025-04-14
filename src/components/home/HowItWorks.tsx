import { Package, MapPin, Clock, CreditCard, ThumbsUp } from "lucide-react";
const features = [{
  title: "Create a Request",
  description: "Describe what you need to send, where it's going, and when it needs to arrive.",
  icon: <Package className="h-8 w-8 text-brand-purple" />
}, {
  title: "Match with a Driver",
  description: "Our AI matches your request with drivers already traveling your route.",
  icon: <MapPin className="h-8 w-8 text-brand-purple" />
}, {
  title: "Real-time Tracking",
  description: "Follow your item's journey in real-time from pickup to delivery.",
  icon: <Clock className="h-8 w-8 text-brand-purple bg-orange-500" />
}, {
  title: "Secure Payment",
  description: "Pay only when your item is delivered safely with our secure escrow system.",
  icon: <CreditCard className="h-8 w-8 text-brand-purple" />
}, {
  title: "Rate & Review",
  description: "Share your experience and help build our trusted community network.",
  icon: <ThumbsUp className="h-8 w-8 text-brand-purple" />
}];
const HowItWorks = () => {
  return <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How whatsgonow Works
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Simple, secure, and sustainable deliveries in 5 easy steps
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => <div key={index} className="flex flex-col bg-white p-8 rounded-lg shadow-sm">
                <div className="bg-brand-light rounded-lg w-14 h-14 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mt-2">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                <div className="mt-4 flex items-center">
                  <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-brand-purple bg-opacity-10 text-brand-purple font-semibold">
                    {index + 1}
                  </div>
                  <div className="ml-4 flex-1 h-0.5 bg-gray-200"></div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default HowItWorks;