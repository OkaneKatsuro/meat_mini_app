'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsApi, Client } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ClientsPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientsApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => clientsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setFormData({ name: '', phone: '', email: '', notes: '' });
      setIsAdding(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    createMutation.mutate(formData);
  };

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
          <h1 className="text-3xl font-bold">Клиенты</h1>
          <p className="text-muted-foreground">Управление клиентами</p>
        </div>
      </div>

      {isAdding ? (
        <Card>
          <CardHeader>
            <CardTitle>Добавить клиента</CardTitle>
            <CardDescription>Введите данные нового клиента</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя клиента *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ООО Ресторан"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+7 900 123-45-67"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="client@example.com"
                />
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
          Добавить клиента
        </Button>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Список клиентов</CardTitle>
          <CardDescription>Всего: {clients?.length || 0}</CardDescription>
        </CardHeader>
        <CardContent>
          {!clients || clients.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Нет клиентов</p>
          ) : (
            <div className="space-y-4">
              {clients.map((client: Client) => (
                <div
                  key={client.id}
                  className="flex justify-between items-start border-b pb-4 last:border-0"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-lg">{client.name}</div>
                    {client.phone && (
                      <div className="text-sm text-muted-foreground">📞 {client.phone}</div>
                    )}
                    {client.email && (
                      <div className="text-sm text-muted-foreground">📧 {client.email}</div>
                    )}
                    {client.notes && (
                      <div className="text-sm text-muted-foreground">📝 {client.notes}</div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm(`Удалить клиента "${client.name}"?`)) {
                        deleteMutation.mutate(client.id);
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
