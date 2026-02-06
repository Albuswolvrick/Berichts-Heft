const { prisma } = require('./db');
const bcrypt = require('bcrypt');

async function createTestUsers() {
  try {
    // Create Admin
    const admin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        name: 'Admin node cfrTest',
        role: 'ADMIN',
        passwordHash: await bcrypt.hash('admin123', 10),
      },
    });
    console.log('✅ Admin created:', admin.email);

    // Create Manager
    const manager = await prisma.user.create({
      data: {
        email: 'manager@test.com',
        name: 'Manager Test',
        role: 'MANAGER',
        passwordHash: await bcrypt.hash('manager123', 10),
      },
    });
    console.log('✅ Manager created:', manager.email);

    // Create Employee
    const employee = await prisma.user.create({
      data: {
        email: 'employee@test.com',
        name: 'Employee Test',
        role: 'EMPLOYEE',
        passwordHash: await bcrypt.hash('employee123', 10),
      },
    });
    console.log('✅ Employee created:', employee.email);

    // Create Trainee
    const trainee = await prisma.user.create({
      data: {
        email: 'trainee@test.com',
        name: 'Trainee Test',
        role: 'TRAINEE',
        passwordHash: await bcrypt.hash('trainee123', 10),
      },
    });
    console.log('✅ Trainee created:', trainee.email);

    console.log('\n✅ All test users created successfully!');
    console.log('\nLogin credentials:');
    console.log('  admin@test.com / admin123');
    console.log('  manager@test.com / manager123');
    console.log('  employee@test.com / employee123');
    console.log('  trainee@test.com / trainee123');
  } catch (error) {
    console.error('❌ Error creating users:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
