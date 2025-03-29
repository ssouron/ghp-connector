/**
 * Mocks pour le système de fichiers (fs)
 */

import * as fs from 'fs';

/**
 * Interface pour le système de fichiers virtuel
 */
export interface VirtualFileSystem {
  [path: string]: string | Buffer;
}

// Type simplifié pour les mocks de fs
type MockedFs = {
  existsSync: jest.Mock;
  readFileSync: jest.Mock;
  writeFileSync: jest.Mock;
  mkdirSync: jest.Mock;
  rmSync: jest.Mock;
};

/**
 * Crée un mock pour le module fs
 */
export function mockFs(): { fs: MockedFs; restore: () => void } {
  // Créer un objet qui contient les fonctions mockées
  const mockFsModule: MockedFs = {
    existsSync: jest.fn().mockImplementation(() => false),
    readFileSync: jest.fn().mockImplementation(() => Buffer.from('')),
    writeFileSync: jest.fn().mockImplementation(() => undefined),
    mkdirSync: jest.fn().mockImplementation(() => undefined),
    rmSync: jest.fn().mockImplementation(() => undefined)
  };

  const restore = () => {
    // Rien à faire
  };

  return { fs: mockFsModule, restore };
}

/**
 * Crée un système de fichiers virtuel pour les tests
 */
export function mockVirtualFs(initialFiles: VirtualFileSystem = {}): { 
  fs: MockedFs; 
  restore: () => void; 
  getVirtualFs: () => VirtualFileSystem 
} {
  const virtualFs: VirtualFileSystem = { ...initialFiles };
  
  // Créer un objet qui contient les fonctions mockées pour le système de fichiers virtuel
  const mockFsModule: MockedFs = {
    existsSync: jest.fn().mockImplementation((path) => {
      const pathStr = path.toString();
      return pathStr in virtualFs;
    }),
    
    readFileSync: jest.fn().mockImplementation((path, options) => {
      const pathStr = path.toString();
      if (!(pathStr in virtualFs)) {
        const error = new Error(`ENOENT: no such file or directory, open '${pathStr}'`) as NodeJS.ErrnoException;
        error.code = 'ENOENT';
        throw error;
      }

      const content = virtualFs[pathStr];
      const encoding = typeof options === 'string' ? options : options?.encoding;
      
      if (typeof content === 'string' && encoding === 'utf8') {
        return content;
      }
      
      return Buffer.isBuffer(content) ? content : Buffer.from(String(content));
    }),
    
    writeFileSync: jest.fn().mockImplementation((path, data) => {
      const pathStr = path.toString();
      // Conversion safe pour s'assurer que data est stockée correctement
      if (Buffer.isBuffer(data)) {
        virtualFs[pathStr] = data;
      } else if (typeof data === 'string') {
        virtualFs[pathStr] = data;
      } else {
        // Pour d'autres types ArrayBufferView
        try {
          virtualFs[pathStr] = Buffer.from(data as any);  
        } catch (e) {
          // Fallback en cas d'erreur
          virtualFs[pathStr] = data.toString();
        }
      }
    }),
    
    mkdirSync: jest.fn().mockImplementation((path) => {
      const pathStr = path.toString();
      virtualFs[pathStr] = '';
      return pathStr;
    }),
    
    rmSync: jest.fn().mockImplementation((path) => {
      const pathStr = path.toString();
      if (pathStr in virtualFs) {
        delete virtualFs[pathStr];
      }
    })
  };

  const restore = () => {
    // Rien à faire
  };

  // Fonction pour accéder au système de fichiers virtuel
  const getVirtualFs = () => virtualFs;

  return { fs: mockFsModule, restore, getVirtualFs };
} 