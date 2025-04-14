
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

interface RateUserProps {
  orderId: string;
  toUser: string;
  fromUser: string;
  role: "driver" | "sender";
  onRatingComplete?: () => void;
}

interface RatingFormValues {
  score: number;
  comment: string;
}

export const RateUser = ({
  orderId,
  toUser,
  fromUser,
  role,
  onRatingComplete,
}: RateUserProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(null);

  const form = useForm<RatingFormValues>({
    defaultValues: {
      score: 0,
      comment: "",
    },
  });

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
    form.setValue("score", starValue);
  };

  const onSubmit = async (data: RatingFormValues) => {
    if (rating === 0) {
      toast({
        title: "Bewertung erforderlich",
        description: "Bitte wähle mindestens einen Stern aus.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert rating into Supabase
      const { error } = await supabase.from("ratings").insert({
        order_id: orderId,
        to_user: toUser,
        from_user: fromUser,
        score: rating,
        comment: data.comment || null,
      });

      if (error) throw error;

      toast({
        title: "Vielen Dank für deine Bewertung!",
        description: "Deine Bewertung wurde erfolgreich gespeichert.",
      });

      // Call the onRatingComplete callback to hide the component
      if (onRatingComplete) {
        onRatingComplete();
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Fehler",
        description: "Deine Bewertung konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleText = role === "driver" ? "Fahrer" : "Sender";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-4">
        Bewerte den {roleText} für diesen Auftrag
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-6">
            <FormLabel className="block mb-2">Sternebewertung</FormLabel>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(null)}
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hover !== null ? hover : rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kommentar (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Teile deine Erfahrungen mit..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-brand-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Wird gesendet..." : "Bewertung abschicken"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
