
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
        MapEvents: any;
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
        Polyline: any;
      };
      geo: {
        LineString: any;
      };
    };
  }
}

export {};
