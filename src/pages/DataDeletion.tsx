import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
  confirmDelete: z.boolean().refine(val => val === true, {
    message: "You must confirm that you understand the deletion process.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const DataDeletion = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Deletion request submitted:", data);
      setIsSuccess(true);
      toast({
        title: "Request submitted",
        description: "Your data deletion request has been received. We will process it within 30 days.",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Data Deletion Request</h1>
          <p className="text-gray-600 mb-4">
            In accordance with GDPR, you have the right to request deletion of your personal data.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Request Submitted Successfully</h2>
            <p className="text-gray-600 mb-4">
              We have received your data deletion request. Our team will process your request within 30 days 
              and contact you via email with updates.
            </p>
            <p className="text-gray-600 mb-4">
              Reference ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </p>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        ) : (
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
                          I understand that this action cannot be undone and all my data will be permanently deleted
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
                    After submitting this request, we will process your data deletion within 30 days as 
                    required by GDPR regulations.
                  </p>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DataDeletion;
