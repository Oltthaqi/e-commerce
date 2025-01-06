import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RolesSeeder } from './seeding/RolesSeeder';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from './roles/entities/role.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription('Users API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const rolesSeeder = app.get(RolesSeeder);
  if (process.env.RUN_SEED === 'true') {
    const rolesRepository = app.get(getRepositoryToken(Role));
    const existingRoles = await rolesRepository.find();

    if (existingRoles.length === 0) {
      await rolesSeeder.seed();
    } else {
      console.log('Roles already exist in the database. Seeder will not run.');
    }
  }
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
  await app.listen(3001);
}
bootstrap();
