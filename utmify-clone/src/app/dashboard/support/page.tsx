"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  HelpCircle,
  MessageSquare,
  Plus,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';
import { SupportTicket } from '@/lib/store';

export default function SupportPage() {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    category: 'general',
    priority: 'medium'
  });

  const { supportTickets, createSupportTicket, addSupportMessage } = useAppStore(state => ({
    supportTickets: state.supportTickets,
    createSupportTicket: state.createSupportTicket,
    addSupportMessage: state.addSupportMessage
  }));

  const currentUser = useAppStore(state => state.auth.user);

  // Filter user tickets
  const userTickets = supportTickets.filter(ticket => ticket.userId === currentUser?.id);

  // Apply search filter
  const filteredTickets = userTickets.filter(ticket => {
    // Filter by status
    const statusMatch =
      filter === 'all' ||
      ticket.status === filter;

    // Filter by search query
    const searchMatch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  // Sort tickets by date (newest first)
  const sortedTickets = [...filteredTickets].sort(
    (a, b) => new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime()
  );

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };

  // Handle selecting a ticket
  const handleSelectTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
  };

  // Handle back to ticket list
  const handleBackToList = () => {
    setSelectedTicket(null);
    setReplyMessage('');
  };

  // Handle reply to a ticket
  const handleReply = async () => {
    if (!selectedTicket || !replyMessage.trim() || !currentUser) return;

    setIsSubmitting(true);

    try {
      await addSupportMessage(selectedTicket.id, {
        userId: currentUser.id,
        message: replyMessage,
        isStaff: false
      });

      setReplyMessage('');

      // Refresh ticket data
      const updatedTicket = supportTickets.find(t => t.id === selectedTicket.id);
      if (updatedTicket) {
        setSelectedTicket(updatedTicket);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle creating a new ticket
  const handleCreateTicket = async () => {
    if (!currentUser) return;
    if (!newTicket.subject.trim() || !newTicket.message.trim()) return;

    setIsSubmitting(true);

    try {
      const ticket = await createSupportTicket({
        userId: currentUser.id,
        subject: newTicket.subject,
        message: newTicket.message,
        category: newTicket.category as any,
        priority: newTicket.priority as any,
        status: 'open'
      });

      // Reset form and close dialog
      setNewTicket({
        subject: '',
        message: '',
        category: 'general',
        priority: 'medium'
      });

      setNewTicketOpen(false);

      // Select the newly created ticket
      setSelectedTicket(ticket);
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get status badge for a ticket
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <Clock className="h-3 w-3 mr-1" />
            Aberto
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
            <MessageSquare className="h-3 w-3 mr-1" />
            Em Andamento
          </Badge>
        );
      case 'resolved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Resolvido
          </Badge>
        );
      case 'closed':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Fechado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        );
    }
  };

  // Get priority badge for a ticket
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Baixa
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Média
          </Badge>
        );
      case 'high':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Alta
          </Badge>
        );
      case 'urgent':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Urgente
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{priority}</Badge>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <HelpCircle className="mr-2 h-6 w-6 text-primary" />
              Suporte
            </h1>
            <p className="text-gray-500">Entre em contato com nossa equipe de suporte.</p>
          </div>

          <Button
            onClick={() => setNewTicketOpen(true)}
            className="mt-4 md:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Ticket
          </Button>
        </div>

        {!selectedTicket ? (
          // Ticket List View
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por assunto ou conteúdo..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-full md:w-48">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tickets</SelectItem>
                  <SelectItem value="open">Abertos</SelectItem>
                  <SelectItem value="in_progress">Em andamento</SelectItem>
                  <SelectItem value="resolved">Resolvidos</SelectItem>
                  <SelectItem value="closed">Fechados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="active">
              <TabsList className="mb-4">
                <TabsTrigger value="active">Ativos</TabsTrigger>
                <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
                <TabsTrigger value="all">Todos</TabsTrigger>
              </TabsList>

              <TabsContent value="active">
                <div className="space-y-4">
                  {sortedTickets
                    .filter(ticket => ['open', 'in_progress'].includes(ticket.status))
                    .map(ticket => (
                      <Card
                        key={ticket.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleSelectTicket(ticket)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle>{ticket.subject}</CardTitle>
                            {getStatusBadge(ticket.status)}
                          </div>
                          <CardDescription>
                            Criado em {formatDate(ticket.dateCreated)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {ticket.message}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t bg-gray-50 py-2">
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">
                              {ticket.messages.length} mensagens
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {getPriorityBadge(ticket.priority)}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}

                  {sortedTickets.filter(ticket => ['open', 'in_progress'].includes(ticket.status)).length === 0 && (
                    <Card className="text-center py-12">
                      <CardContent>
                        <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Nenhum ticket ativo
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Você não possui nenhum ticket de suporte ativo no momento.
                        </p>
                        <Button onClick={() => setNewTicketOpen(true)}>
                          Criar novo ticket
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="resolved">
                <div className="space-y-4">
                  {sortedTickets
                    .filter(ticket => ['resolved', 'closed'].includes(ticket.status))
                    .map(ticket => (
                      <Card
                        key={ticket.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleSelectTicket(ticket)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle>{ticket.subject}</CardTitle>
                            {getStatusBadge(ticket.status)}
                          </div>
                          <CardDescription>
                            Atualizado em {formatDate(ticket.dateUpdated)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {ticket.message}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t bg-gray-50 py-2">
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">
                              {ticket.messages.length} mensagens
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {getPriorityBadge(ticket.priority)}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}

                  {sortedTickets.filter(ticket => ['resolved', 'closed'].includes(ticket.status)).length === 0 && (
                    <Card className="text-center py-12">
                      <CardContent>
                        <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Nenhum ticket resolvido
                        </h3>
                        <p className="text-gray-500">
                          Você não possui nenhum ticket resolvido ou fechado.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="all">
                <div className="space-y-4">
                  {sortedTickets.length > 0 ? (
                    sortedTickets.map(ticket => (
                      <Card
                        key={ticket.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleSelectTicket(ticket)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle>{ticket.subject}</CardTitle>
                            {getStatusBadge(ticket.status)}
                          </div>
                          <CardDescription>
                            Atualizado em {formatDate(ticket.dateUpdated)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {ticket.message}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t bg-gray-50 py-2">
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">
                              {ticket.messages.length} mensagens
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {getPriorityBadge(ticket.priority)}
                          </div>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <Card className="text-center py-12">
                      <CardContent>
                        <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Nenhum ticket encontrado
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Você não possui nenhum ticket de suporte. Crie um novo ticket para receber ajuda.
                        </p>
                        <Button onClick={() => setNewTicketOpen(true)}>
                          Criar novo ticket
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          // Ticket Detail View
          <div className="space-y-6">
            <Button
              variant="ghost"
              className="pl-0 flex items-center text-gray-600 hover:text-gray-900"
              onClick={handleBackToList}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para a lista
            </Button>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{selectedTicket.subject}</CardTitle>
                    <CardDescription>
                      Ticket #{selectedTicket.id.split('ticket')[1]} • Criado em {formatDate(selectedTicket.dateCreated)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(selectedTicket.status)}
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="border-y bg-gray-50 p-6">
                <div className="space-y-6">
                  {/* Initial message */}
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="font-medium text-blue-700">
                        {currentUser?.name?.[0] || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            {currentUser?.name || 'Você'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(selectedTicket.dateCreated)}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {selectedTicket.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ticket messages */}
                  {selectedTicket.messages.map(message => (
                    <div key={message.id} className="flex gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isStaff
                          ? 'bg-primary text-white'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        <span className="font-medium">
                          {message.isStaff ? 'S' : currentUser?.name?.[0] || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className={`p-4 rounded-lg shadow-sm ${
                          message.isStaff
                            ? 'bg-primary/10 border border-primary/20'
                            : 'bg-white'
                        }`}>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-gray-900">
                              {message.isStaff ? 'Suporte' : currentUser?.name || 'Você'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(message.dateCreated)}
                            </span>
                          </div>
                          <p className={`whitespace-pre-wrap ${
                            message.isStaff ? 'text-gray-800' : 'text-gray-700'
                          }`}>
                            {message.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {['open', 'in_progress'].includes(selectedTicket.status) && (
                <CardFooter className="p-6">
                  <div className="w-full space-y-4">
                    <Textarea
                      placeholder="Digite sua resposta..."
                      className="min-h-32 resize-none"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleReply}
                        disabled={!replyMessage.trim() || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Enviar resposta
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        )}

        {/* Create New Ticket Dialog */}
        <Dialog open={newTicketOpen} onOpenChange={setNewTicketOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Criar Novo Ticket de Suporte</DialogTitle>
              <DialogDescription>
                Preencha o formulário abaixo para criar um novo ticket de suporte.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Assunto
                </label>
                <Input
                  id="subject"
                  placeholder="Descreva o assunto do seu ticket"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Categoria
                  </label>
                  <Select
                    value={newTicket.category}
                    onValueChange={(value) => setNewTicket({...newTicket, category: value})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Técnico</SelectItem>
                      <SelectItem value="billing">Faturamento</SelectItem>
                      <SelectItem value="feature_request">Solicitação de Recurso</SelectItem>
                      <SelectItem value="general">Geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium">
                    Prioridade
                  </label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value) => setNewTicket({...newTicket, priority: value})}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Mensagem
                </label>
                <Textarea
                  id="message"
                  placeholder="Descreva detalhadamente o seu problema ou pergunta"
                  className="min-h-32 resize-none"
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setNewTicketOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateTicket}
                disabled={!newTicket.subject.trim() || !newTicket.message.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Ticket'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
