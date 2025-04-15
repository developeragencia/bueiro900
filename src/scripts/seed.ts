import { seedAllData } from '../lib/seedData';

console.log('Iniciando a inserção dos dados de teste...');

seedAllData()
  .then(() => {
    console.log('Dados de teste inseridos com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erro ao inserir dados de teste:', error);
    process.exit(1);
  }); 