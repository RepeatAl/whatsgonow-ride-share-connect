
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

interface LoginFormProps {
  onToggleMode?: () => void;
  showSignUp?: boolean;
}

const EnhancedLoginForm = ({ onToggleMode, showSignUp = true }: LoginFormProps) => {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const { signIn } = useOptimizedAuth();
  const { getLocalizedUrl } = useLanguageMCP();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<Date | null>(null);

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const isLockedOut = () => {
    return lockoutUntil && new Date() < lockoutUntil;
  };

  const getRemainingLockoutTime = () => {
    if (!lockoutUntil) return 0;
    return Math.max(0, Math.ceil((lockoutUntil.getTime() - new Date().getTime()) / 1000 / 60));
  };

  const handleFailedAttempt = () => {
    const newFailedAttempts = failedAttempts + 1;
    setFailedAttempts(newFailedAttempts);
    
    if (newFailedAttempts >= MAX_ATTEMPTS) {
      const lockoutTime = new Date(Date.now() + LOCKOUT_DURATION);
      setLockoutUntil(lockoutTime);
      setError(`Zu viele Fehlversuche. Account gesperrt für ${Math.ceil(LOCKOUT_DURATION / 1000 / 60)} Minuten.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLockedOut()) {
      const remaining = getRemainingLockoutTime();
      setError(`Account noch ${remaining} Minuten gesperrt. Bitte warten Sie.`);
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      console.log('🔐 EnhancedLoginForm: Starting login process for:', formData.email);

      // Direkt mit OptimizedAuth signIn
      await signIn(formData.email.trim(), formData.password);

      // Reset failed attempts on successful login
      setFailedAttempts(0);
      setLockoutUntil(null);

      console.log('✅ Login successful, navigation will be handled by OptimizedAuth redirect logic');

    } catch (err: any) {
      console.error('❌ Login failed:', err);
      
      if (err.message?.includes('Invalid login credentials')) {
        setError('E-Mail-Adresse oder Passwort ist falsch. Bitte überprüfen Sie Ihre Eingaben.');
        handleFailedAttempt();
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse. Schauen Sie in Ihr E-Mail-Postfach.');
      } else if (err.message?.includes('Too many requests')) {
        setError('Zu viele Anmeldeversuche. Bitte warten Sie einen Moment und versuchen Sie es erneut.');
      } else {
        setError(err.message || 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es später erneut.');
      }
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
              disabled={loading || isLockedOut()}
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
                disabled={loading || isLockedOut()}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || isLockedOut()}
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

          <Button 
            type="submit" 
            disabled={loading || !formData.email || !formData.password || isLockedOut()}
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
              onClick={() => navigate(getLocalizedUrl('/forgot-password'))}
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
