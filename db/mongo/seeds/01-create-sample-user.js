print('Starting seed script...');

db = db.getSiblingDB('auth-service');
print('Connected to auth-service database');

// Check if the user already exists
print('Checking for existing user...');
const existingUser = db.users.findOne({ email: 'sample@example.com' });

if (!existingUser) {
    print('No existing user found, creating sample user...');
    // Create sample user with hashed password (this is 'password123' hashed)
    db.users.insertOne({
        email: 'sample@example.com',
        username: 'sampleuser',
        password: '$2b$10$5QyQUKdYRqUXdcyZYaRX9.c7U6dCPWxXBSSRgVO5NXJcNbKvmaA1W',
        roles: ['user'],
        createdAt: new Date(),
        updatedAt: new Date()
    });

    print('Sample user created successfully');
} else {
    print('Sample user already exists');
}

// Verify the user was created
const verifyUser = db.users.findOne({ email: 'sample@example.com' });
print('Verification check - User exists:', verifyUser !== null);

print('Seed script completed.'); 