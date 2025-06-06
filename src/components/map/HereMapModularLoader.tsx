
import React, { useEffect, useRef, useState } from 'react';

interface ModularLoaderState {
  core: boolean;
  service: boolean;
  ui: boolean;
  mapevents: boolean;
  css: boolean;
}

// HERE Maps modular loading with individual scripts
const HERE_MODULES = [
  {
    id: 'core',
    url: 'https://js.api.here.com/v3/3.1/mapsjs-core.js',
    type: 'script'
  },
  {
    id: 'service', 
    url: 'https://js.api.here.com/v3/3.1/mapsjs-service.js',
    type: 'script'
  },
  {
    id: 'ui',
    url: 'https://js.api.here.com/v3/3.1/mapsjs-ui.js', 
    type: 'script'
  },
  {
    id: 'mapevents',
    url: 'https://js.api.here.com/v3/3.1/mapsjs-mapevents.js',
    type: 'script'
  },
  {
    id: 'css',
    url: 'https://js.api.here.com/v3/3.1/mapsjs-ui.css',
    type: 'link'
  }
];

interface HereMapModularLoaderProps {
  onLoad: () => void;
  onError: (error: string) => void;
}

const HereMapModularLoader: React.FC<HereMapModularLoaderProps> = ({ onLoad, onError }) => {
  const [loadState, setLoadState] = useState<ModularLoaderState>({
    core: false,
    service: false,
    ui: false,
    mapevents: false,
    css: false
  });
  
  const loadingRef = useRef(false);

  useEffect(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    console.log('[HERE Maps Modular] Starting modular loading...');

    const loadModule = (module: typeof HERE_MODULES[0]): Promise<void> => {
      return new Promise((resolve, reject) => {
        const existing = module.type === 'script' 
          ? document.querySelector(`script[src="${module.url}"]`)
          : document.querySelector(`link[href="${module.url}"]`);
          
        if (existing) {
          console.log(`[HERE Maps Modular] ${module.id} already loaded`);
          resolve();
          return;
        }

        if (module.type === 'script') {
          const script = document.createElement('script');
          script.src = module.url;
          script.async = true;
          script.crossOrigin = 'anonymous';
          
          script.onload = () => {
            console.log(`[HERE Maps Modular] ✅ ${module.id} loaded`);
            resolve();
          };
          
          script.onerror = () => {
            console.error(`[HERE Maps Modular] ❌ ${module.id} failed`);
            reject(new Error(`Failed to load ${module.id}`));
          };
          
          document.head.appendChild(script);
        } else {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = module.url;
          link.crossOrigin = 'anonymous';
          
          link.onload = () => {
            console.log(`[HERE Maps Modular] ✅ ${module.id} CSS loaded`);
            resolve();
          };
          
          link.onerror = () => {
            console.error(`[HERE Maps Modular] ❌ ${module.id} CSS failed`);
            reject(new Error(`Failed to load ${module.id} CSS`));
          };
          
          document.head.appendChild(link);
        }
      });
    };

    const loadAllModules = async () => {
      try {
        // Load core first (required for everything else)
        await loadModule(HERE_MODULES[0]);
        setLoadState(prev => ({ ...prev, core: true }));

        // Load service (required for platform)
        await loadModule(HERE_MODULES[1]);
        setLoadState(prev => ({ ...prev, service: true }));

        // Load UI and mapevents in parallel
        await Promise.all([
          loadModule(HERE_MODULES[2]).then(() => setLoadState(prev => ({ ...prev, ui: true }))),
          loadModule(HERE_MODULES[3]).then(() => setLoadState(prev => ({ ...prev, mapevents: true }))),
          loadModule(HERE_MODULES[4]).then(() => setLoadState(prev => ({ ...prev, css: true })))
        ]);

        // Verify H object is available
        if (!window.H) {
          throw new Error('HERE Maps object not available after loading');
        }

        console.log('[HERE Maps Modular] ✅ All modules loaded successfully');
        onLoad();
      } catch (error) {
        console.error('[HERE Maps Modular] ❌ Loading failed:', error);
        onError(error instanceof Error ? error.message : 'Unknown loading error');
      }
    };

    loadAllModules();
  }, [onLoad, onError]);

  return null;
};

export default HereMapModularLoader;
