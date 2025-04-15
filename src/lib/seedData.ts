import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const seedUsers = async () => {
  const usersCollection = collection(db, 'users');
  
  const usersData = [
    {
      name: 'João Silva',
      email: 'joao.silva@teste.com',
      phone: '(11) 99999-9999',
      role: 'admin',
      status: 'active',
      avatar: 'https://github.com/shadcn.png',
      lastLogin: Timestamp.fromDate(new Date('2024-03-20T10:00:00')),
      createdAt: Timestamp.fromDate(new Date('2024-01-01'))
    },
    {
      name: 'Maria Santos',
      email: 'maria.santos@teste.com',
      phone: '(11) 98888-8888',
      role: 'manager',
      status: 'active',
      lastLogin: Timestamp.fromDate(new Date('2024-03-19T15:30:00')),
      createdAt: Timestamp.fromDate(new Date('2024-01-15'))
    },
    {
      name: 'Pedro Costa',
      email: 'pedro.costa@teste.com',
      phone: '(11) 97777-7777',
      role: 'user',
      status: 'inactive',
      avatar: 'https://github.com/shadcn.png',
      lastLogin: Timestamp.fromDate(new Date('2024-03-15T08:45:00')),
      createdAt: Timestamp.fromDate(new Date('2024-02-01'))
    }
  ];

  for (const userData of usersData) {
    try {
      await addDoc(usersCollection, userData);
      console.log('Usuário adicionado com sucesso:', userData.name);
    } catch (error) {
      console.error('Erro ao adicionar usuário:', userData.name, error);
    }
  }
};

export const seedTickets = async () => {
  const ticketsCollection = collection(db, 'tickets');
  
  const ticketsData = [
    {
      title: 'Problema com integração',
      description: 'Não consigo conectar minha loja do Shopify',
      status: 'open',
      priority: 'high',
      category: 'technical',
      createdAt: Timestamp.fromDate(new Date('2024-03-20T10:00:00')),
      updatedAt: Timestamp.fromDate(new Date('2024-03-20T10:00:00')),
      userId: '1',
      userName: 'João Silva',
      userAvatar: 'https://github.com/shadcn.png',
      messages: [
        {
          content: 'Olá, estou tendo problemas para conectar minha loja do Shopify. Podem me ajudar?',
          createdAt: Timestamp.fromDate(new Date('2024-03-20T10:00:00')),
          userId: '1',
          userName: 'João Silva',
          userAvatar: 'https://github.com/shadcn.png',
          isStaff: false
        }
      ]
    },
    {
      title: 'Dúvida sobre cobrança',
      description: 'Gostaria de entender melhor o ciclo de faturamento',
      status: 'in_progress',
      priority: 'medium',
      category: 'billing',
      createdAt: Timestamp.fromDate(new Date('2024-03-19T15:30:00')),
      updatedAt: Timestamp.fromDate(new Date('2024-03-19T16:45:00')),
      userId: '2',
      userName: 'Maria Santos',
      messages: [
        {
          content: 'Olá, gostaria de entender melhor como funciona o ciclo de faturamento.',
          createdAt: Timestamp.fromDate(new Date('2024-03-19T15:30:00')),
          userId: '2',
          userName: 'Maria Santos',
          isStaff: false
        },
        {
          content: 'Olá Maria! O ciclo de faturamento é mensal, iniciando no dia da sua assinatura. Posso te ajudar com mais informações?',
          createdAt: Timestamp.fromDate(new Date('2024-03-19T16:45:00')),
          userId: 'staff-1',
          userName: 'Suporte',
          userAvatar: '/support-avatar.png',
          isStaff: true
        }
      ]
    }
  ];

  for (const ticketData of ticketsData) {
    try {
      await addDoc(ticketsCollection, ticketData);
      console.log('Ticket adicionado com sucesso:', ticketData.title);
    } catch (error) {
      console.error('Erro ao adicionar ticket:', ticketData.title, error);
    }
  }
};

// Função para executar todas as seeds
export const seedAllData = async () => {
  try {
    await seedUsers();
    await seedTickets();
    console.log('Todos os dados foram inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir dados:', error);
  }
}; 