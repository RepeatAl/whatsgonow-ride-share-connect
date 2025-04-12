
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  userId: z.string().min(1, {
    message: "User ID is required.",
  }),
  reason: z.string().min(10, {
    message: "Please provide more detail about your request (min 10 characters).",
  }),
  confirmDelete: z.boolean().refine((val) => val === true, {
    message: "You must confirm that you understand the deletion process.",
  }),
});

export type FormValues = z.infer<typeof formSchema>;

interface DataDeletionFormProps {
  onSubmitSuccess: (data: FormValues) => void;
}

const DataDeletionForm = ({ onSubmitSuccess }: DataDeletionFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      userId: "",
      reason: "",
      confirmDelete: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Deletion request submitted:", data);
      toast({
        title: "Request submitted",
        description:
          "Your data deletion request has been received. We will process it within 30 days.",
      });
      onSubmitSuccess(data);
    } catch (error) {
      toast({
        title: "Submission failed",
        description:
          "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} />
                </FormControl>
                <FormDescription>
                  The email address associated with your account.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID</FormLabel>
                <FormControl>
                  <Input placeholder="Your user ID" {...field} />
                </FormControl>
                <FormDescription>
                  You can find your User ID in your profile settings.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason for Deletion (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please explain why you're requesting data deletion"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This helps us improve our services.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmDelete"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I understand that this action cannot be undone and all my
                    data will be permanently deleted
                  </FormLabel>
                  <FormDescription>
                    This includes your profile, orders, messages, and ratings.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              variant="brand"
            >
              {isSubmitting ? "Processing..." : "Submit Deletion Request"}
            </Button>
            <p className="text-xs text-gray-500 mt-4 text-center">
              After submitting this request, we will process your data deletion
              within 30 days as required by GDPR regulations.
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DataDeletionForm;
