
// HERE Maps API TypeScript declarations
declare global {
  interface Window {
    H: {
      Map: any;
      service: {
        Platform: any;
      };
      mapevents: {
        Behavior: any;
      };
      ui: {
        UI: {
          createDefault: any;
        };
        InfoBubble: any;
      };
      map: {
        Icon: any;
        Marker: any;
        Group: any;
      };
    };
  }
}

export {};
