import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { registerSchema, type RegisterFormData } from '@/lib/validators/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RegisterForm = () => {
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
    console.log('🔍 Registration form submitted', { 
      email: data.email, 
      name: data.name, 
      role: data.role 
    });
    
    setError('');
    setIsLoading(true);
    setIsSuccess(false);
    
    try {
      console.log('🚀 Attempting sign up');
      await signUp(data.email, data.password, {
        name: data.name,
        role: data.role,
        company_name: data.company_name || undefined
      });
      
      console.log('✅ Sign up successful');
      setIsSuccess(true);
    } catch (err) {
      console.error('❌ Registration error:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Registrierung erfolgreich</CardTitle>
          <CardDescription>
            Dein Konto wurde erstellt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertDescription>
              Es kann vorkommen, dass keine Bestätigungs-E-Mail versendet wird, da wir uns in der Testphase befinden. 
              Du kannst dich trotzdem mit deinen Anmeldedaten einloggen.
            </AlertDescription>
          </Alert>
          <Button 
            asChild 
            className="w-full"
          >
            <Link to="/login">Zum Login</Link>
          </Button>
        </CardContent>
      </Card>
    );
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Max Mustermann" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="max@beispiel.de" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passwort</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rolle</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wähle deine Rolle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sender_private">Privater Versender</SelectItem>
                      <SelectItem value="sender_business">Geschäftlicher Versender</SelectItem>
                      <SelectItem value="driver">Fahrer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedRole === 'sender_business' && (
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firmenname</FormLabel>
                    <FormControl>
                      <Input placeholder="Firma GmbH" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Wird verarbeitet..." : "Registrieren"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" asChild className="text-sm">
          <Link to="/login">Schon registriert? Login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
