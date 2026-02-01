import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as xmlrpc from 'xmlrpc';

@Injectable()
export class OdooService {
  private commonClient: xmlrpc.Client;
  private objectClient: xmlrpc.Client;
  private uid: number | null = null;

  constructor() {
    const url = new URL(process.env.ODOO_URL || 'http://localhost:8069');
    this.commonClient = xmlrpc.createClient({
      host: url.hostname,
      port: parseInt(url.port),
      path: '/xmlrpc/2/common',
    });
    this.objectClient = xmlrpc.createClient({
      host: url.hostname,
      port: parseInt(url.port),
      path: '/xmlrpc/2/object',
    });
  }

  private async authenticate(): Promise<number> {
    if (this.uid) return this.uid;

    return new Promise((resolve, reject) => {
      this.commonClient.methodCall(
        'authenticate',
        [
          process.env.ODOO_DB,
          process.env.ODOO_USERNAME,
          process.env.ODOO_PASSWORD,
          {},
        ],
        (error, value) => {
          if (error) return reject(error);
          if (!value)
            return reject(
              new InternalServerErrorException('Odoo authentication failed'),
            );
          this.uid = value;
          resolve(value);
        },
      );
    });
  }

  async executeKw(
    model: string,
    method: string,
    args: any[],
    kwargs: any = {},
  ): Promise<any> {
    const uid = await this.authenticate();
    return new Promise((resolve, reject) => {
      this.objectClient.methodCall(
        'execute_kw',
        [
          process.env.ODOO_DB,
          uid,
          process.env.ODOO_PASSWORD,
          model,
          method,
          args,
          kwargs,
        ],
        (error, value) => {
          if (error) return reject(error);
          resolve(value);
        },
      );
    });
  }

  // Example: Find products
  async findProducts() {
    return this.executeKw('product.template', 'search_read', [[]], {
      fields: ['name', 'list_price', 'qty_available'],
      limit: 10,
    });
  }

  // Example: Find partners (customers)
  async findCustomers() {
    return this.executeKw('res.partner', 'search_read', [[]], {
      fields: ['name', 'email', 'phone'],
      limit: 10,
    });
  }
}
