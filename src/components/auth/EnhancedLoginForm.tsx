
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/lib/supabaseClient';

interface LoginFormProps {
  onToggleMode?: () => void;
  showSignUp?: boolean;
}

const EnhancedLoginForm = ({ onToggleMode, showSignUp = true }: LoginFormProps) => {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const { signIn } = useSimpleAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const checkUserExists = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, email, role, verified, is_suspended')
        .eq('email', email)
        .maybeSingle();
      
      return { user: data, error };
    } catch (err) {
      return { user: null, error: err };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDebugInfo(null);

    try {
      // Pre-flight check: Does user exist in our profiles table?
      const { user: existingUser, error: userCheckError } = await checkUserExists(formData.email);
      
      const debug = {
        email: formData.email,
        userExistsInProfiles: !!existingUser,
        userRole: existingUser?.role || 'not found',
        userVerified: existingUser?.verified || false,
        userSuspended: existingUser?.is_suspended || false,
        timestamp: new Date().toISOString()
      };

      console.log('🔍 Login Debug Info:', debug);
      setDebugInfo(debug);

      if (userCheckError) {
        throw new Error(`Datenbankfehler: ${userCheckError.message}`);
      }

      if (!existingUser) {
        throw new Error(`Kein Benutzer mit der E-Mail ${formData.email} gefunden. Bitte registrieren Sie sich zuerst.`);
      }

      if (existingUser.is_suspended) {
        throw new Error('Ihr Account ist gesperrt. Bitte kontaktieren Sie den Support.');
      }

      // Attempt Supabase Auth login
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password
      });

      if (authError) {
        console.error('🔥 Supabase Auth Error:', authError);
        
        // Provide specific error messages
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Ungültige Anmeldedaten. Bitte überprüfen Sie E-Mail und Passwort.');
        } else if (authError.message.includes('Email not confirmed')) {
          throw new Error('E-Mail-Adresse nicht bestätigt. Bitte prüfen Sie Ihr E-Mail-Postfach.');
        } else if (authError.message.includes('Too many requests')) {
          throw new Error('Zu viele Anmeldeversuche. Bitte warten Sie einen Moment.');
        } else {
          throw new Error(`Anmeldefehler: ${authError.message}`);
        }
      }

      if (!data.user) {
        throw new Error('Anmeldung fehlgeschlagen: Kein Benutzer zurückgegeben.');
      }

      console.log('✅ Login successful for:', formData.email);
      console.log('🎯 User role:', existingUser.role);

      // Redirect based on role
      switch (existingUser.role) {
        case 'admin':
        case 'super_admin':
          navigate('/admin/dashboard');
          break;
        case 'cm':
          navigate('/dashboard/cm');
          break;
        case 'driver':
          navigate('/dashboard/driver');
          break;
        case 'sender_private':
        case 'sender_business':
          navigate('/dashboard/sender');
          break;
        default:
          navigate('/dashboard');
      }

    } catch (err: any) {
      console.error('❌ Login failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          {t('auth:sign_in', 'Anmelden')}
        </CardTitle>
        <CardDescription className="text-center">
          {t('auth:sign_in_description', 'Melden Sie sich mit Ihren Zugangsdaten an')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              {t('auth:email', 'E-Mail-Adresse')} *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="ihre.email@beispiel.de"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {t('auth:password', 'Passwort')} *
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {debugInfo && (
            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                <div className="text-xs space-y-1">
                  <div>📧 E-Mail: {debugInfo.email}</div>
                  <div>👤 Benutzer gefunden: {debugInfo.userExistsInProfiles ? '✅' : '❌'}</div>
                  <div>🎭 Rolle: {debugInfo.userRole}</div>
                  <div>✅ Verifiziert: {debugInfo.userVerified ? '✅' : '❌'}</div>
                  <div>🚫 Gesperrt: {debugInfo.userSuspended ? '❌' : '✅'}</div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            disabled={loading || !formData.email || !formData.password}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('auth:signing_in', 'Anmelden...')}
              </>
            ) : (
              t('auth:sign_in', 'Anmelden')
            )}
          </Button>

          {showSignUp && onToggleMode && (
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={onToggleMode}
                disabled={loading}
                className="text-sm"
              >
                {t('auth:no_account', 'Noch kein Konto? Jetzt registrieren')}
              </Button>
            </div>
          )}

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={() => navigate('/forgot-password')}
              disabled={loading}
              className="text-sm"
            >
              {t('auth:forgot_password', 'Passwort vergessen?')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedLoginForm;
