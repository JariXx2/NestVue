import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import axios from 'axios';

@Controller('api')
export class AppController {
  private accessToken: string | null = null;
  private baseDomain: string | null = null;

  constructor() {
    this.getToken().then(() => console.log('Токен получен'));
  }

  async getToken(): Promise<void> {
    try {
      const response = await axios.get(
        'https://app2.gnzs.ru/amocrm/test/oauth/get-token.php',
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Client-Id': '32217794',
          },
        },
      );
      this.accessToken = response.data.access_token;
      this.baseDomain = response.data.base_domain;
    } catch (err) {
      console.error('Ошибка при получении токена:', err);
      throw new HttpException(
        'Ошибка при получении токена',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createEntity(@Body() data: { option: string }): Promise<any> {
    if (!this.accessToken || !this.baseDomain) {
      throw new HttpException('Токен не получен', HttpStatus.UNAUTHORIZED);
    }

    const { option } = data;
    let entityId: string | null = null;
    try {
      switch (option) {
        case 'Сделка':
          entityId = await this.createDeal();
          break;
        case 'Контакт':
          entityId = await this.createContact();
          break;
        case 'Компания':
          entityId = await this.createCompany();
          break;
        default:
          throw new HttpException(
            'Недопустимый тип сущности',
            HttpStatus.BAD_REQUEST,
          );
      }

      return { success: true, result: { id: entityId } };
    } catch (error) {
      console.error('Ошибка при создании сущности:', error);
      throw new HttpException(
        `Ошибка при создании ${option}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async createDeal(): Promise<string> {
    const contactData = {
      name: [
        {
          value: `Сделка ${Date.now()}`, 
        },
      ],
    };

    try {
      const response = await axios.post(
        `https://${this.baseDomain}/api/v4/leads`,
        contactData,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data._embedded.leads[0].id;
    } catch (error) {
      console.error(
        'Ошибка при создании контакта:',
        error.response ? error.response.data : error.message,
      );
      error.response.data['validation-errors'].forEach(
        (validationError: any) => {
          console.error('Request ID:', validationError.request_id);

          console.error('Errors:', validationError.errors);
        },
      );
      throw new HttpException(
        'Ошибка при создании контакта',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async createContact(): Promise<string> {
    const contactData = {
      name: [
        {
          value: `Контакт ${Date.now()}`, 
        },
      ],
    };

    try {
      const response = await axios.post(
        `https://${this.baseDomain}/api/v4/contacts`,
        contactData,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data._embedded.contacts[0].id;
    } catch (error) {
      console.error(
        'Ошибка при создании контакта:',
        error.response ? error.response.data : error.message,
      );
      error.response.data['validation-errors'].forEach(
        (validationError: any) => {
          console.error('Request ID:', validationError.request_id);

          console.error('Errors:', validationError.errors);
        },
      );
      throw new HttpException(
        'Ошибка при создании контакта',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async createCompany(): Promise<string> {
    const contactData = {
      name: [
        {
          value: `Компания ${Date.now()}`, 
        },
      ],
    };

    try {
      const response = await axios.post(
        `https://${this.baseDomain}/api/v4/companies`,
        contactData,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      // Возвращаем ID созданного контакта
      return response.data._embedded.companies[0].id;
    } catch (error) {
      console.error(
        'Ошибка при создании контакта:',
        error.response ? error.response.data : error.message,
      );
      error.response.data['validation-errors'].forEach(
        (validationError: any) => {
          console.error('Request ID:', validationError.request_id);

          console.error('Errors:', validationError.errors);
        },
      );
      throw new HttpException(
        'Ошибка при создании контакта',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
