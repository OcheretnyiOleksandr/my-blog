import { ScreenshotService } from './screenshot.service';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer';
import { Test } from '@nestjs/testing';
import { join } from 'path';
import { Request } from 'express';
import { promises as fs } from 'fs';

jest.mock('puppeteer', () => ({
  __esModule: true,
  default: {
    launch: jest.fn(),
  },
}));

jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn(),
  },
}));

describe('ScreenshotService', () => {
  let screenshotService: ScreenshotService;
  let configService: jest.Mocked<ConfigService>;
  let browser: any;
  let page: any;

  beforeEach(async () => {
    configService = {
      get: jest.fn().mockImplementation((key: string) => {
        const mockConfig = {
          SCHEMA: 'http://',
          APP_HOST: 'localhost',
          APP_PORT: '3000',
        };
        return mockConfig[key];
      }),
    } as unknown as jest.Mocked<ConfigService>;

    browser = {
      newPage: jest.fn(),
      close: jest.fn(),
    };

    page = {
      setCookie: jest.fn(),
      goto: jest.fn(),
      screenshot: jest.fn(),
    };

    (puppeteer.launch as jest.Mock).mockResolvedValue(browser);
    browser.newPage.mockResolvedValue(page);

    const module = await Test.createTestingModule({
      providers: [
        ScreenshotService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    screenshotService = module.get<ScreenshotService>(ScreenshotService);
  });

  it('should be defined', () => {
    expect(screenshotService).toBeDefined();
  });

  it('should create screenshot', async () => {
    const request = {
      cookies: { jwt: 'jwt-token' },
    } as unknown as Request;

    const fullPath = join(process.cwd(), 'screenshot');
    const expected = Buffer.from('screenshot-data');

    page.screenshot.mockResolvedValue(expected);

    const actual = await screenshotService.createScreenshot(request, 123);

    expect(puppeteer.launch).toHaveBeenCalledTimes(1);
    expect(fs.mkdir).toHaveBeenCalledWith(fullPath, { recursive: true });
    expect(browser.newPage).toHaveBeenCalledTimes(1);
    expect(page.setCookie).toHaveBeenCalledWith({
      name: 'jwt',
      value: request.cookies.jwt,
      url: 'http://localhost:3000',
    });
    expect(page.goto).toHaveBeenCalledWith(
      'http://localhost:3000/articles/123',
    );
    expect(page.screenshot).toHaveBeenCalledWith({
      encoding: 'binary',
      type: 'png',
      path: `${fullPath}/screenshot.png`,
    });
    expect(browser.close).toHaveBeenCalledTimes(1);
    expect(actual).toEqual(expected);
  });
});
