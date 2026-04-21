const { prisma } = require('./src/server/config/database');
const bcrypt = require('bcrypt');

async function createTestUsers() {
    try {
        // Delete existing test users
        await prisma.user.deleteMany({
            where: {
                email: {
                    in: ['admin@test.com', 'manager@test.com', 'test@test.com', 'user@test.com'],
                },
            },
        });

        // Create Admin
        const admin = await prisma.user.create({
            data: {
                email: 'admin@test.com',
                name: 'This_sucks',
                role: 'ADMIN',
                passwordHash: await bcrypt.hash('admin123', 10),
            },
        });
        console.log('✅ Admin created:', admin.email);

        // Create Manager
        const manager = await prisma.user.create({
            data: {
                email: 'manager@test.com',
                name: 'Yes_it_sucks',
                role: 'MANAGER',
                passwordHash: await bcrypt.hash('manager123', 10),
            },
        });
        console.log('✅ Manager created:', manager.email);

        // Create User
        const user = await prisma.user.create({
            data: {
                email: 'user@test.com',
                name: 'User_Test',
                role: 'USER',
                passwordHash: await bcrypt.hash('test123', 10),
            },
        });
        console.log('✅ User created:', user.email);

        // Create Test
        const test = await prisma.user.create({
            data: {

                email: 'test@test.com',
                name: 'test Test',
                role: 'TEST',
                passwordHash: await bcrypt.hash('user123', 10),
            },
        });
        console.log('✅ Test created:', test.email);

        console.log('\n✅ All test users created successfully!');
        console.log('\nLogin credentials:');
        console.log('  admin@test.com / admin123');
        console.log('  manager@test.com / manager123');
        console.log('  user@test.com / user123');
        console.log('  test@test.com / test123');
    } catch (error) {
        console.error('❌ Error creating users:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

createTestUsers();
