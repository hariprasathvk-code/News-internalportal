import { Injectable } from '@angular/core';
import { MediaFile } from '../models/news.models';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data:image/png;base64, prefix
        resolve(base64.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  async convertFilesToMediaFiles(files: FileList): Promise<MediaFile[]> {
    const mediaFiles: MediaFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64Content = await this.convertFileToBase64(file);
      mediaFiles.push({
        fileName: file.name,
        base64Content: base64Content
      });
    }

    return mediaFiles;
  }

  validateFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }
}
