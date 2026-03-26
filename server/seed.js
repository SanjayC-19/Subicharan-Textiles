import 'dotenv/config';
import bcrypt from 'bcryptjs';
// import mongoose from 'mongoose';
import Material from './models/Material.js';
import User from './models/User.js';

const materials = [
  {
    materialCode: 'STX-IKAT-001',
    yarnType: 'Ikat Handloom Cotton',
    color: 'Maroon',
    pricePerMeter: 350,
    stock: 5000,
    description: 'Maroon Ikat Handloom Cotton Fabric',    
    imageURL: 'https://github-production-user-asset-6210df.s3.amazonaws.com/49822295/291661138-04f7f631-f25b-439f-bd96-98dcffd404c0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20240216%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240216T120000Z&X-Amz-Expires=300&X-Amz-Signature=temp&X-Amz-SignedHeaders=host&actor_id=49822295&key_id=0&repo_id=0'
  },
  {
    materialCode: 'STX-IKAT-002',
    yarnType: 'Ikat Handloom Cotton',
    color: 'Black',
    pricePerMeter: 350,
    stock: 4500,
    description: 'Black Ikat Cotton Handloom Fabric',    
    imageURL: 'https://github-production-user-asset-6210df.s3.amazonaws.com/49822295/291661136-9a2cfbc6-7359-4b66-a6fc-6e1026090547.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20240216%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240216T120000Z&X-Amz-Expires=300&X-Amz-Signature=temp&X-Amz-SignedHeaders=host&actor_id=49822295&key_id=0&repo_id=0'
  },
  {
    materialCode: 'STX-IKAT-003',
    yarnType: 'Ikat Handloom Cotton',
    color: 'Off White',
    pricePerMeter: 350,
    stock: 3000,
    description: 'Off White Ikat Cotton Handloom Fabric',    
    imageURL: 'https://github-production-user-asset-6210df.s3.amazonaws.com/49822295/291661136-121f6ad1-0d32-4752-bbb8-9eeff1ebaf08.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20240216%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240216T120000Z&X-Amz-Expires=300&X-Amz-Signature=temp&X-Amz-SignedHeaders=host&actor_id=49822295&key_id=0&repo_id=0'
  },
  {
    materialCode: 'STX-IKAT-004',
    yarnType: 'Ikat Handloom Cotton',
    color: 'Maroon',
    pricePerMeter: 350,
    stock: 6200,
    description: 'Maroon Ikat Cotton Handloom Fabric',    
    imageURL: 'https://github-production-user-asset-6210df.s3.amazonaws.com/49822295/291661138-04f7f631-f25b-439f-bd96-98dcffd404c0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20240216%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240216T120000Z&X-Amz-Expires=300&X-Amz-Signature=temp&X-Amz-SignedHeaders=host&actor_id=49822295&key_id=0&repo_id=0'
  },
  {
    materialCode: 'STX-IKAT-005',
    yarnType: 'Embroidered Hakoba Cotton',
    color: 'Pink',
    pricePerMeter: 249,
    stock: 4000,
    description: 'Pink Ikat Diamond Print With Embroidered Hakoba Cotton Fabric',    
    imageURL: 'https://github-production-user-asset-6210df.s3.amazonaws.com/49822295/291661138-d62111ca-b8e7-4f6c-8e4a-44682490b4ad.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20240216%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240216T120000Z&X-Amz-Expires=300&X-Amz-Signature=temp&X-Amz-SignedHeaders=host&actor_id=49822295&key_id=0&repo_id=0'
  },
  {
    materialCode: 'STX-IKAT-006',
    yarnType: 'Ikat Printed Cotton',
    color: 'Blue & Pink',
    pricePerMeter: 240,
    stock: 5500,
    description: 'Blue & Pink Traditional Ikat Printed Cotton Fabric',    
    imageURL: 'https://github-production-user-asset-6210df.s3.amazonaws.com/49822295/291661139-c5c7d8fe-2e11-4ebc-8c01-7faef14112e4.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20240216%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240216T120000Z&X-Amz-Expires=300&X-Amz-Signature=temp&X-Amz-SignedHeaders=host&actor_id=49822295&key_id=0&repo_id=0'
  },
  {
    materialCode: 'STX-IKAT-007',
    yarnType: 'Ikat Printed Cotton',
    color: 'Blue',
    pricePerMeter: 300,
    stock: 2000,
    description: 'Blue Traditional Ikat Print Cotton Fabric',    
    imageURL: 'https://github-production-user-asset-6210df.s3.amazonaws.com/49822295/291661141-863a3d54-1b48-43d9-9520-22c608f51a44.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20240216%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240216T120000Z&X-Amz-Expires=300&X-Amz-Signature=temp&X-Amz-SignedHeaders=host&actor_id=49822295&key_id=0&repo_id=0'
  },
  {
    materialCode: 'STX-IKAT-008',
    yarnType: 'Embroidered Ikat Cotton',
    color: 'Yellow',
    pricePerMeter: 700,
    stock: 1500,
    description: 'Yellow Thread And Zardozi Motifs Embroidered Ikat Cotton Fabric',    
    imageURL: 'https://images.unsplash.com/photo-1544457070-52317134aadd?w=600&q=80'
  },
  {
    materialCode: 'STX-LINEN-001',
    yarnType: 'Cotton Linen',
    color: 'Gray & White',
    pricePerMeter: 580,
    stock: 2500,
    description: 'Gray & White Stripe Cotton Linen Fabric',    
    imageURL: ''
  },
  {
    materialCode: 'STX-LINEN-002',
    yarnType: 'Cotton Linen',
    color: 'Pink & White',
    pricePerMeter: 660,
    stock: 3200,
    description: 'Pink & White Dual Tone Premium Cotton Linen Fabric',    
    imageURL: ''
  },
  {
    materialCode: 'STX-LINEN-003',
    yarnType: 'Textured Cotton Linen',
    color: 'White',
    pricePerMeter: 680,
    stock: 1800,
    description: 'White Jacquard Style Paisley Textured Cotton Linen Fabric',    
    imageURL: ''
  },
  {
    materialCode: 'STX-LINEN-004',
    yarnType: 'Cotton Linen',
    color: 'Off White & Blue',
    pricePerMeter: 580,
    stock: 4100,
    description: 'Off White Cotton Linen Fabric with Blue checks',    
    imageURL: ''
  },
  {
    materialCode: 'STX-LINEN-005',
    yarnType: 'Textured Cotton Linen',
    color: 'Black',
    pricePerMeter: 680,
    stock: 2000,
    description: 'Black Jacquard Style Self Textured Cotton Linen Fabric',    
    imageURL: ''
  },
  {
    materialCode: 'STX-LINEN-006',
    yarnType: 'Cotton Linen',
    color: 'Off White & Black',
    pricePerMeter: 580,
    stock: 3600,
    description: 'Off White Cotton Linen Fabric with Black checks',    
    imageURL: ''
  },
  {
    materialCode: 'STX-LINEN-007',
    yarnType: 'Cotton',
    color: 'Sky Blue & Black',
    pricePerMeter: 580,
    stock: 2800,
    description: 'Sky Blue Cotton Fabric with Black Horizontal Lines',    
    imageURL: ''
  },
  {
    materialCode: 'STX-LINEN-008',
    yarnType: 'Cotton Linen',
    color: 'Dusty Peach & Wine',
    pricePerMeter: 580,
    stock: 1900,
    description: 'Dusty Peach Cotton Linen Fabric with Wine Color Lines',    
    imageURL: ''
  },
  {
    materialCode: 'STX-IKAT-009',
    yarnType: 'Ikkat Cotton',
    color: 'Light Orange',
    pricePerMeter: 332,
    stock: 2500,
    description: 'Light Orange Geometric Self Patterned Ikkat Cotton Fabric',
    imageURL: ''
  },
  {
    materialCode: 'STX-CHAND-001',
    yarnType: 'Mul Chanderi',
    color: 'White',
    pricePerMeter: 350,
    stock: 2000,
    description: 'White Plain Mul chanderi Fabric',
    imageURL: ''
  },
  {
    materialCode: 'STX-CHAND-002',
    yarnType: 'Embroidered Mul Chanderi',
    color: 'Mustard Gold',
    pricePerMeter: 798,
    stock: 1800,
    description: 'Musterd Gold Floral Embroiderd Mul Chanderi Fabric',
    imageURL: ''
  },
  {
    materialCode: 'STX-CHAND-003',
    yarnType: 'Embroidered Mul Chanderi',
    color: 'White',
    pricePerMeter: 790,
    stock: 1500,
    description: 'White Floral Embroiderd Mul Chanderi Fabric',
    imageURL: ''
  },
  {
    materialCode: 'STX-CHAND-004',
    yarnType: 'Embroidered Mul Chanderi',
    color: 'Dusty Purple',
    pricePerMeter: 790,
    stock: 1200,
    description: 'Dusty Purple Floral Embroidered Mul Chanderi Fabric',
    imageURL: ''
  }
];

const seed = async () => {
  try {
    if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
      throw new Error('MONGO_URI and JWT_SECRET are required in .env');
    }

    // MongoDB connection removed

    // Delete the unwanted fallback items from the database
    await Material.deleteMany({ materialCode: { $regex: '^STX-YRN' } });

    // Instead of deleting everything, update or insert (upsert) to preserve manual changes like uploaded images
    for (const material of materials) {
      await Material.updateOne(
        { materialCode: material.materialCode },
        { $setOnInsert: material },
        { upsert: true }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@subicharantex.com';    
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashed = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: 'Subicharan Tex Admin',
        email: adminEmail,
        password: hashed,
        address: 'Subicharan Tex Mill, Erode, Tamil Nadu',
        role: 'admin',
      });
    }

    console.log('Seed complete: materials inserted and admin ensured');
    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exit(1);
  }
};

seed();
