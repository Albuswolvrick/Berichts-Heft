const { prisma } = require('./src/server/config/database');
const bcrypt = require('bcrypt');

async function createAdminUser() {
  try {
    // Delete existing admin user if it exists
    await prisma.user.deleteMany({
      where: {
        email: 'admin@hespie.de',
      },
    });

    // Create Admin
    const admin = await prisma.user.create({
      data: {
        email: 'admin@one.de',
        name: 'admin1',
        role: 'ADMIN',
        passwordHash: await bcrypt.hash('admin1', 10),
      },
    });
    console.log(' check the god dam Admin is created created, welcome to hell you motherbord loving human:', admin.email);
    console.log('\nLogin credentials:');
    console.log('  admin@hespie.de / 1');

  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
