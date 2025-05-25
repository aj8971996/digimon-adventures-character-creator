// src/app/core/services/asset.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private readonly SPRITE_BASE_PATH = 'assets/images/digimon-sprites/';

  constructor() {}

  /**
   * Get the correct path for a rookie sprite
   */
  getRookieSpritePath(spriteFileName: string): string {
    if (!spriteFileName) return '';
    
    // Remove any existing path prefixes and ensure we have just the filename
    const fileName = spriteFileName.split('/').pop() || '';
    
    return `${this.SPRITE_BASE_PATH}rookies/${fileName}`;
  }

  /**
   * Get the correct path for a champion sprite
   */
  getChampionSpritePath(spriteFileName: string): string {
    if (!spriteFileName) return '';
    
    // Remove any existing path prefixes and ensure we have just the filename
    const fileName = spriteFileName.split('/').pop() || '';
    
    return `${this.SPRITE_BASE_PATH}champions/${fileName}`;
  }

  /**
   * Check if a sprite file exists (for fallback handling)
   */
  async checkSpriteExists(spritePath: string): Promise<boolean> {
    try {
      const response = await fetch(spritePath, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get fallback sprite path if the original doesn't exist
   */
  getFallbackSpritePath(): string {
    return `${this.SPRITE_BASE_PATH}fallback/default-digimon.png`;
  }

  /**
   * Preload sprites for better performance
   */
  preloadSprites(spritePaths: string[]): Promise<void[]> {
    const loadPromises = spritePaths.map(path => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = path;
      });
    });

    return Promise.allSettled(loadPromises).then(() => []);
  }
}