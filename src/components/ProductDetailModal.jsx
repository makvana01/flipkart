import React, { useState, useMemo, useEffect } from 'react';
import reviewsData from '../data/reviews.json';
import { useLiveSaleTimer } from './LiveSaleTimer';

// Helper to normalize any product into the exact Flipkart mobile PDP format
function normalizeProductDetails(product, deliveryLocation) {
  if (!product) return null;

  // 1. Original Price & Discount calculation
  const origPrice = product.origPrice || Math.round(product.price * 1.35);
  const discountPct = product.discount 
    ? parseInt(String(product.discount).replace(/\D/g, '')) || Math.max(5, Math.round(((origPrice - product.price) / origPrice) * 100))
    : Math.max(5, Math.round(((origPrice - product.price) / origPrice) * 100));

  // 2. Protect Promise Fee
  const protectFee = product.protectFee || (product.price > 20000 ? 256 : product.price > 5000 ? 149 : product.price > 1000 ? 99 : 49);

  // 3. Delivery info
  const deliveryDate = product.deliveryDate || 'Friday, 16 Oct';
  const seller = product.seller || (product.price > 10000 ? 'TREASURE HAUL ONLINE' : 'SUPERCOM NET RETAILS');
  const sellerRating = product.sellerRating || '4.6';
  const sellerYears = product.sellerYears || '7 years on Flipkart';
  // 4. Category & Product Type Detection
  const cat = (product.category || '').toLowerCase();
  const title = (product.title || '').toLowerCase();

  const isCharger = title.includes('charger') || title.includes('adapter') || title.includes('cable') || title.includes('20w') || title.includes('power bank') || title.includes('powerbank');
  const isCase = title.includes('case') || title.includes('cover') || title.includes('protector');
  const isWatch = title.includes('watch') || title.includes('smartwatch');
  const isAudio = (cat.includes('audio') || cat.includes('speaker') || title.includes('ear') || title.includes('headphone') || title.includes('jbl') || title.includes('boat') || title.includes('airpods') || title.includes('buds') || title.includes('meta')) && !isCharger && !isCase;
  const isShoes = cat.includes('fashion') || cat.includes('shoe') || title.includes('shoe') || title.includes('sneaker') || title.includes('bersache');
  const isIpad = (title.includes('ipad') || cat.includes('tablet') || title.includes('tablet') || title.includes('tab')) && !isCase && !isCharger;

  // Actual smartphones only (strictly exclude chargers, adapters, cables, cases, watches, audio)
  const isIphone = title.includes('iphone') && !isCase && !isCharger && !isWatch;
  const isSamsung = (title.includes('galaxy s') || title.includes('galaxy z') || title.includes('s24') || title.includes('s25') || title.includes('s23') || title.includes('galaxy a') || title.includes('galaxy m') || title.includes('galaxy f')) && !isCase && !isCharger && !isWatch && !isAudio;
  const isPixel = title.includes('pixel') && !title.includes('buds') && !title.includes('watch') && !isCase && !isCharger;
  const isGeneralPhone = (cat.includes('mobile') || title.includes('5g') || title.includes('phone') || title.includes('oneplus') || title.includes('vivo') || title.includes('realme') || title.includes('motorola') || title.includes('nothing phone')) && !isCase && !isCharger && !isWatch && !isAudio;

  // 5. Product-specific ratings and review data
  let rating = product.rating;
  let ratingsCount = product.ratingsCount;
  let customerPhotoMosaic = product.customerPhotoMosaic;
  let customerPhotoCount = product.customerPhotoCount;
  let attributeRatings = product.attributeRatings;
  let reviews = (product.reviews && product.reviews.length >= 10) ? product.reviews : (reviewsData[product.id] || product.reviews || []);

  if (isSamsung) {
    // Screenshot 1: Samsung Galaxy (4.6 ★, 1,389 ratings, Uppal Jain, Preya Arora, +189)
    rating = rating || 4.6;
    ratingsCount = ratingsCount || '1,389';
    customerPhotoMosaic = customerPhotoMosaic || '/assets/images/pdp/customer_review_samsung.png';
    customerPhotoCount = customerPhotoCount || '+189';
    attributeRatings = attributeRatings || [
      { name: 'Camera', rating: 4.6 },
      { name: 'Battery', rating: 4.4 },
      { name: 'Display', rating: 4.7 },
      { name: 'Design', rating: 4.6 },
      { name: 'Performance', rating: 4.7 },
      { name: 'Build Quality', rating: 4.6 },
      { name: 'Value for Money', rating: 4.4 }
    ];
    reviews = reviews || [
      {
        id: 'sam1',
        rating: 5,
        title: 'Excellent',
        time: '4 months ago',
        comment: 'Best Camera.',
        author: 'Uppal Jain',
        verified: true,
        likes: 27,
        dislikes: 2
      },
      {
        id: 'sam2',
        rating: 5,
        title: 'Best in the class',
        time: '5 months ago',
        comment: 'Beautiful phone with unmatched display, camera, battery, and top performance.',
        author: 'Preya Arora',
        verified: true,
        likes: 38,
        dislikes: 4
      },
      {
        id: 'sam3',
        rating: 5,
        title: 'Supreme flagship',
        time: '2 months ago',
        comment: 'S-Pen and Galaxy AI features work flawlessly. Night photography zoom is breathtaking.',
        author: 'Rohit Khandelwal',
        verified: true,
        likes: 52,
        dislikes: 5
      }
    ];
  } else if (isPixel) {
    // Screenshot 2: Google Pixel (4.5 ★, 3,244 ratings, Vikram Nanavate, Rahul Dey, +130)
    rating = rating || 4.5;
    ratingsCount = ratingsCount || '3,244';
    customerPhotoMosaic = customerPhotoMosaic || '/assets/images/pdp/customer_review_pixel.png';
    customerPhotoCount = customerPhotoCount || '+130';
    attributeRatings = attributeRatings || [
      { name: 'Camera', rating: 4.4 },
      { name: 'Battery', rating: 4.3 },
      { name: 'Display', rating: 4.6 },
      { name: 'Design', rating: 4.6 },
      { name: 'Performance', rating: 4.4 },
      { name: 'Build Quality', rating: 4.5 },
      { name: 'Value for Money', rating: 4.2 }
    ];
    reviews = reviews || [
      {
        id: 'pix1',
        rating: 4,
        title: 'Worth the money',
        time: '6 months ago',
        comment: 'I recently purchased the Google Pixel 10a, and while the camera and clean Android UI are breathtaking, the battery easily lasts all day.',
        author: 'Vikram Nanavate',
        verified: true,
        likes: 531,
        dislikes: 169
      },
      {
        id: 'pix2',
        rating: 5,
        title: 'Terrific product',
        time: '2 months ago',
        comment: 'Good phone! Magic Eraser and Gemini AI features are super responsive.',
        author: 'Rahul Dey',
        verified: true,
        likes: 112,
        dislikes: 14
      },
      {
        id: 'pix3',
        rating: 5,
        title: 'Pixel camera magic',
        time: '1 month ago',
        comment: 'Colours are natural and skin tones are accurate. Best camera phone under this price.',
        author: 'Kavita Dave',
        verified: true,
        likes: 89,
        dislikes: 10
      }
    ];
  } else if (isIphone) {
    // Screenshot 3: Apple iPhone (4.7 ★, 28,495 ratings, Akshay Tyagi, Abhi Ghejji, +958)
    rating = rating || 4.7;
    ratingsCount = ratingsCount || '28,495';
    customerPhotoMosaic = customerPhotoMosaic || '/assets/images/pdp/customer_review_iphone.png';
    customerPhotoCount = customerPhotoCount || '+958';
    attributeRatings = attributeRatings || [
      { name: 'Camera', rating: 4.7 },
      { name: 'Battery', rating: 4.4 },
      { name: 'Display', rating: 4.8 },
      { name: 'Design', rating: 4.7 },
      { name: 'Performance', rating: 4.7 },
      { name: 'Build Quality', rating: 4.7 },
      { name: 'Value for Money', rating: 4.2 }
    ];
    reviews = reviews || [
      {
        id: 'iph1',
        rating: 5,
        title: 'Perfect product!',
        time: '1 year ago',
        comment: 'Nice Product... Loved It.. Desert Titanium finish and camera control button are amazing.',
        author: 'Akshay Tyagi',
        verified: true,
        likes: 49,
        dislikes: 6
      },
      {
        id: 'iph2',
        rating: 5,
        title: 'Simply awesome',
        time: '8 months ago',
        comment: 'Love it 16 Pro! Sound clarity and 120Hz display feel super responsive.',
        author: 'Abhi Ghejji',
        verified: true,
        likes: 84,
        dislikes: 12
      },
      {
        id: 'iph3',
        rating: 5,
        title: 'Absolute beast!',
        time: '3 months ago',
        comment: 'Upgraded after 3 years. A18 Pro chip handles gaming without thermal issues. Battery life lasts 1.5 days.',
        author: 'Priya Sundaram',
        verified: true,
        likes: 142,
        dislikes: 15
      }
    ];
  } else if (isIpad) {
    // iPad: (4.7 ★, 16,363 ratings, TEJ PRAKASH BAGHEL, TRILOK KUMAR, +655)
    rating = rating || 4.7;
    ratingsCount = ratingsCount || '16,363';
    customerPhotoMosaic = customerPhotoMosaic || '/assets/images/pdp/customer_review_mosaic.png';
    customerPhotoCount = customerPhotoCount || '+655';
    attributeRatings = attributeRatings || [
      { name: 'Camera', rating: 4.1 },
      { name: 'Battery', rating: 4.4 },
      { name: 'Performance', rating: 4.6 },
      { name: 'Value for Money', rating: 4.5 },
      { name: 'Display & Brightness', rating: 4.6 },
      { name: 'Build & Sound Quality', rating: 4.5 },
      { name: 'Functionality', rating: 4.6 }
    ];
    reviews = reviews || [
      {
        id: 'ipad1',
        rating: 5,
        title: 'Great product',
        time: '1 year ago',
        comment: 'Very nice iPad 11',
        author: 'TEJ PRAKASH BAGHEL',
        verified: true,
        likes: 914,
        dislikes: 316
      },
      {
        id: 'ipad2',
        rating: 5,
        title: 'Simply awesome',
        time: '8 months ago',
        comment: 'Value for money tablet! Display is super crisp and A16 processor handles everything without stutter.',
        author: 'TRILOK KUMAR',
        verified: true,
        likes: 452,
        dislikes: 88
      },
      {
        id: 'ipad3',
        rating: 5,
        title: 'Superb battery & design',
        time: '4 months ago',
        comment: 'Apple never disappoints. The blue color is vibrant and light in weight. Kids love it for studies and drawing.',
        author: 'ANKIT MEHRA',
        verified: true,
        likes: 240,
        dislikes: 34
      }
    ];
  } else if (isShoes) {
    // Shoes: (4.2 ★, 3,410 ratings, Jayesh Patel, Rohan Verma, +240)
    rating = rating || 4.2;
    ratingsCount = ratingsCount || '3,410';
    customerPhotoMosaic = customerPhotoMosaic || '/assets/images/pdp/customer_review_shoes.jpg';
    customerPhotoCount = customerPhotoCount || '+240';
    attributeRatings = attributeRatings || [
      { name: 'Comfort', rating: 4.6 },
      { name: 'Sole Quality', rating: 4.4 },
      { name: 'Fitting & Size', rating: 4.5 },
      { name: 'Design & Look', rating: 4.8 },
      { name: 'Value for Money', rating: 4.7 },
      { name: 'Durability', rating: 4.3 }
    ];
    reviews = reviews || [
      {
        id: 'sh1',
        rating: 5,
        title: 'Superb quality shoes for this price!',
        time: '2 days ago',
        comment: 'Ankle support is fantastic. Very comfortable for bike riding and casual wear.',
        author: 'Jayesh Patel',
        verified: true,
        likes: 148,
        dislikes: 12
      },
      {
        id: 'sh2',
        rating: 4,
        title: 'Value for money',
        time: '1 week ago',
        comment: 'Grip on rainy roads is solid. Fits true to size and lightweight.',
        author: 'Rohan Verma',
        verified: true,
        likes: 86,
        dislikes: 9
      },
      {
        id: 'sh3',
        rating: 5,
        title: 'Must buy sneakers',
        time: '2 weeks ago',
        comment: 'Looks just like high end designer sneakers. Comfortable cushioning during long walks.',
        author: 'Kunal Joshi',
        verified: true,
        likes: 64,
        dislikes: 4
      }
    ];
  } else if (isAudio) {
    // Audio: (4.6 ★, 8,920 ratings, Chirag Mehta, Parth Desai, +160)
    rating = rating || 4.6;
    ratingsCount = ratingsCount || '8,920';
    customerPhotoMosaic = customerPhotoMosaic || '/assets/images/pdp/customer_review_audio.jpg';
    customerPhotoCount = customerPhotoCount || '+160';
    attributeRatings = attributeRatings || [
      { name: 'Sound Quality', rating: 4.7 },
      { name: 'Bass', rating: 4.6 },
      { name: 'Battery Life', rating: 4.5 },
      { name: 'Comfort', rating: 4.4 },
      { name: 'Build Quality', rating: 4.6 },
      { name: 'Value for Money', rating: 4.8 }
    ];
    reviews = reviews || [
      {
        id: 'aud1',
        rating: 5,
        title: 'Mind-blowing sound!',
        time: '3 weeks ago',
        comment: 'Deep punchy bass and crystal clear vocals. Lasts over 12 hours on a single charge.',
        author: 'Chirag Mehta',
        verified: true,
        likes: 215,
        dislikes: 18
      },
      {
        id: 'aud2',
        rating: 5,
        title: 'Best in this segment',
        time: '1 month ago',
        comment: 'Bluetooth connects instantly. Very handy for travel and outdoor trips.',
        author: 'Parth Desai',
        verified: true,
        likes: 94,
        dislikes: 7
      },
      {
        id: 'aud3',
        rating: 5,
        title: 'Terrific battery backup',
        time: '2 months ago',
        comment: 'Solid build quality. Water resistant design holds up great during gym workouts.',
        author: 'Hardik Trivedi',
        verified: true,
        likes: 82,
        dislikes: 5
      }
    ];
  } else {
    // Default accessories / other
    rating = rating || 4.4;
    ratingsCount = ratingsCount || '5,280';
    customerPhotoMosaic = customerPhotoMosaic || '/assets/images/pdp/customer_review_iphone.png';
    customerPhotoCount = customerPhotoCount || '+150';
    attributeRatings = attributeRatings || [
      { name: 'Quality', rating: 4.6 },
      { name: 'Value for Money', rating: 4.5 },
      { name: 'Durability', rating: 4.4 },
      { name: 'Design & Finish', rating: 4.7 },
      { name: 'Functionality', rating: 4.6 }
    ];
    reviews = reviews || [
      {
        id: 'acc1',
        rating: 5,
        title: 'Excellent purchase',
        time: 'Yesterday',
        comment: 'Quality is top notch, genuine brand packaging and fast delivery.',
        author: 'Manish Shah',
        verified: true,
        likes: 64,
        dislikes: 5
      },
      {
        id: 'acc2',
        rating: 5,
        title: 'Superb item',
        time: '4 days ago',
        comment: 'Completely satisfied with the quality and fit. Value for money.',
        author: 'Deepen Vyas',
        verified: true,
        likes: 42,
        dislikes: 3
      }
    ];
  }

  // Ensure first review has the customer review photo
  if (reviews && reviews[0] && !reviews[0].image && customerPhotoMosaic) {
    reviews[0].image = customerPhotoMosaic;
    reviews[0].images = [customerPhotoMosaic];
  }

  // 6. EMI per month
  const emiPerMonth = product.emiPerMonth || Math.round(product.price / 6);

  // 7. Gallery images
  const gallery = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image, product.image];

  // 8. Variants by category
  let variantTypes = product.variantTypes;
  if (!variantTypes) {
    if (isCharger) {
      if (title.includes('cable')) {
        variantTypes = {
          length: {
            label: 'Cable Length',
            selected: '1.2m',
            options: ['1m', '1.2m', '2m']
          },
          color: {
            label: 'Color',
            selected: 'White',
            options: ['White', 'Black']
          }
        };
      } else if (title.includes('power bank') || title.includes('powerbank')) {
        variantTypes = {
          color: {
            label: 'Color',
            selected: 'Black',
            options: ['Black', 'Blue', 'Silver']
          }
        };
      } else {
        // Chargers & Power Adapters (e.g. Apple 20W USB-C Adapter, Anker 65W GaN)
        variantTypes = {
          color: {
            label: 'Color',
            selected: 'White',
            options: ['White']
          },
          pack: {
            label: 'Pack',
            selected: '1 Unit',
            options: ['1 Unit', 'Pack of 2']
          }
        };
      }
    } else if (isCase) {
      variantTypes = {
        color: {
          label: 'Color',
          selected: 'Clear',
          options: ['Clear', 'Smoke Black', 'Matte Frost']
        },
        device: {
          label: 'Compatible Model',
          selected: 'Standard Fit',
          options: ['Standard Fit']
        }
      };
    } else if (isWatch) {
      variantTypes = {
        strapColor: {
          label: 'Strap Color',
          selected: 'Midnight Black',
          options: ['Midnight Black', 'Navy Blue', 'Silver Metal']
        }
      };
    } else if (isAudio) {
      variantTypes = {
        color: {
          label: 'Color',
          selected: 'Carbon Black',
          options: ['Carbon Black', 'Navy Blue', 'Off White']
        }
      };
    } else if (isShoes) {
      variantTypes = {
        color: {
          label: 'Color',
          selected: 'Black & Red',
          options: ['Black & Red', 'Navy Blue', 'Olive Green']
        },
        size: {
          label: 'Size',
          selected: '8',
          options: ['6', '7', '8', '9', '10']
        }
      };
    } else if (isIpad) {
      variantTypes = {
        color: {
          label: 'Color',
          selected: 'Blue',
          options: ['Blue', 'Pink', 'Yellow', 'Silver', 'Space Grey']
        },
        storage: {
          label: 'Storage',
          selected: '128 GB',
          options: ['64 GB', '128 GB', '256 GB']
        }
      };
    } else if (isIphone) {
      const colors = ['Desert Titanium', 'Natural Titanium', 'White Titanium', 'Black Titanium'];
      variantTypes = {
        color: {
          label: 'Color',
          selected: colors[0],
          options: colors
        },
        storage: {
          label: 'Storage',
          selected: '256 GB',
          options: ['128 GB', '256 GB', '512 GB', '1 TB']
        }
      };
    } else if (isSamsung) {
      const colors = ['Titanium Gray', 'Titanium Black', 'Titanium Violet', 'Titanium Yellow'];
      variantTypes = {
        color: {
          label: 'Color',
          selected: colors[0],
          options: colors
        },
        storage: {
          label: 'Storage',
          selected: '256 GB',
          options: ['256 GB', '512 GB', '1 TB']
        }
      };
    } else if (isPixel) {
      const colors = ['Hibiscus Pink', 'Obsidian Black', 'Porcelain White', 'Hazel'];
      variantTypes = {
        color: {
          label: 'Color',
          selected: colors[0],
          options: colors
        },
        storage: {
          label: 'Storage',
          selected: '128 GB',
          options: ['128 GB', '256 GB', '512 GB']
        }
      };
    } else if (isGeneralPhone) {
      variantTypes = {
        color: {
          label: 'Color',
          selected: 'Midnight Black',
          options: ['Midnight Black', 'Ocean Blue', 'Emerald Green']
        },
        storage: {
          label: 'Storage',
          selected: '128 GB',
          options: ['128 GB', '256 GB']
        }
      };
    } else {
      variantTypes = {
        color: {
          label: 'Color',
          selected: 'Standard',
          options: ['Standard']
        }
      };
    }
  }

  return {
    ...product,
    origPrice,
    discountPct,
    protectFee,
    deliveryDate,
    seller,
    sellerRating,
    sellerYears,
    rating,
    ratingsCount,
    emiPerMonth,
    gallery,
    variantTypes,
    attributeRatings,
    customerPhotoMosaic,
    customerPhotoCount,
    customerPhotos: product.customerPhotos || (customerPhotoMosaic ? [customerPhotoMosaic] : []),
    reviews
  };
}

function getProductSpecifications(product, selectedVariants = {}) {
  if (!product) return [];

  if (Array.isArray(product.specifications) && product.specifications.length > 0) {
    return product.specifications;
  }

  const cat = (product.category || '').toLowerCase();
  const title = (product.title || '').toLowerCase();
  const specs = [];

  const titleWords = (product.title || '').trim().split(/\s+/);
  let brand = titleWords[0] || 'Brand';
  if (brand.toLowerCase() === 'flipkart' && titleWords[1]?.toLowerCase() === 'smartbuy') {
    brand = 'Flipkart SmartBuy';
  }
  specs.push({ label: 'Brand', value: brand });

  const cleanModelName = (product.title || '').replace(new RegExp(`^${brand}\\s*`, 'i'), '').trim();
  specs.push({ label: 'Model Name', value: cleanModelName || product.title });

  // 1. Watches
  if (title.includes('watch') || title.includes('fogg') || cat.includes('watch')) {
    specs.push({ label: 'Display Type', value: title.includes('smart') ? 'Digital AMOLED' : 'Analog' });
    specs.push({ label: 'Strap Material', value: title.includes('leather') ? 'Genuine Leather' : 'Stainless Steel Mesh' });
    specs.push({ label: 'Strap Color', value: selectedVariants.strapColor || selectedVariants.color || 'Midnight Black' });
    specs.push({ label: 'Dial Color', value: 'Black' });
    specs.push({ label: 'Dial Shape', value: 'Round' });
    specs.push({ label: 'Water Resistant', value: 'Yes (30 m)' });
    specs.push({ label: 'Mechanism', value: 'Japanese Quartz' });
    specs.push({ label: 'Occasion', value: 'Casual & Formal' });
    specs.push({ label: 'In The Box', value: '1 Wrist Watch, Warranty Card, Gift Box' });
    specs.push({ label: 'Warranty', value: '1 Year Manufacturer Warranty' });
  }
  // 2. Mobiles & Tablets
  else if (cat.includes('mobile') || title.includes('iphone') || title.includes('galaxy') || title.includes('pixel') || title.includes('ipad') || title.includes('phone') || title.includes('tablet')) {
    specs.push({ label: 'In The Box', value: 'Handset, USB Type-C Cable, SIM Ejector, Quick Guide' });
    specs.push({ label: 'Internal Storage', value: selectedVariants.storage || '128 GB' });
    specs.push({ label: 'Color', value: selectedVariants.color || 'Standard' });
    specs.push({ label: 'Network Type', value: '5G, 4G LTE, 3G, 2G' });
    specs.push({ label: 'Display Size', value: title.includes('ipad') ? '11 inch Liquid Retina' : title.includes('pro max') ? '6.9 inch Super Retina' : '6.7 inch Full HD+ AMOLED' });
    specs.push({ label: 'Battery Capacity', value: title.includes('7200') ? '7200 mAh' : title.includes('7000') ? '7000 mAh' : '5000 mAh' });
    specs.push({ label: 'Warranty', value: '1 Year Brand Warranty for Phone' });
  }
  // 3. Footwear & Shoes
  else if (cat.includes('fashion') && (title.includes('shoe') || title.includes('sneaker') || title.includes('trekking') || title.includes('sandal') || title.includes('boot'))) {
    specs.push({ label: 'Type', value: title.includes('trekking') ? 'High-Top Trekking Shoes' : 'Sports Running Sneakers' });
    specs.push({ label: 'Outer Material', value: 'Breathable Mesh & Synthetic' });
    specs.push({ label: 'Sole Material', value: 'Shock Absorbing EVA & Anti-Skid TPR' });
    if (selectedVariants.size) specs.push({ label: 'Size', value: selectedVariants.size });
    specs.push({ label: 'Color', value: selectedVariants.color || 'As Selected' });
    specs.push({ label: 'Closure', value: 'Lace-Ups' });
    specs.push({ label: 'Ideal For', value: 'Men' });
    specs.push({ label: 'Care Instructions', value: 'Wipe with a clean, dry cloth' });
    specs.push({ label: 'Warranty', value: '3 Months Manufacturing Warranty' });
  }
  // 4. Other Fashion
  else if (cat.includes('fashion')) {
    specs.push({ label: 'Type', value: 'Fashion Lifestyle' });
    specs.push({ label: 'Material', value: 'Premium Grade Fabric / Alloy' });
    if (selectedVariants.size) specs.push({ label: 'Size', value: selectedVariants.size });
    specs.push({ label: 'Color', value: selectedVariants.color || 'Standard' });
    specs.push({ label: 'Ideal For', value: 'Men & Women' });
    specs.push({ label: 'Warranty', value: '1 Month Seller Warranty' });
  }
  // 5. Electronics & Audio
  else if (cat.includes('electronic') || title.includes('speaker') || title.includes('earbuds') || title.includes('headphone') || title.includes('tws')) {
    specs.push({ label: 'Type', value: title.includes('speaker') ? 'Portable Bluetooth Speaker' : 'True Wireless Stereo (TWS)' });
    specs.push({ label: 'Connectivity', value: 'Bluetooth v5.3' });
    specs.push({ label: 'Wireless Range', value: '10 m' });
    specs.push({ label: 'Battery Life', value: title.includes('speaker') ? 'Up to 12 Hours' : 'Up to 40 Hours' });
    specs.push({ label: 'Charging Interface', value: 'USB Type-C Fast Charging' });
    specs.push({ label: 'Water Resistance', value: 'IPX5 / IP67 Water & Dust Proof' });
    specs.push({ label: 'In The Box', value: 'Device, Type-C Cable, Extra Ear Tips, User Manual' });
    specs.push({ label: 'Warranty', value: '1 Year Domestic Brand Warranty' });
  }
  // 6. Appliances
  else if (cat.includes('appliance') || title.includes('kettle') || title.includes('iron') || title.includes('mixer') || title.includes('cooker')) {
    specs.push({ label: 'Type', value: 'Rapid Heating Appliance' });
    specs.push({ label: 'Power Consumption', value: title.includes('kettle') ? '1500 W' : '750 W' });
    specs.push({ label: 'Capacity', value: title.includes('1.7l') ? '1.7 Litres' : 'Standard' });
    specs.push({ label: 'Body Material', value: 'Food-Grade 304 Stainless Steel' });
    specs.push({ label: 'Auto Shut-off', value: 'Yes (Boil-Dry Protection)' });
    specs.push({ label: 'Warranty', value: '1 Year Brand Warranty' });
  }
  // 7. Beauty
  else if (cat.includes('beauty') || title.includes('serum') || title.includes('cream') || title.includes('lotion') || title.includes('oil')) {
    specs.push({ label: 'Quantity', value: title.includes('30ml') ? '30 ml' : '50 ml' });
    specs.push({ label: 'Skin Type', value: 'Suitable for All Skin Types' });
    specs.push({ label: 'Form', value: 'Liquid Serum' });
    specs.push({ label: 'Applied For', value: 'Radiance, Glow & Dark Spot Reduction' });
    specs.push({ label: 'Paraben Free', value: 'Yes (100% Dermatologically Tested)' });
    specs.push({ label: 'Organic', value: 'Yes' });
  }
  // 8. Home & Kitchen
  else if (cat.includes('home') || title.includes('bottle') || title.includes('pan') || title.includes('container') || title.includes('cup')) {
    specs.push({ label: 'Material', value: 'Food-Grade Stainless Steel / BPA-Free' });
    specs.push({ label: 'Capacity', value: title.includes('950ml') ? '950 ml' : 'Standard' });
    specs.push({ label: 'Leak Proof', value: 'Yes (Silicone Sealed Airtight Cap)' });
    specs.push({ label: 'Dishwasher Safe', value: 'Yes' });
    specs.push({ label: 'In The Box', value: title.includes('set of 3') ? 'Set of 3 Water Bottles' : 'Main Product Unit' });
  }
  // 9. Toys & Baby
  else if (cat.includes('toy') || title.includes('car') || title.includes('crawler') || title.includes('truck')) {
    specs.push({ label: 'Type', value: 'Remote Control 4WD Off-Road Crawler' });
    specs.push({ label: 'Age Group', value: '6+ Years' });
    specs.push({ label: 'Control Frequency', value: '2.4 GHz Long Range Anti-Interference' });
    specs.push({ label: 'Battery Type', value: 'USB Rechargeable Li-Ion (Included)' });
    specs.push({ label: 'Material', value: 'ABS Non-Toxic Impact-Resistant Plastic' });
  }
  // 10. Food & Health
  else if (cat.includes('food') || title.includes('dry fruits') || title.includes('tea') || title.includes('honey')) {
    specs.push({ label: 'Quantity', value: title.includes('500g') ? '500 g' : '1 kg' });
    specs.push({ label: 'Ingredients', value: 'California Almonds, Cashews, Seedless Raisins' });
    specs.push({ label: 'Shelf Life', value: '9 Months' });
    specs.push({ label: 'Dietary Preference', value: '100% Vegetarian, No Added Sugar or Salt' });
    specs.push({ label: 'Storage', value: 'Store in a cool, dry and airtight container' });
  }
  // 11. Auto Accessories
  else if (cat.includes('auto') || title.includes('washer') || title.includes('foam') || title.includes('cleaner')) {
    specs.push({ label: 'Compatibility', value: 'Universal (All Cars, Bikes & Garden Hoses)' });
    specs.push({ label: 'Spray Modes', value: '8 Rotating Spray Patterns (Jet, Mist, Foam, Cone)' });
    specs.push({ label: 'Material', value: 'High Density Impact-Resistant Polymer' });
    specs.push({ label: 'Warranty', value: '6 Months Replacement Warranty' });
  }
  // 12. Sports & Fitness
  else if (cat.includes('sport') || title.includes('gym') || title.includes('belt') || title.includes('mat')) {
    specs.push({ label: 'Material', value: 'Genuine Suede Leather & Steel Buckle' });
    specs.push({ label: 'Ideal For', value: 'Men & Women (Gym, Powerlifting, Squats)' });
    specs.push({ label: 'Closure', value: 'Heavy Duty Dual-Prong Roller Buckle' });
    specs.push({ label: 'Width', value: 'Contoured 4-Inch Core Support' });
    specs.push({ label: 'Warranty', value: '6 Months Brand Warranty' });
  }
  // 13. Furniture
  else if (cat.includes('furn') || title.includes('shelf') || title.includes('table') || title.includes('chair')) {
    specs.push({ label: 'Primary Material', value: 'Engineered Wood with Matte Lamination' });
    specs.push({ label: 'Finish Type', value: 'Matte Water-Resistant Texture' });
    specs.push({ label: 'Dimensions', value: '80 cm x 30 cm x 120 cm' });
    specs.push({ label: 'Assembly', value: 'DIY (Hardware and Step-by-Step Manual Included)' });
    specs.push({ label: 'Warranty', value: '1 Year Structural Warranty' });
  }
  // General Fallback
  else {
    specs.push({ label: 'Category', value: product.category || 'General Merchandise' });
    specs.push({ label: 'Sales Package', value: '1 Main Unit, User Guide, Warranty Card' });
    specs.push({ label: 'Condition', value: '100% Genuine & Brand New' });
    specs.push({ label: 'Quality Check', value: 'Flipkart Assured Verified' });
    specs.push({ label: 'Warranty', value: '1 Year Domestic Warranty' });
  }

  return specs;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
  cartCount = 1,
  onOpenCart,
  deliveryLocation = 'Select delivery location',
  onOpenLocation,
  onSearch
}) {
  const data = useMemo(() => {
    return product ? normalizeProductDetails(product, deliveryLocation) : null;
  }, [product, deliveryLocation]);

  // Variant States
  const [selectedVariants, setSelectedVariants] = useState(() => {
    const initial = {};
    if (data?.variantTypes) {
      Object.entries(data.variantTypes).forEach(([key, val]) => {
        initial[key] = val.selected;
      });
    }
    return initial;
  });

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [isReviewsExpanded, setIsReviewsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [shareToast, setShareToast] = useState(false);
  const liveSaleTime = useLiveSaleTimer();

  // Specifications calculated for the active product and selected variants
  const productSpecs = useMemo(() => {
    return data ? getProductSpecifications(data, selectedVariants) : [];
  }, [data, selectedVariants]);

  // Review likes state
  const [reviewVotes, setReviewVotes] = useState({});
  const [selectedReviewImage, setSelectedReviewImage] = useState(null);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);

  // Review photo lightbox back button handling
  useEffect(() => {
    if (!isOpen) return;
    const handleLightboxPopState = () => {
      if (selectedReviewImage) {
        setSelectedReviewImage(null);
      }
    };
    window.addEventListener('popstate', handleLightboxPopState);
    return () => window.removeEventListener('popstate', handleLightboxPopState);
  }, [isOpen, selectedReviewImage]);

  const handleOpenReviewImage = (img) => {
    try {
      window.history.pushState({ fkApp: true, view: 'lightbox' }, '');
    } catch (e) {}
    setSelectedReviewImage(img);
  };

  const handleCloseReviewImage = () => {
    if (window.history.state?.view === 'lightbox') {
      window.history.back();
    } else {
      setSelectedReviewImage(null);
    }
  };

  const reviewCounts = useMemo(() => {
    const list = data?.reviews || [];
    return {
      total: list.length,
      r5: list.filter(r => r.rating === 5).length,
      r4: list.filter(r => r.rating === 4).length,
      r3: list.filter(r => r.rating === 3).length,
      rBad: list.filter(r => r.rating <= 2).length,
      photos: list.filter(r => r.image || (r.images && r.images.length > 0)).length
    };
  }, [data?.reviews]);

  const filteredReviews = useMemo(() => {
    const list = data?.reviews || [];
    if (reviewFilter === 'all') return list;
    if (reviewFilter === 'photos') return list.filter(r => r.image || (r.images && r.images.length > 0));
    if (reviewFilter === '5') return list.filter(r => r.rating === 5);
    if (reviewFilter === '4') return list.filter(r => r.rating === 4);
    if (reviewFilter === '3') return list.filter(r => r.rating === 3);
    if (reviewFilter === 'bad') return list.filter(r => r.rating <= 2);
    return list;
  }, [data?.reviews, reviewFilter]);

  // Reset state when product changes
  useEffect(() => {
    if (data?.variantTypes) {
      const initial = {};
      Object.entries(data.variantTypes).forEach(([key, val]) => {
        initial[key] = val.selected;
      });
      setSelectedVariants(initial);
    }
    setActiveImageIndex(0);
    setIsTitleExpanded(false);
    setReviewFilter('all');
    setShowAllReviewsModal(false);
  }, [product?.id]);

  // Lock body scroll when ProductDetailModal is open to prevent underlying homepage scrolling
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !product || !data) return null;

  const handleVote = (reviewId, type) => {
    setReviewVotes(prev => {
      const current = prev[reviewId] || { likes: 0, dislikes: 0, userVoted: null };
      if (current.userVoted === type) return prev;
      return {
        ...prev,
        [reviewId]: {
          likes: type === 'like' ? current.likes + 1 : current.likes,
          dislikes: type === 'dislike' ? current.dislikes + 1 : current.dislikes,
          userVoted: type
        }
      };
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2400);
  };

  const handleSelectVariant = (groupKey, value) => {
    setSelectedVariants(prev => ({
      ...prev,
      [groupKey]: value
    }));
  };

  // Check if product is an actual smartphone or tablet with tech storage tiers (strictly exclude chargers and accessories)
  const isTechProduct = useMemo(() => {
    const cat = (data?.category || '').toLowerCase();
    const title = (data?.title || '').toLowerCase();
    const isAccessory = title.includes('charger') || title.includes('adapter') || title.includes('cable') || title.includes('case') || title.includes('cover') || title.includes('power bank') || title.includes('powerbank');
    if (isAccessory) return false;
    return (
      cat.includes('mobile') ||
      title.includes('iphone') ||
      title.includes('galaxy s') ||
      title.includes('galaxy z') ||
      title.includes('pixel') ||
      (cat.includes('electronic') && (title.includes('phone') || title.includes('ipad') || title.includes('tablet')))
    );
  }, [data?.category, data?.title]);

  // Dynamic Variant Price Delta:
  // ONLY applied to Mobiles and Electronics (+₹99 or +₹199 based on product tier).
  // Other categories (Fashion, Beauty, Home, etc.) have ZERO price increase on size/color change.
  const priceDelta = useMemo(() => {
    if (!isTechProduct || !data?.variantTypes) return 0;
    let delta = 0;
    const isPremiumTech = (data.price || 0) >= 800;
    const tierStep = isPremiumTech ? 199 : 99;

    Object.entries(data.variantTypes).forEach(([groupKey, group]) => {
      const selectedVal = selectedVariants[groupKey] || group.selected;
      const options = group.options || [];
      const optionIndex = options.findIndex(opt => {
        const name = typeof opt === 'object' ? opt.name : opt;
        return name === selectedVal;
      });

      if (optionIndex > 0) {
        const k = groupKey.toLowerCase();
        if (k.includes('storage') || k.includes('ram') || k.includes('edition') || k.includes('type') || k.includes('connectivity')) {
          delta += optionIndex * tierStep;
        } else if (k.includes('color')) {
          delta += 99;
        }
      }
    });

    return delta;
  }, [isTechProduct, data?.variantTypes, data?.price, selectedVariants]);

  const currentPrice = (data.price || 0) + priceDelta;
  const currentOrigPrice = (data.origPrice || Math.round(data.price * 1.5)) + Math.round(priceDelta * 1.5);
  const currentDiscountPct = Math.max(5, Math.round(((currentOrigPrice - currentPrice) / currentOrigPrice) * 100));
  const currentEmi = Math.round(currentPrice / 6);

  const handleActionAddToCart = () => {
    onAddToCart({
      ...data,
      price: currentPrice,
      origPrice: currentOrigPrice,
      discountPct: currentDiscountPct,
      emiPerMonth: currentEmi,
      selectedVariants
    });
  };

  const handleActionBuyNow = () => {
    onBuyNow({
      ...data,
      price: currentPrice,
      origPrice: currentOrigPrice,
      discountPct: currentDiscountPct,
      emiPerMonth: currentEmi,
      selectedVariants
    });
  };

  const currentImage = (data.gallery && data.gallery[activeImageIndex]) || data.image;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100%',
      maxHeight: '100dvh',
      zIndex: 99999,
      backgroundColor: 'rgba(0,0,0,0.65)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'stretch'
    }}>
      {/* Mobile Shell constrained to 480px */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        height: '100%',
        maxHeight: '100dvh',
        backgroundColor: '#ffffff',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 0 24px rgba(0,0,0,0.2)',
        WebkitOverflowScrolling: 'touch'
      }}>
        {/* Share Toast */}
        {shareToast && (
          <div style={{
            position: 'fixed',
            top: 60,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            backgroundColor: 'rgba(33,33,33,0.92)',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(0,0,0,0.18)'
          }}>
            ✓ Link copied to clipboard
          </div>
        )}

        {/* 1. TOP MOBILE HEADER (Screenshot 3 & 4) */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: '#dff1ff',
          padding: '8px 12px',
          paddingTop: 'calc(8px + env(safe-area-inset-top, 0px))',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: '1px solid #cbe4fb',
          flexShrink: 0
        }}>
          {/* Back Arrow */}
          <button
            onClick={onClose}
            aria-label="Back"
            style={{
              background: 'none',
              border: 'none',
              padding: '6px 4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>

          {/* Search Bar Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (onSearch) {
                onSearch(searchQuery);
                onClose();
              }
            }}
            style={{
              flex: 1,
              backgroundColor: '#ffffff',
              border: '1px solid #70b4ff',
              borderRadius: 8,
              height: 38,
              padding: '0 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#717478" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search for products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: 13,
                color: '#212121',
                backgroundColor: 'transparent'
              }}
            />
          </form>

          {/* Cart Icon with Red Badge */}
          <div
            onClick={() => {
              if (onOpenCart) {
                onOpenCart();
              } else {
                onClose();
              }
            }}
            style={{
              position: 'relative',
              cursor: 'pointer',
              padding: '4px 6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: '#d32f2f',
                color: '#ffffff',
                fontSize: 11,
                fontWeight: 700,
                borderRadius: '50%',
                minWidth: 17,
                height: 17,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 2px',
                border: '1.5px solid #dff1ff'
              }}>
                {cartCount}
              </span>
            )}
          </div>
        </header>

        {/* Scrollable Body Container */}
        <div style={{ flex: 1, paddingBottom: 20 }}>
          {/* 2. PRODUCT TITLE & PRICING (Screenshot 4) */}
          <div style={{ padding: '12px 14px 10px', backgroundColor: '#ffffff' }}>
            {/* Title with ...more toggle */}
            <div style={{ fontSize: 14, color: '#212121', fontWeight: 600, lineHeight: 1.4 }}>
              {isTitleExpanded ? data.fullTitle || data.title : data.title}
              {(data.fullTitle || data.title).length > 40 && (
                <span
                  onClick={() => setIsTitleExpanded(!isTitleExpanded)}
                  style={{
                    color: '#2874f0',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginLeft: 4
                  }}
                >
                  {isTitleExpanded ? ' less' : '...more'}
                </span>
              )}
            </div>

            {/* Price Row: Discount, Original MRP, Bold Selling Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
              {/* Green discount percentage with down arrow */}
              <span style={{
                color: '#108435',
                fontSize: 19,
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: 16, marginRight: 2 }}>↓</span>{currentDiscountPct}%
              </span>

              {/* Struck-through original MRP */}
              <span style={{
                color: '#717478',
                fontSize: 18,
                textDecoration: 'line-through',
                fontWeight: 500
              }}>
                {currentOrigPrice.toLocaleString('en-IN')}
              </span>

              {/* Bold Selling Price */}
              <span style={{
                color: '#111112',
                fontSize: 22,
                fontWeight: 800
              }}>
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>

              {/* Dynamic variant badge */}
              {priceDelta > 0 && (
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#108435',
                  backgroundColor: '#e8f5e9',
                  padding: '2px 7px',
                  borderRadius: 4,
                  border: '1px solid #c8e6c9',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}>
                  +₹{priceDelta} Variant Option
                </span>
              )}
            </div>

            {/* Protect Promise Fee */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              marginTop: 4,
              fontSize: 12,
              color: '#717478',
              cursor: 'pointer'
            }}>
              <span>+{data.protectFee} Protect Promise Fee</span>
              <span style={{ fontSize: 11, fontWeight: 'bold', marginLeft: 2 }}>&gt;</span>
            </div>

            {/* Live Sale Looping Urgency Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 8,
              backgroundColor: '#fff5f0',
              border: '1px solid #ffd8cc',
              borderRadius: 6,
              padding: '4px 9px',
              fontSize: 12,
              fontWeight: 700,
              color: '#d9532f'
            }}>
              <span>⚡ Live Sale ends in <span style={{ color: '#e05a38', fontWeight: 800 }}>{liveSaleTime.minutes}min {liveSaleTime.seconds < 10 ? `0${liveSaleTime.seconds}` : liveSaleTime.seconds}sec</span></span>
            </div>
          </div>

          {/* 3. PRODUCT IMAGE GALLERY & PREVIEW (Screenshot 3) */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: 340,
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 20px',
            borderTop: '1px solid #f5f5f5'
          }}>
            {/* Top Right Share Icon */}
            <button
              onClick={handleShare}
              aria-label="Share product"
              style={{
                position: 'absolute',
                top: 12,
                right: 14,
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e5e5',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>

            {/* Floating Rating Pill: 4.7 ★ | 16.3K+ */}
            <div style={{
              position: 'absolute',
              bottom: 12,
              left: 14,
              backgroundColor: 'rgba(255,255,255,0.95)',
              border: '1px solid #e0e0e0',
              borderRadius: 4,
              padding: '3px 8px',
              fontSize: 12,
              fontWeight: 700,
              color: '#212121',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              zIndex: 10
            }}>
              <span>{data.rating}</span>
              <span style={{ color: '#108435' }}>★</span>
              <span style={{ color: '#d0d0d0', margin: '0 1px' }}>|</span>
              <span style={{ color: '#666666', fontWeight: 500 }}>
                {data.ratingsCount ? (typeof data.ratingsCount === 'string' && data.ratingsCount.includes('K') ? data.ratingsCount : `${data.ratingsCount}+`) : '16.3K+'}
              </span>
            </div>

            {/* Product Image */}
            <img
              src={currentImage}
              alt={data.title}
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/images/cart_ipad.png';
              }}
            />
          </div>

          {/* Pagination Dots (● ○ ○ ○ ○) */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 6,
            padding: '10px 0 14px',
            backgroundColor: '#ffffff'
          }}>
            {[0, 1, 2, 3, 4].map((dotIndex) => {
              const isActive = dotIndex === activeImageIndex;
              return (
                <div
                  key={dotIndex}
                  onClick={() => setActiveImageIndex(dotIndex % (data.gallery?.length || 1))}
                  style={{
                    width: isActive ? 7 : 5,
                    height: isActive ? 7 : 5,
                    borderRadius: '50%',
                    backgroundColor: isActive ? '#1c68f2' : '#d8d8d8',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                />
              );
            })}
          </div>

          {/* 4. DYNAMIC VARIANT SELECTORS (Screenshot 3) */}
          <div style={{
            padding: '12px 14px 16px',
            borderTop: '1px solid #f0f0f0',
            backgroundColor: '#ffffff'
          }}>
            {/* Variant Rows (Color, Connectivity, Storage, Size, etc.) */}
            {data.variantTypes && Object.entries(data.variantTypes).map(([groupKey, group]) => {
              const activeVal = selectedVariants[groupKey] || group.selected;
              return (
                <div key={groupKey} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, color: '#111112', fontWeight: 700, marginBottom: 8 }}>
                    {group.label}: <span style={{ fontWeight: 500 }}>{activeVal}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: 8,
                    overflowX: 'auto',
                    paddingBottom: 2,
                    scrollbarWidth: 'none'
                  }}>
                    {group.options.map((opt, optIndex) => {
                      const optName = typeof opt === 'object' ? opt.name : opt;
                      const isDisabled = typeof opt === 'object' ? opt.disabled : false;
                      const isSelected = activeVal === optName;

                      let optPriceInc = 0;
                      if (isTechProduct && optIndex > 0) {
                        const isPremiumTech = (data.price || 0) >= 800;
                        const tierStep = isPremiumTech ? 199 : 99;
                        const k = groupKey.toLowerCase();
                        if (k.includes('storage') || k.includes('ram') || k.includes('edition') || k.includes('type') || k.includes('connectivity')) {
                          optPriceInc = optIndex * tierStep;
                        } else if (k.includes('color')) {
                          optPriceInc = 99;
                        }
                      }

                      return (
                        <button
                          key={optName}
                          disabled={isDisabled}
                          onClick={() => !isDisabled && handleSelectVariant(groupKey, optName)}
                          style={{
                            border: isSelected
                              ? '1.5px solid #2874f0'
                              : isDisabled
                              ? '1px dashed #cccccc'
                              : '1px solid #dcdcdc',
                            backgroundColor: isSelected ? '#f1f7ff' : isDisabled ? '#fafafa' : '#ffffff',
                            color: isSelected ? '#2874f0' : isDisabled ? '#999999' : '#212121',
                            fontWeight: isSelected ? 700 : 500,
                            borderRadius: 8,
                            padding: '6px 12px',
                            fontSize: 13,
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                            flexShrink: 0,
                            whiteSpace: 'nowrap',
                            outline: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            textDecoration: isDisabled ? 'line-through' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span>{optName}</span>
                          {optPriceInc > 0 && (
                            <span style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: isSelected ? '#108435' : '#717478',
                              backgroundColor: isSelected ? '#e8f5e9' : '#f5f5f5',
                              padding: '1px 5px',
                              borderRadius: 4
                            }}>
                              +₹{optPriceInc}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 5. PRODUCT DETAILS & SPECIFICATIONS (Flipkart Style) */}
          <div style={{ height: 8, backgroundColor: '#f1f3f6' }} />
          <div style={{ padding: '14px 14px 16px', backgroundColor: '#ffffff' }}>
            {/* Header with Accordion arrow */}
            <div
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: isDetailsExpanded ? 14 : 0,
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: '#111112' }}>
                Product details
              </div>
              <span style={{
                fontSize: 16,
                color: '#555555',
                transform: isDetailsExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.2s ease'
              }}>
                ▲
              </span>
            </div>

            {isDetailsExpanded && (
              <>
                {/* Highlights */}
                {data.highlights && data.highlights.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#212121', marginBottom: 8 }}>
                      Highlights
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {data.highlights.map((hl, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#212121', lineHeight: 1.4 }}>
                          <span style={{ color: '#2874f0', fontSize: 15, lineHeight: '18px', fontWeight: 'bold' }}>•</span>
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications Key-Value Table */}
                {productSpecs && productSpecs.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#212121', marginBottom: 8 }}>
                      Specifications
                    </div>
                    <div style={{
                      borderRadius: 8,
                      border: '1px solid #e8e8e8',
                      overflow: 'hidden'
                    }}>
                      {productSpecs.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            padding: '9px 12px',
                            fontSize: 12,
                            backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9f9fa',
                            borderBottom: idx < productSpecs.length - 1 ? '1px solid #f0f0f0' : 'none'
                          }}
                        >
                          <div style={{ width: '42%', color: '#717478', fontWeight: 500, paddingRight: 8, flexShrink: 0 }}>
                            {item.label}
                          </div>
                          <div style={{ width: '58%', color: '#111112', fontWeight: 600, wordBreak: 'break-word' }}>
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {data.description && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#212121', marginBottom: 6 }}>
                      Description
                    </div>
                    <div style={{ fontSize: 13, color: '#555555', lineHeight: 1.5 }}>
                      {data.description}
                    </div>
                  </div>
                )}

              </>
            )}
          </div>

          {/* 6. DELIVERY DETAILS (Screenshot 2) */}
          <div style={{ height: 8, backgroundColor: '#f1f3f6' }} />
          <div style={{ padding: '14px 14px 16px', backgroundColor: '#ffffff' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#111112', marginBottom: 12 }}>
              Delivery details
            </div>

            {/* Location Row (Light Blue Box) */}
            <div
              onClick={onOpenLocation}
              style={{
                backgroundColor: '#f1f7ff',
                borderRadius: 8,
                padding: '11px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#212121' }}>
                <span style={{ fontSize: 15 }}>📍</span>
                <span>{deliveryLocation && deliveryLocation !== 'Select delivery location' ? `Delivering to ${deliveryLocation}` : 'Location not set'}</span>
              </div>
              <span style={{ color: '#2874f0', fontWeight: 700, fontSize: 13 }}>
                Select delivery location &gt;
              </span>
            </div>

            {/* Delivery Date Row (Light Gray Box) */}
            <div style={{
              backgroundColor: '#f7f7f8',
              borderRadius: 8,
              padding: '11px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 8
            }}>
              <span style={{ fontSize: 16 }}>🚚</span>
              <div style={{ fontSize: 13, color: '#212121' }}>
                Delivery by <strong>{data.deliveryDate}</strong>
              </div>
            </div>

            {/* Seller Row (Light Gray Box) */}
            <div style={{
              backgroundColor: '#f7f7f8',
              borderRadius: 8,
              padding: '11px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#212121' }}>
                  <span style={{ fontSize: 15 }}>🏪</span>
                  <span>Seller: <strong>{data.seller}</strong></span>
                </div>
                <span style={{ color: '#2874f0', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                  See other sellers
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#717478', paddingLeft: 24 }}>
                {data.sellerRating} ★ • {data.sellerYears}
              </div>
            </div>
          </div>

          {/* 6. RATINGS AND REVIEWS (Screenshot 1) */}
          <div style={{ height: 8, backgroundColor: '#f1f3f6' }} />
          <div style={{ padding: '14px 14px 16px', backgroundColor: '#ffffff' }}>
            {/* Header with Accordion arrow */}
            <div
              onClick={() => setIsReviewsExpanded(!isReviewsExpanded)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 800, color: '#111112' }}>
                Ratings and reviews
              </div>
              <span style={{
                fontSize: 16,
                color: '#555555',
                transform: isReviewsExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.2s ease'
              }}>
                ▲
              </span>
            </div>

            {isReviewsExpanded && (
              <>
                {/* Rating Score & Excellent Pill */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    backgroundColor: '#108435',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontWeight: 800,
                    fontSize: 15
                  }}>
                    {data.rating} ★
                  </span>
                  <span style={{
                    backgroundColor: '#e8f5e9',
                    color: '#108435',
                    border: '1px solid #c8e6c9',
                    borderRadius: 4,
                    padding: '2px 8px',
                    fontSize: 12,
                    fontWeight: 700
                  }}>
                    Excellent
                  </span>
                </div>

                <div style={{ fontSize: 13, color: '#717478', marginBottom: 14 }}>
                  based on {data.ratingsCount} ratings by <span style={{ color: '#212121', fontWeight: 600 }}>✓ Verified Buyers</span>
                </div>

                {/* Customer Photo Mosaic Grid (Exact match from Screenshot 1) */}
                <div 
                  onClick={() => setSelectedReviewImage(data.customerPhotoMosaic)}
                  style={{
                    marginBottom: 16,
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: '1px solid #ebebeb',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <img
                    src={data.customerPhotoMosaic}
                    alt="Customer review photos"
                    style={{
                      width: '100%',
                      maxHeight: 260,
                      display: 'block',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: '#fff',
                    padding: '3px 8px',
                    borderRadius: 14,
                    fontSize: 11,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    <span>📷</span> Customer Photos
                  </div>
                </div>

                {/* Attribute Rating Pills (Horizontal scrolling pills) */}
                <div style={{
                  display: 'flex',
                  gap: 8,
                  overflowX: 'auto',
                  padding: '4px 0 14px',
                  scrollbarWidth: 'none'
                }}>
                  {data.attributeRatings.map((attr, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#f1f8ff',
                        border: '1px solid #d4e9fc',
                        borderRadius: 20,
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#111112',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        flexShrink: 0
                      }}
                    >
                      <span>{attr.name}</span>
                      <span style={{ fontWeight: 700 }}>{attr.rating}</span>
                      <span style={{ color: '#108435' }}>★</span>
                    </div>
                  ))}
                </div>

                {/* Review Type Filter Pills (All, 5★, 4★, 3★, 1-2★, Photos) */}
                <div style={{
                  display: 'flex',
                  gap: 8,
                  overflowX: 'auto',
                  padding: '2px 0 12px',
                  scrollbarWidth: 'none'
                }}>
                  {[
                    { key: 'all', label: `All (${reviewCounts.total})` },
                    { key: 'photos', label: `📷 Photos (${reviewCounts.photos})` },
                    { key: '5', label: `5 ★ (${reviewCounts.r5})` },
                    { key: '4', label: `4 ★ (${reviewCounts.r4})` },
                    { key: '3', label: `3 ★ (${reviewCounts.r3})` },
                    { key: 'bad', label: `1-2 ★ (${reviewCounts.rBad})` }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setReviewFilter(tab.key)}
                      style={{
                        padding: '5px 11px',
                        borderRadius: 16,
                        fontSize: 11,
                        fontWeight: 700,
                        border: reviewFilter === tab.key ? '1px solid #2874f0' : '1px solid #e0e0e0',
                        backgroundColor: reviewFilter === tab.key ? '#eaf2fe' : '#ffffff',
                        color: reviewFilter === tab.key ? '#2874f0' : '#444444',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Verified Buyer Review Cards (Horizontal Swipeable Row) */}
                <div style={{
                  display: 'flex',
                  gap: 12,
                  overflowX: 'auto',
                  paddingBottom: 6,
                  scrollbarWidth: 'none'
                }}>
                  {filteredReviews.map((rev) => {
                    const votes = reviewVotes[rev.id] || { likes: 0, dislikes: 0, userVoted: null };
                    const currentLikes = (rev.likes || 120) + votes.likes;
                    const currentDislikes = (rev.dislikes || 24) + votes.dislikes;

                    return (
                      <div
                        key={rev.id}
                        style={{
                          backgroundColor: '#f8f9fa',
                          borderRadius: 12,
                          padding: '12px 14px',
                          minWidth: 280,
                          maxWidth: 310,
                          border: '1px solid #ececec',
                          flexShrink: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          {/* Rating, Title & Date */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                            <span style={{
                              backgroundColor: rev.rating >= 4 ? '#108435' : rev.rating === 3 ? '#ff9f00' : '#d32f2f',
                              color: '#ffffff',
                              borderRadius: 3,
                              padding: '1px 5px',
                              fontSize: 11,
                              fontWeight: 700
                            }}>
                              {rev.rating} ★
                            </span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#111112' }}>
                              {rev.title}
                            </span>
                            <span style={{ fontSize: 11, color: '#888888', marginLeft: 'auto' }}>
                              {rev.time || '1 year ago'}
                            </span>
                          </div>

                          {/* Review comment */}
                          <div style={{ fontSize: 13, color: '#333333', lineHeight: 1.4, marginBottom: (rev.image || (rev.images && rev.images[0])) ? 8 : 12 }}>
                            {rev.comment}
                          </div>

                          {/* Customer Review Photo if present */}
                          {(rev.image || (rev.images && rev.images[0])) && (
                            <div style={{ marginBottom: 12 }}>
                              <div
                                onClick={() => setSelectedReviewImage(rev.image || rev.images[0])}
                                style={{
                                  display: 'inline-block',
                                  position: 'relative',
                                  borderRadius: 8,
                                  overflow: 'hidden',
                                  border: '1px solid #dcdcdc',
                                  cursor: 'pointer',
                                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                  backgroundColor: '#ffffff'
                                }}
                              >
                                <img
                                  src={rev.image || rev.images[0]}
                                  alt="Customer Review"
                                  style={{
                                    width: 76,
                                    height: 76,
                                    objectFit: 'cover',
                                    display: 'block'
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                                <div style={{
                                  position: 'absolute',
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  background: 'rgba(0,0,0,0.65)',
                                  color: '#ffffff',
                                  fontSize: 9,
                                  fontWeight: 600,
                                  textAlign: 'center',
                                  padding: '2px 0',
                                  letterSpacing: '0.2px'
                                }}>
                                  📷 Buyer Photo
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          {/* Author and Verified Buyer */}
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#212121', textTransform: 'uppercase' }}>
                            {rev.author}
                          </div>
                          <div style={{ fontSize: 11, color: '#717478', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1, flexWrap: 'wrap' }}>
                            <span>✓ Verified Buyer</span>
                            {rev.location && <span style={{ color: '#888888' }}>• {rev.location}</span>}
                          </div>

                          {/* Helpful Buttons */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            marginTop: 10,
                            paddingTop: 8,
                            borderTop: '1px solid #e8e8e8'
                          }}>
                            <button
                              onClick={() => handleVote(rev.id, 'like')}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: votes.userVoted === 'like' ? '#108435' : '#555555',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: 0
                              }}
                            >
                              <span>👍</span> {currentLikes}
                            </button>
                            <button
                              onClick={() => handleVote(rev.id, 'dislike')}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: votes.userVoted === 'dislike' ? '#d32f2f' : '#555555',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: 0
                              }}
                            >
                              <span>👎</span> {currentDislikes}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Show all reviews button (matching Screenshot 2) */}
                <div style={{ marginTop: 12 }}>
                  <button
                    onClick={() => setShowAllReviewsModal(true)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #d4d5d9',
                      backgroundColor: '#ffffff',
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#212121',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <span>Show all {reviewCounts.total} reviews</span>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>&gt;</span>
                  </button>
                </div>
              </>
            )}
          </div>
          <div style={{ height: 28 }} />
        </div>

        {/* 7. STICKY BOTTOM ACTION BAR (Screenshot 3) */}
        <div style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 100,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e0e0e0',
          padding: '8px 12px calc(10px + env(safe-area-inset-bottom, 0px))',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.08)',
          flexShrink: 0,
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Add to cart Button (White with Border matching screenshot) */}
          <button
            onClick={handleActionAddToCart}
            style={{
              flex: 1,
              height: 46,
              borderRadius: 8,
              border: '1px solid #c7c7c7',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              outline: 'none',
              padding: '6px 10px'
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111112' }}>
              Add to cart
            </span>
          </button>

          {/* Buy now Button (Flipkart Yellow #ffd200) */}
          <button
            onClick={handleActionBuyNow}
            style={{
              flex: 1,
              height: 46,
              borderRadius: 8,
              backgroundColor: '#ffd200',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
              padding: '2px 8px'
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: '#111112', lineHeight: 1.2 }}>
              Buy now
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#111112', lineHeight: 1.2 }}>
              at ₹{currentPrice.toLocaleString('en-IN')}
            </div>
          </button>
        </div>
      </div>

      {/* All Reviews Modal / Bottom Sheet */}
      {showAllReviewsModal && (
        <div
          onClick={() => setShowAllReviewsModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            zIndex: 100000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            backdropFilter: 'blur(2px)'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              width: '100%',
              maxWidth: 520,
              height: '86vh',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -4px 24px rgba(0,0,0,0.3)',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid #ebebeb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff'
            }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#111112' }}>
                  Ratings & Reviews ({data.reviews.length})
                </div>
                <div style={{ fontSize: 12, color: '#717478', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    backgroundColor: '#108435',
                    color: '#fff',
                    borderRadius: 3,
                    padding: '1px 5px',
                    fontSize: 11,
                    fontWeight: 700
                  }}>
                    {data.rating} ★
                  </span>
                  <span>based on {data.ratingsCount} ratings by Verified Buyers</span>
                </div>
              </div>
              <button
                onClick={() => setShowAllReviewsModal(false)}
                style={{
                  background: '#f1f3f6',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: '#333'
                }}
              >
                ✕
              </button>
            </div>

            {/* Filter Tabs */}
            <div style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              padding: '10px 16px',
              borderBottom: '1px solid #f1f1f1',
              scrollbarWidth: 'none',
              flexShrink: 0,
              backgroundColor: '#fafafa'
            }}>
              {[
                { key: 'all', label: `All (${reviewCounts.total})` },
                { key: 'photos', label: `📷 Photos (${reviewCounts.photos})` },
                { key: '5', label: `5 ★ (${reviewCounts.r5})` },
                { key: '4', label: `4 ★ (${reviewCounts.r4})` },
                { key: '3', label: `3 ★ (${reviewCounts.r3})` },
                { key: 'bad', label: `1-2 ★ (${reviewCounts.rBad})` }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setReviewFilter(tab.key)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    border: reviewFilter === tab.key ? '1px solid #2874f0' : '1px solid #dcdcdc',
                    backgroundColor: reviewFilter === tab.key ? '#eaf2fe' : '#ffffff',
                    color: reviewFilter === tab.key ? '#2874f0' : '#444444',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Reviews List */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              {filteredReviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 16px', color: '#888' }}>
                  No reviews match this filter.
                </div>
              ) : (
                filteredReviews.map(rev => {
                  const votes = reviewVotes[rev.id] || { likes: 0, dislikes: 0, userVoted: null };
                  const currentLikes = (rev.likes || 40) + votes.likes;
                  const currentDislikes = (rev.dislikes || 2) + votes.dislikes;

                  return (
                    <div
                      key={rev.id}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 10,
                        padding: '12px 14px',
                        border: '1px solid #ececec',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <span style={{
                          backgroundColor: rev.rating >= 4 ? '#108435' : rev.rating === 3 ? '#ff9f00' : '#d32f2f',
                          color: '#ffffff',
                          borderRadius: 3,
                          padding: '1px 5px',
                          fontSize: 11,
                          fontWeight: 700
                        }}>
                          {rev.rating} ★
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#111112' }}>
                          {rev.title}
                        </span>
                        <span style={{ fontSize: 11, color: '#888888', marginLeft: 'auto' }}>
                          {rev.time || 'recently'}
                        </span>
                      </div>

                      <div style={{ fontSize: 13, color: '#333333', lineHeight: 1.4, marginBottom: (rev.image || (rev.images && rev.images[0])) ? 8 : 10 }}>
                        {rev.comment}
                      </div>

                      {/* Customer Photo */}
                      {(rev.image || (rev.images && rev.images[0])) && (
                        <div style={{ marginBottom: 10 }}>
                          <img
                            src={rev.image || rev.images[0]}
                            alt="Customer Review"
                            onClick={() => handleOpenReviewImage(rev.image || rev.images[0])}
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 8,
                              border: '1px solid #dcdcdc',
                              cursor: 'pointer',
                              display: 'block'
                            }}
                          />
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#212121', textTransform: 'uppercase' }}>
                            {rev.author}
                          </div>
                          <div style={{ fontSize: 11, color: '#717478', marginTop: 1, display: 'flex', gap: 4 }}>
                            <span>✓ Verified Buyer</span>
                            {rev.location && <span style={{ color: '#888' }}>• {rev.location}</span>}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                          <button
                            onClick={() => handleVote(rev.id, 'like')}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: 12,
                              fontWeight: 600,
                              color: votes.userVoted === 'like' ? '#108435' : '#555555',
                              cursor: 'pointer'
                            }}
                          >
                            👍 {currentLikes}
                          </button>
                          <button
                            onClick={() => handleVote(rev.id, 'dislike')}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: 12,
                              fontWeight: 600,
                              color: votes.userVoted === 'dislike' ? '#d32f2f' : '#555555',
                              cursor: 'pointer'
                            }}
                          >
                            👎 {currentDislikes}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Customer Review Image Lightbox */}
      {selectedReviewImage && (
        <div
          onClick={handleCloseReviewImage}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            zIndex: 100000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backdropFilter: 'blur(3px)'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: 420,
              width: '100%',
              backgroundColor: '#1e1e1e',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <button
              onClick={handleCloseReviewImage}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'rgba(0,0,0,0.6)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 700,
                zIndex: 3
              }}
            >
              ✕
            </button>
            <img
              src={selectedReviewImage}
              alt="Customer Review Enlarged"
              style={{
                width: '100%',
                maxHeight: '68vh',
                objectFit: 'contain',
                backgroundColor: '#000000',
                display: 'block'
              }}
            />
            <div style={{
              padding: '12px 16px',
              color: '#ffffff',
              fontSize: 12,
              width: '100%',
              background: '#151515',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #282828'
            }}>
              <span style={{ fontWeight: 600, color: '#4caf50' }}>✓ Verified Buyer Photo</span>
              <span style={{ fontSize: 11, color: '#9e9e9e' }}>Flipkart Customer Review</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
