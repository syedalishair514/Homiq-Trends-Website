/* eslint-disable @typescript-eslint/no-require-imports */
const https = require('https');
const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'public', 'images');

const downloads = [
  // Hero
  { dir: 'hero', name: 'hero-01.jpg', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=70' },
  { dir: 'hero', name: 'hero-02.jpg', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=70' },
  { dir: 'hero', name: 'hero-03.jpg', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=70' },
  { dir: 'hero', name: 'hero-04.jpg', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=70' },
  { dir: 'hero', name: 'hero-05.jpg', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70' },

  // Categories
  { dir: 'categories', name: 'category-living-room.jpg', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=70' },
  { dir: 'categories', name: 'category-bedroom.jpg', url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=70' },
  { dir: 'categories', name: 'category-kitchen.jpg', url: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=600&q=70' },
  { dir: 'categories', name: 'category-bathroom.jpg', url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=600&q=70' },
  { dir: 'categories', name: 'category-office.jpg', url: 'https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?auto=format&fit=crop&w=600&q=70' },
  { dir: 'categories', name: 'category-decoration.jpg', url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=70' },
  { dir: 'categories', name: 'category-storage.jpg', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=70' },
  { dir: 'categories', name: 'category-lighting.jpg', url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=600&q=70' },
  { dir: 'categories', name: 'category-wall-art.jpg', url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=70' },
  { dir: 'categories', name: 'category-furniture.jpg', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=70' },

  // Rooms
  { dir: 'rooms', name: 'room-living-room.jpg', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=70' },
  { dir: 'rooms', name: 'room-kitchen.jpg', url: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=600&q=70' },
  { dir: 'rooms', name: 'room-bedroom.jpg', url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=70' },
  { dir: 'rooms', name: 'room-dining-room.jpg', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=70' },
  { dir: 'rooms', name: 'room-bathroom.jpg', url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=600&q=70' },
  { dir: 'rooms', name: 'room-office.jpg', url: 'https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?auto=format&fit=crop&w=600&q=70' },

  // Testimonials
  { dir: 'testimonials', name: 'testimonial-01.jpg', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=70' },
  { dir: 'testimonials', name: 'testimonial-02.jpg', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=70' },
  { dir: 'testimonials', name: 'testimonial-03.jpg', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=70' },

  // Instagram
  { dir: 'instagram', name: 'instagram-01.jpg', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&h=400&q=70' },
  { dir: 'instagram', name: 'instagram-02.jpg', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&h=400&q=70' },
  { dir: 'instagram', name: 'instagram-03.jpg', url: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=400&h=400&q=70' },
  { dir: 'instagram', name: 'instagram-04.jpg', url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=400&h=400&q=70' },
  { dir: 'instagram', name: 'instagram-05.jpg', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&h=400&q=70' },
  { dir: 'instagram', name: 'instagram-06.jpg', url: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=400&h=400&q=70' },
  { dir: 'instagram', name: 'instagram-07.jpg', url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&h=400&q=70' },
  { dir: 'instagram', name: 'instagram-08.jpg', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&h=400&q=70' },

  // Products (25 Curated Home Decor Images)
  { dir: 'products', name: 'product-01.jpg', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-02.jpg', url: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-03.jpg', url: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-04.jpg', url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-05.jpg', url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-06.jpg', url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-07.jpg', url: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-08.jpg', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-09.jpg', url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-10.jpg', url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-11.jpg', url: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-12.jpg', url: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-13.jpg', url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-14.jpg', url: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-15.jpg', url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-16.jpg', url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-17.jpg', url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-18.jpg', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-19.jpg', url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-20.jpg', url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-21.jpg', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-22.jpg', url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-23.jpg', url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-24.jpg', url: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=400&h=500&q=70' },
  { dir: 'products', name: 'product-25.jpg', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&h=500&q=70' }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download from ${url}: Status ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(dest);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    });

    request.on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log(`Starting downloads of ${downloads.length} premium brand images...`);
  
  // Create base images dir
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  // Run downloads sequentially to avoid rate-limits and network congestion
  for (let i = 0; i < downloads.length; i++) {
    const item = downloads[i];
    const targetDir = path.join(baseDir, item.dir);
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const destPath = path.join(targetDir, item.name);
    
    // Skip if file already exists to make execution instant on reruns
    if (fs.existsSync(destPath)) {
      console.log(`[${i + 1}/${downloads.length}] Skipping ${item.name} (already downloaded)`);
      continue;
    }

    console.log(`[${i + 1}/${downloads.length}] Downloading ${item.name} to ${item.dir}/...`);
    
    try {
      await downloadFile(item.url, destPath);
    } catch (e) {
      console.error(`Error downloading ${item.name}:`, e.message);
    }
  }

  console.log('\nAll premium brand assets downloaded and saved successfully!');
}

run();
