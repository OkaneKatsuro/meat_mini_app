'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shipmentsApi, clientsApi, Shipment, MeatType, PackageSize } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ShipmentsPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    meatType: MeatType.CHICKEN,
    packageSize: PackageSize.SIZE_15,
    quantity: 0,
    isPaid: false,
    totalAmount: 0,
    notes: '',
  });

  const { data: shipments, isLoading: shipmentsLoading } = useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      const response = await shipmentsApi.getAll();
      return response.data;
    },
  });

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientsApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => shipmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setFormData({
        clientId: '',
        date: new Date().toISOString().split('T')[0],
        meatType: MeatType.CHICKEN,
        packageSize: PackageSize.SIZE_15,
        quantity: 0,
        isPaid: false,
        totalAmount: 0,
        notes: '',
      });
      setIsAdding(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => shipmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: (id: string) => shipmentsApi.markAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId || formData.quantity <= 0) return;
    createMutation.mutate(formData);
  };

  const getMeatName = (type: MeatType) => (type === MeatType.CHICKEN ? 'Курица' : 'Говядина');
  const getSizeName = (size: PackageSize) => (size === PackageSize.SIZE_15 ? '15 кг' : '20 кг');

  if (shipmentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Отгрузки</h1>
          <p className="text-muted-foreground">Управление отгрузками</p>
        </div>
      </div>

      {isAdding ? (
        <Card>
          <CardHeader>
            <CardTitle>Добавить отгрузку</CardTitle>
            <CardDescription>Введите данные новой отгрузки</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Клиент *</Label>
                <select
                  id="clientId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  required
                >
                  <option value="">Выберите клиента</option>
                  {clients?.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Дата отгрузки *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meatType">Тип мяса *</Label>
                <select
                  id="meatType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.meatType}
                  onChange={(e) =>
                    setFormData({ ...formData, meatType: e.target.value as MeatType })
                  }
                >
                  <option value={MeatType.CHICKEN}>Курица</option>
                  <option value={MeatType.BEEF}>Говядина</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="packageSize">Размер упаковки *</Label>
                <select
                  id="packageSize"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.packageSize}
                  onChange={(e) =>
                    setFormData({ ...formData, packageSize: e.target.value as PackageSize })
                  }
                >
                  <option value={PackageSize.SIZE_15}>15 кг</option>
                  <option value={PackageSize.SIZE_20}>20 кг</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Количество упаковок *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Сумма (₽)</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.totalAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPaid"
                  checked={formData.isPaid}
                  onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="isPaid" className="cursor-pointer">
                  Оплачено
                </Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Примечания</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Дополнительная информация"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Сохранение...' : 'Сохранить'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить отгрузку
        </Button>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Список отгрузок</CardTitle>
          <CardDescription>Всего: {shipments?.length || 0}</CardDescription>
        </CardHeader>
        <CardContent>
          {!shipments || shipments.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Нет отгрузок</p>
          ) : (
            <div className="space-y-4">
              {shipments.map((shipment: Shipment) => (
                <div
                  key={shipment.id}
                  className="flex justify-between items-start border-b pb-4 last:border-0"
                >
                  <div className="space-y-1 flex-1">
                    <div className="font-medium text-lg">
                      {shipment.client?.name || 'Клиент удален'}
                    </div>
                    <div className="text-sm">
                      {getMeatName(shipment.meatType)} - {getSizeName(shipment.packageSize)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      📦 {shipment.quantity} упаковок
                    </div>
                    <div className="text-sm text-muted-foreground">
                      📅 {new Date(shipment.date).toLocaleDateString('ru-RU')}
                    </div>
                    {shipment.totalAmount && (
                      <div className="text-sm font-medium">
                        💰 {Number(shipment.totalAmount).toLocaleString('ru-RU')} ₽
                      </div>
                    )}
                    {shipment.notes && (
                      <div className="text-sm text-muted-foreground">📝 {shipment.notes}</div>
                    )}
                    <div>
                      {shipment.isPaid ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Оплачено
                        </span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Не оплачено
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!shipment.isPaid && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('Отметить как оплаченное?')) {
                            markPaidMutation.mutate(shipment.id);
                          }
                        }}
                        disabled={markPaidMutation.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Удалить эту отгрузку?')) {
                          deleteMutation.mutate(shipment.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
