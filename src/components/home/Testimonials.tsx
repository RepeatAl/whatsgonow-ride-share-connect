
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const Testimonials = () => {
  const { t, i18n } = useTranslation();

  const testimonials = [
    {
      name: t('landing.testimonials.testimonial1.name'),
      role: t('landing.testimonials.testimonial1.role'),
      text: t('landing.testimonials.testimonial1.text'),
      rating: 5,
      image: "/lovable-uploads/1310b47b-6ab3-443c-88cc-2b6fe8b77f0c.png"
    },
    {
      name: t('landing.testimonials.testimonial2.name'),
      role: t('landing.testimonials.testimonial2.role'),
      text: t('landing.testimonials.testimonial2.text'),
      rating: 4,
      image: "/lovable-uploads/38c76c60-9ce4-40c9-b580-8da351655c67.png"
    },
    {
      name: t('landing.testimonials.testimonial3.name'),
      role: t('landing.testimonials.testimonial3.role'),
      text: t('landing.testimonials.testimonial3.text'),
      rating: 5,
      image: "/lovable-uploads/25ba838f-17f9-4e58-9599-0dc83993fe74.png"
    }
  ];

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold">{t('landing.testimonials.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
          {t('landing.testimonials.description')}
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  name: string;
  role: string;
  text: string;
  rating: number;
  image: string;
}

const TestimonialCard = ({ name, role, text, rating, image }: TestimonialCardProps) => {
  return (
    <Card className="border-none shadow-md h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon 
              key={i} 
              className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
        </div>
        <p className="text-gray-600 dark:text-gray-300 italic">"{text}"</p>
      </CardContent>
      <CardFooter className="flex items-center gap-4 border-t pt-4">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Testimonials;
