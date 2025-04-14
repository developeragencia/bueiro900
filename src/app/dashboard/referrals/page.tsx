"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Link,
  Copy,
  Share2,
  DollarSign,
  TrendingUp,
  UserPlus,
  Gift,
  ChevronDown,
  Filter,
  Search,
  Mail
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  conversionRate: number;
  monthlyGrowth: number;
}

interface Referral {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'pending' | 'inactive';
  dateJoined: string;
  earnings: number;
  lastActivity: string;
  plan: string;
}

const mockReferralStats: ReferralStats = {
  totalReferrals: 156,
  activeReferrals: 89,
  pendingReferrals: 34,
  totalEarnings: 7850.00,
  conversionRate: 68.5,
  monthlyGrowth: 12.3
};

const mockReferrals: Referral[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    email: 'carlos.silva@exemplo.com',
    status: 'active',
    dateJoined: '2024-02-15',
    earnings: 350.00,
    lastActivity: '2024-03-18',
    plan: 'Pro'
  },
  {
    id: '2',
    name: 'Ana Santos',
    email: 'ana.santos@exemplo.com',
    status: 'pending',
    dateJoined: '2024-03-10',
    earnings: 0,
    lastActivity: '2024-03-10',
    plan: 'Basic'
  },
  // Adicione mais dados mock conforme necessário
];

export default function ReferralsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dateJoined');
  const [referralLink] = useState('https://app.exemplo.com/ref/user123');
  const [stats] = useState<ReferralStats>(mockReferralStats);
  const [referrals, setReferrals] = useState<Referral[]>(mockReferrals);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Link copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar o link. Tente novamente.');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Junte-se a mim!',
          text: 'Use meu link de indicação para começar:',
          url: referralLink
        });
        toast.success('Link compartilhado com sucesso!');
      } else {
        throw new Error('Web Share API não suportada');
      }
    } catch (error) {
      toast.error('Erro ao compartilhar. Tente copiar o link manualmente.');
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast.error('Por favor, insira um e-mail válido');
      return;
    }

    setIsInviting(true);
    try {
      // Aqui você implementaria a chamada à API para enviar o convite
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação de chamada à API
      toast.success('Convite enviado com sucesso!');
      setInviteEmail('');
    } catch (error) {
      toast.error('Erro ao enviar convite. Tente novamente.');
    } finally {
      setIsInviting(false);
    }
  };

  const filteredReferrals = referrals
    .filter(referral => {
      const matchesSearch = referral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          referral.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || referral.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dateJoined':
          return new Date(b.dateJoined).getTime() - new Date(a.dateJoined).getTime();
        case 'earnings':
          return b.earnings - a.earnings;
        case 'lastActivity':
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Programa de Indicações</h1>
            <p className="text-gray-500">Gerencie suas indicações e acompanhe seus ganhos</p>
          </div>
          <div className="flex space-x-4">
            <Button onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Button variant="outline" onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar Link
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total de Indicações</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.totalReferrals}</h3>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +{stats.monthlyGrowth}% este mês
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Ganhos Totais</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    R$ {stats.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h3>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                Taxa de conversão: {stats.conversionRate}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Indicações Ativas</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.activeReferrals}</h3>
                </div>
                <UserPlus className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                {stats.pendingReferrals} pendentes
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invite Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Convide Novos Usuários</CardTitle>
            <CardDescription>
              Envie convites personalizados para seus contatos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Input
                placeholder="Digite o e-mail do convidado"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                type="email"
              />
              <Button onClick={handleInvite} disabled={isInviting}>
                <Mail className="h-4 w-4 mr-2" />
                {isInviting ? 'Enviando...' : 'Enviar Convite'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Referrals Table */}
        <Card>
          <CardHeader>
            <CardTitle>Suas Indicações</CardTitle>
            <CardDescription>
              Lista completa de todas as suas indicações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-4 flex-1">
                <div className="w-64">
                  <Input
                    placeholder="Pesquisar indicações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dateJoined">Data de Entrada</SelectItem>
                    <SelectItem value="earnings">Ganhos</SelectItem>
                    <SelectItem value="lastActivity">Última Atividade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Entrada</TableHead>
                    <TableHead>Ganhos</TableHead>
                    <TableHead>Última Atividade</TableHead>
                    <TableHead>Plano</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReferrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{referral.name}</div>
                          <div className="text-sm text-gray-500">{referral.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(referral.status)}>
                          {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(referral.dateJoined).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        R$ {referral.earnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        {new Date(referral.lastActivity).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{referral.plan}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState('');

  const { referrals, generateReferralCode } = useAppStore(state => ({
    referrals: state.referrals,
    generateReferralCode: state.generateReferralCode
  }));

  const currentUser = useAppStore(state => state.auth.user);

  // Get the current user's referral
  const userReferral = referrals.find(r => r.userId === currentUser?.id);

  // Generate referral link when the component mounts
  useEffect(() => {
    if (userReferral) {
      // Construct the referral link
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      setReferralLink(`${baseUrl}/register?ref=${userReferral.code}`);
    }
  }, [userReferral]);

  // Get earnings, visits, signups, and conversions
  const earnings = userReferral?.earnings || 0;
  const visits = userReferral?.visits || 0;
  const signups = userReferral?.signups || 0;
  const conversions = userReferral?.conversions || 0;

  // Calculate conversion rates
  const visitToSignupRate = visits > 0 ? (signups / visits) * 100 : 0;
  const signupToConversionRate = signups > 0 ? (conversions / signups) * 100 : 0;

  // Handle copy to clipboard
  const handleCopyLink = () => {
    if (!referralLink) return;

    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Handle generating a referral code
  const handleGenerateCode = async () => {
    if (!currentUser) return;

    try {
      await generateReferralCode(currentUser.id);
    } catch (error) {
      console.error('Error generating referral code:', error);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  // Mock referral history for demonstration
  const referralHistory = [
    { id: 1, name: 'Maria Silva', date: '2023-09-01T10:30:00Z', amount: 97.50, status: 'paid' },
    { id: 2, name: 'João Santos', date: '2023-08-25T15:45:00Z', amount: 97.50, status: 'paid' },
    { id: 3, name: 'Ana Oliveira', date: '2023-08-10T09:20:00Z', amount: 147.00, status: 'paid' },
    { id: 4, name: 'Carlos Pereira', date: '2023-07-28T14:00:00Z', amount: 97.50, status: 'paid' },
    { id: 5, name: 'Juliana Costa', date: '2023-07-15T11:30:00Z', amount: 147.00, status: 'paid' }
  ];

  // Mock leaderboard data
  const leaderboard = [
    { id: 1, name: 'Thiago M.', earnings: 2450.00, conversions: 25 },
    { id: 2, name: 'Amanda S.', earnings: 1980.50, conversions: 20 },
    { id: 3, name: 'Roberto L.', earnings: 1470.00, conversions: 15 },
    { id: 4, name: currentUser?.name || 'Você', earnings, conversions, highlight: true },
    { id: 5, name: 'Fernanda M.', earnings: 980.00, conversions: 10 },
  ].sort((a, b) => b.earnings - a.earnings);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Share2 className="mr-2 h-6 w-6 text-primary" />
            Indique e Ganhe
          </h1>
          <p className="text-gray-500">
            Indique amigos e ganhe 10% de comissão em cada assinatura realizada.
          </p>
        </div>

        {/* Referral Stats and Link Card */}
        <Card className="mb-8 border-t-4 border-primary">
          <CardHeader>
            <CardTitle>Seu Link de Indicação</CardTitle>
            <CardDescription>
              Compartilhe este link com seus amigos e ganhe comissões quando eles se cadastrarem.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {userReferral ? (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex-1">
                      <Input
                        value={referralLink}
                        readOnly
                        className="bg-white focus-visible:ring-primary"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="flex-shrink-0"
                      onClick={handleCopyLink}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar Link
                        </>
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-shrink-0"
                      onClick={() => window.open(referralLink, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Abrir Link
                    </Button>
                  </div>

                  <div className="mt-4 text-sm text-gray-500 flex items-center">
                    <div className="flex items-center mr-4">
                      <Badge variant="outline" className="mr-2 font-normal">
                        {userReferral.code}
                      </Badge>
                      Seu código de indicação
                    </div>

                    <div className="flex items-center">
                      <Badge
                        variant={userReferral.status === 'active' ? 'default' : 'secondary'}
                        className="font-normal"
                      >
                        {userReferral.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Ganhos Totais</p>
                          <h4 className="text-2xl font-bold text-gray-900 mt-1">
                            {formatCurrency(earnings)}
                          </h4>
                        </div>
                        <div className="p-2 bg-green-100 rounded-full">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Visitas</p>
                          <h4 className="text-2xl font-bold text-gray-900 mt-1">
                            {visits}
                          </h4>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Eye className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Cadastros</p>
                          <h4 className="text-2xl font-bold text-gray-900 mt-1">
                            {signups}
                          </h4>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-full">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Conversões</p>
                          <h4 className="text-2xl font-bold text-gray-900 mt-1">
                            {conversions}
                          </h4>
                        </div>
                        <div className="p-2 bg-amber-100 rounded-full">
                          <Repeat className="h-6 w-6 text-amber-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Taxa de Conversão de Visitas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Visitas → Cadastros</span>
                          <span className="font-medium">{formatPercentage(visitToSignupRate)}</span>
                        </div>
                        <Progress value={visitToSignupRate} className="h-2" />
                        <div className="text-xs text-gray-500">
                          {signups} cadastros de {visits} visitas
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Taxa de Conversão de Cadastros</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Cadastros → Assinaturas</span>
                          <span className="font-medium">{formatPercentage(signupToConversionRate)}</span>
                        </div>
                        <Progress value={signupToConversionRate} className="h-2" />
                        <div className="text-xs text-gray-500">
                          {conversions} assinaturas de {signups} cadastros
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Share2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Você ainda não tem um código de indicação
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Gere seu código de indicação para começar a compartilhar e ganhar comissões.
                </p>
                <Button onClick={handleGenerateCode}>
                  Gerar Código de Indicação
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="history" className="mb-8">
          <TabsList>
            <TabsTrigger value="history">Histórico de Comissões</TabsTrigger>
            <TabsTrigger value="leaderboard">Ranking de Afiliados</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Comissões</CardTitle>
                <CardDescription>
                  Veja todas as comissões que você recebeu pelas suas indicações.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userReferral && userReferral.conversions > 0 ? (
                  <Table>
                    <TableCaption>Lista de comissões recebidas</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referralHistory.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{formatDate(item.date)}</TableCell>
                          <TableCell>{formatCurrency(item.amount)}</TableCell>
                          <TableCell>
                            <Badge variant={item.status === 'paid' ? 'default' : 'secondary'}>
                              {item.status === 'paid' ? 'Pago' : 'Pendente'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Nenhuma comissão recebida
                    </h3>
                    <p className="text-gray-500">
                      Compartilhe seu link de indicação para começar a ganhar comissões.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle>Ranking de Afiliados</CardTitle>
                <CardDescription>
                  Veja como você se compara a outros afiliados no programa.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Top 5 afiliados do mês</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Posição</TableHead>
                      <TableHead>Afiliado</TableHead>
                      <TableHead>Conversões</TableHead>
                      <TableHead>Ganhos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.map((item, index) => (
                      <TableRow key={item.id} className={item.highlight ? 'bg-blue-50' : ''}>
                        <TableCell className="font-medium">
                          {index + 1}º
                          {item.highlight && (
                            <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-300">
                              Você
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.conversions}</TableCell>
                        <TableCell>{formatCurrency(item.earnings)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="text-sm text-gray-500 border-t bg-gray-50 px-6 py-4">
                O ranking é atualizado diariamente. Continue indicando para melhorar sua posição!
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* How It Works Section */}
        <Card>
          <CardHeader>
            <CardTitle>Como Funciona o Programa de Indicação</CardTitle>
            <CardDescription>
              Entenda como você pode ganhar comissões indicando a plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Share2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">1. Compartilhe seu Link</h3>
                <p className="text-gray-500 text-sm">
                  Compartilhe seu link de indicação com amigos, colegas ou nas redes sociais.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">2. Amigos se Cadastram</h3>
                <p className="text-gray-500 text-sm">
                  Quando alguém utiliza seu link e se cadastra, eles são vinculados à sua conta.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">3. Ganhe Comissões</h3>
                <p className="text-gray-500 text-sm">
                  Ganhe 10% de comissão em cada assinatura feita por usuários que você indicou.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t flex justify-between items-center flex-wrap gap-4">
            <p className="text-sm text-gray-500">
              As comissões são pagas automaticamente todo dia 15 do mês.
            </p>
            <Button variant="ghost" className="text-primary">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Ver política de indicações
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}
