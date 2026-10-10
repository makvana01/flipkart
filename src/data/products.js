import catalogProducts from './products.json';

export const categories = [
  { name: "For You", icon: "/assets/images/63c46931a5c1.svg" },
  { name: "Fashion", icon: "/assets/images/afda2709f10b.svg" },
  { name: "Mobiles", icon: "/assets/images/1309e240886d.svg" },
  { name: "Electronics", icon: "/assets/images/71ecb2d81e0b.svg" },
  { name: "Beauty", icon: "/assets/images/14f47b807e4f.svg" },
  { name: "Home", icon: "/assets/images/5791533b83de.svg" },
  { name: "Appliances", icon: "/assets/images/2ae1671168b8.svg" },
  { name: "Toys, baby..", icon: "/assets/images/9f1e56072fb3.svg" },
  { name: "Food & Health", icon: "/assets/images/43a1417efcc5.svg" },
  { name: "Auto Acc...", icon: "/assets/images/3d7edea014bb.svg" },
  { name: "Sports & Fitness", icon: "/assets/images/38bb0d99872b.svg" },
  { name: "Furniture", icon: "/assets/images/24889bb06ca9.svg" }
];

export const heroBanners = [
  {
    id: "rohit_bbd",
    title: "The Big Billion Days - Sale is Live!",
    subtitle: "India's Biggest Festival Sale is Live Now",
    image: "/assets/images/big_billion_days_rohit.png",
    badge: "SALE LIVE"
  },
  {
    id: "bbd_vivo_7200",
    title: "vivo T5x 5G | UFS 3.1",
    subtitle: "Segment's Biggest Battery 7200 mAh | Sale is Live",
    image: "/assets/images/banners/bbd_vivo_7200mah.png",
    badge: "SALE LIVE"
  },
  {
    id: "bbd_power_7000",
    title: "Max Power 5G - 7000 mAh",
    subtitle: "Sale is Live | Instant Bank Discounts",
    image: "/assets/images/banners/bbd_power_7000mah.jpg",
    badge: "MEGA BATTERY"
  },
  {
    id: "bbd_ultra_5g",
    title: "Ultra 5G Flagship Series",
    subtitle: "Next-Gen Performance | Instant Card Savings",
    image: "/assets/images/banners/bbd_ultra_5g.jpg",
    badge: "NEW LAUNCH"
  },
  {
    id: "bbd_vibe_pastel",
    title: "Vibe 5G Series - Android 16",
    subtitle: "6000 mAh Battery | Flipkart Unique",
    image: "/assets/images/banners/bbd_vibe_pastel.jpg",
    badge: "TOP TRENDING"
  }
];

// Exact products featured in the user's mobile Flipkart screenshot
export const screenshotProducts = [
  {
    id: "prod_ipad_2025",
    title: "Apple 2025 iPad (A16) 128 GB ROM 11 inch with Wi-Fi Only Gaming A...more",
    fullTitle: "Apple 2025 iPad (A16) 128 GB ROM 11 inch with Wi-Fi Only Gaming A16 Bionic Liquid Retina Display",
    category: "Tablets",
    image: "/assets/images/pdp/ipad_main.png",
    gallery: [
      "/assets/images/pdp/ipad_main.png",
      "/assets/images/cart_ipad.png",
      "/assets/images/pdp/ipad_product.png"
    ],
    badge: "Special Price",
    badgeColor: "#108435",
    origPrice: 49900,
    price: 1299,
    discount: "97% off",
    protectFee: 99,
    rating: 4.7,
    ratingsCount: "16,363",
    seller: "TREASURE HAUL ONLINE",
    sellerRating: "4.6",
    sellerYears: "6 years with Flipkart",
    deliveryDate: "Friday, 16 Oct",
    emiPerMonth: 217,
    variantTypes: {
      color: {
        label: "Color",
        selected: "Blue",
        options: ["Blue", "Pink", "Yellow", "Gold", "Silver", "Space Grey"]
      },
      connectivity: {
        label: "Connectivity",
        selected: "Wi-Fi Only",
        options: [
          { name: "4G", disabled: true },
          { name: "Wi-Fi Only", disabled: false }
        ]
      },
      storage: {
        label: "Storage",
        selected: "128 GB",
        options: ["64 GB", "128 GB", "256 GB"]
      }
    },
    attributeRatings: [
      { name: "Camera", rating: 4.1 },
      { name: "Battery", rating: 4.4 },
      { name: "Performance", rating: 4.6 },
      { name: "Value for Money", rating: 4.5 },
      { name: "Display & Brightness", rating: 4.6 },
      { name: "Build & Sound Quality", rating: 4.5 },
      { name: "Functionality", rating: 4.6 }
    ],
    customerPhotoMosaic: "/assets/images/pdp/customer_review_mosaic.png",
    customerPhotoCount: "+655",
    reviews: [
      {
        id: "r_tej",
        rating: 5,
        title: "Great product",
        time: "1 year ago",
        comment: "Very nice iPad 11",
        author: "TEJ PRAKASH BAGHEL",
        verified: true,
        likes: 914,
        dislikes: 316
      },
      {
        id: "r_trilok",
        rating: 5,
        title: "Simply awesome",
        time: "8 months ago",
        comment: "Value for money tablet! Display is super crisp and A16 processor handles everything without stutter.",
        author: "TRILOK KUMAR",
        verified: true,
        likes: 452,
        dislikes: 88
      },
      {
        id: "r_ankit",
        rating: 5,
        title: "Superb battery & design",
        time: "4 months ago",
        comment: "Apple never disappoints. The blue color is vibrant and light in weight. Kids love it for studies and drawing.",
        author: "ANKIT MEHRA",
        verified: true,
        likes: 240,
        dislikes: 34
      }
    ]
  },
  {
    id: "prod_bersache",
    title: "BERSACHE Premium Sports ...",
    fullTitle: "BERSACHE Premium Sports High-Top Trekking Shoes For Men",
    category: "Fashion",
    image: "/assets/images/bersache_shoes.png",
    badge: "Value 365",
    badgeColor: "#e51049",
    origPrice: 4999,
    price: 638,
    priceStyle: "red-pill",
    offer: "₹623 with UPI offer",
    rating: 4.2,
    ratingsCount: "3,410",
    highlights: [
      "Lightweight High-Top Riding & Sports Design",
      "Shock Absorption EVA Midsole",
      "Breathable Mesh Lining",
      "Anti-Skid TPR Outer Grip Sole"
    ],
    description: "BERSACHE Premium Sports Sneakers crafted with superior durability and modern ergonomic styling. Ideal for running, gym, trekking, and casual daily wear.",
    reviews: [
      {
        id: "br1",
        author: "Jayesh Patel",
        location: "Surat, Gujarat",
        date: "2 days ago",
        rating: 5,
        title: "Superb quality shoes for this price!",
        comment: "Ankle support is fantastic. Very comfortable for bike riding and casual wear.",
        helpful: 48
      }
    ]
  },
  {
    id: "prod_smartbuy_case",
    title: "Flipkart SmartBuy Back Co...",
    fullTitle: "Flipkart SmartBuy Clear Magnetic MagSafe Case for Apple iPhone 15 & 16",
    category: "Accessories",
    image: "/assets/images/smartbuy_case.png",
    ratingPill: true,
    rating: 4.2,
    ratingsCount: "16,118",
    origPrice: 999,
    price: 144,
    priceStyle: "regular",
    offer: "₹119 with Bank offer + more",
    highlights: [
      "Crystal Clear Anti-Yellowing Bayer TPU",
      "Built-in 38 N52 Super Strong Magnetic Ring",
      "Raised 1.5mm Screen and Camera Bump Guards",
      "Air-Cushioned Shockproof Corners"
    ],
    description: "Flipkart SmartBuy premium shockproof bumper clear case featuring high-grade magnets for fast and secure MagSafe wireless charging compatibility.",
    reviews: [
      {
        id: "cr1",
        author: "Manish Shah",
        location: "Ahmedabad, Gujarat",
        date: "Yesterday",
        rating: 5,
        title: "Crystal clear and strong magnet!",
        comment: "Fits my iPhone perfectly and MagSafe charger snaps firmly.",
        helpful: 125
      }
    ]
  },
  {
    id: "prod_pixel_11",
    title: "Google Pixel 11 (Hibiscus, 2...",
    fullTitle: "Google Pixel 11 Pro 5G (Hibiscus Pink, 256 GB)",
    category: "Google Pixel",
    image: "/assets/images/pixel_pink.png",
    ratingPill: true,
    rating: 4.5,
    ratingsCount: "403",
    origPrice: 89999,
    price: 1349,
    discount: "98% off",
    priceStyle: "regular",
    offer: "₹1,249 with Bank offer",
    highlights: [
      "Next-Gen Google Tensor G5 with Google AI",
      "Super Actua Pro 120Hz OLED Display",
      "Triple 50MP Pro Camera with 5x Periscope Zoom",
      "All-Day 5000 mAh Battery with Fast Wireless Charging"
    ],
    description: "The Google Pixel 11 in vibrant Hibiscus Pink is built for pro-grade performance and cutting-edge Gemini AI features with Google's most powerful camera system.",
    reviews: [
      {
        id: "pr1",
        author: "Kavita Dave",
        location: "Vadodara, Gujarat",
        date: "3 days ago",
        rating: 5,
        title: "Stunning Hibiscus color and camera magic!",
        comment: "Photos look like DSLR quality. Battery lasts more than a full day easily.",
        helpful: 92
      }
    ]
  },
  {
    id: "prod_rayban_meta",
    title: "Ray-Ban | Meta Wayfarer (G...",
    fullTitle: "Ray-Ban | Meta Wayfarer (Gen 2 Smart Audio Camera Glasses, Matte Black)",
    category: "Electronics",
    image: "/assets/images/rayban_meta.png",
    badge: "Hero Deal",
    badgeColor: "#3538cd",
    ratingPill: true,
    rating: 4.3,
    ratingsCount: "173",
    origPrice: 39900,
    price: 1199,
    discount: "97% off",
    priceStyle: "red-pill",
    offer: "₹1,099 with NCEMI offer",
    highlights: [
      "Ultra-wide 12 MP Camera with 1080p Video Recording",
      "Open-Ear Custom Speakers & 5-Mic Spatial Audio",
      "Meta AI Voice Controls built-in",
      "Rechargeable Charging Case with up to 36 hours life"
    ],
    description: "Iconic Ray-Ban Wayfarer styling meets next-generation smart technology with Meta AI, high-resolution photography, live streaming, and hands-free calls.",
    reviews: [
      {
        id: "rr1",
        author: "Chirag Mehta",
        location: "Rajkot, Gujarat",
        date: "4 days ago",
        rating: 5,
        title: "Future of wearable tech! Audio is surprisingly clear.",
        comment: "Taking videos hands-free while travelling is mind blowing. Lightweight and looks just like classic Ray-Bans.",
        helpful: 67
      }
    ]
  }
];

// iPhone Models (Fixed ₹1,000 - ₹1,500)
export const iphones = [
  {
    id: "ip16pm",
    title: "Apple iPhone 16 Pro Max (256 GB, Desert Titanium)",
    category: "iPhones",
    price: 1449,
    origPrice: 144900,
    discount: "99% off",
    rating: 4.9,
    ratingsCount: "12,480",
    image: "/assets/images/iphone16_pro_max.jpg",
    highlights: [
      "256 GB ROM",
      "17.53 cm (6.9 inch) Super Retina XDR Display",
      "48MP + 48MP + 12MP | 12MP Front Camera",
      "A18 Pro Chip with 6-core GPU",
      "Titanium frame with textured matte glass back",
      "All-day battery life with up to 33 hours video playback"
    ],
    description: "The Apple iPhone 16 Pro Max features a strong and lightweight titanium design with a larger 6.9-inch Super Retina XDR display. Powered by the groundbreaking A18 Pro chip, it brings Apple Intelligence, incredible battery efficiency, and studio-quality 4K 120 fps Dolby Vision recording.",
    reviews: [
      {
        id: "r1",
        author: "Aarav Patel",
        location: "Ahmedabad, Gujarat",
        date: "Yesterday",
        rating: 5,
        title: "Absolute beast! Camera and battery are next level",
        comment: "Received the delivery in just 1 day. Desert Titanium looks even better in person than the photos. Camera Control button is super intuitive and battery lasted 1.5 days on heavy 5G usage. Totally in love with this device!",
        helpful: 248
      },
      {
        id: "r2",
        author: "Priya Sundaram",
        location: "Bangalore, Karnataka",
        date: "2 days ago",
        rating: 5,
        title: "Worth every single rupee! Pure flagship luxury",
        comment: "Upgraded from iPhone 13 Pro. The 120Hz ProMotion display combined with thin bezels makes everything look immersive. Sound output from built-in speakers is crisp with deep punch.",
        helpful: 182
      },
      {
        id: "r3",
        author: "Vikram Malhotra",
        location: "Delhi NCR",
        date: "3 days ago",
        rating: 5,
        title: "Top tier performance. A18 Pro handles gaming smoothly",
        comment: "Played Genshin Impact for 2 hours straight without thermal throttling. Apple Intelligence features work fast and Siri integration is helpful for daily tasks.",
        helpful: 129
      }
    ]
  },
  {
    id: "ip16p",
    title: "Apple iPhone 16 Pro (128 GB, Natural Titanium)",
    category: "iPhones",
    price: 1399,
    origPrice: 119900,
    discount: "99% off",
    rating: 4.8,
    ratingsCount: "9,820",
    image: "/assets/images/iphone16_pro_natural.jpg",
    highlights: [
      "128 GB ROM",
      "15.9 cm (6.3 inch) Super Retina XDR Display",
      "48MP + 48MP + 12MP | 12MP Front Camera",
      "A18 Pro Chip Processor",
      "Camera Control for instant photo capture",
      "Ceramic Shield front that is 2x tougher than any smartphone glass"
    ],
    description: "The iPhone 16 Pro delivers pro camera performance in a compact 6.3-inch form factor. With the A18 Pro chip, 5x optical telephoto lens, and the Camera Control tactile button, it is the ultimate creator companion.",
    reviews: [
      {
        id: "r4",
        author: "Karan Desai",
        location: "Surat, Gujarat",
        date: "Yesterday",
        rating: 5,
        title: "Perfect compact flagship size!",
        comment: "The 6.3 inch screen is the sweet spot. Comfortable one-hand usage and the 5x zoom camera takes stunning portrait shots with crisp bokeh.",
        helpful: 164
      },
      {
        id: "r5",
        author: "Sneha Reddy",
        location: "Hyderabad, Telangana",
        date: "2 days ago",
        rating: 5,
        title: "Audio recording and 4K 120fps is mind blowing",
        comment: "Using it for social media content creation. The studio quality microphones filter out background wind noise seamlessly.",
        helpful: 112
      }
    ]
  },
  {
    id: "ip16",
    title: "Apple iPhone 16 (128 GB, Ultramarine)",
    category: "iPhones",
    price: 1199,
    origPrice: 79900,
    discount: "98% off",
    rating: 4.8,
    ratingsCount: "18,430",
    image: "/assets/images/iphone16_ultramarine.jpg",
    highlights: [
      "128 GB ROM",
      "15.54 cm (6.1 inch) Super Retina XDR OLED Display",
      "48MP Fusion Camera + 12MP Ultra Wide with Macro",
      "A18 Chip with 5-core GPU",
      "Action Button and Camera Control",
      "Dynamic Island for live activities"
    ],
    description: "The vibrant iPhone 16 in striking Ultramarine brings Action Button, Camera Control, macro photography, and the A18 Bionic chip designed for Apple Intelligence.",
    reviews: [
      {
        id: "r6",
        author: "Rohan Dave",
        location: "Vadodara, Gujarat",
        date: "Yesterday",
        rating: 5,
        title: "The Ultramarine color is stunning in real life",
        comment: "Fast delivery within 24 hours. Screen brightness under Gujarat sunny afternoon is superb. Macro photos of flowers look like DSLR shots.",
        helpful: 95
      },
      {
        id: "r7",
        author: "Ananya Roy",
        location: "Kolkata, West Bengal",
        date: "3 days ago",
        rating: 5,
        title: "Super smooth battery and zero heating",
        comment: "A18 chip is efficient. Phone stays completely cool while browsing, streaming and taking 4K videos.",
        helpful: 78
      }
    ]
  },
  {
    id: "ip15pm",
    title: "Apple iPhone 15 Pro Max (256 GB, Black Titanium)",
    category: "iPhones",
    price: 1299,
    origPrice: 134900,
    discount: "99% off",
    rating: 4.8,
    ratingsCount: "25,120",
    image: "/assets/images/iphone15_pro_max.jpg",
    highlights: [
      "256 GB ROM",
      "17.02 cm (6.7 inch) Super Retina XDR Display",
      "48MP + 12MP + 12MP Triple Camera with 5x Zoom",
      "A17 Pro Chip with Ray Tracing support",
      "USB-C port with 10Gbps USB 3 transfer speeds",
      "Action Button customizable shortcuts"
    ],
    description: "Forged in titanium, the iPhone 15 Pro Max features the groundbreaking A17 Pro processor with hardware-accelerated ray tracing and powerful 5x optical telephoto lens.",
    reviews: [
      {
        id: "r8",
        author: "Harshil Vora",
        location: "Rajkot, Gujarat",
        date: "2 days ago",
        rating: 5,
        title: "USB-C makes life so much easier!",
        comment: "Can now use the same USB-C charger for MacBook, iPad, and iPhone. Fast charging and blazing quick data transfers.",
        helpful: 142
      }
    ]
  },
  {
    id: "ip15",
    title: "Apple iPhone 15 (128 GB, Pastel Pink)",
    category: "iPhones",
    price: 1049,
    origPrice: 69900,
    discount: "98% off",
    rating: 4.7,
    ratingsCount: "42,890",
    image: "/assets/images/iphone15_pastel_pink.jpg",
    highlights: [
      "128 GB ROM",
      "15.49 cm (6.1 inch) Super Retina XDR Display",
      "48MP Main Camera with 2x Telephoto Sensor-Shift",
      "A16 Bionic Chip",
      "Dynamic Island integration",
      "Color-infused durable glass back"
    ],
    description: "The iPhone 15 features Dynamic Island, a 48MP main camera with lossless 2x optical quality zoom, and durable color-infused back glass.",
    reviews: [
      {
        id: "r9",
        author: "Meera Joshi",
        location: "Ahmedabad, Gujarat",
        date: "Yesterday",
        rating: 5,
        title: "Dynamic Island is super useful for cricket scores!",
        comment: "Live sports scores and music controls right in the pill island. Very lightweight in hand.",
        helpful: 88
      }
    ]
  },
  {
    id: "ip14p",
    title: "Apple iPhone 14 Plus (128 GB, Midnight Blue)",
    category: "iPhones",
    price: 1099,
    origPrice: 64900,
    discount: "98% off",
    rating: 4.7,
    ratingsCount: "31,200",
    image: "/assets/images/iphone14_plus.jpg",
    highlights: [
      "128 GB ROM",
      "17.02 cm (6.7 inch) Super Retina XDR Big Display",
      "12MP + 12MP Dual Camera with Photonic Engine",
      "A15 Bionic Chip",
      "Legendary multi-day battery endurance",
      "Crash Detection and Emergency SOS"
    ],
    description: "Big 6.7-inch Super Retina screen with longest battery life in standard iPhones. Perfect for binge-watching and gaming.",
    reviews: [
      {
        id: "r10",
        author: "Ketan Trivedi",
        location: "Gandhinagar, Gujarat",
        date: "3 days ago",
        rating: 5,
        title: "Battery champion! Lasts 2 full days without charge",
        comment: "For anyone who hates carrying power banks, this phone is a dream. Massive screen is bright and sharp.",
        helpful: 67
      }
    ]
  }
];

// Samsung Models (Fixed ₹1,000 - ₹1,500)
export const samsungPhones = [
  {
    id: "s25u",
    title: "Samsung Galaxy S25 Ultra 5G (Titanium Gray, 256 GB)",
    category: "Samsung",
    price: 1449,
    origPrice: 139999,
    discount: "99% off",
    rating: 4.9,
    ratingsCount: "8,340",
    image: "/assets/images/samsung_s25_ultra.jpg",
    highlights: [
      "12 GB RAM | 256 GB ROM",
      "17.27 cm (6.8 inch) Dynamic AMOLED 2X 120Hz Display",
      "200MP + 50MP + 50MP + 12MP Quad Pro Camera",
      "Built-in S-Pen with Air Gestures",
      "Snapdragon 8 Elite Processor for Galaxy",
      "5000 mAh Battery with 45W Fast Charging"
    ],
    description: "Galaxy S25 Ultra introduces Galaxy AI 2.0 with Snapdragon 8 Elite, a revolutionary 200MP camera with 100x Space Zoom, built-in S Pen stylus, and durable Titanium chassis.",
    reviews: [
      {
        id: "sr1",
        author: "Bhavik Shah",
        location: "Surat, Gujarat",
        date: "Yesterday",
        rating: 5,
        title: "200MP camera is insane! Zoomed into moon with zero blur",
        comment: "The S-Pen makes signing PDF documents and editing photos super convenient. Screen has zero glare even under direct sunlight.",
        helpful: 195
      },
      {
        id: "sr2",
        author: "Devendra Rao",
        location: "Pune, Maharashtra",
        date: "2 days ago",
        rating: 5,
        title: "Galaxy AI translation features helped me during business trips",
        comment: "Real-time call translation works seamlessly. Ultra smooth 120Hz display is gorgeous.",
        helpful: 114
      }
    ]
  },
  {
    id: "s24u",
    title: "Samsung Galaxy S24 Ultra 5G (Titanium Violet, 256 GB)",
    category: "Samsung",
    price: 1399,
    origPrice: 129999,
    discount: "99% off",
    rating: 4.8,
    ratingsCount: "19,850",
    image: "/assets/images/samsung_s24_ultra.jpg",
    highlights: [
      "12 GB RAM | 256 GB ROM",
      "17.27 cm (6.8 inch) Flat QHD+ AMOLED Display with Corning Gorilla Armor",
      "200MP + 50MP + 12MP + 10MP Camera Setup",
      "Snapdragon 8 Gen 3 Processor",
      "Circle to Search with Google & Live Translate",
      "Titanium frame construction"
    ],
    description: "Featuring Gorilla Armor anti-reflective glass and flat 6.8-inch display, the S24 Ultra delivers class-leading photo fidelity, AI capabilities, and S Pen productivity.",
    reviews: [
      {
        id: "sr3",
        author: "Manish Choksi",
        location: "Ahmedabad, Gujarat",
        date: "Yesterday",
        rating: 5,
        title: "Anti-reflective glass is an absolute gamechanger",
        comment: "Reading outdoors is like reading paper. Battery backup is very reliable and Titanium violet looks majestic.",
        helpful: 138
      }
    ]
  },
  {
    id: "s24fe",
    title: "Samsung Galaxy S24 FE 5G (Blue, 128 GB)",
    category: "Samsung",
    price: 1149,
    origPrice: 59999,
    discount: "98% off",
    rating: 4.7,
    ratingsCount: "14,210",
    image: "/assets/images/samsung_s24_fe.jpg",
    highlights: [
      "8 GB RAM | 128 GB ROM",
      "17.02 cm (6.7 inch) Dynamic AMOLED 2X Display",
      "50MP OIS + 12MP Ultra-wide + 8MP Telephoto Camera",
      "Exynos 2400e 4nm Flagship Processor",
      "Galaxy AI Photo Assist & Generative Edit",
      "4700 mAh Battery with Wireless PowerShare"
    ],
    description: "The Fan Edition flagship brings all Galaxy AI features, big 6.7-inch 120Hz display, and 50MP ProVisual camera engine at remarkable value.",
    reviews: [
      {
        id: "sr4",
        author: "Parth Somani",
        location: "Rajkot, Gujarat",
        date: "3 days ago",
        rating: 5,
        title: "Best value flagship in Samsung lineup",
        comment: "Got Galaxy AI photo editing, generative fill and high refresh rate screen. Haptics and sound quality are top notch.",
        helpful: 76
      }
    ]
  },
  {
    id: "zfold6",
    title: "Samsung Galaxy Z Fold 6 5G (Silver Shadow, 256 GB)",
    category: "Samsung",
    price: 1449,
    origPrice: 164999,
    discount: "99% off",
    rating: 4.8,
    ratingsCount: "4,190",
    image: "/assets/images/569da81e35fa.jpg",
    highlights: [
      "12 GB RAM | 256 GB ROM",
      "19.3 cm (7.6 inch) QXGA+ Foldable AMOLED Main Screen",
      "15.75 cm (6.2 inch) Dynamic AMOLED Cover Screen",
      "Snapdragon 8 Gen 3 for Galaxy",
      "Triple 50MP + 12MP + 10MP Camera",
      "Thinner, lighter Armor Aluminum hinge"
    ],
    description: "The thinnest, lightest Galaxy Z Fold yet. Unfolds into a mini-tablet with multi-window productivity, S Pen support, and immersive gaming.",
    reviews: [
      {
        id: "sr5",
        author: "Chirag Merchant",
        location: "Mumbai, Maharashtra",
        date: "2 days ago",
        rating: 5,
        title: "Feels like carrying a pocket computer",
        comment: "Running three apps simultaneously while trading stocks is effortless. Hinge closes completely flat with no gap.",
        helpful: 154
      }
    ]
  }
];

// Google Pixel Models (Fixed ₹1,000 - ₹1,500)
export const pixelPhones = [
  {
    id: "px9pxl",
    title: "Google Pixel 9 Pro XL (Hazel, 256 GB)",
    category: "Google Pixel",
    price: 1399,
    origPrice: 124999,
    discount: "99% off",
    rating: 4.8,
    ratingsCount: "6,420",
    image: "/assets/images/pixelphone.jpg",
    highlights: [
      "16 GB RAM | 256 GB ROM",
      "17.27 cm (6.8 inch) Super Actua 120Hz LTPO OLED Display",
      "50MP + 48MP Quad PD Telephoto + 48MP Ultra-wide",
      "42MP Auto-focus Selfie Camera",
      "Google Tensor G4 Chip with Gemini Nano",
      "5060 mAh Battery with 37W Fast Charging"
    ],
    description: "Google Pixel 9 Pro XL features the sleek new camera bar, Super Actua display, Gemini AI assistant built-in, 7 years of OS updates, and unmatched computational photography.",
    reviews: [
      {
        id: "pr1",
        author: "Jayesh Pandya",
        location: "Bhavnagar, Gujarat",
        date: "Yesterday",
        rating: 5,
        title: "Clean pure Android and unmatched camera skin tones",
        comment: "Zero bloatware, instant Android updates and the camera captures realistic skin tones like no other phone. Magic Editor works like magic.",
        helpful: 122
      },
      {
        id: "pr2",
        author: "Siddharth Jain",
        location: "Jaipur, Rajasthan",
        date: "3 days ago",
        rating: 5,
        title: "Gemini AI live assistant is super handy",
        comment: "Can ask questions by holding power button and it understands natural conversational English and Hindi.",
        helpful: 84
      }
    ]
  },
  {
    id: "px9",
    title: "Google Pixel 9 (Peony Pink, 128 GB)",
    category: "Google Pixel",
    price: 1149,
    origPrice: 79999,
    discount: "98% off",
    rating: 4.7,
    ratingsCount: "9,180",
    image: "/assets/images/pixel9_peony_pink.jpg",
    highlights: [
      "12 GB RAM | 128 GB ROM",
      "16.0 cm (6.3 inch) Actua OLED 120Hz Display",
      "50MP Main + 48MP Ultra Wide with Macro Focus",
      "Google Tensor G4 Processor",
      "Best Take & Audio Magic Eraser AI tools",
      "All-day battery life with Extreme Battery Saver"
    ],
    description: "Compact flagship with Tensor G4, polished glass back, satin finish metal frame, and Google's signature camera smarts.",
    reviews: [
      {
        id: "pr3",
        author: "Kavita Nair",
        location: "Kochi, Kerala",
        date: "2 days ago",
        rating: 5,
        title: "Audio Magic Eraser is mind blowing for video clips",
        comment: "Removes traffic noise from outdoor video recordings in seconds. Very light and comfortable in pocket.",
        helpful: 69
      }
    ]
  },
  {
    id: "px8a",
    title: "Google Pixel 8a (Bay Blue, 128 GB)",
    category: "Google Pixel",
    price: 1049,
    origPrice: 52999,
    discount: "98% off",
    rating: 4.7,
    ratingsCount: "22,400",
    image: "/assets/images/pixel8a_bay_blue.jpg",
    highlights: [
      "8 GB RAM | 128 GB ROM",
      "15.49 cm (6.1 inch) Actua 120Hz OLED Display",
      "64MP + 13MP Dual Camera with Night Sight",
      "Google Tensor G3 Processor",
      "IP67 Water and Dust Resistance",
      "7 years of Android Feature Drops"
    ],
    description: "The beloved Pixel a-series with vibrant matte blue texture, Tensor G3 performance, and flagship-grade computational photography.",
    reviews: [
      {
        id: "pr4",
        author: "Nilesh Panchal",
        location: "Ahmedabad, Gujarat",
        date: "Yesterday",
        rating: 5,
        title: "Night Sight photos look brighter than daylight!",
        comment: "Astrophotography mode captures stars clearly. 120Hz screen is very smooth and compact size fits comfortably.",
        helpful: 105
      }
    ]
  }
];

// Audio & Accessories (Fixed between ₹100 to ₹500)
export const audioAccessories = [
  {
    id: "jblf6",
    title: "JBL Flip 6 Wireless Portable Bluetooth Speaker (Black)",
    category: "Audio & JBL",
    price: 449,
    origPrice: 9999,
    discount: "95% off",
    rating: 4.8,
    ratingsCount: "38,200",
    image: "/assets/images/jbl_flip_6.jpg",
    highlights: [
      "30W RMS Bold Sound Output with 2-way speaker system",
      "Dual Passive Radiators for Deep Bass",
      "IP67 Waterproof and Dustproof",
      "Up to 12 Hours Battery Playtime on single charge",
      "PartyBoost compatible to pair multiple speakers",
      "USB-C Quick Charging protection"
    ],
    description: "The rugged JBL Flip 6 delivers powerful JBL Original Pro Sound with exceptional clarity thanks to its 2-way speaker system. Take your music everywhere with IP67 waterproof durability.",
    reviews: [
      {
        id: "ar1",
        author: "Rahul Suthar",
        location: "Ahmedabad, Gujarat",
        date: "Yesterday",
        rating: 5,
        title: "Bass that shakes the entire room!",
        comment: "Used it at a pool party yesterday. Completely waterproof and sound didn't distort even at 90% volume. Incredible battery life.",
        helpful: 210
      },
      {
        id: "ar2",
        author: "Deepak Rawat",
        location: "Dehradun, Uttarakhand",
        date: "2 days ago",
        rating: 5,
        title: "Genuine original JBL sound quality",
        comment: "Crystal clear vocals and tight punchy bass. USB-C fast charging fills it up in under 2 hours.",
        helpful: 145
      }
    ]
  },
  {
    id: "jblc5",
    title: "JBL Charge 5 Bluetooth Speaker with Built-in Powerbank",
    category: "Audio & JBL",
    price: 499,
    origPrice: 14999,
    discount: "96% off",
    rating: 4.9,
    ratingsCount: "16,400",
    image: "/assets/images/jbl_charge_5.jpg",
    highlights: [
      "40W RMS Monster Output with separate tweeter",
      "Up to 20 Hours of Playtime",
      "Built-in 7500mAh Powerbank to charge phones",
      "IP67 Waterproof & Dustproof",
      "Bluetooth 5.1 with multi-device pairing"
    ],
    description: "Play and charge endlessly. JBL Charge 5 features an optimized long excursion driver, separate tweeter, and dual pumping JBL bass radiators, plus a built-in power bank to keep your devices charged.",
    reviews: [
      {
        id: "ar3",
        author: "Sanjay Parmar",
        location: "Rajkot, Gujarat",
        date: "Yesterday",
        rating: 5,
        title: "Massive battery and charged my phone on camping trip!",
        comment: "Carried it on a weekend trip. Played music continuously and still had enough juice to charge my phone twice.",
        helpful: 133
      }
    ]
  },
  {
    id: "boat450",
    title: "boAt Rockerz 450 Bluetooth On-Ear Headphone (Luscious Black)",
    category: "Audio & JBL",
    price: 249,
    origPrice: 3990,
    discount: "93% off",
    rating: 4.6,
    ratingsCount: "1,45,200",
    image: "/assets/images/boat_rockerz_450.jpg",
    highlights: [
      "40mm Dynamic Drivers with HD Immersive Sound",
      "Up to 15 Hours Battery Playback",
      "Ergonomic fit with adaptive earcups",
      "Dual Modes: Bluetooth and 3.5mm AUX connectivity",
      "In-line microphone with voice assistant activation"
    ],
    description: "Step into the musical realm with boAt Rockerz 450. Fitted with 40mm drivers for punchy rhythmic bass and lightweight cushioned earcups.",
    reviews: [
      {
        id: "ar5",
        author: "Manoj Rathod",
        location: "Ahmedabad, Gujarat",
        date: "Yesterday",
        rating: 5,
        title: "Value for money king! Bass is great",
        comment: "Using for college online lectures and gym workouts. Good connectivity and comfortable fit.",
        helpful: 180
      }
    ]
  },
  {
    id: "fastrackfs1",
    title: "Fastrack Limitless FS1 Pro Smart Watch (1.96\" Super AMOLED)",
    category: "Smartwatches",
    price: 349,
    origPrice: 3995,
    discount: "91% off",
    rating: 4.6,
    ratingsCount: "54,200",
    image: "/assets/images/smartwatch.jpg",
    highlights: [
      "1.96\" Super AMOLED Curved Display with Always-On",
      "SingleSync BT Calling with crystal mic",
      "110+ Sports Modes with Auto-recognition",
      "24x7 Heart Rate, SpO2 & Stress monitoring",
      "7 Days battery life with NitroFast charging"
    ],
    description: "The Fastrack FS1 Pro features an ultra-bright curved AMOLED display, Bluetooth calling with clear speaker output, and advanced fitness telemetry.",
    reviews: [
      {
        id: "wr1",
        author: "Pratik Barot",
        location: "Gandhinagar, Gujarat",
        date: "Yesterday",
        rating: 5,
        title: "Super AMOLED screen is bright and vivid",
        comment: "Calling feature works smoothly while driving bike. Pedometer and sleep tracking are accurate.",
        helpful: 72
      }
    ]
  },
  {
    id: "apple20w",
    title: "Apple 20W USB-C Fast Power Adapter (White)",
    category: "Accessories",
    price: 149,
    origPrice: 1900,
    discount: "92% off",
    rating: 4.8,
    ratingsCount: "86,400",
    image: "/assets/images/apple20w.png",
    highlights: [
      "20W Power Delivery Fast Charging",
      "Charges iPhone 8 or later up to 50% in 30 minutes",
      "Original Apple certified safety with surge protection",
      "Compact travel-ready pin architecture"
    ],
    description: "The Apple 20W USB-C Power Adapter offers fast, efficient charging at home, in the office, or on the go.",
    reviews: [
      {
        id: "ac1",
        author: "Amit Solanki",
        location: "Ahmedabad, Gujarat",
        date: "Yesterday",
        rating: 5,
        title: "Charges my iPhone 15 from 10% to 60% in 25 mins!",
        comment: "Original quality adapter. Doesn't overheat phone while fast charging.",
        helpful: 160
      }
    ]
  },
  {
    id: "cello900",
    title: "Cello Puro Steel-X Stainless Steel Insulated Flask (900 ml)",
    category: "Accessories",
    price: 129,
    origPrice: 599,
    discount: "78% off",
    rating: 4.6,
    ratingsCount: "42,000",
    image: "/assets/images/cello_puro_flask.jpg",
    highlights: [
      "Double walled vacuum insulation maintains temperature for 18 hours",
      "Food-grade 304 stainless steel interior",
      "100% Leak-proof lid with ergonomic carry handle",
      "Sweat-free and rust-proof exterior"
    ],
    description: "Keep your beverages icy cold or piping hot throughout the day with Cello's double-wall vacuum insulated stainless steel bottle.",
    reviews: [
      {
        id: "ac3",
        author: "Varsha Soni",
        location: "Surat, Gujarat",
        date: "3 days ago",
        rating: 5,
        title: "Keeps chilled water cold all day during summer",
        comment: "Strong build quality, doesn't leak in backpack. Great for office and gym usage.",
        helpful: 52
      }
    ]
  },
  {
    id: "fastchargecable",
    title: "Flipkart SmartBuy 100W Fast Charging Braided Type-C Cable",
    category: "Accessories",
    price: 119,
    origPrice: 799,
    discount: "85% off",
    rating: 4.7,
    ratingsCount: "68,000",
    image: "/assets/images/b52cae55b7c3.jpeg",
    highlights: [
      "100W Power Delivery SuperVOOC / Dash / DART compatible",
      "Reinforced Nylon Braided 1.2m wire",
      "480Mbps Data Sync Speed",
      "Tangle-free durable connectors tested for 10,000 bends"
    ],
    description: "High speed 100W PD charging cable with military grade braided jacket and gold-plated pins.",
    reviews: [
      {
        id: "ac5",
        author: "Bhavesh Rana",
        location: "Ahmedabad, Gujarat",
        date: "Yesterday",
        rating: 5,
        title: "Heavy duty cable, rapid fast charges without heating",
        comment: "Best cable in this budget. Connectors fit snugly into the phone port.",
        helpful: 84
      }
    ]
  }
];

export const allProducts = catalogProducts;


