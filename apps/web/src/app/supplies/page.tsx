'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suppliesApi, Supply, MeatType, PackageSize } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function SuppliesPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    meatType: MeatType.CHICKEN,
    packageSize: PackageSize.SIZE_15,
    quantity: 0,
  });

  const { data: supplies, isLoading } = useQuery({
    queryKey: ['supplies'],
    queryFn: async () => {
      const response = await suppliesApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => suppliesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplies'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setFormData({
        date: new Date().toISOString().split('T')[0],
        meatType: MeatType.CHICKEN,
        packageSize: PackageSize.SIZE_15,
        quantity: 0,
      });
      setIsAdding(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => suppliesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplies'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.quantity <= 0) return;
    createMutation.mutate(formData);
  };

  const getMeatName = (type: MeatType) => (type === MeatType.CHICKEN ? 'Курица' : 'Говядина');
  const getSizeName = (size: PackageSize) => (size === PackageSize.SIZE_15 ? '15 кг' : '20 кг');

  if (isLoading) {
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
          <h1 className="text-3xl font-bold">Поставки</h1>
          <p className="text-muted-foreground">Управление поставками</p>
        </div>
      </div>

      {isAdding ? (
        <Card>
          <CardHeader>
            <CardTitle>Добавить поставку</CardTitle>
            <CardDescription>Введите данные новой поставки</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Дата поставки *</Label>
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
          Добавить поставку
        </Button>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Список поставок</CardTitle>
          <CardDescription>Всего: {supplies?.length || 0}</CardDescription>
        </CardHeader>
        <CardContent>
          {!supplies || supplies.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Нет поставок</p>
          ) : (
            <div className="space-y-4">
              {supplies.map((supply: Supply) => (
                <div
                  key={supply.id}
                  className="flex justify-between items-center border-b pb-4 last:border-0"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-lg">
                      {getMeatName(supply.meatType)} - {getSizeName(supply.packageSize)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      📦 {supply.quantity} упаковок
                    </div>
                    <div className="text-sm text-muted-foreground">
                      📅 {new Date(supply.date).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm('Удалить эту поставку?')) {
                        deleteMutation.mutate(supply.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
