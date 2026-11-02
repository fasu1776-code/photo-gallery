const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Photo = require('./models/Photo');

dotenv.config();

const samplePhotos = [
  {
    title: 'Misty Alpine Awakening',
    description: 'Golden morning light piercing through towering pine needles and cold valley mist.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1400&auto=format&fit=crop',
    category: 'Nature',
  },
  {
    title: 'Brutalist Geometry in Glass',
    description: 'Sharp angles and reflective cantilevered architecture piercing the skyline.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop',
    category: 'Architecture',
  },
  {
    title: 'Golden Hour Silhouette',
    description: 'Cinematic chiaroscuro portrait captured against warm dusk horizon.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1400&auto=format&fit=crop',
    category: 'Portrait',
  },
  {
    title: 'Neon Odyssey Shinjuku',
    description: 'Rain-soaked street reflecting vivid cyan and vermilion signboards at midnight.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1400&auto=format&fit=crop',
    category: 'Street',
  },
  {
    title: 'Wanderer Above the Fjords',
    description: 'Perched high atop sheer cliff precipices overlooking deep glacial waterways.',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1400&auto=format&fit=crop',
    category: 'Travel',
  },
  {
    title: 'Emerald Forest Canopy',
    description: 'Deep woodland sanctuary covered in lush ferns and emerald moss.',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1400&auto=format&fit=crop',
    category: 'Nature',
  },
  {
    title: 'Monolithic Spiral Staircase',
    description: 'Mesmerizing architectural helix winding into infinity.',
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1400&auto=format&fit=crop',
    category: 'Architecture',
  },
  {
    title: 'Tokyo Alleyway Rain',
    description: 'Solitary pedestrian with umbrella wandering quiet lantern-lit backstreets.',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1400&auto=format&fit=crop',
    category: 'Street',
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas successfully!');

    await User.deleteMany();
    await Photo.deleteMany();

    const admin = await User.create({
      name: 'Curator Admin',
      email: 'admin@photogallery.com',
      password: 'password123',
      role: 'admin',
    });

    const demoUser = await User.create({
      name: 'Photo Explorer',
      email: 'user@photogallery.com',
      password: 'password123',
      role: 'user',
    });

    const photosToInsert = samplePhotos.map(p => ({
      ...p,
      uploadedBy: admin._id
    }));

    const createdPhotos = await Photo.insertMany(photosToInsert);

    demoUser.favorites.push(createdPhotos[0]._id, createdPhotos[2]._id);
    await demoUser.save();

    console.log('Database seeded successfully!');
    console.log('Admin Login: admin@photogallery.com / password123');
    console.log('User Login: user@photogallery.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();