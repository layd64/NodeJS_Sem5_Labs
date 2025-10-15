import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileStorageService {
  private readonly storageDir: string;

  constructor() {
    this.storageDir = path.join(process.cwd(), 'storage');
    this.ensureStorageDir();
  }

  private async ensureStorageDir(): Promise<void> {
    try {
      await fs.mkdir(this.storageDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create storage directory:', error);
    }
  }

  async readFile<T>(filename: string, defaultValue: T): Promise<T> {
    const filePath = path.join(this.storageDir, filename);
    
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) as T;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await this.writeFile(filename, defaultValue);
        return defaultValue;
      }
      console.error(`Error reading file ${filename}:`, error);
      return defaultValue;
    }
  }

  async writeFile<T>(filename: string, data: T): Promise<void> {
    const filePath = path.join(this.storageDir, filename);
    
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Error writing file ${filename}:`, error);
      throw error;
    }
  }

  async fileExists(filename: string): Promise<boolean> {
    const filePath = path.join(this.storageDir, filename);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

