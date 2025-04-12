
import { useState, useEffect } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

const CONSENT_STORAGE_KEY = "whatsgonow-cookie-consent";

type CookieSettings = {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
};

const CookieConsent = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [settings, setSettings] = useState<CookieSettings>({
    necessary: true, // Always required
    preferences: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if consent has been given before
    const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!storedConsent) {
      setShowBanner(true);
    } else {
      try {
        setSettings(JSON.parse(storedConsent));
      } catch (e) {
        // If stored consent is invalid, show banner again
        setShowBanner(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
    };
    setSettings(allAccepted);
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(settings));
    setShowBanner(false);
  };

  const handleSettingChange = (settingName: keyof CookieSettings) => {
    if (settingName === "necessary") return; // Cannot change necessary cookies
    
    setSettings((prev) => ({
      ...prev,
      [settingName]: !prev[settingName],
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 py-4 md:px-6 md:py-6 bg-white border-t shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold">Cookie Settings</h2>
          <button 
            onClick={() => setShowBanner(false)} 
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close cookie consent banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <p className="mb-4 text-gray-600">
          We use cookies to enhance your browsing experience, serve personalized ads or content, and 
          analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
        </p>
        
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="mb-4">
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center text-gray-700"
              >
                {isOpen ? "Hide Cookie Settings" : "Customize Settings"}
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            <div className="space-y-4 border-t pt-4 mb-4">
              <div className="flex items-start gap-3">
                <Checkbox id="necessary" checked disabled />
                <div>
                  <label 
                    htmlFor="necessary" 
                    className="font-medium block mb-1 cursor-not-allowed"
                  >
                    Necessary Cookies
                  </label>
                  <p className="text-gray-600 text-sm">
                    These cookies are essential for the website to function properly and cannot be disabled.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="preferences" 
                  checked={settings.preferences}
                  onCheckedChange={() => handleSettingChange("preferences")} 
                />
                <div>
                  <label 
                    htmlFor="preferences" 
                    className="font-medium block mb-1 cursor-pointer"
                  >
                    Preference Cookies
                  </label>
                  <p className="text-gray-600 text-sm">
                    These cookies allow the website to remember choices you have made in the past.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="analytics" 
                  checked={settings.analytics}
                  onCheckedChange={() => handleSettingChange("analytics")} 
                />
                <div>
                  <label 
                    htmlFor="analytics" 
                    className="font-medium block mb-1 cursor-pointer"
                  >
                    Analytics Cookies
                  </label>
                  <p className="text-gray-600 text-sm">
                    These cookies collect information about how you use the website, which pages you visited and which links you clicked on.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="marketing" 
                  checked={settings.marketing}
                  onCheckedChange={() => handleSettingChange("marketing")} 
                />
                <div>
                  <label 
                    htmlFor="marketing" 
                    className="font-medium block mb-1 cursor-pointer"
                  >
                    Marketing Cookies
                  </label>
                  <p className="text-gray-600 text-sm">
                    These cookies track your online activity to help advertisers deliver more relevant advertising.
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="text-sm text-gray-600">
            For more details, please read our{" "}
            <Link to="/privacy-policy" className="text-brand-primary underline">
              Privacy Policy
            </Link>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleAcceptSelected}
            >
              Accept Selected
            </Button>
            <Button 
              variant="brand" 
              onClick={handleAcceptAll}
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
