import 'dotenv/config';

const createFirebaseUser = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@subicharantex.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const apiKey = 'AIzaSyCd_ex_zdWQf8HHFI95SgDCro2JcAW0XP0'; // From your Firebase config

  try {
    console.log(`Creating Firebase Auth user: ${email}...`);

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Firebase user created successfully!');
      console.log(`   Email: ${email}`);
      console.log(`   UID: ${data.localId}`);
      console.log('\n✨ Now you can log in at /admin/login with these credentials.');
    } else if (data.error?.message?.includes('EMAIL_EXISTS')) {
      console.log('⚠️  User already exists in Firebase Auth.');
      console.log(`   Email: ${email}`);
      console.log('   You can now log in with these credentials.');
    } else {
      console.error('❌ Error creating user:', data.error?.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    process.exit(1);
  }
};

createFirebaseUser();
