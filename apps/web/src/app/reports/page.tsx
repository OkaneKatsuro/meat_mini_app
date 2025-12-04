'use client';

import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ArrowLeft, CalendarRange, Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MeatType, PackageSize, PeriodReport, reportsApi } from '@/lib/api';

const today = new Date();
const defaultStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
const defaultEnd = today.toISOString().split('T')[0];

export default function ReportsPage() {
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const isPeriodValid = useMemo(
    () => Boolean(startDate) && Boolean(endDate) && startDate <= endDate,
    [startDate, endDate],
  );

  const reportMutation = useMutation({
    mutationFn: async ({ start, end }: { start: string; end: string }) => {
      const response = await reportsApi.getPeriodReport(start, end);
      return response.data as PeriodReport;
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async ({ start, end }: { start: string; end: string }) => {
      const response = await reportsApi.downloadPeriodReportCsv(start, end);
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report_${start}_${end}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });

  const handleLoadReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPeriodValid) return;
    reportMutation.mutate({ start: startDate, end: endDate });
  };

  const handleDownloadCsv = () => {
    if (!isPeriodValid) return;
    downloadMutation.mutate({ start: startDate, end: endDate });
  };

  const report = reportMutation.data;
  const isLoading = reportMutation.isPending;

  const getMeatName = (type: MeatType) => (type === MeatType.CHICKEN ? 'Курица' : 'Говядина');
  const getSizeName = (size: PackageSize) => (size === PackageSize.SIZE_15 ? '15 кг' : '20 кг');

  const formatNumber = (value: number) => value.toLocaleString('ru-RU');

  return (
    <main className="container mx-auto p-4 space-y-6 max-w-6xl">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Отчеты</h1>
          <p className="text-muted-foreground">Выгружайте данные за выбранный период</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Период отчета</CardTitle>
          <CardDescription>Укажите даты и сформируйте отчет или выгрузите CSV</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-4 items-end" onSubmit={handleLoadReport}>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="startDate">Дата начала</Label>
              <div className="flex items-center gap-2">
                <CalendarRange className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="endDate">Дата окончания</Label>
              <div className="flex items-center gap-2">
                <CalendarRange className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  min={startDate}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:col-span-4">
              <Button type="submit" disabled={!isPeriodValid || isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Показать отчет
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleDownloadCsv}
                disabled={!isPeriodValid || downloadMutation.isPending}
              >
                {downloadMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Скачать CSV
              </Button>
            </div>
            {!isPeriodValid ? (
              <p className="text-sm text-destructive md:col-span-4">
                Проверьте корректность периода: дата начала должна быть раньше даты окончания.
              </p>
            ) : null}
            {reportMutation.error ? (
              <p className="text-sm text-destructive md:col-span-4">
                Не удалось получить отчет. Попробуйте еще раз.
              </p>
            ) : null}
          </form>
        </CardContent>
      </Card>

      {report ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Поставки</CardTitle>
                <CardDescription>Итого: {formatNumber(report.supplies.total)} упаковок</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground">
                  <span>Тип мяса</span>
                  <span>Размер</span>
                  <span className="text-right">Количество</span>
                </div>
                <div className="space-y-2">
                  {report.supplies.byType.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Нет данных за период</div>
                  ) : (
                    report.supplies.byType.map((item) => (
                      <div key={`${item.meatType}-${item.packageSize}`} className="grid grid-cols-3 text-sm">
                        <span>{getMeatName(item.meatType)}</span>
                        <span>{getSizeName(item.packageSize)}</span>
                        <span className="text-right font-medium">{formatNumber(item.quantity)}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>Отгрузки</CardTitle>
                  <CardDescription>
                    Всего: {report.shipments.total} • Оплачено: {report.shipments.paid} • Не оплачено:{' '}
                    {report.shipments.unpaid}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>₽ {formatNumber(report.shipments.revenue.total)}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-5 text-sm font-medium text-muted-foreground">
                  <span>Мясо</span>
                  <span>Размер</span>
                  <span className="text-right">Всего</span>
                  <span className="text-right text-emerald-700 dark:text-emerald-400">Оплачено</span>
                  <span className="text-right text-orange-700 dark:text-orange-400">Не оплачено</span>
                </div>
                <div className="space-y-2">
                  {report.shipments.byType.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Нет данных за период</div>
                  ) : (
                    report.shipments.byType.map((item) => (
                      <div key={`${item.meatType}-${item.packageSize}`} className="grid grid-cols-5 text-sm">
                        <span>{getMeatName(item.meatType)}</span>
                        <span>{getSizeName(item.packageSize)}</span>
                        <span className="text-right font-medium">{formatNumber(item.quantity)}</span>
                        <span className="text-right text-emerald-700 dark:text-emerald-400">
                          {formatNumber(item.paidQuantity)}
                        </span>
                        <span className="text-right text-orange-700 dark:text-orange-400">
                          {formatNumber(item.unpaidQuantity)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Выручка: оплачено {formatNumber(report.shipments.revenue.paid)} ₽ • не оплачено{' '}
                  {formatNumber(report.shipments.revenue.unpaid)} ₽
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Топ клиентов</CardTitle>
              <CardDescription>По сумме отгрузок за выбранный период</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {report.topClients.length === 0 ? (
                <div className="text-sm text-muted-foreground">Пока нет отгрузок</div>
              ) : (
                <div className="space-y-2">
                  {report.topClients.map((client) => (
                    <div
                      key={client.clientId}
                      className="flex items-center justify-between rounded-lg border bg-card px-3 py-2"
                    >
                      <div>
                        <div className="font-medium">{client.clientName}</div>
                        <div className="text-xs text-muted-foreground">
                          Отгрузок: {client.totalShipments.toLocaleString('ru-RU')}
                        </div>
                      </div>
                      <div className="text-right font-semibold">
                        {client.totalAmount.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </main>
  );
}
