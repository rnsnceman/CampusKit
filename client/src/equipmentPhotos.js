// Bundled reference photos work for existing equipment records without reseeding.
// Full attribution and license links: client/public/equipment/photo-credits.html.
const equipmentPhotos = {
  "sony alpha a6400": {
    "src": "/equipment/sony-a6400.jpg",
    "alt": "Sony Alpha a6400 camera with lens",
    "reference": false
  },
  "audio-technica at2020": {
    "src": "/equipment/at2020.jpg",
    "alt": "Audio-Technica AT2020 condenser microphone",
    "reference": false
  },
  "focusrite scarlett 2i2": {
    "src": "/equipment/scarlett-2i2.jpg",
    "alt": "Focusrite Scarlett interface lineup with the 2i2 at the top",
    "reference": true
  },
  "macbook air m2": {
    "src": "/equipment/macbook-air-m2.jpg",
    "alt": "M2 MacBook Air in Starlight",
    "reference": false
  },
  "manfrotto compact tripod": {
    "src": "/equipment/manfrotto-tripod.jpg",
    "alt": "Illustrative Manfrotto tripod photo; the specific model may differ",
    "reference": true
  },
  "canon eos rebel t7": {
    "src": "/equipment/canon-rebel-t7.jpg",
    "alt": "Canon EOS 2000D camera with lens, also sold as the Rebel T7",
    "reference": false
  },
  "zoom h5 recorder": {
    "src": "/equipment/zoom-h5.jpg",
    "alt": "Zoom H5 handheld recorder",
    "reference": false
  },
  "led video light kit": {
    "src": "/equipment/led-video-light.jpg",
    "alt": "Illustrative Digitek LED video light panel; kit accessories are not shown",
    "reference": true
  }
}

export function getEquipmentPhoto(name = '') {
  return equipmentPhotos[name.trim().toLowerCase()] ?? null;
}
