
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { registerSchema, type RegisterFormData } from '@/components/auth/register/RegisterFormSchema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { RegisterFormFields } from '@/components/auth/register/RegisterFormFields';
import { SuccessMessage } from '@/components/auth/register/SuccessMessage';
import { ErrorDisplay } from '@/components/auth/register/ErrorDisplay';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { signUp } = useAuth();
  
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      role: 'sender_private',
      company_name: ''
    }
  });

  const { watch } = form;
  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    if (import.meta.env.DEV) {
      console.log('🧪 Registration form data:', { 
        email: data.email, 
        name: data.name, 
        role: data.role,
        company_name: data.company_name
      });
    }
    
    setError('');
    setIsLoading(true);
    setIsSuccess(false);
    
    try {
      if (import.meta.env.DEV) {
        console.log('🚀 Attempting sign up with:', { 
          email: data.email, 
          name: data.name,
          role: data.role,
          company_name: data.company_name || undefined
        });
      }

      await signUp(data.email, data.password, {
        name: data.name,
        role: data.role,
        company_name: data.company_name || undefined
      });
      
      if (import.meta.env.DEV) {
        console.log('✅ Sign up successful');
      }
      
      setIsSuccess(true);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('❌ Registration error:', err);
      }
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return <SuccessMessage />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Registrieren</CardTitle>
        <CardDescription>
          Erstelle ein neues Konto bei Whatsgonow
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <RegisterFormFields control={form.control} selectedRole={selectedRole} />
            <ErrorDisplay error={error} />
            <Button type="submit" className="w-full" disabled={isLoading} variant="brand">
              {isLoading ? "Wird verarbeitet..." : "Registrieren"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          variant="link" 
          onClick={onSwitchToLogin} 
          className="text-sm"
        >
          Schon registriert? Login
        </Button>
      </CardFooter>
    </Card>
  );
};
