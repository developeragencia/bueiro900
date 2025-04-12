"use client";

import { useState } from 'react';
import { PermissionGuard } from '@/components/permission-guard';
import { useAppStore } from '@/lib/store';
import { SupportTicket } from '@/lib/store'; // Adicionar esta importação
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  HelpCircle,
  Users,
  MessageSquare,
  AlertCircle,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Inbox,
  Send,
  MoreHorizontal,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MessagesSquare
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';

export default function AdminSupportPage() {
  const { supportTickets, users, addSupportMessage, updateSupportTicket } = useAppStore(state => ({
    supportTickets: state.supportTickets,
    users: state.users,
    addSupportMessage: state.addSupportMessage,
    updateSupportTicket: state.updateSupportTicket
  }));

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null); // Corrigido o tipo
  const [replyText, setReplyText] = useState('');
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);

  // Estatísticas dos tickets
  const ticketStats = {
    total: supportTickets.length,
    open: supportTickets.filter(t => t.status === 'open').length,
    inProgress: supportTickets.filter(t => t.status === 'in_progress').length,
    resolved: supportTickets.filter(t => t.status === 'resolved').length,
    closed: supportTickets.filter(t => t.status === 'closed').length,
    highPriority: supportTickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length,
    technical: supportTickets.filter(t => t.category === 'technical').length,
    billing: supportTickets.filter(t => t.category === 'billing').length,
    feature: supportTickets.filter(t => t.category === 'feature_request').length,
    general: supportTickets.filter(t => t.category === 'general').length,
    avgResponseTime: 4.2 // Valor fictício para exemplo
  };

  // Filtrar tickets
  const filteredTickets = supportTickets.filter(ticket => {
    const user = users.find(u => u.id === ticket.userId);
    const userDetails = user ? `${user.name} ${user.email}`.toLowerCase() : '';
    const ticketDetails = `${ticket.subject} ${ticket.message}`.toLowerCase();

    const matchesSearch = searchTerm === '' ||
      userDetails.includes(searchTerm.toLowerCase()) ||
      ticketDetails.includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Função para obter dados do usuário
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Usuário desconhecido';
  };

  const getUserEmail = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.email : 'Email não encontrado';
  };

  const getUserAvatar = (userId: string): string | undefined => {
    const user = users.find(u => u.id === userId);
    return user?.avatar;
  };

  // Funções para formatação
  const formatCategory = (category: string) => {
    switch (category) {
      case 'technical': return 'Técnico';
      case 'billing': return 'Faturamento';
      case 'feature_request': return 'Solicitação de Recurso';
      case 'general': return 'Geral';
      default: return category;
    }
  };

  const formatPriority = (priority: string) => {
    switch (priority) {
      case 'low': return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Baixa</Badge>;
      case 'medium': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Média</Badge>;
      case 'high': return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Alta</Badge>;
      case 'urgent': return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Urgente</Badge>;
      default: return <Badge>{priority}</Badge>;
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'open': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Aberto</Badge>;
      case 'in_progress': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Em andamento</Badge>;
      case 'resolved': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Resolvido</Badge>;
      case 'closed': return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Fechado</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  // Função para determinar se um ticket tem novas mensagens
  const hasNewMessages = (ticket: SupportTicket) => {
    // Simula a verificação de novas mensagens (na aplicação real, teria lógica para verificar)
    return ticket.messages.length > 0 && Math.random() > 0.7;
  };

  // Funções para gerenciar tickets
  const handleOpenTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setTicketDialogOpen(true);
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;

    try {
      // Encontrar o ID do admin para usar como remetente
      const admin = users.find(u => u.role === 'admin');
      if (!admin) throw new Error('Nenhum administrador encontrado');

      await addSupportMessage(selectedTicket.id, {
        userId: admin.id,
        message: replyText,
        isStaff: true
      });

      // Atualizar status do ticket para em andamento se estiver aberto
      if (selectedTicket.status === 'open') {
        await updateSupportTicket(selectedTicket.id, {
          status: 'in_progress',
          assignedTo: admin.id
        });
      }

      // Atualizar o ticket selecionado para mostrar a nova resposta
      const updatedTicket = supportTickets.find(t => t.id === selectedTicket.id);
      if (updatedTicket) {
        setSelectedTicket(updatedTicket);
      }

      setReplyText('');
      toast.success('Resposta enviada com sucesso!');
    } catch (error: unknown) {
      toast.error('Erro ao enviar resposta: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleUpdateTicketStatus = async (id: string, status: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    try {
      await updateSupportTicket(id, { status });
      toast.success(`Status do ticket atualizado para ${status}`);

      // Atualizar o ticket selecionado se for o mesmo
      if (selectedTicket && selectedTicket.id === id) {
        const updatedTicket = supportTickets.find(t => t.id === id);
        if (updatedTicket) {
          setSelectedTicket(updatedTicket);
        }
      }
    } catch (error: unknown) {
      toast.error('Erro ao atualizar ticket: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleUpdateTicketPriority = async (id: string, priority: 'low' | 'medium' | 'high' | 'urgent') => {
    try {
      await updateSupportTicket(id, { priority });
      toast.success(`Prioridade do ticket atualizada para ${priority}`);

      // Atualizar o ticket selecionado se for o mesmo
      if (selectedTicket && selectedTicket.id === id) {
        const updatedTicket = supportTickets.find(t => t.id === id);
        if (updatedTicket) {
          setSelectedTicket(updatedTicket);
        }
      }
    } catch (error: unknown) {
      toast.error('Erro ao atualizar ticket: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  return (
    <DashboardLayout>
      <PermissionGuard requiredPermissions="acessar_admin">
        <div className="container mx-auto py-6 px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Suporte ao Cliente</h1>
              <p className="text-gray-500 mt-1">
                Gerenciar tickets e requisições de suporte
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total de Tickets</p>
                    <h4 className="text-2xl font-bold mt-1">{ticketStats.total}</h4>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Inbox className="h-6 w-6 text-blue-700" />
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge className="bg-blue-100 text-blue-800">{ticketStats.open} abertos</Badge>
                  <Badge className="bg-yellow-100 text-yellow-800">{ticketStats.inProgress} em andamento</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Resolvidos</p>
                    <h4 className="text-2xl font-bold mt-1">{ticketStats.resolved + ticketStats.closed}</h4>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-700" />
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Taxa de resolução: {((ticketStats.resolved + ticketStats.closed) / Math.max(1, ticketStats.total) * 100).toFixed(0)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Tempo Médio de Resposta</p>
                    <h4 className="text-2xl font-bold mt-1">{ticketStats.avgResponseTime} horas</h4>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-700" />
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Meta: 24 horas
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Prioridade Alta</p>
                    <h4 className="text-2xl font-bold mt-1">{ticketStats.highPriority}</h4>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-700" />
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {ticketStats.highPriority > 0
                    ? `${ticketStats.highPriority} tickets requerem atenção`
                    : 'Sem tickets de alta prioridade'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Buscar ticket por assunto, usuário ou ID..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="open">Abertos</SelectItem>
                      <SelectItem value="in_progress">Em andamento</SelectItem>
                      <SelectItem value="resolved">Resolvidos</SelectItem>
                      <SelectItem value="closed">Fechados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      <SelectItem value="technical">Técnico</SelectItem>
                      <SelectItem value="billing">Faturamento</SelectItem>
                      <SelectItem value="feature_request">Solicitação de Recurso</SelectItem>
                      <SelectItem value="general">Geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="px-3 py-1 cursor-pointer">
                  <Filter className="h-3 w-3 mr-1" />
                  Todos ({ticketStats.total})
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-800 px-3 py-1 cursor-pointer">
                  <Inbox className="h-3 w-3 mr-1" />
                  Abertos ({ticketStats.open})
                </Badge>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-800 px-3 py-1 cursor-pointer">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Em andamento ({ticketStats.inProgress})
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-800 px-3 py-1 cursor-pointer">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Resolvidos ({ticketStats.resolved})
                </Badge>
                <Badge variant="outline" className="bg-gray-50 text-gray-800 px-3 py-1 cursor-pointer">
                  <XCircle className="h-3 w-3 mr-1" />
                  Fechados ({ticketStats.closed})
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tickets Table */}
          <Card>
            <CardHeader>
              <CardTitle>Tickets de Suporte</CardTitle>
              <CardDescription>
                {filteredTickets.length} tickets encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Assunto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id} className={hasNewMessages(ticket) ? 'bg-blue-50' : ''}>
                      <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{getUserName(ticket.userId)}</div>
                        <div className="text-xs text-gray-500">{getUserEmail(ticket.userId)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium truncate max-w-[200px]">{ticket.subject}</span>
                          {hasNewMessages(ticket) && (
                            <Badge className="bg-blue-100 text-blue-800">Novo</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatCategory(ticket.category)}</TableCell>
                      <TableCell>{formatPriority(ticket.priority)}</TableCell>
                      <TableCell>{formatStatus(ticket.status)}</TableCell>
                      <TableCell>{new Date(ticket.dateCreated).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-blue-600"
                            onClick={() => handleOpenTicket(ticket)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Ver
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />

                              <DropdownMenuItem onClick={() => handleOpenTicket(ticket)}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                <span>Responder</span>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
                              {ticket.status !== 'open' && (
                                <DropdownMenuItem onClick={() => handleUpdateTicketStatus(ticket.id, 'open')}>
                                  <span>Aberto</span>
                                </DropdownMenuItem>
                              )}
                              {ticket.status !== 'in_progress' && (
                                <DropdownMenuItem onClick={() => handleUpdateTicketStatus(ticket.id, 'in_progress')}>
                                  <span>Em andamento</span>
                                </DropdownMenuItem>
                              )}
                              {ticket.status !== 'resolved' && (
                                <DropdownMenuItem onClick={() => handleUpdateTicketStatus(ticket.id, 'resolved')}>
                                  <span>Resolvido</span>
                                </DropdownMenuItem>
                              )}
                              {ticket.status !== 'closed' && (
                                <DropdownMenuItem onClick={() => handleUpdateTicketStatus(ticket.id, 'closed')}>
                                  <span>Fechado</span>
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Alterar Prioridade</DropdownMenuLabel>
                              {ticket.priority !== 'low' && (
                                <DropdownMenuItem onClick={() => handleUpdateTicketPriority(ticket.id, 'low')}>
                                  <span>Baixa</span>
                                </DropdownMenuItem>
                              )}
                              {ticket.priority !== 'medium' && (
                                <DropdownMenuItem onClick={() => handleUpdateTicketPriority(ticket.id, 'medium')}>
                                  <span>Média</span>
                                </DropdownMenuItem>
                              )}
                              {ticket.priority !== 'high' && (
                                <DropdownMenuItem onClick={() => handleUpdateTicketPriority(ticket.id, 'high')}>
                                  <span>Alta</span>
                                </DropdownMenuItem>
                              )}
                              {ticket.priority !== 'urgent' && (
                                <DropdownMenuItem onClick={() => handleUpdateTicketPriority(ticket.id, 'urgent')}>
                                  <span>Urgente</span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="gap-1">
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
            </CardFooter>
          </Card>

          {/* Dialog para visualizar e responder ticket */}
          <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              {selectedTicket && (
                <>
                  <DialogHeader>
                    <div className="flex items-center justify-between">
                      <DialogTitle>{selectedTicket.subject}</DialogTitle>
                      <div className="flex items-center space-x-2">
                        {formatPriority(selectedTicket.priority)}
                        {formatStatus(selectedTicket.status)}
                      </div>
                    </div>
                    <DialogDescription>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <span className="text-sm">De: {getUserName(selectedTicket.userId)}</span>
                          <span className="text-sm text-gray-500 ml-2">({getUserEmail(selectedTicket.userId)})</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(selectedTicket.dateCreated).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* Mensagem original */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">{selectedTicket.message}</p>
                    </div>

                    {/* Histórico de mensagens */}
                    {selectedTicket.messages.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-4">Histórico de mensagens</h4>
                        <div className="space-y-4">
                          {selectedTicket.messages.map((message) => (
                            <div
                              key={message.id}
                              className={cn(
                                "flex p-4 rounded-lg",
                                message.isStaff
                                  ? "bg-blue-50 ml-4"
                                  : "bg-gray-50 mr-4"
                              )}
                            >
                              <Avatar className="h-8 w-8 mr-3">
                                <AvatarImage src={getUserAvatar(message.userId)} />
                                <AvatarFallback>
                                  {getUserName(message.userId).charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="font-medium text-sm">
                                    {getUserName(message.userId)}
                                    {message.isStaff && (
                                      <Badge className="ml-2 bg-blue-100 text-blue-800">Equipe</Badge>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(message.dateCreated).toLocaleString('pt-BR')}
                                  </div>
                                </div>
                                <p className="text-gray-700 whitespace-pre-line">{message.message}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Formulário de resposta */}
                    {selectedTicket.status !== 'closed' && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Responder</h4>
                        <Textarea
                          placeholder="Digite sua resposta aqui..."
                          className="min-h-[120px]"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <DialogFooter className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'resolved')}
                        disabled={selectedTicket.status === 'resolved' || selectedTicket.status === 'closed'}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marcar como Resolvido
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'closed')}
                        disabled={selectedTicket.status === 'closed'}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Fechar Ticket
                      </Button>
                    </div>

                    {selectedTicket.status !== 'closed' && (
                      <Button
                        onClick={handleSendReply}
                        disabled={!replyText.trim()}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Resposta
                      </Button>
                    )}
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </PermissionGuard>
    </DashboardLayout>
  );
}
