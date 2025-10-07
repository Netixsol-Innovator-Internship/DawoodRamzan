/* eslint-disable */
import { Injectable, BadRequestException } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as os from 'os';

@Injectable()
export class FileUploadService {
  private readonly uploadPath = join(os.tmpdir(), 'uploads');

  constructor() {
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    if (!file) throw new BadRequestException('No file provided');

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed');
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = join(this.uploadPath, filename);

    return new Promise((resolve, reject) => {
      const stream = createWriteStream(filepath);
      stream.write(file.buffer);
      stream.end();
      stream.on('finish', () => resolve(filepath));
      stream.on('error', (err) =>
        reject(new BadRequestException(`Error saving file: ${err.message}`)),
      );
    });
  }
}
