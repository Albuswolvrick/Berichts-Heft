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
    console.log(' User is created.', admin.email);
    console.log('\nLogin credentials:admin1');
    console.log('  admin@hespie.de / 1');
    console.log('bitte erstelen sie einen Privaten nutzer und Löschen sie den admin1')

  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
