import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.resolve(__dirname, '../src/data/products.json');
const reviewsJsonPath = path.resolve(__dirname, '../src/data/reviews.json');

const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Diverse Indian names
const indianNames = [
  'Aarav Patel', 'Pooja Verma', 'Rohit Sharma', 'Sneha Kulkarni',
  'Amit Kumar', 'Ananya Iyer', 'Vikram Singh', 'Kavita Joshi',
  'Deepak Mehta', 'Priya Nair', 'Manish Gupta', 'Ritu Desai',
  'Jayesh Trivedi', 'Bhavna Parmar', 'Hardik Shah', 'Sanjay Kumar',
  'Neha Reddy', 'Rahul Suthar', 'Divya Menon', 'Rajesh Panchal',
  'Kiran More', 'Alok Pandey', 'Sunita Rao', 'Arjun Das',
  'Meera Bhat', 'Suresh Pillai', 'Preeti Agrawal', 'Kunal Ghosh',
  'Shalini Tiwari', 'Gaurav Chauhan', 'Tanvi Saxena', 'Mahesh Solanki',
  'Rekha Choudhary', 'Nitin Varma', 'Farhan Shaikh', 'Simran Kaur',
  'Bhavesh Rana', 'Swati Deshmukh', 'Ashok Singhal', 'Poonam Yadav',
  'Jitendra Mishra', 'Geeta Sen', 'Mohit Jain', 'Komal Chawla',
  'Umesh Joshi', 'Vandana Shukla', 'Chirag Barot', 'Rashmi Hegde',
  'Harish Nambiar', 'Payal Agarwal', 'Siddharth Roy', 'Anita Bisht'
];

// Indian Cities
const indianCities = [
  'Ahmedabad, Gujarat', 'Surat, Gujarat', 'Vadodara, Gujarat', 'Rajkot, Gujarat',
  'Mumbai, Maharashtra', 'Pune, Maharashtra', 'Nagpur, Maharashtra',
  'Bengaluru, Karnataka', 'Mysuru, Karnataka',
  'Delhi, NCR', 'Noida, UP', 'Gurugram, Haryana',
  'Jaipur, Rajasthan', 'Jodhpur, Rajasthan',
  'Hyderabad, Telangana', 'Chennai, Tamil Nadu', 'Coimbatore, Tamil Nadu',
  'Kolkata, West Bengal', 'Indore, MP', 'Bhopal, MP',
  'Chandigarh, Punjab', 'Lucknow, UP', 'Patna, Bihar'
];

// Time ago strings
const reviewTimes = [
  'Just now', 'Today', 'Yesterday', '2 days ago', '3 days ago', '4 days ago',
  '5 days ago', '1 week ago', '2 weeks ago', '3 weeks ago', '1 month ago',
  '5 weeks ago', '2 months ago', '3 months ago', '4 months ago', '5 months ago',
  '6 months ago', '8 months ago', '1 year ago'
];

// Category-specific review content pools
const reviewPools = {
  Fashion: {
    5: [
      { title: 'Superb quality & fantastic fit!', comment: 'Received genuine product in original packaging. The material feels premium, stitching is sturdy, and fitting is true to size. Highly recommended!' },
      { title: 'Worth every single rupee!', comment: 'Looks even more stylish in real life than in photos. Wore it all day and comfort level is 10/10. Definitely purchasing another color.' },
      { title: 'Mindblowing finish!', comment: 'Fabric is soft, breathable and premium quality. Color has not faded at all even after two washes. Super satisfied!' },
      { title: 'Classy look and feel', comment: 'Extremely lightweight and comfortable. Got multiple compliments from friends. Flipkart delivery was lightning fast.' },
      { title: 'Value for money deal!', comment: 'At this Big Billion Days discount, this is an absolute steal deal. Quality matches top retail showroom brands.' },
      { title: 'Perfect size & comfortable', comment: 'Accurate sizing chart. Fitting is snug and comfortable. Perfect for both casual outings and daily wear.' }
    ],
    4: [
      { title: 'Good product for the price', comment: 'Overall happy with the purchase. Material is good. Slight thread loose at the corner but easily trimmed. Good daily wear.' },
      { title: 'Nice quality, minor color shade difference', comment: 'Product is durable and comfortable. The color shade is slightly darker than the product photos, but still looks handsome.' },
      { title: 'Satisfied with purchase', comment: 'Delivered in 2 days. Quality is reliable for everyday use. Value for money under this price bracket.' },
      { title: 'Pretty good fitting', comment: 'Fits nicely. Material is comfortable for summer and winter. Would recommend ordering your standard size.' }
    ],
    3: [
      { title: 'Decent, average quality', comment: 'Quality is okay for the price paid. Nothing extraordinary but works fine for daily rough usage.' },
      { title: 'Just average product', comment: 'Material feels a bit thinner than expected. Fitting is okay. Good for casual wear at home.' },
      { title: 'Fair product for budget buyers', comment: 'Looks nice from outside. Finishing inside could have been neater. Average comfort.' }
    ],
    2: [
      { title: 'Below expectations', comment: 'Fabric quality feels cheap and stiff. Fitting was tight around the edges. Had to request size exchange.' },
      { title: 'Not satisfied with finish', comment: 'Stitching was irregular near the seams. Expected better durability from this brand.' }
    ],
    1: [
      { title: 'Disappointed with quality', comment: 'Color faded slightly on first wash. Material shrank and fitting became uncomfortable. Would not recommend.' },
      { title: 'Size is completely off', comment: 'Ordered size L but it feels like size S. Very disappointed with sizing accuracy.' }
    ]
  },

  Mobiles: {
    5: [
      { title: 'Pure flagship luxury!', comment: 'Display is breathtaking with smooth 120Hz refresh rate. Camera clarity in daylight and night mode is outstanding. Battery easily lasts 1.5 days on 5G!' },
      { title: 'Beast performance & camera!', comment: 'Zero lag or stutter while multitasking and heavy gaming. 5G network reception is super fast and speaker audio is crisp.' },
      { title: 'Worth every rupee!', comment: 'Upgraded after 3 years and the difference in speed and build quality is massive. Charging is rapid and build feels ultra premium.' },
      { title: 'Mindblowing camera details', comment: 'Portrait mode cutouts and 4K video stabilization are class-leading. Natural skin tones and zero shutter lag. 10/10 phone.' },
      { title: 'Best smartphone in this segment', comment: 'Compact in hand, lightweight design with solid grip. Clean software UI without unnecessary bloatware. Highly satisfied!' }
    ],
    4: [
      { title: 'Very good phone overall', comment: 'Performance and screen quality are fantastic. Heats up slightly during 45 mins of continuous 4K recording, otherwise solid daily driver.' },
      { title: 'Solid battery & clean display', comment: 'Battery backup is 7+ hours screen on time. Camera is reliable. Only downside is no charging adapter included in the box.' },
      { title: 'Smooth performance', comment: 'Apps open instantaneously. Haptic feedback is pleasant. Night photography takes 2 seconds processing but result is good.' }
    ],
    3: [
      { title: 'Decent phone, battery could be better', comment: 'Screen and build are good, but battery drains faster on 5G mobile data compared to Wi-Fi. Average standby time.' },
      { title: 'Average camera in low light', comment: 'Daylight shots are crisp, but night photos have visible grain and noise. Decent phone for regular users.' },
      { title: 'Good for basic use', comment: 'Handles social media and calls with ease. Not meant for intense graphic gaming.' }
    ],
    2: [
      { title: 'Heating issue noticed', comment: 'Gets uncomfortably warm during charging and gaming. Battery percentage drops rapidly below 20%.' },
      { title: 'Software has bugs', comment: 'Occasional frame drops in UI transitions. Camera shutter button lags when taking rapid bursts.' }
    ],
    1: [
      { title: 'Battery backup is terrible', comment: 'Need to charge twice a day even on moderate usage. Very disappointed considering the price.' },
      { title: 'Poor low-light camera', comment: 'Images come out blurry and soft indoors. Expected much better sensor quality.' }
    ]
  },

  Electronics: {
    5: [
      { title: 'Bass is punchy and room-filling!', comment: 'Soundstage is wide with rich bass and crystal clear vocals. Connects instantly with Bluetooth 5.3 and battery backup is insane!' },
      { title: 'Supreme build & sound quality', comment: 'Noise cancellation works wonders in traffic. Ear cushions are plush for long 5-hour sessions without fatigue.' },
      { title: 'Best audio gear in this price!', comment: 'Tuned with balanced mids and trebles. No distortion even at 100% volume. Build feels durable.' },
      { title: 'Incredible value & battery life', comment: 'Charged it once and used it for 4 days straight on daily commute. Fast Type-C charging is super convenient.' }
    ],
    4: [
      { title: 'Great sound, decent microphone', comment: 'Music playback is 10/10. Microphone audio in noisy outdoor environments is a bit soft, but works fine indoors.' },
      { title: 'Solid performance', comment: 'Connects seamlessly with both laptop and phone. Build is sturdy plastic. Good value.' },
      { title: 'Comfortable & clear audio', comment: 'Lightweight design and snug fit. Volume levels are loud enough. Satisfied with purchase.' }
    ],
    3: [
      { title: 'Decent sound for everyday use', comment: 'Bass is average, treble is clear. Good enough for online classes and casual music.' },
      { title: 'Average build quality', comment: 'Audio output is okay, but cable/body feels slightly delicate. Needs careful handling.' }
    ],
    2: [
      { title: 'Connectivity drops occasionally', comment: 'Bluetooth disconnects randomly when moving more than 5 meters away from the phone.' },
      { title: 'Bass is lacking', comment: 'Audio output feels flat and tinny. Not recommended for bass lovers.' }
    ],
    1: [
      { title: 'Stopped working after 3 weeks', comment: 'Right side driver volume dropped to zero. Customer support turnaround is slow.' },
      { title: 'Poor build quality', comment: 'Ear cushion stitching tore within 15 days. Very fragile plastic frame.' }
    ]
  },

  Appliances: {
    5: [
      { title: 'Works like a charm! Rapid heating', comment: 'Boils water/cooks within 2-3 minutes. Auto shut-off mechanism is completely reliable and safe. Heavy gauge body.' },
      { title: 'Must-have kitchen appliance', comment: 'Saves so much cooking time daily. Energy efficient, easy to clean, and takes very little counter space.' },
      { title: 'Superb build & durability', comment: 'Stainless steel finish looks modern. Power cord is heavy duty. 100% satisfied with performance.' }
    ],
    4: [
      { title: 'Good appliance, cord length is short', comment: 'Heating and motor speed are excellent. Only small issue is 1-meter power cord requires nearby power plug.' },
      { title: 'Reliable performance', comment: 'Using daily for 2 weeks. Operates smoothly with minimal noise. Good product under budget.' }
    ],
    3: [
      { title: 'Average appliance', comment: 'Gets the job done but motor/body gets warm during prolonged 10-minute continuous operation.' },
      { title: 'Decent for small family', comment: 'Capacity is slightly smaller than expected, but functions properly.' }
    ],
    2: [
      { title: 'Lid fitment is loose', comment: 'Steam leaks from the top lid rim during boiling. Expected tighter rubber seal.' },
      { title: 'Noisy operation', comment: 'Vibrates significantly on maximum speed setting. Build feels lightweight.' }
    ],
    1: [
      { title: 'Defective thermostat', comment: 'Auto-cut did not trip and water kept boiling dry. Very poor safety.' },
      { title: 'Burning smell on first use', comment: 'Emitted strong burning plastic odor from motor vent. Had to stop using.' }
    ]
  },

  Beauty: {
    5: [
      { title: 'Visible results in 2 weeks!', comment: 'Skin texture improved drastically, acne spots faded, and gives a healthy radiant glow without feeling sticky. Holy grail product!' },
      { title: 'Non-greasy, absorbs instantly', comment: 'Lightweight formulation that sinks into skin in seconds. Leaves zero white cast or oily residue. Suitable for all skin types.' },
      { title: 'Gentle on sensitive skin', comment: 'Zero irritation, zero breakouts. Keeps skin deeply hydrated throughout the day. Authentic product with security seal.' }
    ],
    4: [
      { title: 'Good serum, subtle fragrance', comment: 'Moisturizes well and evens skin tone. Fragrance is mild. Takes a few weeks of consistent use for best results.' },
      { title: 'Pleasant and effective', comment: 'Skin feels soft and supple in morning. Good packaging with convenient dropper applicator.' }
    ],
    3: [
      { title: 'Average moisturizer', comment: 'Does basic hydration. Did not notice major glow or spot reduction, but does not cause acne.' },
      { title: 'Okay for daily use', comment: 'Slightly sticky if applied in excess humidity. Otherwise decent.' }
    ],
    2: [
      { title: 'Did not suit my skin', comment: 'Caused minor redness and tiny bumps after 3 days. Not recommended for very sensitive skin.' },
      { title: 'Leaky dispenser pump', comment: 'Product leaked inside the delivery carton during courier transit.' }
    ],
    1: [
      { title: 'Severe breakout triggered', comment: 'Clogged pores and broke out in acne on forehead. Discontinued immediately.' },
      { title: 'Received near expiry batch', comment: 'Manufactured 18 months ago with only 2 months shelf life remaining.' }
    ]
  },

  Home: {
    5: [
      { title: 'Super soft pure cotton & vibrant colors!', comment: 'Feels like 5-star hotel linen. Fabric didn’t shrink or bleed color after machine washing. Stitching is heavy duty.' },
      { title: 'Transformed my living room!', comment: 'High aesthetic appeal. Quality and thickness of the material is much superior to local market products.' },
      { title: 'Excellent value for home upgrade', comment: 'Durable, premium finish, and accurate dimensions. Packaging was neat and delivered on time.' }
    ],
    4: [
      { title: 'Good quality, slight color variance', comment: 'Fabric is soft and comfortable. Shade is slightly darker than the product photograph. Overall satisfied.' },
      { title: 'Durable and practical', comment: 'Stitching is firm. Value for money item for daily household use.' }
    ],
    3: [
      { title: 'Decent daily use item', comment: 'Fabric is average thickness. Good for rough daily use but not luxury quality.' },
      { title: 'Average finish', comment: 'Thread count feels around 140. Does the basic job.' }
    ],
    2: [
      { title: 'Color faded on first wash', comment: 'Washed in cold water but noticeable color bleed onto other garments.' },
      { title: 'Rough texture after washing', comment: 'Lost its initial softness after first wash and feels stiff.' }
    ],
    1: [
      { title: 'Very thin material', comment: 'Transparently thin fabric. Seam started unraveling within one week.' },
      { title: 'Incorrect dimensions sent', comment: 'Length is 6 inches shorter than mentioned in specifications.' }
    ]
  },

  Toys: {
    5: [
      { title: 'My kid loves it! Hours of screen-free fun', comment: 'Smooth rounded edges with zero sharp burrs. High grade non-toxic plastic that withstands rough toddler handling. 10/10!' },
      { title: 'Extremely durable & engaging', comment: 'Colors are bright and mechanics work flawlessly. Great educational and motor-skill value.' },
      { title: 'Best gift item for kids', comment: 'Delivered in pristine gift packaging. Sturdy construction that can survive accidental drops.' }
    ],
    4: [
      { title: 'Fun toy, batteries not included', comment: 'Kids enjoy playing with it. Only note is you need to purchase 2 AA batteries separately.' },
      { title: 'Good interactive toy', comment: 'Nice sound and movement. Plastic quality is decent for the price.' }
    ],
    3: [
      { title: 'Average build, loud volume', comment: 'Toy works fine but sound effects are a bit too loud without a volume adjustment switch.' },
      { title: 'Okay for toddlers', comment: 'Small parts require adult supervision. Decent play value.' }
    ],
    2: [
      { title: 'Fragile plastic parts', comment: 'One of the wheel clips snapped when dropped from sofa height.' },
      { title: 'Battery drains too fast', comment: 'New alkaline batteries lasted only 2 hours of continuous play.' }
    ],
    1: [
      { title: 'Broke on the first day', comment: 'Motor stopped spinning after 30 minutes of gentle play. Very flimsy.' },
      { title: 'Cheap toxic plastic smell', comment: 'Strong chemical plastic smell from the box. Unsafe for young children.' }
    ]
  },

  'Food & Health': {
    5: [
      { title: '100% fresh, crunchy & authentic taste!', comment: 'Zero stale or bitter pieces. Sealed in food-grade airtight zipper pouch. High energy and nutrient packed.' },
      { title: 'Pure natural quality without adulteration', comment: 'Rich authentic aroma and taste. Certified lab-tested purity feel. Regularly ordering now.' },
      { title: 'Superb health supplement', comment: 'Digestibility is smooth, mixes effortlessly without lumps. Noticeable boost in daily stamina.' }
    ],
    4: [
      { title: 'Good taste, zip lock could be better', comment: 'Contents are fresh and delicious. The pouch zip seal requires extra pressure to close properly.' },
      { title: 'Fresh quality product', comment: 'Good crunch and aroma. Value for money for monthly kitchen pantry stocking.' }
    ],
    3: [
      { title: 'Average taste and size', comment: 'Some pieces were smaller in size than expected. Taste is acceptable.' },
      { title: 'Decent daily staple', comment: 'Quality is okay for basic daily consumption.' }
    ],
    2: [
      { title: 'Slightly stale smell', comment: 'Moisture seemed to have entered the pack, making pieces less crunchy.' },
      { title: 'Overly sweet / altered flavor', comment: 'Flavor feels artificially enhanced rather than 100% natural.' }
    ],
    1: [
      { title: 'Damaged packaging seal', comment: 'Jar seal was broken inside the parcel. Unhygienic and unsafe to consume.' },
      { title: 'Bitter and rancid taste', comment: 'Batch delivered was close to expiry date and tasted stale.' }
    ]
  },

  'Auto Acc': {
    5: [
      { title: 'Heavy duty build & works flawlessly!', comment: 'Rock solid mount that doesn’t wobble even on Indian potholes. Premium metal/ABS construction with snug grip.' },
      { title: 'Lifesaver accessory for car/bike', comment: 'High precision and fast operation. Compact size fits easily in glovebox or under bike seat.' },
      { title: 'Top-tier safety & finish', comment: 'ISI certified standards. Padding is plush and fitment is aerodynamic with zero vibration.' }
    ],
    4: [
      { title: 'Good accessory, cable slightly short', comment: 'Performs reliably. Would have appreciated an extra 50cm wire length for reaching rear tyres.' },
      { title: 'Sturdy & practical', comment: 'Clamps securely onto handlebar/dashboard. Good finish.' }
    ],
    3: [
      { title: 'Decent for occasional city use', comment: 'Works okay on smooth city roads, but vibrates slightly on gravel roads.' },
      { title: 'Average build quality', comment: 'Plastic finish could be thicker, but performs basic function.' }
    ],
    2: [
      { title: 'Clamp screw loosened up', comment: 'Needs frequent retightening after riding on bumpy roads.' },
      { title: 'Suction cup falls off in hot sun', comment: 'Dashboard heat causes suction cup to lose grip after 2 hours.' }
    ],
    1: [
      { title: 'Broke within 10 days', comment: 'Plastic hinge snapped while tightening on the mirror bracket.' },
      { title: 'Defective power socket pin', comment: 'Fuse blew up in 12V car socket on first plug in.' }
    ]
  },

  Sports: {
    5: [
      { title: 'Exceptional grip, non-slip & durable!', comment: 'High density material that cushions knees and joints perfectly. No foul rubber smell and sweat-resistant grip.' },
      { title: 'Professional gym-grade quality', comment: 'Solid weight calibration, ergonomic grip, and rust-resistant finish. Perfect for serious home fitness.' },
      { title: 'Superb balance and crisp rebound', comment: 'Lightweight frame with high string tension. Gives explosive smashes and effortless control.' }
    ],
    4: [
      { title: 'Good fitness gear for home gym', comment: 'Comfortable to hold and exercise with. Slight rubber smell for first 2 days, then vanished.' },
      { title: 'Sturdy and reliable', comment: 'Durable construction. Helps maintain proper workout posture.' }
    ],
    3: [
      { title: 'Average thickness for basic yoga', comment: 'Okay for stretching and light yoga, but thin for heavy knee-bearing poses.' },
      { title: 'Decent recreational gear', comment: 'Good for weekend beginners, not for tournament level.' }
    ],
    2: [
      { title: 'Grip tape started peeling', comment: 'Handle wrap uncoiled during intense 30-min badminton match.' },
      { title: 'Weight inaccurate by 200g', comment: 'Checked on digital scale, each dumbbell is 2.3kg instead of 2.5kg.' }
    ],
    1: [
      { title: 'Material tore after 1 week', comment: 'Surface peeled off from shoe pressure during lunges. Very poor density.' },
      { title: 'Frame bent on mild impact', comment: 'Aluminium rim bent easily during regular play.' }
    ]
  },

  Furniture: {
    5: [
      { title: 'Super sturdy, premium wooden finish!', comment: 'Assembly was easy with provided tools and diagram. Looks like a luxury ₹4,000 showroom piece in my room!' },
      { title: 'Sturdy, ergonomic & space saving', comment: 'High weight capacity, doesn’t wobble, and smooth edge banding all around. Absolutely love it!' },
      { title: 'Top quality engineered wood', comment: 'Moisture resistant coating, heavy hardware fittings, and zero scratches. Delivered with thermocol protection.' }
    ],
    4: [
      { title: 'Good table, took 25 mins to assemble', comment: 'Once built, it is rock solid and holds monitor and books with ease. Instructions could have bigger font.' },
      { title: 'Satisfied with storage capacity', comment: 'Neat compartments and smooth finish. Fits snugly in bedroom corner.' }
    ],
    3: [
      { title: 'Average quality engineered wood', comment: 'Decent for light books and decor, but avoid placing very heavy weight.' },
      { title: 'Okay for student use', comment: 'Serves basic study purpose. Edge laminates are average.' }
    ],
    2: [
      { title: 'One screw hole was misaligned', comment: 'Had to drill a new hole manually to fix the middle shelf level.' },
      { title: 'Minor edge chip on arrival', comment: 'Corner laminate was chipped during courier handling. Applied glue.' }
    ],
    1: [
      { title: 'Wobbly and unstable frame', comment: 'Legs are uneven and table wobbles constantly while typing.' },
      { title: 'Very fragile particle board', comment: 'Board cracked around screw joints when tightening. Poor material.' }
    ]
  }
};

// Generic fallback pool if category not found
const genericPool = {
  5: [
    { title: 'Exceptional product, fully satisfied!', comment: 'Received original sealed product in perfect condition. Exceeded expectations in terms of build and utility.' },
    { title: 'Best purchase on Big Billion Days!', comment: 'Incredible value for money. Daily user now and performance has been spotless.' },
    { title: 'Outstanding quality and fast delivery', comment: 'Premium material, sturdy finish, and arrived 2 days earlier than scheduled.' }
  ],
  4: [
    { title: 'Good product for the price', comment: 'Works as advertised. Quality is solid for the discounted price. Recommended.' },
    { title: 'Pretty good overall', comment: 'Satisfied with product performance. Packaging was neat.' }
  ],
  3: [
    { title: 'Average product, does the job', comment: 'Fair quality for daily rough use. Nothing outstanding but acceptable.' }
  ],
  2: [
    { title: 'Expected better durability', comment: 'Build quality feels lightweight. Finishing could be refined.' }
  ],
  1: [
    { title: 'Disappointed with purchase', comment: 'Did not match expectations based on online product description.' }
  ]
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateReviewsForProduct(product) {
  // Target: between 22 and 32 reviews per product
  const targetCount = getRandomInt(22, 32);
  const categoryPool = reviewPools[product.category] || genericPool;
  const webPhotoPath = `/assets/images/reviews/rev_${product.id}.jpg`;

  const reviews = [];

  // Distribution:
  // ~55% 5 stars (Best / Excellent)
  // ~25% 4 stars (Good)
  // ~12% 3 stars (Neutral / Average)
  // ~8% 1 or 2 stars (Bad / Poor)
  const count5 = Math.round(targetCount * 0.55);
  const count4 = Math.round(targetCount * 0.25);
  const count3 = Math.round(targetCount * 0.12);
  const count12 = targetCount - (count5 + count4 + count3);

  const ratingsDistribution = [];
  for (let i = 0; i < count5; i++) ratingsDistribution.push(5);
  for (let i = 0; i < count4; i++) ratingsDistribution.push(4);
  for (let i = 0; i < count3; i++) ratingsDistribution.push(3);
  for (let i = 0; i < count12; i++) {
    ratingsDistribution.push(Math.random() < 0.6 ? 2 : 1);
  }

  // Shuffle ratings array so reviews are naturally distributed in time
  for (let i = ratingsDistribution.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ratingsDistribution[i], ratingsDistribution[j]] = [ratingsDistribution[j], ratingsDistribution[i]];
  }

  // Ensure first review is a stellar 5-star review with customer photo
  if (ratingsDistribution[0] !== 5) {
    const idx5 = ratingsDistribution.indexOf(5);
    if (idx5 !== -1) {
      [ratingsDistribution[0], ratingsDistribution[idx5]] = [ratingsDistribution[idx5], ratingsDistribution[0]];
    } else {
      ratingsDistribution[0] = 5;
    }
  }

  // Decide which reviews get customer photos (2 to 4 reviews per product)
  const photoIndices = new Set([0]); // First review always has photo
  const numExtraPhotos = getRandomInt(1, 3);
  while (photoIndices.size < numExtraPhotos + 1 && photoIndices.size < targetCount) {
    const pick = getRandomInt(1, targetCount - 1);
    photoIndices.add(pick);
  }

  // Used reviewer names to prevent exact duplicate authors on the same product
  const usedAuthors = new Set();

  for (let idx = 0; idx < ratingsDistribution.length; idx++) {
    const rating = ratingsDistribution[idx];
    const ratingPool = categoryPool[rating] || genericPool[rating] || genericPool[5];
    const template = getRandomItem(ratingPool);

    let author = getRandomItem(indianNames);
    while (usedAuthors.has(author)) {
      author = getRandomItem(indianNames) + ' ' + String.fromCharCode(65 + (idx % 26)) + '.';
    }
    usedAuthors.add(author);

    const location = getRandomItem(indianCities);
    const time = reviewTimes[Math.min(idx, reviewTimes.length - 1)];

    const hasPhoto = photoIndices.has(idx);
    const likes = rating >= 4 ? getRandomInt(25, 340) : getRandomInt(4, 45);
    const dislikes = rating >= 4 ? getRandomInt(1, 15) : getRandomInt(2, 28);

    const rev = {
      id: `rev_${product.id}_${idx + 1}`,
      productId: product.id,
      rating: rating,
      ratingType: rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Neutral' : 'Poor',
      title: template.title,
      comment: template.comment,
      author: author,
      location: location,
      time: time,
      verified: Math.random() > 0.08, // 92% certified buyers
      likes: likes,
      dislikes: dislikes
    };

    if (hasPhoto) {
      rev.image = webPhotoPath;
      rev.images = [webPhotoPath];
    }

    reviews.push(rev);
  }

  return reviews;
}

function main() {
  console.log('================================================================');
  console.log('Generating 20-35 Comprehensive Reviews for All 220 Products');
  console.log('Categories covered: All 11 categories');
  console.log('Rating types: Best (5★), Good (4★), Neutral (3★), Bad (1-2★)');
  console.log('================================================================\n');

  const allReviewsMap = {};
  let totalReviewsCount = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const pReviews = generateReviewsForProduct(p);
    allReviewsMap[p.id] = pReviews;
    totalReviewsCount += pReviews.length;

    // Also update directly on product object
    p.reviews = pReviews;
    p.ratingsCount = `${(pReviews.length * 128 + 340).toLocaleString('en-IN')}`;
    
    // Calculate realistic weighted rating average
    const sumRatings = pReviews.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = parseFloat((sumRatings / pReviews.length).toFixed(1));
    p.rating = avgRating;
  }

  // 1. Write dedicated reviews.json
  fs.writeFileSync(reviewsJsonPath, JSON.stringify(allReviewsMap, null, 2), 'utf8');
  console.log(`✓ Created src/data/reviews.json (${(fs.statSync(reviewsJsonPath).size / 1024).toFixed(1)} KB)`);

  // 2. Also update products.json so each product carries its reviews directly
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
  console.log(`✓ Updated src/data/products.json with full 20-35 reviews per product`);

  console.log('\n================================================================');
  console.log(`Total Products Processed: ${products.length}`);
  console.log(`Total Reviews Generated: ${totalReviewsCount}`);
  console.log(`Average Reviews per Product: ${(totalReviewsCount / products.length).toFixed(1)}`);
  console.log('All rating tiers included: 5★ (Best), 4★ (Good), 3★ (Neutral), 1-2★ (Bad)');
  console.log('================================================================\n');
}

main();
