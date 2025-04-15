"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  MessageSquare,
  HelpCircle,
  Send,
  Filter,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'account' | 'other';
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  userId: string;
  userName: string;
  userAvatar?: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  userName: string;
  userAvatar?: string;
  isStaff: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isExpanded?: boolean;
}

const MOCK_TICKETS: Ticket[] = [
  {
    id: '1',
    title: 'Problema com integração',
    description: 'Não consigo conectar minha loja do Shopify',
    status: 'open',
    priority: 'high',
    category: 'technical',
    createdAt: new Date('2024-03-20T10:00:00'),
    updatedAt: new Date('2024-03-20T10:00:00'),
    messages: [
      {
        id: '1',
        content: 'Olá, estou tendo problemas para conectar minha loja do Shopify. Podem me ajudar?',
        createdAt: new Date('2024-03-20T10:00:00'),
        userId: '1',
        userName: 'João Silva',
        userAvatar: 'https://github.com/shadcn.png',
        isStaff: false
      }
    ],
    userId: '1',
    userName: 'João Silva',
    userAvatar: 'https://github.com/shadcn.png'
  },
  {
    id: '2',
    title: 'Dúvida sobre cobrança',
    description: 'Gostaria de entender melhor o ciclo de faturamento',
    status: 'in_progress',
    priority: 'medium',
    category: 'billing',
    createdAt: new Date('2024-03-19T15:30:00'),
    updatedAt: new Date('2024-03-19T16:45:00'),
    messages: [
      {
        id: '2',
        content: 'Olá, gostaria de entender melhor como funciona o ciclo de faturamento.',
        createdAt: new Date('2024-03-19T15:30:00'),
        userId: '2',
        userName: 'Maria Santos',
        isStaff: false
      },
      {
        id: '3',
        content: 'Olá Maria! O ciclo de faturamento é mensal, iniciando no dia da sua assinatura. Posso te ajudar com mais informações?',
        createdAt: new Date('2024-03-19T16:45:00'),
        userId: 'staff-1',
        userName: 'Suporte',
        userAvatar: '/support-avatar.png',
        isStaff: true
      }
    ],
    userId: '2',
    userName: 'Maria Santos'
  }
];

const MOCK_FAQS: FAQ[] = [
  {
    id: '1',
    question: 'Como faço para integrar minha loja?',
    answer: 'Para integrar sua loja, acesse a seção de integrações no painel e selecione a plataforma desejada. Siga o passo a passo para configurar as credenciais e webhooks necessários.',
    category: 'Integrações'
  },
  {
    id: '2',
    question: 'Qual o prazo de processamento dos pedidos?',
    answer: 'O processamento dos pedidos é feito em tempo real assim que recebemos a notificação da sua plataforma de e-commerce.',
    category: 'Pedidos'
  },
  {
    id: '3',
    question: 'Como funciona o suporte técnico?',
    answer: 'Nosso suporte técnico está disponível 24/7 através de tickets e chat. Para casos urgentes, oferecemos atendimento prioritário.',
    category: 'Suporte'
  }
];

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [faqs, setFaqs] = useState<FAQ[]>(MOCK_FAQS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Ticket['status'] | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Ticket['category'] | 'all'>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'technical' as Ticket['category']
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTicket?.messages]);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreateTicket = async () => {
    try {
      setIsLoading(true);
      // Simulando chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newTicketData: Ticket = {
        id: Math.random().toString(36).substr(2, 9),
        ...newTicket,
        status: 'open',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [],
        userId: '1',
        userName: 'Usuário Atual',
        userAvatar: 'https://github.com/shadcn.png'
      };

      setTickets(prev => [...prev, newTicketData]);
      setShowNewTicketDialog(false);
      setNewTicket({
        title: '',
        description: '',
        category: 'technical'
      });
      toast.success('Ticket criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar ticket. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedTicket || !newMessage.trim()) return;

    try {
      setIsLoading(true);
      // Simulando chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newMessageData: Message = {
        id: Math.random().toString(36).substr(2, 9),
        content: newMessage,
        createdAt: new Date(),
        userId: '1',
        userName: 'Usuário Atual',
        userAvatar: 'https://github.com/shadcn.png',
        isStaff: false
      };

      const updatedTicket = {
        ...selectedTicket,
        messages: [...selectedTicket.messages, newMessageData],
        updatedAt: new Date()
      };

      setTickets(prev => prev.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));
      setSelectedTicket(updatedTicket);
      setNewMessage('');
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="p-6">
      <Tabs defaultValue="tickets">
        <TabsList className="mb-6">
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Tickets
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Tickets de Suporte</h1>
            <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
              <DialogTrigger asChild>
                <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Ticket
          </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Ticket</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                <Input
                      placeholder="Título"
                      value={newTicket.title}
                      onChange={e => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
                  <div>
                    <Textarea
                      placeholder="Descrição do problema"
                      value={newTicket.description}
                      onChange={e => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Select
                      value={newTicket.category}
                      onValueChange={value => setNewTicket(prev => ({ ...prev, category: value as Ticket['category'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                        <SelectItem value="technical">Técnico</SelectItem>
                        <SelectItem value="billing">Faturamento</SelectItem>
                        <SelectItem value="account">Conta</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowNewTicketDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateTicket} disabled={isLoading}>
                      {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Criar Ticket
                    </Button>
                          </div>
                </div>
              </DialogContent>
            </Dialog>
                          </div>

          <Card className="p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar tickets..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                          </div>
                          <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={value => setStatusFilter(value as Ticket['status'] | 'all')}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="open">Aberto</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                    <SelectItem value="closed">Fechado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={value => setCategoryFilter(value as Ticket['category'] | 'all')}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filtrar por categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    <SelectItem value="technical">Técnico</SelectItem>
                    <SelectItem value="billing">Faturamento</SelectItem>
                    <SelectItem value="account">Conta</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                          </div>
                      </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Lista de Tickets</h2>
                </div>
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {filteredTickets.map(ticket => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedTicket?.id === ticket.id ? 'bg-gray-50' : ''
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex items-start justify-between">
                  <div>
                        <h3 className="font-medium">{ticket.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
                  </div>
                      <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                        {ticket.status === 'open' ? 'Aberto' :
                         ticket.status === 'in_progress' ? 'Em Andamento' :
                         ticket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
                      </Badge>
                  </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {format(ticket.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </div>
                      <Badge variant="secondary" className={getPriorityColor(ticket.priority)}>
                        {ticket.priority === 'urgent' ? 'Urgente' :
                         ticket.priority === 'high' ? 'Alta' :
                         ticket.priority === 'medium' ? 'Média' : 'Baixa'}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
                        </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              {selectedTicket ? (
                <>
                  <div className="p-4 border-b">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="font-semibold">{selectedTicket.title}</h2>
                        <p className="text-sm text-gray-500 mt-1">{selectedTicket.description}</p>
                      </div>
                      <Badge variant="secondary" className={getStatusColor(selectedTicket.status)}>
                        {selectedTicket.status === 'open' ? 'Aberto' :
                         selectedTicket.status === 'in_progress' ? 'Em Andamento' :
                         selectedTicket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col h-[500px]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedTicket.messages.map(message => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.isStaff ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`flex items-start gap-3 max-w-[80%] ${message.isStaff ? 'flex-row' : 'flex-row-reverse'}`}>
                            <Avatar>
                              <AvatarImage src={message.userAvatar} />
                              <AvatarFallback>{message.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className={`rounded-lg p-3 ${
                                message.isStaff ? 'bg-gray-100' : 'bg-blue-500 text-white'
                              }`}>
                                <p>{message.content}</p>
                      </div>
                              <div className={`text-xs text-gray-500 mt-1 ${
                                message.isStaff ? 'text-left' : 'text-right'
                              }`}>
                                {format(message.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite sua mensagem..."
                          value={newMessage}
                          onChange={e => setNewMessage(e.target.value)}
                          onKeyPress={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button onClick={handleSendMessage} disabled={isLoading || !newMessage.trim()}>
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                        )}
                      </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Selecione um ticket para ver os detalhes
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">Perguntas Frequentes</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                placeholder="Buscar nas FAQs..."
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

          <div className="space-y-4">
            {faqs.map(faq => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow"
              >
                <button
                  className="w-full p-4 text-left flex items-center justify-between"
                  onClick={() => setFaqs(prev => prev.map(f => 
                    f.id === faq.id ? { ...f, isExpanded: !f.isExpanded } : f
                  ))}
                >
                  <span className="font-medium">{faq.question}</span>
                  {faq.isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </button>
                {faq.isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="px-4 pb-4"
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      </div>
  );
}
