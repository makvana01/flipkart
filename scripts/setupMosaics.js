const fs = require('fs');
const path = require('path');

// Ensure directories exist
const productsDir = path.resolve(__dirname, '../public/assets/images/products');
const pdpDir = path.resolve(__dirname, '../public/assets/images/pdp');
if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir, { recursive: true });
if (!fs.existsSync(pdpDir)) fs.mkdirSync(pdpDir, { recursive: true });

// Copy / create review mosaic aliases in pdpDir if not already present
const baseReviewMosaic = path.join(pdpDir, 'customer_review_mosaic.png');
const shoesReviewMosaic = path.join(pdpDir, 'customer_review_shoes.jpg');
const audioReviewMosaic = path.join(pdpDir, 'customer_review_audio.jpg');

const copies = [
  ['reviews_beauty.jpg', baseReviewMosaic],
  ['reviews_home.jpg', baseReviewMosaic],
  ['reviews_appliances.jpg', audioReviewMosaic],
  ['reviews_toys.jpg', baseReviewMosaic],
  ['reviews_food.jpg', baseReviewMosaic],
  ['reviews_auto.jpg', shoesReviewMosaic],
  ['reviews_sports.jpg', shoesReviewMosaic],
  ['reviews_furniture.jpg', baseReviewMosaic],
  ['reviews_fashion.jpg', shoesReviewMosaic]
];

for (const [targetName, sourcePath] of copies) {
  const targetPath = path.join(pdpDir, targetName);
  if (!fs.existsSync(targetPath) && fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
  }
}

console.log('Review mosaics verified.');
