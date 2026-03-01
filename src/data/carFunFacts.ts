// Fun facts per car brand — age 5-6, Polish, linking car ↔ country
// Key = brand entity ID (e.g. "car:toyota")

export const CAR_FUN_FACTS: Record<string, string[]> = {
  // === JAPAN ===
  'car:toyota': [
    'Toyota to najczęściej kupowane auto na świecie! Pochodzi z Japonii 🇯🇵',
    'Nazwa "Toyota" pochodzi od nazwiska założyciela — Kiichiro Toyoda',
  ],
  'car:honda': [
    'Honda zaczęła od robienia motorów, a potem zrobiła samochody!',
    'Honda pochodzi z Japonii — kraju, gdzie jest góra Fuji 🗻',
  ],
  'car:nissan': [
    'Nissan robi elektryczne auto Leaf — jedzie na prądzie, nie na benzynie! ⚡',
    'Nissan pochodzi z Japonii — kraju tysiąca wysp',
  ],
  'car:mazda': [
    'Mazda ma specjalny silnik, który kręci się jak bączek — silnik Wankla!',
    'Mazda pochodzi z miasta Hiroszima w Japonii',
  ],
  'car:suzuki': [
    'Suzuki robi nie tylko auta, ale też motory i łodzie motorowe!',
    'Suzuki pochodzi z Japonii i uwielbia robić małe, zwinne autka',
  ],
  'car:subaru': [
    'Logo Subaru to gwiazdki — jak konstelacja Plejad na niebie ✨',
    'Subaru uwielbia napęd na cztery koła — świetne na śnieg!',
  ],
  'car:mitsubishi': [
    'Mitsubishi znaczy "trzy diamenty" — zobacz ich logo! 💎',
    'Mitsubishi pochodzi z Japonii i robi świetne auta terenowe',
  ],
  'car:lexus': [
    'Lexus to luksusowa marka Toyoty — takie auto dla dorosłych, którzy lubią ciszę',
    'Lexus pochodzi z Japonii i jest bardzo cichy w środku 🤫',
  ],
  'car:infiniti': [
    'Logo Infiniti to droga prowadząca w nieskończoność ∞',
    'Infiniti to luksusowa wersja Nissana — z Japonii',
  ],
  'car:acura': [
    'Acura to luksusowa Honda — też pochodzi z Japonii!',
    'Acura robi sportowe auta, które wyglądają jak z przyszłości',
  ],
  'car:daihatsu': [
    'Daihatsu robi jedne z najmniejszych aut na świecie!',
    'Pochodzi z Japonii — kraju, gdzie ulice bywają bardzo wąskie',
  ],

  // === GERMANY ===
  'car:bmw': [
    'BMW znaczy "Bawarska Fabryka Silników" — Bawaria to region w Niemczech 🇩🇪',
    'Logo BMW wygląda jak obracające się śmigło samolotu ✈️',
  ],
  'car:mercedes-benz': [
    'Gwiazda Mercedesa ma 3 ramiona — za jazdę po lądzie, wodzie i w powietrzu ⭐',
    'Mercedes to jedno z najstarszych aut na świecie — z Niemiec!',
  ],
  'car:volkswagen': [
    'Volkswagen znaczy "samochód ludowy" po niemiecku 🇩🇪',
    'Garbus Volkswagena to jedno z najbardziej znanych aut w historii!',
  ],
  'car:audi': [
    'Cztery kółka w logo Audi to cztery firmy, które się połączyły',
    'Audi pochodzi z Niemiec i uwielbia robić szybkie auta',
  ],
  'car:porsche': [
    'Porsche 911 wygląda prawie tak samo od ponad 60 lat!',
    'Porsche pochodzi ze Stuttgartu w Niemczech — miasta aut 🏎️',
  ],
  'car:opel': [
    'Logo Opla to błyskawica ⚡ — szybkie jak piorun!',
    'Opel pochodzi z Niemiec i jest bardzo popularny w Polsce',
  ],
  'car:smart': [
    'Smart to najmniejsze auto w mieście — mieści się wszędzie!',
    'Smart wymyślili Niemcy razem ze Szwajcarami (firma zegarków Swatch)',
  ],
  'car:maybach': [
    'Maybach to jedno z najdroższych aut na świecie — jak pałac na kółkach! 👑',
    'Maybach pochodzi z Niemiec i jest teraz częścią Mercedesa',
  ],

  // === USA ===
  'car:ford': [
    'Henry Ford wymyślił taśmę produkcyjną — dzięki niemu auta stały się tańsze!',
    'Ford pochodzi z Detroit w USA — miasta, które nazywają "Motor City" 🇺🇸',
  ],
  'car:chevrolet': [
    'Logo Chevroleta to złoty krzyżyk — jeden z najbardziej znanych znaków!',
    'Chevrolet pochodzi z USA — kraju, który kocha wielkie pickup trucki',
  ],
  'car:tesla': [
    'Tesla jeździ na prądzie — zero spalin, zero hałasu! ⚡🔋',
    'Nazwana na cześć Nikoli Tesli — genialnego wynalazcy prądu',
  ],
  'car:jeep': [
    'Jeep to król terenówek — jedzie przez błoto, piach i góry! 🏔️',
    'Jeep pochodzi z USA i był używany przez żołnierzy w czasie wojny',
  ],
  'car:dodge': [
    'Dodge robi jedne z najmocniejszych aut na świecie — ryczą jak lwy! 🦁',
    'Dodge Challenger to klasyk z USA — wielki, głośny i szybki',
  ],
  'car:cadillac': [
    'Cadillac to auto dla prezydentów USA — jeżdżą nim najważniejsi ludzie!',
    'Nazwa pochodzi od francuskiego odkrywcy, który założył Detroit',
  ],
  'car:gmc': [
    'GMC robi ogromne pickup trucki i SUV-y — największe auta na drodze!',
    'GMC pochodzi z USA — kraju wielkich odległości i wielkich aut',
  ],
  'car:chrysler': [
    'Chrysler ma w logo skrzydła — jak gdyby auto chciało latać! 🦅',
    'Chrysler pochodzi z Detroit w USA',
  ],
  'car:buick': [
    'Buick jest bardzo popularny w Chinach, ale pochodzi z USA!',
    'Logo Buicka to trzy tarcze — rycerskie jak w bajce 🛡️',
  ],
  'car:lincoln': [
    'Lincoln jest nazwany od prezydenta Abrahama Lincolna! 🎩',
    'Lincolnem jeżdżą prezydenci USA od wielu lat',
  ],
  'car:rivian': [
    'Rivian robi elektryczne pickup trucki — duże i ekologiczne! 🌿⚡',
    'Rivian pochodzi z USA i jest nową marką — młodsza niż Ty!',
  ],
  'car:lucid': [
    'Lucid Air jedzie dalej na baterii niż prawie każde inne auto! 🔋',
    'Lucid pochodzi z USA i rywalizuje z Teslą',
  ],

  // === SOUTH KOREA ===
  'car:hyundai': [
    'Hyundai znaczy "nowoczesność" po koreańsku! 🇰🇷',
    'Hyundai pochodzi z Korei Południowej — kraju K-popu i kimchi',
  ],
  'car:kia': [
    'Kia pochodzi z Korei Południowej — tego samego kraju co Samsung!',
    'Nowe logo Kia wygląda jak podpis — eleganckie i nowoczesne',
  ],
  'car:genesis': [
    'Genesis to luksusowa marka Hyundaia — jak Lexus dla Toyoty',
    'Genesis pochodzi z Korei Południowej i jest coraz bardziej popularna',
  ],

  // === UK ===
  'car:jaguar': [
    'Jaguar to kot, który skacze — dlatego logo to skaczący jaguar! 🐆',
    'Jaguar pochodzi z Anglii — kraju królowej i Big Bena 🇬🇧',
  ],
  'car:land-rover': [
    'Land Rover to auto dla odkrywców — jedzie przez dżunglę i pustynię!',
    'Land Rover pochodzi z Anglii i jeżdżą nim nawet królowie 👑',
  ],
  'car:bentley': [
    'Bentley to jedno z najdroższych aut — w środku jest jak luksusowy salon!',
    'Bentley pochodzi z Anglii i ma skrzydełka w logo 🪶',
  ],
  'car:rolls-royce': [
    'Rolls-Royce to najbardziej luksusowe auto na świecie — ma nawet parasol w drzwiach! ☂️',
    'Rolls-Royce pochodzi z Anglii i robi też silniki do samolotów',
  ],
  'car:aston-martin': [
    'Aston Martin to auto Jamesa Bonda — tajnego agenta 007! 🕵️',
    'Aston Martin pochodzi z Anglii i jest bardzo eleganckie',
  ],
  'car:mclaren': [
    'McLaren to auto wyścigowe, które jeździ po zwykłych drogach! 🏁',
    'McLaren pochodzi z Anglii i startuje w Formule 1',
  ],
  'car:lotus': [
    'Lotus jest bardzo lekki — waży mniej niż inne sportowe auta!',
    'Lotus pochodzi z Anglii i jest znany z wyścigów',
  ],
  'car:mini': [
    'Mini to mały samochodzik, który jest wielki duchem! 💪',
    'Mini pochodzi z Anglii — teraz należy do BMW',
  ],

  // === ITALY ===
  'car:ferrari': [
    'Ferrari jest czerwone jak pomidor — to kolor szczęścia we Włoszech! 🔴🇮🇹',
    'Logo Ferrari to konik — "cavallino rampante" czyli galopujący konik 🐴',
  ],
  'car:lamborghini': [
    'Logo Lamborghini to byk — bo założyciel hodował byki! 🐂',
    'Lamborghini pochodzi z Włoch — kraju pizzy i lodów 🍕🍦',
  ],
  'car:fiat': [
    'Fiat 500 to mały włoski samochodzik — idealny na wąskie uliczki Rzymu!',
    'FIAT to skrót od "Fabbrica Italiana Automobili Torino"',
  ],
  'car:alfa-romeo': [
    'W logo Alfa Romeo jest wąż, który zjada człowieka — ale to stary herb Mediolanu! 🐍',
    'Alfa Romeo pochodzi z Włoch i robi piękne, sportowe auta',
  ],
  'car:maserati': [
    'Logo Maserati to trójząb Neptuna — boga morza! 🔱',
    'Maserati pochodzi z Włoch i jest bardzo luksusowe',
  ],
  'car:pagani': [
    'Pagani Zonda jest nazwana od gorącego wiatru w Argentynie!',
    'Pagani pochodzi z Włoch — każde auto jest robione ręcznie',
  ],
  'car:bugatti': [
    'Bugatti Chiron jedzie ponad 400 km/h — szybciej niż pociąg! 🚄',
    'Bugatti założył Włoch, ale firma jest teraz we Francji',
  ],

  // === FRANCE ===
  'car:renault': [
    'Renault ma logo w kształcie diamentu 💎 — od ponad 100 lat!',
    'Renault pochodzi z Francji — kraju wieży Eiffla 🗼🇫🇷',
  ],
  'car:peugeot': [
    'Logo Peugeota to lew — silny i dumny! 🦁',
    'Peugeot pochodzi z Francji i jest jedną z najstarszych marek aut',
  ],
  'car:citroen': [
    'Citroën ma w logo dwa kąty — jak zęby koła zębatego ⚙️',
    'Citroën pochodzi z Francji i robi wygodne auta',
  ],
  'car:alpine': [
    'Alpine to sportowe auto z Francji — lekkie jak piórko!',
    'Alpine jest niebieskie jak niebo nad Alpami 🏔️💙',
  ],

  // === SWEDEN ===
  'car:volvo': [
    'Volvo to jedno z najbezpieczniejszych aut na świecie! 🛡️',
    'Volvo pochodzi ze Szwecji — kraju łosi i IKEA 🇸🇪',
  ],
  'car:koenigsegg': [
    'Koenigsegg to jedno z najszybszych aut na świecie — z małej Szwecji!',
    'Koenigsegg robi tylko kilkadziesiąt aut rocznie — każde jest wyjątkowe',
  ],
  'car:polestar': [
    'Polestar to elektryczne auto ze Szwecji — gwiazda polarna! ⭐',
    'Polestar pochodzi z rodziny Volvo',
  ],

  // === CZECH REPUBLIC ===
  'car:skoda': [
    'Škoda pochodzi z Czech — naszych sąsiadów! 🇨🇿',
    'Logo Škody to skrzydlata strzała — szybka jak wiatr! 🏹',
  ],

  // === ROMANIA ===
  'car:dacia': [
    'Dacia to jedno z najtańszych nowych aut w Europie!',
    'Dacia pochodzi z Rumunii — kraju Drakuli 🧛🇷🇴',
  ],

  // === SPAIN ===
  'car:seat': [
    'SEAT pochodzi z Hiszpanii — kraju flamenco i paelli! 🇪🇸💃',
    'SEAT produkuje auta blisko Barcelony',
  ],
  'car:cupra': [
    'Cupra to sportowa siostra SEATa — szybsza i bardziej sportowa!',
    'Cupra pochodzi z Hiszpanii i ma złote logo ✨',
  ],

  // === CHINA ===
  'car:byd': [
    'BYD znaczy "Build Your Dreams" — Zbuduj Swoje Marzenia! 💭',
    'BYD pochodzi z Chin i robi głównie auta elektryczne ⚡🇨🇳',
  ],
  'car:nio': [
    'NIO wymienia baterię w 3 minuty zamiast ładować godzinami! 🔋',
    'NIO pochodzi z Chin — największego kraju na świecie',
  ],
  'car:geely': [
    'Geely znaczy "szczęście" po chińsku! 🍀',
    'Geely pochodzi z Chin i jest właścicielem Volvo',
  ],
  'car:great-wall': [
    'Great Wall znaczy "Wielki Mur" — jak Wielki Mur Chiński! 🏰',
    'Great Wall pochodzi z Chin i robi duże SUV-y',
  ],
  'car:xpeng': [
    'XPeng robi inteligentne auta, które prawie same jeżdżą! 🤖',
    'XPeng pochodzi z Chin i jest jak chiński Tesla',
  ],
  'car:li-auto': [
    'Li Auto robi auta, które mają i silnik, i baterię — na wszelki wypadek!',
    'Li Auto pochodzi z Chin',
  ],

  // === INDIA ===
  'car:tata': [
    'Tata Motors to największa firma samochodowa w Indiach! 🇮🇳',
    'Tata jest właścicielem Jaguara i Land Rovera!',
  ],
  'car:mahindra': [
    'Mahindra robi traktory i samochody terenowe — z Indii!',
    'Mahindra pochodzi z Indii — kraju Gangesu i tygrysów 🐯',
  ],

  // === MALAYSIA ===
  'car:proton': [
    'Proton to narodowe auto Malezji — duma całego kraju! 🇲🇾',
    'Malezja to tropikalny kraj w Azji — ciepło tam cały rok! 🌴',
  ],

  // === AUSTRALIA ===
  'car:holden': [
    'Holden to legenda Australii — kraju kangurów! 🦘🇦🇺',
    'Holden już nie produkuje nowych aut, ale Australijczycy go kochają',
  ],
};

// Generic facts when brand-specific one is not available
export const GENERIC_CAR_FACTS: string[] = [
  'Każde auto jest zaprojektowane w kraju, z którego pochodzi marka!',
  'Auta podróżują po całym świecie — od fabryki do Twojego miasta!',
  'Każda marka ma swoje logo — jak podpis na dziele sztuki ✍️',
  'Niektóre auta są szybkie jak gepard, inne wygodne jak kanapa!',
  'Auta elektryczne nie potrzebują benzyny — ładują się jak telefon! 🔌',
];
