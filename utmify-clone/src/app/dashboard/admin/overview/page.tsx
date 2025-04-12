"use client";

import { useState } from 'react';
import {
  PieChart,
  BarChart,
  RefreshCw,
  Info,
  EyeOff,
  Settings
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from '@/components/DashboardLayout';
import { PermissionGuard } from '@/components/permission-guard';

export default function AdminDashboardOverview() {
  const [period, setPeriod] = useState("hoje");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveChanges = () => {
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <PermissionGuard requiredPermissions="acessar_admin">
        <div className="container mx-auto py-6 px-4 lg:px-8 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard - Principal</h1>
              <button className="ml-2 text-gray-400 hover:text-gray-600">
                <EyeOff className="h-5 w-5" />
              </button>
              <button className="ml-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center">
              <div className="bg-blue-600 h-2.5 w-16 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600">Filtros: 0/1</span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-xs text-gray-600">R$ 1M</span>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Resumo</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Atualizado sobre tempo:</span>
                <Button onClick={handleSaveChanges} disabled={isUpdating} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isUpdating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    'Atualizar'
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Período de Visualização</label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hoje">Hoje</SelectItem>
                    <SelectItem value="ontem">Ontem</SelectItem>
                    <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                    <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Canal de Anúncio</label>
                <Select defaultValue="qualquer">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um canal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qualquer">Qualquer</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Fonte de Tráfego</label>
                <Select defaultValue="qualquer">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qualquer">Qualquer</SelectItem>
                    <SelectItem value="direto">Direto</SelectItem>
                    <SelectItem value="organico">Orgânico</SelectItem>
                    <SelectItem value="referencia">Referência</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Plataforma</label>
                <Select defaultValue="qualquer">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qualquer">Qualquer</SelectItem>
                    <SelectItem value="hotmart">Hotmart</SelectItem>
                    <SelectItem value="perfectpay">PerfectPay</SelectItem>
                    <SelectItem value="kiwify">Kiwify</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Produto</label>
                <Select defaultValue="qualquer">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qualquer">Qualquer</SelectItem>
                    <SelectItem value="produto1">Produto 1</SelectItem>
                    <SelectItem value="produto2">Produto 2</SelectItem>
                    <SelectItem value="produto3">Produto 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="rounded-md bg-blue-900 text-white p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-blue-200">Faturamento Líquido</p>
                    <h3 className="text-xl font-bold mt-1">R$ 974,22</h3>
                  </div>
                  <button className="text-blue-200 hover:text-white">
                    <Info className="h-4 w-4" />
                  </button>
                </div>
              </Card>

              <Card className="rounded-md bg-blue-900 text-white p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-blue-200">Gastos com anúncios</p>
                    <h3 className="text-xl font-bold mt-1">R$ 0,00</h3>
                  </div>
                  <button className="text-blue-200 hover:text-white">
                    <Info className="h-4 w-4" />
                  </button>
                </div>
              </Card>

              <Card className="rounded-md bg-blue-900 text-white p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-blue-200">ROAS</p>
                    <h3 className="text-xl font-bold mt-1">N/A</h3>
                  </div>
                  <button className="text-blue-200 hover:text-white">
                    <Info className="h-4 w-4" />
                  </button>
                </div>
              </Card>

              <Card className="rounded-md bg-blue-900 text-white p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-blue-200">Lucro</p>
                    <h3 className="text-xl font-bold mt-1">R$ 974,22</h3>
                  </div>
                  <button className="text-blue-200 hover:text-white">
                    <Info className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Pie Chart */}
              <Card className="rounded-md bg-blue-900 text-white p-4">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-xs text-blue-200">Vendas por Pagamento</p>
                  <button className="text-blue-200 hover:text-white">
                    <Info className="h-4 w-4" />
                  </button>
                </div>
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-blue-800 mx-auto flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-lg font-bold">Total</p>
                      <p className="text-xl font-bold">20</p>
                    </div>
                  </div>
                  <div className="absolute inset-0">
                    <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" strokeWidth="20" strokeDasharray="75.4 251.2" transform="rotate(-90 50 50)" />
                    </svg>
                  </div>
                  <div className="mt-4 flex justify-around text-xs">
                    <div className="flex items-center">
                      <span className="h-3 w-3 bg-blue-500 rounded-full mr-1"></span>
                      <span>Pix</span>
                    </div>
                    <div className="flex items-center">
                      <span className="h-3 w-3 bg-blue-300 rounded-full mr-1"></span>
                      <span>Cartão</span>
                    </div>
                    <div className="flex items-center">
                      <span className="h-3 w-3 bg-yellow-400 rounded-full mr-1"></span>
                      <span>Boleto</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Sales Info */}
              <div className="flex flex-col gap-2">
                <Card className="rounded-md bg-blue-900 text-white p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-blue-200">Vendas Pendentes</p>
                      <h3 className="text-xl font-bold mt-1">R$ 57,81</h3>
                    </div>
                    <button className="text-blue-200 hover:text-white">
                      <Info className="h-4 w-4" />
                    </button>
                  </div>
                </Card>

                <Card className="rounded-md bg-blue-900 text-white p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-blue-200">Vendas Reembolsadas</p>
                      <h3 className="text-xl font-bold mt-1">R$ 0,00</h3>
                    </div>
                    <button className="text-blue-200 hover:text-white">
                      <Info className="h-4 w-4" />
                    </button>
                  </div>
                </Card>

                <Card className="rounded-md bg-blue-900 text-white p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-blue-200">Imposto</p>
                      <h3 className="text-xl font-bold mt-1">R$ 0,00</h3>
                    </div>
                    <button className="text-blue-200 hover:text-white">
                      <Info className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              </div>

              {/* ROI Info */}
              <div className="flex flex-col gap-2">
                <Card className="rounded-md bg-blue-900 text-white p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-blue-200">ROI</p>
                      <h3 className="text-xl font-bold mt-1">N/A</h3>
                    </div>
                    <button className="text-blue-200 hover:text-white">
                      <Info className="h-4 w-4" />
                    </button>
                  </div>
                </Card>

                <Card className="rounded-md bg-blue-900 text-white p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-blue-200">Margem</p>
                      <h3 className="text-xl font-bold mt-1 text-green-400">100.0%</h3>
                    </div>
                    <button className="text-blue-200 hover:text-white">
                      <Info className="h-4 w-4" />
                    </button>
                  </div>
                </Card>

                <Card className="rounded-md bg-blue-900 text-white p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-blue-200">Chargeback</p>
                      <h3 className="text-xl font-bold mt-1 text-green-400">0.0%</h3>
                    </div>
                    <button className="text-blue-200 hover:text-white">
                      <Info className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Products and Sources */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="rounded-md bg-blue-900 text-white p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <p className="text-xs text-blue-200">Vendas por Produto</p>
                    <span className="ml-1 text-xs text-blue-400">(deslize a tela →)</span>
                  </div>
                  <button className="text-blue-200 hover:text-white">
                    <Info className="h-4 w-4" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-blue-200">
                        <th className="pb-2">Produto</th>
                        <th className="pb-2 text-right"></th>
                        <th className="pb-2 text-right">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-1">GRINGATOOLS</td>
                        <td className="py-1 text-right">17</td>
                        <td className="py-1 text-right">85.0%</td>
                      </tr>
                      <tr>
                        <td className="py-1">Español para el uso - (Avançado)</td>
                        <td className="py-1 text-right">1</td>
                        <td className="py-1 text-right">5.0%</td>
                      </tr>
                      <tr>
                        <td className="py-1">Acesso Adicional - (Sócio ou Amigo)</td>
                        <td className="py-1 text-right">1</td>
                        <td className="py-1 text-right">5.0%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card className="rounded-md bg-blue-900 text-white p-4">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-xs text-blue-200">Vendas por Fonte</p>
                  <button className="text-blue-200 hover:text-white">
                    <Info className="h-4 w-4" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-blue-200">
                        <th className="pb-2">Fonte</th>
                        <th className="pb-2 text-right"></th>
                        <th className="pb-2 text-right">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-1">N/A</td>
                        <td className="py-1 text-right">19</td>
                        <td className="py-1 text-right">95.0%</td>
                      </tr>
                      <tr>
                        <td className="py-1">Google/google</td>
                        <td className="py-1 text-right">1</td>
                        <td className="py-1 text-right">5.0%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card className="rounded-md bg-blue-900 text-white p-4">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-xs text-blue-200">Taxas de Aprovação</p>
                  <button className="text-blue-200 hover:text-white">
                    <Info className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center">
                      <span>Cartão</span>
                      <span>86.7%</span>
                    </div>
                    <div className="w-full bg-blue-700 rounded-full h-2 mt-1">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: '86.7%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <span>Pix</span>
                      <span>87.5%</span>
                    </div>
                    <div className="w-full bg-blue-700 rounded-full h-2 mt-1">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: '87.5%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <span>Boleto</span>
                      <span>N/A</span>
                    </div>
                    <div className="w-full bg-blue-700 rounded-full h-2 mt-1">
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Funnel and Weekly Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="rounded-md bg-blue-900 text-white p-4">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-xs text-blue-200">Funil de Conversão (Meta Ads)</p>
                  <button className="text-blue-200 hover:text-white">
                    <Info className="h-4 w-4" />
                  </button>
                </div>
                <div className="h-64 flex items-end pb-8 pt-8 relative">
                  <div className="absolute bottom-0 w-full flex justify-between text-xs text-blue-200">
                    <div className="text-center w-1/5 px-2">Cliques</div>
                    <div className="text-center w-1/5 px-2">Vis. Página</div>
                    <div className="text-center w-1/5 px-2">IDs</div>
                    <div className="text-center w-1/5 px-2">Vendas Pend.</div>
                    <div className="text-center w-1/5 px-2">Vendas Apr.</div>
                  </div>
                  <div className="w-1/5 px-2 h-0 bg-purple-700 mx-1 relative flex justify-center">
                    <span className="absolute -top-6 text-xs">0%</span>
                  </div>
                  <div className="w-1/5 px-2 h-0 bg-purple-700 mx-1 relative flex justify-center">
                    <span className="absolute -top-6 text-xs">0%</span>
                  </div>
                  <div className="w-1/5 px-2 h-0 bg-purple-700 mx-1 relative flex justify-center">
                    <span className="absolute -top-6 text-xs">0%</span>
                  </div>
                  <div className="w-1/5 px-2 h-40 bg-purple-600 mx-1 relative flex justify-center">
                    <span className="absolute -top-6 text-xs">100%</span>
                    <span className="absolute -bottom-8 text-xs">23</span>
                  </div>
                  <div className="w-1/5 px-2 h-32 bg-pink-500 mx-1 relative flex justify-center">
                    <span className="absolute -top-6 text-xs">87%</span>
                    <span className="absolute -bottom-8 text-xs">20</span>
                  </div>
                </div>
              </Card>

              <Card className="rounded-md bg-blue-900 text-white p-4">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-xs text-blue-200">Vendas por Dia da Semana</p>
                  <button className="text-blue-200 hover:text-white">
                    <Info className="h-4 w-4" />
                  </button>
                </div>
                <div className="h-64 flex items-end justify-around">
                  <div className="flex flex-col items-center">
                    <div className="h-0 w-10 bg-blue-500"></div>
                    <span className="text-xs mt-2">Dom</span>
                    <span className="text-xs text-blue-300">0%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-0 w-10 bg-blue-500"></div>
                    <span className="text-xs mt-2">Seg</span>
                    <span className="text-xs text-blue-300">0%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-0 w-10 bg-blue-500"></div>
                    <span className="text-xs mt-2">Ter</span>
                    <span className="text-xs text-blue-300">0%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-0 w-10 bg-blue-500"></div>
                    <span className="text-xs mt-2">Qua</span>
                    <span className="text-xs text-blue-300">0%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-0 w-10 bg-blue-500"></div>
                    <span className="text-xs mt-2">Qui</span>
                    <span className="text-xs text-blue-300">0%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-0 w-10 bg-blue-500"></div>
                    <span className="text-xs mt-2">Sex</span>
                    <span className="text-xs text-blue-300">0%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-48 w-10 bg-blue-500"></div>
                    <span className="text-xs mt-2">Sab</span>
                    <span className="text-xs text-blue-300">100%</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* CBR and Products Billing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="rounded-md bg-blue-900 text-white p-4">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-xs text-blue-200">CBR</p>
                  <button className="text-blue-200 hover:text-white">
                    <Info className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-center py-8">
                  <h3 className="text-xl font-bold">R$ 0,00</h3>
                </div>
              </Card>

              <Card className="rounded-md bg-blue-900 text-white p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <p className="text-xs text-blue-200">Faturamento por Produto</p>
                    <span className="ml-1 text-xs text-blue-400">(deslize a tela →)</span>
                  </div>
                  <button className="text-blue-200 hover:text-white">
                    <Info className="h-4 w-4" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-blue-200">
                        <th className="pb-2">Produto</th>
                        <th className="pb-2 text-right">Valor</th>
                        <th className="pb-2 text-right">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-1">GRINGATOOLS</td>
                        <td className="py-1 text-right">R$1.177,41</td>
                        <td className="py-1 text-right">92.3%</td>
                      </tr>
                      <tr>
                        <td className="py-1">Acesso Adicional - (Sócio ou Amigo)</td>
                        <td className="py-1 text-right">R$8,70</td>
                        <td className="py-1 text-right">7.0%</td>
                      </tr>
                      <tr>
                        <td className="py-1">Grupo de Ofertas - (Avaliação)</td>
                        <td className="py-1 text-right">R$5,04</td>
                        <td className="py-1 text-right">0.4%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-right">
                  <div className="text-sm font-medium">Faturamento Bruto</div>
                  <div className="text-xl font-bold">R$ 1.275,21</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </PermissionGuard>
    </DashboardLayout>
  );
}
