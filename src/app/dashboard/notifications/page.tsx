"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  Trash2,
  CheckCheck,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';
import { Notification } from '@/lib/store';

export default function NotificationsPage() {
  const { notifications, markNotificationAsRead, deleteNotification } = useAppStore((state) => ({
    notifications: state.notifications,
    markNotificationAsRead: state.markNotificationAsRead,
    deleteNotification: state.deleteNotification
  }));

  const currentUser = useAppStore((state) => state.auth.user);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Filter notifications based on the current user
  const userNotifications = notifications.filter(notification =>
    notification.userId === currentUser?.id
  );

  // Further filter based on read/unread status
  const filteredNotifications = filter === 'all'
    ? userNotifications
    : userNotifications.filter(notification => !notification.read);

  // Sort notifications by date (newest first)
  const sortedNotifications = [...filteredNotifications].sort(
    (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
  );

  // Count unread notifications
  const unreadCount = userNotifications.filter(n => !n.read).length;

  // Handle marking notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Handle deleting a notification
  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const promises = filteredNotifications
        .filter(n => !n.read)
        .map(n => markNotificationAsRead(n.id));

      await Promise.all(promises);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Bell className="mr-2 h-6 w-6 text-primary" />
              Notificações
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 text-xs bg-primary text-white rounded-full">
                  {unreadCount} não lidas
                </span>
              )}
            </h1>
            <p className="text-gray-500">Gerencie suas notificações e mantenha-se atualizado.</p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Marcar todas como lidas
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  Todas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('unread')}>
                  Não lidas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="success">Sucesso</TabsTrigger>
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="warning">Alertas</TabsTrigger>
            <TabsTrigger value="error">Erros</TabsTrigger>
          </TabsList>

          {['all', 'success', 'info', 'warning', 'error'].map(tabValue => (
            <TabsContent key={tabValue} value={tabValue}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {tabValue === 'all'
                      ? 'Todas as notificações'
                      : `Notificações de ${
                          tabValue === 'success' ? 'sucesso' :
                          tabValue === 'info' ? 'informações' :
                          tabValue === 'warning' ? 'alertas' :
                          'erros'
                        }`
                    }
                  </CardTitle>
                  <CardDescription>
                    {tabValue === 'all'
                      ? 'Veja todas as suas notificações'
                      : `Apenas notificações do tipo ${
                          tabValue === 'success' ? 'sucesso' :
                          tabValue === 'info' ? 'informações' :
                          tabValue === 'warning' ? 'alertas' :
                          'erros'
                        }`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sortedNotifications
                      .filter(n => tabValue === 'all' || n.type === tabValue)
                      .map(notification => (
                        <div
                          key={notification.id}
                          className={`flex items-start p-4 rounded-lg ${
                            notification.read ? 'bg-gray-50' : 'bg-blue-50'
                          } relative transition-all hover:shadow-sm`}
                        >
                          <div className="flex-shrink-0 mr-4">
                            {getNotificationIcon(notification.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className={`text-sm font-medium ${
                                notification.read ? 'text-gray-900' : 'text-gray-900 font-semibold'
                              }`}>
                                {notification.title}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatDate(notification.dateCreated)}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">{notification.message}</p>

                            {notification.link && (
                              <Link
                                href={notification.link}
                                className="mt-2 inline-flex text-sm text-primary hover:underline"
                              >
                                Ver detalhes
                              </Link>
                            )}
                          </div>

                          <div className="ml-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {!notification.read && (
                                  <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Marcar como lida
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleDelete(notification.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {!notification.read && (
                            <div className="absolute top-4 right-4 h-2 w-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      ))}

                    {sortedNotifications.filter(n => tabValue === 'all' || n.type === tabValue).length === 0 && (
                      <div className="text-center py-12">
                        <Bell className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhuma notificação</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {filter === 'unread'
                            ? 'Você não tem notificações não lidas no momento.'
                            : 'Você não tem notificações nesta categoria.'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
