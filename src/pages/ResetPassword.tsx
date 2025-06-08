
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Layout from '@/components/Layout';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const { t } = useTranslation(['auth', 'common']);
  const { getLocalizedUrl } = useLanguageMCP();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // FIXED: Get tokens from URL params for password reset
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const type = searchParams.get('type');

  useEffect(() => {
    // FIXED: Verify this is a password reset session
    if (type !== 'recovery' || !accessToken) {
      setError('Ungültiger oder fehlender Passwort-Reset-Link.');
      return;
    }

    // FIXED: Set the session with the tokens from the URL
    const setSession = async () => {
      try {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        });
        
        if (error) {
          console.error('Session setup error:', error);
          setError('Ungültiger Reset-Link. Bitte fordern Sie einen neuen an.');
        }
      } catch (err) {
        console.error('Session setup failed:', err);
        setError('Fehler beim Verarbeiten des Reset-Links.');
      }
    };

    setSession();
  }, [accessToken, refreshToken, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // FIXED: Password validation
    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth:passwords_not_match', 'Die Passwörter stimmen nicht überein.'));
      return;
    }

    setIsLoading(true);

    try {
      console.debug('🔐 Resetting password...');
      
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('❌ Password reset failed:', error);
        setError('Das Zurücksetzen des Passworts ist fehlgeschlagen. Bitte versuchen Sie es erneut.');
        return;
      }

      console.log('✅ Password reset successful:', data);
      
      // Show success toast
      toast({
        title: "Passwort erfolgreich zurückgesetzt!",
        description: "Sie können sich jetzt mit Ihrem neuen Passwort anmelden.",
        variant: "default",
      });
      
      setSuccess(true);
      
      // FIXED: Redirect to login page after short delay
      setTimeout(() => {
        navigate(getLocalizedUrl('/login'), { replace: true });
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ Password reset error:', error);
      setError('Das Zurücksetzen des Passworts ist fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate(getLocalizedUrl('/login'), { replace: true });
  };

  if (isLoading) {
    return (
      <Layout pageType="public">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md space-y-8">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">{t('auth:reset_password', 'Passwort zurücksetzen')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                <p className="mt-4">{t('auth:resetting_password', 'Passwort wird zurückgesetzt...')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (error && (!accessToken || type !== 'recovery')) {
    return (
      <Layout pageType="public">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md space-y-8">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">{t('auth:reset_password', 'Passwort zurücksetzen')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
              <div className="mt-4 text-center">
                <Button variant="link" onClick={handleBackToLogin}>
                  {t('auth:back_to_login', 'Zurück zum Login')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (success) {
    return (
      <Layout pageType="public">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md space-y-8">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">{t('auth:reset_password', 'Passwort zurücksetzen')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  {t('auth:password_reset_success', 'Passwort erfolgreich zurückgesetzt!')}
                </h3>
                <p className="mt-1 text-sm text-gray-700">
                  {t('auth:you_can_now_login', 'Sie werden zur Anmeldung weitergeleitet...')}
                </p>
                <div className="mt-6">
                  <Button onClick={handleBackToLogin}>
                    {t('auth:back_to_login', 'Zurück zum Login')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageType="public">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md space-y-8">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{t('auth:reset_password', 'Passwort zurücksetzen')}</CardTitle>
            <CardDescription className="text-center">
              {t('auth:enter_new_password', 'Bitte geben Sie Ihr neues Passwort ein.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="password">{t('auth:new_password', 'Neues Passwort')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirmPassword">{t('auth:confirm_new_password', 'Neues Passwort bestätigen')}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('auth:resetting_password', 'Passwort wird zurückgesetzt...')}
                    </>
                  ) : (
                    t('auth:reset_password', 'Passwort zurücksetzen')
                  )}
                </Button>
              </div>
            </form>
            <div className="text-center">
              <Button variant="link" onClick={handleBackToLogin}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('auth:back_to_login', 'Zurück zum Login')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ResetPassword;
