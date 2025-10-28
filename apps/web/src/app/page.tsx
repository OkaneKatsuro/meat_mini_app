'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Package, Users, TruckIcon, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await dashboardApi.getDashboard();
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  const stats = dashboard?.stats || {};
  const inventory = dashboard?.inventory || [];
  const debtors = dashboard?.debtors || [];

  return (
    <main className="container mx-auto p-4 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Склад Мяса</h1>
        <p className="text-muted-foreground">Управление и учет</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Всего поставок</CardDescription>
            <CardTitle className="text-3xl">{stats.totalSupplies || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Всего отгрузок</CardDescription>
            <CardTitle className="text-3xl">{stats.totalShipments || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <TruckIcon className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Клиентов</CardDescription>
            <CardTitle className="text-3xl">{stats.totalClients || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader className="pb-2">
            <CardDescription>Неоплачено</CardDescription>
            <CardTitle className="text-3xl">{stats.unpaidShipments || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Остатки</TabsTrigger>
          <TabsTrigger value="debtors">Должники</TabsTrigger>
          <TabsTrigger value="actions">Действия</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Текущие остатки на складе</CardTitle>
              <CardDescription>Количество упаковок по типам</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventory.map((item: any, index: number) => {
                  const meatName = item.meatType === 'CHICKEN' ? 'Курица' : 'Говядина';
                  const sizeName = item.packageSize === 'SIZE_15' ? '15 кг' : '20 кг';

                  return (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">
                          {meatName} - {sizeName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Поступило: {item.totalSupplied} | Отгружено: {item.totalShipped}
                        </div>
                      </div>
                      <div className="text-2xl font-bold">{item.currentStock}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debtors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Список должников</CardTitle>
              <CardDescription>Клиенты с неоплаченными отгрузками</CardDescription>
            </CardHeader>
            <CardContent>
              {debtors.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Нет неоплаченных отгрузок
                </p>
              ) : (
                <div className="space-y-4">
                  {debtors.map((debtor: any) => (
                    <div
                      key={debtor.clientId}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <div className="font-medium">{debtor.clientName}</div>
                        <div className="text-sm text-muted-foreground">
                          Отгрузок: {debtor.unpaidShipmentsCount}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-destructive">
                          {debtor.totalUnpaidAmount.toLocaleString('ru-RU')} ₽
                        </div>
                        <div className="text-xs text-muted-foreground">
                          с {new Date(debtor.oldestUnpaidDate).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление</CardTitle>
                <CardDescription>Основные операции</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/supplies">
                  <Button className="w-full" variant="outline">
                    <Package className="mr-2 h-4 w-4" />
                    Управление поставками
                  </Button>
                </Link>
                <Link href="/shipments">
                  <Button className="w-full" variant="outline">
                    <TruckIcon className="mr-2 h-4 w-4" />
                    Управление отгрузками
                  </Button>
                </Link>
                <Link href="/clients">
                  <Button className="w-full" variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Управление клиентами
                  </Button>
                </Link>
                <Link href="/reports">
                  <Button className="w-full" variant="outline">
                    Отчеты
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
