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
  Mail,
  Check,
  ExternalLink,
  Repeat,
  ArrowUpRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAppStore } from '@/lib/store';

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
  const [copied, setCopied] = useState(false);

  const { referrals: appReferrals, generateReferralCode } = useAppStore(state => ({
    referrals: state.referrals,
    generateReferralCode: state.generateReferralCode
  }));

  const currentUser = useAppStore(state => state.auth.user);

  // Get the current user's referral
  const userReferral = appReferrals.find(r => r.userId === currentUser?.id);

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

  const handleApprove = (id: string) => {
    setReferrals(prev => 
      prev.map(ref => 
        ref.id === id 
          ? { ...ref, status: "approved" as const } 
          : ref
      )
    );
    toast.success("Indicação aprovada com sucesso!");
  };

  const handleReject = (id: string) => {
    setReferrals(prev => 
      prev.map(ref => 
        ref.id === id 
          ? { ...ref, status: "rejected" as const } 
          : ref
      )
    );
    toast.success("Indicação rejeitada.");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Indicações</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie suas indicações e comissões
            </p>
          </div>
          <Button>
            Exportar Relatório
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Buscar por nome ou email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="approved">Aprovado</option>
                <option value="rejected">Rejeitado</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Comissão</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>{referral.name}</TableCell>
                    <TableCell>{referral.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(referral.status)}`}>
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>R$ {referral.earnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>{new Date(referral.dateJoined).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {referral.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(referral.id)}
                              variant="outline"
                            >
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleReject(referral.id)}
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              Rejeitar
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
