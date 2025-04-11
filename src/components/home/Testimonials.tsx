
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "As a busy professional, I needed to send urgent documents across town. whatsgonow found me a driver who was already heading that way. Saved me time and money!",
    author: "Anna M.",
    role: "Marketing Executive",
    stars: 5,
    imageUrl: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    quote: "I drive to university daily with lots of empty space in my car. Now I earn extra money just by taking packages along my route. It's genius!",
    author: "Markus T.",
    role: "Student & Driver",
    stars: 5,
    imageUrl: "https://randomuser.me/api/portraits/men/46.jpg"
  },
  {
    quote: "Our small bakery needed flexible delivery options without hiring a full-time driver. whatsgonow connected us with people already on the road. Game changer!",
    author: "Sophie K.",
    role: "Small Business Owner",
    stars: 4,
    imageUrl: "https://randomuser.me/api/portraits/women/65.jpg"
  }
];

const Testimonials = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Real stories from our growing community
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative rounded-lg bg-white p-8 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img src={testimonial.imageUrl} alt={testimonial.author} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.stars ? "fill-current" : "stroke-current text-gray-300"}`}
                  />
                ))}
              </div>
              <blockquote className="text-gray-600 italic">"{testimonial.quote}"</blockquote>
              <div className="absolute top-4 right-4 text-brand-purple opacity-10">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
