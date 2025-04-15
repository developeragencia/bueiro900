"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search as SearchIcon,
  Filter,
  Calendar,
  Link,
  ExternalLink,
  Copy,
  BarChart,
  ArrowUpRight,
  Loader2,
  Download,
  Share2,
  Tag,
  Clock,
  Globe
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface SearchResult {
  id: string;
  url: string;
  title: string;
  source: string;
  medium: string;
  campaign: string;
  clicks: number;
  conversions: number;
  revenue: number;
  lastClick: string;
  tags: string[];
}

const mockResults: SearchResult[] = [
  {
    id: 'link_001',
    url: 'https://exemplo.com/produto-especial',
    title: 'Campanha Produto Especial',
    source: 'facebook',
    medium: 'social',
    campaign: 'lancamento_verao',
    clicks: 1250,
    conversions: 85,
    revenue: 8500.00,
    lastClick: '2024-03-18T14:30:00',
    tags: ['produto', 'verão', 'facebook']
  },
  {
    id: 'link_002',
    url: 'https://exemplo.com/oferta-exclusiva',
    title: 'Oferta Exclusiva Instagram',
    source: 'instagram',
    medium: 'social',
    campaign: 'black_friday',
    clicks: 2300,
    conversions: 145,
    revenue: 14500.00,
    lastClick: '2024-03-17T16:45:00',
    tags: ['oferta', 'black friday', 'instagram']
  },
  {
    id: 'link_003',
    url: 'https://exemplo.com/desconto-especial',
    title: 'Desconto Email Marketing',
    source: 'email',
    medium: 'email',
    campaign: 'newsletter',
    clicks: 850,
    conversions: 42,
    revenue: 4200.00,
    lastClick: '2024-03-16T09:15:00',
    tags: ['desconto', 'email', 'newsletter']
  }
];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [mediumFilter, setMediumFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>(mockResults);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);

    try {
      // Simula busca na API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const filtered = mockResults.filter(result => {
        const matchesSearch = 
          result.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesSource = sourceFilter === 'all' || result.source === sourceFilter;
        const matchesMedium = mediumFilter === 'all' || result.medium === mediumFilter;

        let matchesDate = true;
        if (dateRange.from && dateRange.to) {
          const clickDate = new Date(result.lastClick);
          matchesDate = clickDate >= dateRange.from && clickDate <= dateRange.to;
        }

        return matchesSearch && matchesSource && matchesMedium && matchesDate;
      });

      setResults(filtered);
      toast.success(`${filtered.length} resultados encontrados`);
    } catch (error) {
      toast.error('Erro ao realizar busca');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copiado para a área de transferência');
  };

  const handleExport = async () => {
    try {
      const csvContent = [
        ['URL', 'Título', 'Fonte', 'Meio', 'Campanha', 'Cliques', 'Conversões', 'Receita', 'Último Clique', 'Tags'],
        ...results.map(result => [
          result.url,
          result.title,
          result.source,
          result.medium,
          result.campaign,
          result.clicks.toString(),
          result.conversions.toString(),
          result.revenue.toFixed(2),
          new Date(result.lastClick).toLocaleString('pt-BR'),
          result.tags.join(', ')
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `busca_links_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`;
      link.click();
      
      toast.success('Dados exportados com sucesso');
    } catch (error) {
      toast.error('Erro ao exportar dados');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'facebook':
        return '📘';
      case 'instagram':
        return '📸';
      case 'email':
        return '📧';
      default:
        return '🌐';
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Busca Avançada</h1>
            <p className="text-gray-500">Pesquise e analise seus links UTM</p>
          </div>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Resultados
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros de Busca</CardTitle>
            <CardDescription>Refine sua pesquisa usando os filtros abaixo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                  placeholder="Buscar por URL, título, campanha ou tags..."
                  className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Fonte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as fontes</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>

              <Select value={mediumFilter} onValueChange={setMediumFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Meio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os meios</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="cpc">CPC</SelectItem>
                </SelectContent>
              </Select>

              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'dd/MM/yy')} -{' '}
                          {format(dateRange.to, 'dd/MM/yy')}
                        </>
                      ) : (
                        format(dateRange.from, 'dd/MM/yy')
                      )
                    ) : (
                      'Selecionar período'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onSelect={(range) => {
                      setDateRange({
                        from: range?.from,
                        to: range?.to,
                      });
                      if (range?.from && range?.to) {
                        setIsCalendarOpen(false);
                      }
                    }}
                    numberOfMonths={2}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <SearchIcon className="mr-2 h-4 w-4" />
                  Buscar
                  </>
                )}
                </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {results.map((result) => (
            <Card key={result.id}>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">{getSourceIcon(result.source)}</div>
                      <div>
                        <h3 className="font-medium text-lg">{result.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Globe className="h-4 w-4" />
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline truncate max-w-md"
                          >
                            {result.url}
                          </a>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyToClipboard(result.url)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Link className="h-3 w-3" />
                        {result.source}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        {result.medium}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {result.campaign}
                      </Badge>
                  </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {result.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Cliques</p>
                        <p className="text-2xl font-semibold">{result.clicks}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Conversões</p>
                        <p className="text-2xl font-semibold">{result.conversions}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Receita</p>
                        <p className="text-2xl font-semibold">{formatCurrency(result.revenue)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Último clique: {format(new Date(result.lastClick), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                      <Button variant="ghost" size="sm" className="text-primary">
                        <BarChart className="h-4 w-4 mr-1" />
                        Ver análise
                      </Button>
                    </div>
                  </div>
                </div>
          </CardContent>
        </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
