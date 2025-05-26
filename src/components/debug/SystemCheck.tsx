
import React from 'react';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SystemCheck = () => {
  const { getLocalizedUrl, currentLanguage } = useLanguageMCP();
  const { t, ready } = useTranslation('landing');
  const location = useLocation();

  const runTests = () => {
    console.log('=== SYSTEM CHECK START ===');
    console.log('Current route:', location.pathname);
    console.log('Current language:', currentLanguage);
    console.log('Translation ready:', ready);
    console.log('getLocalizedUrl function:', typeof getLocalizedUrl);
    
    // Test translation keys
    const testKeys = [
      'hero.cta_learn_more',
      'cta.button_login', 
      'cta.button_register',
      'hero.title',
      'hero.subtitle'
    ];
    
    console.log('=== TRANSLATION TESTS ===');
    testKeys.forEach(key => {
      const translation = t(key);
      console.log(`${key}:`, translation);
      if (translation === key) {
        console.error(`❌ Missing translation for key: ${key}`);
      }
    });
    
    // Test routing
    console.log('=== ROUTING TESTS ===');
    const testRoutes = ['/about', '/login', '/register', '/pre-register'];
    testRoutes.forEach(route => {
      const localizedUrl = getLocalizedUrl(route);
      console.log(`${route} -> ${localizedUrl}`);
    });
    
    console.log('=== SYSTEM CHECK END ===');
  };

  const testHardcodedNavigation = (path: string) => {
    console.log('Testing hardcoded navigation to:', path);
    window.location.href = path;
  };

  return (
    <Card className="m-4 border-2 border-red-500">
      <CardHeader>
        <CardTitle className="text-red-600">🔧 System Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Current Route:</strong> {location.pathname}
          </div>
          <div>
            <strong>Language:</strong> {currentLanguage}
          </div>
          <div>
            <strong>Translation Ready:</strong> {ready ? '✅' : '❌'}
          </div>
          <div>
            <strong>getLocalizedUrl Type:</strong> {typeof getLocalizedUrl}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Test Translation Keys:</h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div>hero.cta_learn_more: "{t('hero.cta_learn_more')}"</div>
            <div>cta.button_login: "{t('cta.button_login')}"</div>
            <div>cta.button_register: "{t('cta.button_register')}"</div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Test Routing:</h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div>/about → {getLocalizedUrl('/about')}</div>
            <div>/login → {getLocalizedUrl('/login')}</div>
            <div>/register → {getLocalizedUrl('/register')}</div>
          </div>
        </div>

        <div className="space-y-2">
          <Button onClick={runTests} variant="outline" className="w-full">
            🔍 Run Full Console Tests
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Test Buttons (MCP Routing):</h3>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="default">
              <Link to={getLocalizedUrl('/about')}>About (MCP)</Link>
            </Button>
            <Button asChild variant="default">
              <Link to={getLocalizedUrl('/login')}>Login (MCP)</Link>
            </Button>
            <Button asChild variant="default">
              <Link to={getLocalizedUrl('/register')}>Register (MCP)</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Test Buttons (Hardcoded):</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => testHardcodedNavigation('/de/about')}
              variant="outline"
            >
              About (Hardcoded)
            </Button>
            <Button 
              onClick={() => testHardcodedNavigation('/de/login')}
              variant="outline"
            >
              Login (Hardcoded)
            </Button>
            <Button 
              onClick={() => testHardcodedNavigation('/de/register')}
              variant="outline"
            >
              Register (Hardcoded)
            </Button>
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Debugging-Anweisungen:</strong><br/>
            1. Öffne die Browser DevTools (F12)<br/>
            2. Klicke "Run Full Console Tests"<br/>
            3. Prüfe die Console auf Fehler<br/>
            4. Teste beide Button-Varianten<br/>
            5. Inspiziere die Button-Elemente im DOM
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemCheck;
