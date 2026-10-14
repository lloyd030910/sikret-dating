import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums/user-role.enum';
import { UserStatus } from '../users/enums/user-status.enum';
import * as argon2 from 'argon2';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';

  const existingAdmin = await usersService.findOneByEmail(adminEmail);
  if (existingAdmin) {
    console.log('Admin user already exists.');
    await app.close();
    return;
  }

  const passwordHash = await argon2.hash(adminPassword);

  await usersService.create({
    email: adminEmail,
    passwordHash,
    role: UserRole.SUPER_ADMIN,
    status: UserStatus.ACTIVE,
    emailVerified: true,
    profile: {
      displayName: 'Super Admin',
    } as any,
  });

  console.log('Super Admin user created successfully.');
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);

  await app.close();
}

bootstrap();
