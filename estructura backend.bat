@echo off
echo Creando estructura del proyecto NestJS...
echo.

REM Crear estructura principal de directorios
mkdir backend
cd backend
mkdir src
mkdir test

REM Crear directorios principales dentro de src
mkdir src\common
mkdir src\common\decorators
mkdir src\config
mkdir src\auth
mkdir src\auth\guards
mkdir src\auth\strategies
mkdir src\auth\dto
mkdir src\users
mkdir src\users\entities
mkdir src\users\dto
mkdir src\offices
mkdir src\offices\entities
mkdir src\roles
mkdir src\roles\entities
mkdir src\routing-sheets
mkdir src\routing-sheets\entities
mkdir src\cites
mkdir src\cites\entities
mkdir src\documents
mkdir src\documents\entities
mkdir src\folders
mkdir src\folders\entities
mkdir src\copies
mkdir src\copies\entities
mkdir src\groups
mkdir src\groups\entities
mkdir src\history
mkdir src\history\entities

echo Directorios creados exitosamente.
echo.

echo Creando archivos...
echo.

REM Crear archivos en src
echo // Archivo principal del módulo de la aplicación > src\app.module.ts
echo import { Module } from '@nestjs/common'; >> src\app.module.ts
echo import { AuthModule } from './auth/auth.module'; >> src\app.module.ts
echo import { UsersModule } from './users/users.module'; >> src\app.module.ts
echo import { OfficesModule } from './offices/offices.module'; >> src\app.module.ts
echo import { RolesModule } from './roles/roles.module'; >> src\app.module.ts
echo import { RoutingSheetsModule } from './routing-sheets/routing-sheets.module'; >> src\app.module.ts
echo import { CitesModule } from './cites/cites.module'; >> src\app.module.ts
echo import { DocumentsModule } from './documents/documents.module'; >> src\app.module.ts
echo import { FoldersModule } from './folders/folders.module'; >> src\app.module.ts
echo import { CopiesModule } from './copies/copies.module'; >> src\app.module.ts
echo import { GroupsModule } from './groups/groups.module'; >> src\app.module.ts
echo import { HistoryModule } from './history/history.module'; >> src\app.module.ts
echo. >> src\app.module.ts
echo @Module({ >> src\app.module.ts
echo   imports: [ >> src\app.module.ts
echo     AuthModule, >> src\app.module.ts
echo     UsersModule, >> src\app.module.ts
echo     OfficesModule, >> src\app.module.ts
echo     RolesModule, >> src\app.module.ts
echo     RoutingSheetsModule, >> src\app.module.ts
echo     CitesModule, >> src\app.module.ts
echo     DocumentsModule, >> src\app.module.ts
echo     FoldersModule, >> src\app.module.ts
echo     CopiesModule, >> src\app.module.ts
echo     GroupsModule, >> src\app.module.ts
echo     HistoryModule, >> src\app.module.ts
echo   ], >> src\app.module.ts
echo }) >> src\app.module.ts
echo export class AppModule {} >> src\app.module.ts

echo // Servicio principal de la aplicación > src\app.service.ts
echo import { Injectable } from '@nestjs/common'; >> src\app.service.ts
echo. >> src\app.service.ts
echo @Injectable() >> src\app.service.ts
echo export class AppService { >> src\app.service.ts
echo   getHello(): string { >> src\app.service.ts
echo     return 'Hello World!'; >> src\app.service.ts
echo   } >> src\app.service.ts
echo } >> src\app.service.ts

echo // Controlador principal de la aplicación > src\app.controller.ts
echo import { Controller, Get } from '@nestjs/common'; >> src\app.controller.ts
echo import { AppService } from './app.service'; >> src\app.controller.ts
echo. >> src\app.controller.ts
echo @Controller() >> src\app.controller.ts
echo export class AppController { >> src\app.controller.ts
echo   constructor(private readonly appService: AppService) {} >> src\app.controller.ts
echo. >> src\app.controller.ts
echo   @Get() >> src\app.controller.ts
echo   getHello(): string { >> src\app.controller.ts
echo     return this.appService.getHello(); >> src\app.controller.ts
echo   } >> src\app.controller.ts
echo } >> src\app.controller.ts

echo // Archivo principal de la aplicación > src\main.ts
echo import { NestFactory } from '@nestjs/core'; >> src\main.ts
echo import { AppModule } from './app.module'; >> src\main.ts
echo import { ValidationPipe } from '@nestjs/common'; >> src\main.ts
echo. >> src\main.ts
echo async function bootstrap() { >> src\main.ts
echo   const app = await NestFactory.create(AppModule); >> src\main.ts
echo   app.useGlobalPipes(new ValidationPipe()); >> src\main.ts
echo   await app.listen(3000); >> src\main.ts
echo } >> src\main.ts
echo bootstrap(); >> src\main.ts

REM Crear archivos en common/decorators
echo // Decorador para obtener el usuario actual > src\common\decorators\user.decorator.ts
echo import { createParamDecorator, ExecutionContext } from '@nestjs/common'; >> src\common\decorators\user.decorator.ts
echo. >> src\common\decorators\user.decorator.ts
echo export const User = createParamDecorator( >> src\common\decorators\user.decorator.ts
echo   (data: string, ctx: ExecutionContext) => { >> src\common\decorators\user.decorator.ts
echo     const request = ctx.switchToHttp().getRequest(); >> src\common\decorators\user.decorator.ts
echo     const user = request.user; >> src\common\decorators\user.decorator.ts
echo. >> src\common\decorators\user.decorator.ts
echo     return data ? user?.[data] : user; >> src\common\decorators\user.decorator.ts
echo   }, >> src\common\decorators\user.decorator.ts
echo ); >> src\common\decorators\user.decorator.ts

REM Crear archivos de configuración
echo // Configuración de la base de datos > src\config\database.config.ts
echo export const databaseConfig = { >> src\config\database.config.ts
echo   host: process.env.DB_HOST || 'localhost', >> src\config\database.config.ts
echo   port: parseInt(process.env.DB_PORT, 10) || 5432, >> src\config\database.config.ts
echo   username: process.env.DB_USERNAME || 'postgres', >> src\config\database.config.ts
echo   password: process.env.DB_PASSWORD || 'password', >> src\config\database.config.ts
echo   database: process.env.DB_NAME || 'sistema_gestion_documental', >> src\config\database.config.ts
echo }; >> src\config\database.config.ts

echo // Configuración de JWT > src\config\jwt.config.ts
echo export const jwtConfig = { >> src\config\jwt.config.ts
echo   secret: process.env.JWT_SECRET || 'secretKey', >> src\config\jwt.config.ts
echo   expiresIn: process.env.JWT_EXPIRES_IN || '24h', >> src\config\jwt.config.ts
echo }; >> src\config\jwt.config.ts

REM Crear archivos base para cada módulo (solo estructura)
for %%M in (auth users offices roles routing-sheets cites documents folders copies groups history) do (
  echo // Módulo de %%~nM > src\%%M\%%M.module.ts
  echo import { Module } from '@nestjs/common'; >> src\%%M\%%M.module.ts
  echo. >> src\%%M\%%M.module.ts
  echo @Module({}) >> src\%%M\%%M.module.ts
  echo export class %%~nMCapitalize%%Module {} >> src\%%M\%%M.module.ts
  
  echo // Servicio de %%~nM > src\%%M\%%M.service.ts
  echo import { Injectable } from '@nestjs/common'; >> src\%%M\%%M.service.ts
  echo. >> src\%%M\%%M.service.ts
  echo @Injectable() >> src\%%M\%%M.service.ts
  echo export class %%~nMCapitalize%%Service {} >> src\%%M\%%M.service.ts
  
  echo // Controlador de %%~nM > src\%%M\%%M.controller.ts
  echo import { Controller } from '@nestjs/common'; >> src\%%M\%%M.controller.ts
  echo. >> src\%%M\%%M.controller.ts
  echo @Controller('%%M') >> src\%%M\%%M.controller.ts
  echo export class %%~nMCapitalize%%Controller {} >> src\%%M\%%M.controller.ts
)

REM Crear archivos específicos para auth
echo // DTO de login > src\auth\dto\login.dto.ts
echo import { IsString, IsNotEmpty } from 'class-validator'; >> src\auth\dto\login.dto.ts
echo. >> src\auth\dto\login.dto.ts
echo export class LoginDto { >> src\auth\dto\login.dto.ts
echo   @IsString() >> src\auth\dto\login.dto.ts
echo   @IsNotEmpty() >> src\auth\dto\login.dto.ts
echo   username: string; >> src\auth\dto\login.dto.ts
echo. >> src\auth\dto\login.dto.ts
echo   @IsString() >> src\auth\dto\login.dto.ts
echo   @IsNotEmpty() >> src\auth\dto\login.dto.ts
echo   password: string; >> src\auth\dto\login.dto.ts
echo } >> src\auth\dto\login.dto.ts

echo // DTO de registro > src\auth\dto\register.dto.ts
echo import { IsString, IsNotEmpty, IsEmail } from 'class-validator'; >> src\auth\dto\register.dto.ts
echo. >> src\auth\dto\register.dto.ts
echo export class RegisterDto { >> src\auth\dto\register.dto.ts
echo   @IsString() >> src\auth\dto\register.dto.ts
echo   @IsNotEmpty() >> src\auth\dto\register.dto.ts
echo   username: string; >> src\auth\dto\register.dto.ts
echo. >> src\auth\dto\register.dto.ts
echo   @IsEmail() >> src\auth\dto\register.dto.ts
echo   @IsNotEmpty() >> src\auth\dto\register.dto.ts
echo   email: string; >> src\auth\dto\register.dto.ts
echo. >> src\auth\dto\register.dto.ts
echo   @IsString() >> src\auth\dto\register.dto.ts
echo   @IsNotEmpty() >> src\auth\dto\register.dto.ts
echo   password: string; >> src\auth\dto\register.dto.ts
echo } >> src\auth\dto\register.dto.ts

echo // Guard de autenticación local > src\auth\guards\local-auth.guard.ts
echo import { Injectable } from '@nestjs/common'; >> src\auth\guards\local-auth.guard.ts
echo import { AuthGuard } from '@nestjs/passport'; >> src\auth\guards\local-auth.guard.ts
echo. >> src\auth\guards\local-auth.guard.ts
echo @Injectable() >> src\auth\guards\local-auth.guard.ts
echo export class LocalAuthGuard extends AuthGuard('local') {} >> src\auth\guards\local-auth.guard.ts

echo // Guard de autenticación JWT > src\auth\guards\jwt-auth.guard.ts
echo import { Injectable } from '@nestjs/common'; >> src\auth\guards\jwt-auth.guard.ts
echo import { AuthGuard } from '@nestjs/passport'; >> src\auth\guards\jwt-auth.guard.ts
echo. >> src\auth\guards\jwt-auth.guard.ts
echo @Injectable() >> src\auth\guards\jwt-auth.guard.ts
echo export class JwtAuthGuard extends AuthGuard('jwt') {} >> src\auth\guards\jwt-auth.guard.ts

echo // Estrategia local > src\auth\strategies\local.strategy.ts
echo import { Strategy } from 'passport-local'; >> src\auth\strategies\local.strategy.ts
echo import { PassportStrategy } from '@nestjs/passport'; >> src\auth\strategies\local.strategy.ts
echo import { Injectable, UnauthorizedException } from '@nestjs/common'; >> src\auth\strategies\local.strategy.ts
echo import { AuthService } from '../auth.service'; >> src\auth\strategies\local.strategy.ts
echo. >> src\auth\strategies\local.strategy.ts
echo @Injectable() >> src\auth\strategies\local.strategy.ts
echo export class LocalStrategy extends PassportStrategy(Strategy) { >> src\auth\strategies\local.strategy.ts
echo   constructor(private authService: AuthService) { >> src\auth\strategies\local.strategy.ts
echo     super(); >> src\auth\strategies\local.strategy.ts
echo   } >> src\auth\strategies\local.strategy.ts
echo. >> src\auth\strategies\local.strategy.ts
echo   async validate(username: string, password: string): Promise<any> { >> src\auth\strategies\local.strategy.ts
echo     const user = await this.authService.validateUser(username, password); >> src\auth\strategies\local.strategy.ts
echo     if (!user) { >> src\auth\strategies\local.strategy.ts
echo       throw new UnauthorizedException(); >> src\auth\strategies\local.strategy.ts
echo     } >> src\auth\strategies\local.strategy.ts
echo     return user; >> src\auth\strategies\local.strategy.ts
echo   } >> src\auth\strategies\local.strategy.ts
echo } >> src\auth\strategies\local.strategy.ts

echo // Estrategia JWT > src\auth\strategies\jwt.strategy.ts
echo import { ExtractJwt, Strategy } from 'passport-jwt'; >> src\auth\strategies\jwt.strategy.ts
echo import { PassportStrategy } from '@nestjs/passport'; >> src\auth\strategies\jwt.strategy.ts
echo import { Injectable } from '@nestjs/common'; >> src\auth\strategies\jwt.strategy.ts
echo import { jwtConfig } from '../../config/jwt.config'; >> src\auth\strategies\jwt.strategy.ts
echo. >> src\auth\strategies\jwt.strategy.ts
echo @Injectable() >> src\auth\strategies\jwt.strategy.ts
echo export class JwtStrategy extends PassportStrategy(Strategy) { >> src\auth\strategies\jwt.strategy.ts
echo   constructor() { >> src\auth\strategies\jwt.strategy.ts
echo     super({ >> src\auth\strategies\jwt.strategy.ts
echo       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), >> src\auth\strategies\jwt.strategy.ts
echo       ignoreExpiration: false, >> src\auth\strategies\jwt.strategy.ts
echo       secretOrKey: jwtConfig.secret, >> src\auth\strategies\jwt.strategy.ts
echo     }); >> src\auth\strategies\jwt.strategy.ts
echo   } >> src\auth\strategies\jwt.strategy.ts
echo. >> src\auth\strategies\jwt.strategy.ts
echo   async validate(payload: any) { >> src\auth\strategies\jwt.strategy.ts
echo     return { userId: payload.sub, username: payload.username }; >> src\auth\strategies\jwt.strategy.ts
echo   } >> src\auth\strategies\jwt.strategy.ts
echo } >> src\auth\strategies\jwt.strategy.ts

REM Crear archivos de entidades base
echo // Entidad de usuario > src\users\entities\user.entity.ts
echo import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'; >> src\users\entities\user.entity.ts
echo. >> src\users\entities\user.entity.ts
echo @Entity('users') >> src\users\entities\user.entity.ts
echo export class User { >> src\users\entities\user.entity.ts
echo   @PrimaryGeneratedColumn() >> src\users\entities\user.entity.ts
echo   id: number; >> src\users\entities\user.entity.ts
echo. >> src\users\entities\user.entity.ts
echo   @Column({ unique: true }) >> src\users\entities\user.entity.ts
echo   username: string; >> src\users\entities\user.entity.ts
echo. >> src\users\entities\user.entity.ts
echo   @Column({ unique: true }) >> src\users\entities\user.entity.ts
echo   email: string; >> src\users\entities\user.entity.ts
echo. >> src\users\entities\user.entity.ts
echo   @Column() >> src\users\entities\user.entity.ts
echo   password: string; >> src\users\entities\user.entity.ts
echo. >> src\users\entities\user.entity.ts
echo   @CreateDateColumn() >> src\users\entities\user.entity.ts
echo   createdAt: Date; >> src\users\entities\user.entity.ts
echo. >> src\users\entities\user.entity.ts
echo   @UpdateDateColumn() >> src\users\entities\user.entity.ts
echo   updatedAt: Date; >> src\users\entities\user.entity.ts
echo } >> src\users\entities\user.entity.ts

REM Crear archivos de configuración del proyecto
echo {} > .env
echo {} > .gitignore
echo node_modules/ >> .gitignore
echo dist/ >> .gitignore
echo .env >> .gitignore

echo {} > nest-cli.json
echo { >> nest-cli.json
echo   "collection": "@nestjs/schematics", >> nest-cli.json
echo   "sourceRoot": "src" >> nest-cli.json
echo } >> nest-cli.json

echo {} > package.json
echo { >> package.json
echo   "name": "sistema-gestion-documental", >> package.json
echo   "version": "1.0.0", >> package.json
echo   "description": "Sistema de gestión documental", >> package.json
echo   "scripts": { >> package.json
echo     "start": "nest start", >> package.json
echo     "start:dev": "nest start --watch", >> package.json
echo     "start:debug": "nest start --debug --watch", >> package.json
echo     "start:prod": "node dist/main", >> package.json
echo     "build": "nest build", >> package.json
echo     "test": "jest", >> package.json
echo     "test:watch": "jest --watch", >> package.json
echo     "test:cov": "jest --coverage", >> package.json
echo     "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand", >> package.json
echo     "typeorm": "ts-node ./node_modules/typeorm/cli" >> package.json
echo   } >> package.json
echo } >> package.json

echo {} > tsconfig.json
echo { >> tsconfig.json
echo   "compilerOptions": { >> tsconfig.json
echo     "module": "commonjs", >> tsconfig.json
echo     "declaration": true, >> tsconfig.json
echo     "removeComments": true, >> tsconfig.json
echo     "emitDecoratorMetadata": true, >> tsconfig.json
echo     "experimentalDecorators": true, >> tsconfig.json
echo     "allowSyntheticDefaultImports": true, >> tsconfig.json
echo     "target": "es2017", >> tsconfig.json
echo     "sourceMap": true, >> tsconfig.json
echo     "outDir": "./dist", >> tsconfig.json
echo     "baseUrl": "./", >> tsconfig.json
echo     "incremental": true, >> tsconfig.json
echo     "skipLibCheck": true, >> tsconfig.json
echo     "strictNullChecks": false, >> tsconfig.json
echo     "noImplicitAny": false, >> tsconfig.json
echo     "strictBindCallApply": false, >> tsconfig.json
echo     "forceConsistentCasingInFileNames": false, >> tsconfig.json
echo     "noFallthroughCasesInSwitch": false >> tsconfig.json
echo   } >> tsconfig.json
echo } >> tsconfig.json

echo.
echo ¡Estructura creada exitosamente!
echo.
echo Instrucciones:
echo 1. Ejecuta: cd backend
echo 2. Instala dependencias: npm install
echo 3. Configura las variables de entorno en el archivo .env
echo 4. Ejecuta el proyecto: npm run start:dev
echo.
pause