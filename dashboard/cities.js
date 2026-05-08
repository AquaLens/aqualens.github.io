let cityCache = {
  // Netherlands
  "amsterdam": { country: "netherlands", lat: 52.3776, lng: 4.8972 },
  "leiden": { country: "netherlands", lat: 52.1601, lng: 4.4970 },
  "rotterdam": { country: "netherlands", lat: 51.9225, lng: 4.4792 },
  "delft": { country: "netherlands", lat: 52.0116, lng: 4.3571 },
  "eindhoven": { country: "netherlands", lat: 51.4416, lng: 5.4697 },
  "haarlemmermeer": { country: "netherlands", lat: 52.3030, lng: 4.6900 },
  "alphen aan den rijn": { country: "netherlands", lat: 52.1307, lng: 4.6577 },
  "biddinghuizen": { country: "netherlands", lat: 52.4607, lng: 5.6963 },
  "hondsbossche zeewering": { country: "netherlands", lat: 52.8000, lng: 4.6500 },

  // Germany
  "berlin": { country: "germany", lat: 52.5200, lng: 13.4050 },
  "munich": { country: "germany", lat: 48.1374, lng: 11.5755 },
  "bad hersfeld": { country: "germany", lat: 50.8678, lng: 9.7089 },
  "osnabrück": { country: "germany", lat: 52.2799, lng: 8.0472 },
  "lucerne": { country: "switzerland", lat: 47.0502, lng: 8.3093 },

  // France  
  "paris": { country: "france", lat: 48.8566, lng: 2.3522 },
  "lyon": { country: "france", lat: 45.7640, lng: 4.8357 },
  "briis-sous-forges": { country: "france", lat: 48.6167, lng: 2.1667 },
  "caen": { country: "france", lat: 49.1829, lng: -0.3707 },
  "saint-quentin-en-yvelines": { country: "france", lat: 48.7833, lng: 2.0333 },

  // United Kingdom
  "london": { country: "united kingdom", lat: 51.5074, lng: -0.1278 },
  "england": { country: "united kingdom", lat: 52.3555, lng: -1.1743 },
  "medmerry": { country: "united kingdom", lat: 50.7833, lng: -0.8333 },
  "hengistbury head": { country: "united kingdom", lat: 50.7167, lng: -1.7667 },

  // Belgium
  "brussels": { country: "belgium", lat: 50.8503, lng: 4.3517 },
  "leuven": { country: "belgium", lat: 50.8798, lng: 4.7005 },

  // Switzerland
  "bernex": { country: "switzerland", lat: 46.1833, lng: 6.0833 },
  "confignon": { country: "switzerland", lat: 46.1833, lng: 6.0833 },
  "perley-certoux": { country: "switzerland", lat: 46.1667, lng: 6.0500 },
  "onex": { country: "switzerland", lat: 46.1833, lng: 6.1000 },

  // Austria
  "vienna": { country: "austria", lat: 48.2100, lng: 16.3634 },
  "perg": { country: "austria", lat: 48.2500, lng: 14.6333 },
  "salzburg": { country: "austria", lat: 47.8095, lng: 13.0550 },

  // Sweden
  "malmo": { country: "sweden", lat: 55.6059, lng: 13.0007 },
  "arvika": { country: "sweden", lat: 59.6558, lng: 12.5906 },

  // USA
  "new york": { country: "usa", lat: 40.7128, lng: -74.0060 },
  "chicago": { country: "usa", lat: 41.8781, lng: -87.6298 },
  "portland": { country: "usa", lat: 45.5152, lng: -122.6784 },
  "washington dc": { country: "usa", lat: 38.9072, lng: -77.0369 },
  "florida": { country: "usa", lat: 27.7663, lng: -82.6404 },
  "montana": { country: "usa", lat: 47.0527, lng: -109.6333 },
  "oregon": { country: "usa", lat: 44.5720, lng: -122.0709 },
  "illinois": { country: "usa", lat: 40.3493, lng: -88.9862 },
  "louisiana": { country: "usa", lat: 31.1695, lng: -91.8678 },
  "new mexico": { country: "usa", lat: 34.8405, lng: -106.2485 },
  "billings": { country: "usa", lat: 45.7833, lng: -108.5007 },
  "holden": { country: "usa", lat: 42.3501, lng: -71.8634 },
  "sheridan": { country: "usa", lat: 44.7969, lng: -106.9561 },
  "big sky": { country: "usa", lat: 45.2847, lng: -111.3080 },
  "pasco county": { country: "usa", lat: 28.3231, lng: -82.4379 },
  "st. gabriel": { country: "usa", lat: 30.2507, lng: -91.1009 },
  "montgomery county": { country: "usa", lat: 39.1547, lng: -77.2405 },
  "baltimore county": { country: "usa", lat: 39.4403, lng: -76.6413 },
  "boston": { country: "usa", lat: 42.3601, lng: -71.0589 },

  // Canada
  "montreal": { country: "canada", lat: 45.5017, lng: -73.5673 },

  // Spain
  "barcelona": { country: "spain", lat: 41.3851, lng: 2.1734 },
  "madrid": { country: "spain", lat: 40.4168, lng: -3.7038 },

  // Italy
  "rome": { country: "italy", lat: 41.9028, lng: 12.4964 },
  "milan": { country: "italy", lat: 45.4642, lng: 9.1900 },

  // China
  "beijing": { country: "china", lat: 39.9042, lng: 116.4074 },
  "jinan": { country: "china", lat: 36.6512, lng: 117.1201 },
  "shenzhen": { country: "china", lat: 22.5431, lng: 114.0579 },

  // Indonesia
  "bali": { country: "indonesia", lat: -8.4095, lng: 115.1889 },
  "ubud": { country: "indonesia", lat: -8.5069, lng: 115.2625 },
  "jakarta": { country: "indonesia", lat: -6.2088, lng: 106.8456 },

  // Romania
  "braila": { country: "romania", lat: 45.2692, lng: 27.9575 },
  "bucharest": { country: "romania", lat: 44.4268, lng: 26.1025 },

  // Poland
  "warszawa": { country: "poland", lat: 52.2297, lng: 21.0122 },

  // Czech Republic
  "soběslav": { country: "czech republic", lat: 49.2597, lng: 14.7181 },
  "prague": { country: "czech republic", lat: 50.0755, lng: 14.4378 },

  // Finland
  "kirkkojärvi": { country: "finland", lat: 60.8333, lng: 24.8167 },

  // Saudi Arabia
  "riyadh": { country: "saudi arabia", lat: 24.7136, lng: 46.6753 },

  // Kuwait
  "al khiran": { country: "kuwait", lat: 28.6375, lng: 48.1303 },

  // Japan
  "saitama": { country: "japan", lat: 35.8617, lng: 139.6455 },
  "minuma tando": { country: "japan", lat: 35.9167, lng: 139.6333 },

  // New Zealand
  "new zealand": { country: "new zealand", lat: -40.9006, lng: 174.8860 },
  "whanganhui": { country: "new zealand", lat: -39.9167, lng: 175.0500 },
  "dutchy lake": { country: "new zealand", lat: -45.0333, lng: 170.1000 },
  "greymouth": { country: "new zealand", lat: -42.4500, lng: 171.2167 },
  "selwyn": { country: "new zealand", lat: -43.6667, lng: 172.0000 },
  "christchurch": { country: "new zealand", lat: -43.5321, lng: 172.6362 },
  "queenstown": { country: "new zealand", lat: -45.0312, lng: 168.6626 },

  // Other Pacific
  "tuvalu": { country: "tuvalu", lat: -7.1095, lng: 177.6493 },
  "kauai": { country: "usa", lat: 22.0964, lng: -159.5261 },

  // South America
  "uros": { country: "peru", lat: -15.8200, lng: -69.9600 },
  "matto grosso": { country: "brazil", lat: -12.6819, lng: -56.9211 },

  // Central America
  "heredia": { country: "costa rica", lat: 10.0025, lng: -84.1167 },
  "quebrada seca-río burío": { country: "costa rica", lat: 10.0000, lng: -84.2000 },
  "xochimilco": { country: "mexico", lat: 19.2647, lng: -99.1031 },

  // Africa
  "somerset county": { country: "south africa", lat: -32.8833, lng: 25.0167 },

  // Scandinavia
  "oslo": { country: "norway", lat: 59.9139, lng: 10.7522 },
  "stockholm": { country: "sweden", lat: 59.3293, lng: 18.0686 },
  "holalokka": { country: "norway", lat: 60.1500, lng: 11.0500 },

  // Rivers and Geographic Features
  "danube river": { country: "multiple", lat: 48.6000, lng: 20.0000 },
  "vecht river": { country: "netherlands", lat: 52.2167, lng: 5.0833 },
  "danube river basin": { country: "multiple", lat: 48.0000, lng: 20.0000 },
  "dutch delta": { country: "netherlands", lat: 51.8000, lng: 4.5000 },
  "valleilkaneel-eem river": { country: "netherlands", lat: 52.1833, lng: 5.2500 },
  "wadden sea": { country: "multiple", lat: 53.5000, lng: 6.0000 },
  "rhine-meuse delta": { country: "netherlands", lat: 51.9500, lng: 4.5000 },
  "seine": { country: "france", lat: 48.8566, lng: 2.3522 },
  "lake marken": { country: "netherlands", lat: 52.4667, lng: 5.1000 },
  "valleikanaal-eem river system": { country: "netherlands", lat: 52.1833, lng: 5.2500 },
  "thames river": { country: "united kingdom", lat: 51.5074, lng: -0.1278 },

  // Special Areas/Parks
  "green village": { country: "netherlands", lat: 52.0116, lng: 4.3571 },
  "bishan-ang mo kio park": { country: "singapore", lat: 1.3667, lng: 103.8500 },
  "binnenhaven marineterriein": { country: "netherlands", lat: 52.3667, lng: 4.9000 },
  "story mill": { country: "usa", lat: 45.6769, lng: -111.0429 },
  
};

console.log(`Predefined cities loaded: ${Object.keys(cityCache).length} cities available`);

// Debug: test if it works
console.log('Sample predefined cities:', {
  'danube river': cityCache['danube river'],
  'montana': cityCache['montana'], 
  'medmerry': cityCache['medmerry'],
  'story mill': cityCache['story mill']
});