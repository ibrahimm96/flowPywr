declare module "mapbox-gl-animated-popup" {
    import { Popup, PopupOptions } from "mapbox-gl";
  
    export default class AnimatedPopup extends Popup {
      constructor(options?: PopupOptions & { 
        openingAnimation?: { duration: number; easing: string; transform: string };
        closingAnimation?: { duration: number; easing: string; transform: string };
      });
    }
  }