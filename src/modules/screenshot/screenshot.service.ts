import puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { promises as fs } from 'fs';
import * as process from 'node:process';
import { Request } from 'express';

@Injectable()
export class ScreenshotService {
  constructor(private readonly configService: ConfigService) {}

  async createScreenshot(request: Request, postId: number) {
    const url = this.buildUrl(postId);
    const browser = await puppeteer.launch();

    const fullPath = join(process.cwd(), 'screenshot');
    await this.createTempDirectory(fullPath);

    const page = await browser.newPage();
    await page.setCookie({
      name: 'jwt',
      value: request.cookies.jwt,
      url: this.buildBaseUrl(),
    });

    await page.goto(url);
    const screenshot = await page.screenshot({
      encoding: 'binary',
      type: 'png',
      path: `${fullPath}/screenshot.png`,
    });

    await browser.close();

    return screenshot;
  }

  private buildUrl(postId: number): string {
    const baseUrl = this.buildBaseUrl();

    return `${baseUrl}/articles/${postId}`;
  }

  private buildBaseUrl(): string {
    const schema = this.configService.get('SCHEMA');
    const host = this.configService.get('APP_HOST');
    const port = this.configService.get('APP_PORT');

    return `${schema + host}:${port}`;
  }

  private async createTempDirectory(path: string) {
    await fs.mkdir(path, { recursive: true });
  }
}
