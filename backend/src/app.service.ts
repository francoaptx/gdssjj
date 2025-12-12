// Servicio principal de la aplicación 
import { Injectable } from '@nestjs/common'; 
 
@Injectable() 
export class AppService { 
  getHello(): string { 
    return 'Hello World!'; 
  } 
} 
