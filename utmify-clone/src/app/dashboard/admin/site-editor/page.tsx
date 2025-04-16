"use client";

import { useState } from 'react';
import { PermissionGuard } from '@/components/permission-guard';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Code,
  Layout,
  Palette,
  Eye,
  Save,
  Undo,
  Redo,
  Monitor,
  Smartphone,
  Tablet,
  Image as ImageIcon,
  Type,
  SlidersHorizontal,
  Globe,
  Upload,
  Trash2,
  Plus,
  FileCode,
  FileJson,
  Laptop,
  PanelLeft,
  PanelRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Mock data for available templates and components
const pageTemplates = [
  { id: 'landing', name: 'Landing Page', thumbnail: '/templates/landing.png' },
  { id: 'about', name: 'Sobre Nós', thumbnail: '/templates/about.png' },
  { id: 'contact', name: 'Contato', thumbnail: '/templates/contact.png' },
  { id: 'pricing', name: 'Preços', thumbnail: '/templates/pricing.png' },
  { id: 'blog', name: 'Blog', thumbnail: '/templates/blog.png' },
];

const sitePages = [
  { id: 'home', name: 'Página Inicial', path: '/' },
  { id: 'about', name: 'Sobre Nós', path: '/sobre' },
  { id: 'pricing', name: 'Preços', path: '/precos' },
  { id: 'integrations', name: 'Integrações', path: '/integracoes' },
  { id: 'contact', name: 'Contato', path: '/contato' },
];

export default function SiteEditorPage() {
  const [activeTab, setActiveTab] = useState('layout');
  const [selectedPage, setSelectedPage] = useState(sitePages[0]);
  const [viewportSize, setViewportSize] = useState('desktop');
  const [showSidebar, setShowSidebar] = useState(true);
  const [cssCode, setCssCode] = useState(`/* Estilos personalizados */
.hero-section {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  padding: 5rem 0;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  color: white;
}

.hero-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.25rem;
  max-width: 600px;
}`);

  const [htmlCode, setHtmlCode] = useState(`<section class="hero-section">
  <div class="container mx-auto px-4">
    <h1 class="hero-title">Bueiro Digital</h1>
    <p class="hero-description">
      A plataforma completa para gerenciar suas campanhas de marketing
    </p>
    <div class="mt-8">
      <a
        href="/register"
        class="px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
      >
        Comece Agora
      </a>
    </div>
  </div>
</section>`);

  return (
    <DashboardLayout>
      <PermissionGuard requiredPermissions="acessar_admin">
        <div className="h-full flex flex-col">
          {/* Editor Toolbar */}
          <div className="bg-white border-b py-2 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Select value={selectedPage.id} onValueChange={(value) => {
                  const page = sitePages.find(p => p.id === value);
                  if (page) setSelectedPage(page);
                }}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Selecionar página" />
                  </SelectTrigger>
                  <SelectContent>
                    {sitePages.map(page => (
                      <SelectItem key={page.id} value={page.id}>{page.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewportSize === 'desktop' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewportSize('desktop')}
                    className="px-2"
                  >
                    <Laptop size={16} />
                  </Button>
                  <Button
                    variant={viewportSize === 'tablet' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewportSize('tablet')}
                    className="px-2"
                  >
                    <Tablet size={16} />
                  </Button>
                  <Button
                    variant={viewportSize === 'mobile' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewportSize('mobile')}
                    className="px-2"
                  >
                    <Smartphone size={16} />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Undo size={16} className="mr-1" />
                  Desfazer
                </Button>
                <Button variant="outline" size="sm">
                  <Redo size={16} className="mr-1" />
                  Refazer
                </Button>
                <Button variant="outline" size="sm">
                  <Eye size={16} className="mr-1" />
                  Visualizar
                </Button>
                <Button size="sm">
                  <Save size={16} className="mr-1" />
                  Salvar
                </Button>
              </div>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            {showSidebar && (
              <div className="w-72 bg-white border-r overflow-y-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-4">
                    <TabsTrigger value="layout" className="py-2">
                      <Layout size={16} />
                    </TabsTrigger>
                    <TabsTrigger value="style" className="py-2">
                      <Palette size={16} />
                    </TabsTrigger>
                    <TabsTrigger value="code" className="py-2">
                      <Code size={16} />
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="py-2">
                      <Globe size={16} />
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="layout" className="p-3 space-y-4">
                    <h3 className="font-medium text-sm">COMPONENTES</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border rounded p-2 text-center hover:bg-gray-50 cursor-move">
                        <div className="bg-gray-100 rounded-md aspect-video flex items-center justify-center mb-2">
                          <Layout size={24} className="text-gray-500" />
                        </div>
                        <span className="text-xs">Seção</span>
                      </div>
                      <div className="border rounded p-2 text-center hover:bg-gray-50 cursor-move">
                        <div className="bg-gray-100 rounded-md aspect-video flex items-center justify-center mb-2">
                          <Type size={24} className="text-gray-500" />
                        </div>
                        <span className="text-xs">Título</span>
                      </div>
                      <div className="border rounded p-2 text-center hover:bg-gray-50 cursor-move">
                        <div className="bg-gray-100 rounded-md aspect-video flex items-center justify-center mb-2">
                          <ImageIcon size={24} className="text-gray-500" />
                        </div>
                        <span className="text-xs">Imagem</span>
                      </div>
                      <div className="border rounded p-2 text-center hover:bg-gray-50 cursor-move">
                        <div className="bg-gray-100 rounded-md aspect-video flex items-center justify-center mb-2">
                          <PanelLeft size={24} className="text-gray-500" />
                        </div>
                        <span className="text-xs">2 Colunas</span>
                      </div>
                    </div>

                    <Separator />

                    <h3 className="font-medium text-sm">TEMPLATES</h3>
                    <div className="space-y-3">
                      {pageTemplates.map(template => (
                        <div key={template.id} className="border rounded p-2 hover:bg-gray-50 cursor-pointer">
                          <div className="bg-gray-100 rounded-md aspect-video mb-2 overflow-hidden">
                            <img
                              src={template.thumbnail || "/placeholder-template.png"}
                              alt={template.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{template.name}</span>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Plus size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="style" className="p-3 space-y-4">
                    <h3 className="font-medium text-sm">ESTILOS</h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Cores Primárias</label>
                        <div className="grid grid-cols-5 gap-2">
                          <div className="h-8 bg-blue-600 rounded cursor-pointer" />
                          <div className="h-8 bg-indigo-600 rounded cursor-pointer" />
                          <div className="h-8 bg-purple-600 rounded cursor-pointer" />
                          <div className="h-8 bg-pink-600 rounded cursor-pointer" />
                          <div className="h-8 bg-gray-600 rounded cursor-pointer" />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">Tipografia</label>
                        <Select defaultValue="inter">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma fonte" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inter">Inter</SelectItem>
                            <SelectItem value="roboto">Roboto</SelectItem>
                            <SelectItem value="montserrat">Montserrat</SelectItem>
                            <SelectItem value="open-sans">Open Sans</SelectItem>
                            <SelectItem value="poppins">Poppins</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">Bordas</label>
                        <div className="flex space-x-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-none border cursor-pointer flex items-center justify-center text-xs">0</div>
                          <div className="w-8 h-8 bg-gray-100 rounded-sm border cursor-pointer flex items-center justify-center text-xs">4</div>
                          <div className="w-8 h-8 bg-gray-100 rounded-md border cursor-pointer flex items-center justify-center text-xs">8</div>
                          <div className="w-8 h-8 bg-gray-100 rounded-lg border cursor-pointer flex items-center justify-center text-xs">12</div>
                          <div className="w-8 h-8 bg-gray-100 rounded-full border cursor-pointer flex items-center justify-center text-xs">∞</div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">Sombreamento</label>
                        <div className="flex space-x-2">
                          <div className="w-8 h-8 bg-white border cursor-pointer flex items-center justify-center text-xs">0</div>
                          <div className="w-8 h-8 bg-white border shadow-sm cursor-pointer flex items-center justify-center text-xs">1</div>
                          <div className="w-8 h-8 bg-white border shadow-md cursor-pointer flex items-center justify-center text-xs">2</div>
                          <div className="w-8 h-8 bg-white border shadow-lg cursor-pointer flex items-center justify-center text-xs">3</div>
                          <div className="w-8 h-8 bg-white border shadow-xl cursor-pointer flex items-center justify-center text-xs">4</div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <h3 className="font-medium text-sm">TEMAS PREDEFINIDOS</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border rounded-md overflow-hidden cursor-pointer">
                        <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-600" />
                        <div className="p-2 text-xs font-medium">Azul Corporativo</div>
                      </div>
                      <div className="border rounded-md overflow-hidden cursor-pointer">
                        <div className="h-16 bg-gradient-to-r from-green-500 to-emerald-600" />
                        <div className="p-2 text-xs font-medium">Verde Natural</div>
                      </div>
                      <div className="border rounded-md overflow-hidden cursor-pointer">
                        <div className="h-16 bg-gradient-to-r from-orange-500 to-red-600" />
                        <div className="p-2 text-xs font-medium">Quente</div>
                      </div>
                      <div className="border rounded-md overflow-hidden cursor-pointer">
                        <div className="h-16 bg-gradient-to-r from-gray-800 to-gray-900" />
                        <div className="p-2 text-xs font-medium">Escuro</div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="p-3 space-y-4">
                    <Tabs defaultValue="html" className="w-full">
                      <TabsList className="w-full">
                        <TabsTrigger value="html">HTML</TabsTrigger>
                        <TabsTrigger value="css">CSS</TabsTrigger>
                        <TabsTrigger value="js">JavaScript</TabsTrigger>
                      </TabsList>

                      <TabsContent value="html" className="pt-4">
                        <div className="border rounded-md overflow-hidden">
                          <div className="bg-gray-100 px-4 py-2 text-xs font-medium flex items-center justify-between">
                            <span>HTML</span>
                            <div className="flex items-center space-x-2">
                              <button className="text-gray-500 hover:text-gray-700">
                                <FileCode size={16} />
                              </button>
                              <button className="text-gray-500 hover:text-gray-700">
                                <Upload size={16} />
                              </button>
                            </div>
                          </div>
                          <textarea
                            className="font-mono text-sm p-4 w-full h-64 resize-none focus:outline-none"
                            value={htmlCode}
                            onChange={(e) => setHtmlCode(e.target.value)}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="css" className="pt-4">
                        <div className="border rounded-md overflow-hidden">
                          <div className="bg-gray-100 px-4 py-2 text-xs font-medium flex items-center justify-between">
                            <span>CSS</span>
                            <div className="flex items-center space-x-2">
                              <button className="text-gray-500 hover:text-gray-700">
                                <FileCode size={16} />
                              </button>
                              <button className="text-gray-500 hover:text-gray-700">
                                <Upload size={16} />
                              </button>
                            </div>
                          </div>
                          <textarea
                            className="font-mono text-sm p-4 w-full h-64 resize-none focus:outline-none"
                            value={cssCode}
                            onChange={(e) => setCssCode(e.target.value)}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="js" className="pt-4">
                        <div className="border rounded-md overflow-hidden">
                          <div className="bg-gray-100 px-4 py-2 text-xs font-medium flex items-center justify-between">
                            <span>JavaScript</span>
                            <div className="flex items-center space-x-2">
                              <button className="text-gray-500 hover:text-gray-700">
                                <FileCode size={16} />
                              </button>
                              <button className="text-gray-500 hover:text-gray-700">
                                <Upload size={16} />
                              </button>
                            </div>
                          </div>
                          <textarea
                            className="font-mono text-sm p-4 w-full h-64 resize-none focus:outline-none"
                            placeholder="// Adicione seu código JavaScript aqui"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>

                  <TabsContent value="settings" className="p-3 space-y-4">
                    <h3 className="font-medium text-sm">CONFIGURAÇÕES DA PÁGINA</h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Título da Página</label>
                        <Input defaultValue={`${selectedPage.name} | Bueiro Digital`} />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">Descrição (Meta)</label>
                        <Textarea
                          defaultValue="Bueiro Digital - A melhor plataforma para gerenciar suas campanhas de marketing e rastrear conversões."
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">URL da Página</label>
                        <div className="flex">
                          <div className="bg-gray-100 text-gray-500 border border-r-0 rounded-l-md px-3 py-2 text-sm">
                            https://bueiro-digital.com.br
                          </div>
                          <Input
                            className="rounded-l-none"
                            value={selectedPage.path}
                            onChange={() => {}}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <label className="text-sm font-medium block">Indexar nos motores de busca</label>
                          <p className="text-xs text-gray-500">Permitir que esta página seja indexada pelo Google</p>
                        </div>
                        <Switch id="index" defaultChecked />
                      </div>

                      <Separator />

                      <div>
                        <label className="text-sm font-medium mb-1 block">Open Graph Image</label>
                        <div className="border rounded-md p-3 border-dashed">
                          <div className="flex flex-col items-center justify-center py-4">
                            <ImageIcon size={48} className="text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500 mb-2">Arraste e solte ou clique para adicionar</p>
                            <Button variant="outline" size="sm">
                              <Upload size={14} className="mr-1" />
                              Selecionar Imagem
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Preview Area */}
            <div className="flex-1 bg-gray-100 overflow-auto flex justify-center p-6 relative">
              <button
                className="absolute top-2 left-2 bg-white rounded-md shadow p-1.5"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                {showSidebar ? <PanelLeft size={18} /> : <PanelRight size={18} />}
              </button>

              <div
                className={`
                  bg-white border shadow-sm rounded-md overflow-y-auto
                  ${viewportSize === 'desktop' ? 'w-full max-w-6xl h-full' :
                    viewportSize === 'tablet' ? 'w-[768px] h-[1024px]' :
                    'w-[375px] h-[667px]'
                  }
                `}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: htmlCode }}
                  className="preview-container"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>
            </div>
          </div>
        </div>
      </PermissionGuard>
    </DashboardLayout>
  );
}
