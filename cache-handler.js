const fs = require('fs');
const path = require('path');

class CacheHandler {
  constructor(options) {
    this.options = options;
    this.cacheDirectory = path.join(process.cwd(), '.next/cache');
    
    // Garantir que o diretório de cache existe
    if (!fs.existsSync(this.cacheDirectory)) {
      fs.mkdirSync(this.cacheDirectory, { recursive: true });
    }
  }

  async get(key) {
    try {
      const cacheFile = path.join(this.cacheDirectory, `${key}.json`);
      if (fs.existsSync(cacheFile)) {
        const data = fs.readFileSync(cacheFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Erro ao ler cache:', error);
    }
    return null;
  }

  async set(key, data) {
    try {
      const cacheFile = path.join(this.cacheDirectory, `${key}.json`);
      fs.writeFileSync(cacheFile, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao escrever cache:', error);
    }
  }
}

module.exports = CacheHandler; 