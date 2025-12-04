import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Client, MeatType, PackageSize, Shipment, Supply } from '@repo/database';

export interface PeriodReport {
  period: {
    startDate: Date;
    endDate: Date;
  };
  supplies: {
    total: number;
    byType: Array<{
      meatType: MeatType;
      packageSize: PackageSize;
      quantity: number;
    }>;
  };
  shipments: {
    total: number;
    paid: number;
    unpaid: number;
    byType: Array<{
      meatType: MeatType;
      packageSize: PackageSize;
      quantity: number;
      paidQuantity: number;
      unpaidQuantity: number;
    }>;
    revenue: {
      total: number;
      paid: number;
      unpaid: number;
    };
  };
  topClients: Array<{
    clientId: string;
    clientName: string;
    totalShipments: number;
    totalAmount: number;
  }>;
}

@Injectable()
export class ReportsService {
  private readonly topClientsLimit = 10;

  constructor(private readonly db: DatabaseService) {}

  async generatePeriodReport(
    startDate: Date,
    endDate: Date,
  ): Promise<PeriodReport> {
    const { supplies, shipments } = await this.getPeriodData(startDate, endDate);

    const suppliesSummary = this.buildSuppliesSummary(supplies);
    const shipmentsSummary = this.buildShipmentsSummary(shipments);
    const topClientsData = this.getTopClientsFromShipments(shipments);

    return {
      period: {
        startDate,
        endDate,
      },
      supplies: suppliesSummary,
      shipments: shipmentsSummary,
      topClients: topClientsData,
    };
  }

  async generatePeriodReportCsv(startDate: Date, endDate: Date): Promise<string> {
    const { supplies, shipments } = await this.getPeriodData(startDate, endDate);
    const suppliesSummary = this.buildSuppliesSummary(supplies);
    const shipmentsSummary = this.buildShipmentsSummary(shipments);
    const topClients = this.getTopClientsFromShipments(shipments);

    const rows: Array<Array<string | number | boolean>> = [];

    rows.push(['Отчет за период', this.formatDate(startDate), this.formatDate(endDate)]);
    rows.push([]);

    rows.push(['Сводка поставок']);
    rows.push(['Тип мяса', 'Размер упаковки', 'Количество']);
    suppliesSummary.byType.forEach((item) => {
      rows.push([
        this.getMeatLabel(item.meatType),
        this.getPackageSizeLabel(item.packageSize),
        item.quantity,
      ]);
    });
    rows.push(['Итого поставок', '', suppliesSummary.total]);
    rows.push([]);

    rows.push(['Отгрузки по типам']);
    rows.push(['Тип мяса', 'Размер упаковки', 'Кол-во', 'Оплачено', 'Не оплачено']);
    shipmentsSummary.byType.forEach((item) => {
      rows.push([
        this.getMeatLabel(item.meatType),
        this.getPackageSizeLabel(item.packageSize),
        item.quantity,
        item.paidQuantity,
        item.unpaidQuantity,
      ]);
    });
    rows.push([
      'Всего отгрузок',
      '',
      shipmentsSummary.total,
      shipmentsSummary.paid,
      shipmentsSummary.unpaid,
    ]);
    rows.push(['Выручка', 'Всего', shipmentsSummary.revenue.total]);
    rows.push(['', 'Оплачено', shipmentsSummary.revenue.paid]);
    rows.push(['', 'Не оплачено', shipmentsSummary.revenue.unpaid]);
    rows.push([]);

    rows.push(['Топ клиентов']);
    rows.push(['Клиент', 'Отгрузок', 'Сумма']);
    if (topClients.length === 0) {
      rows.push(['Нет данных', 0, 0]);
    } else {
      topClients.forEach((client) => {
        rows.push([client.clientName, client.totalShipments, client.totalAmount]);
      });
    }
    rows.push([]);

    rows.push(['Поставки (детализация)']);
    rows.push(['Дата', 'Тип мяса', 'Размер', 'Количество']);
    if (supplies.length === 0) {
      rows.push(['-', '-', '-', 0]);
    } else {
      supplies.forEach((supply) => {
        rows.push([
          this.formatDate(supply.date),
          this.getMeatLabel(supply.meatType),
          this.getPackageSizeLabel(supply.packageSize),
          supply.quantity,
        ]);
      });
    }
    rows.push([]);

    rows.push(['Отгрузки (детализация)']);
    rows.push(['Дата', 'Клиент', 'Тип мяса', 'Размер', 'Количество', 'Оплачено', 'Сумма', 'Комментарий']);
    if (shipments.length === 0) {
      rows.push(['-', '-', '-', '-', 0, '-', '-', '-']);
    } else {
      shipments.forEach((shipment) => {
        rows.push([
          this.formatDate(shipment.date),
          shipment.client?.name ?? '—',
          this.getMeatLabel(shipment.meatType),
          this.getPackageSizeLabel(shipment.packageSize),
          shipment.quantity,
          shipment.isPaid ? 'Да' : 'Нет',
          this.getShipmentAmount(shipment),
          shipment.notes ?? '',
        ]);
      });
    }

    return this.toCsv(rows);
  }

  private async getPeriodData(startDate: Date, endDate: Date) {
    const [supplies, shipments] = await Promise.all([
      this.db.supply.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          date: 'asc',
        },
      }),
      this.db.shipment.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          client: true,
        },
        orderBy: {
          date: 'asc',
        },
      }),
    ]);

    return {
      supplies,
      shipments,
    };
  }

  private buildSuppliesSummary(supplies: Supply[]) {
    const total = supplies.reduce((sum: number, s) => sum + s.quantity, 0);

    const byTypeMap = new Map<
      string,
      { meatType: MeatType; packageSize: PackageSize; quantity: number }
    >();

    supplies.forEach((supply) => {
      const key = `${supply.meatType}-${supply.packageSize}`;
      const existing = byTypeMap.get(key);
      if (existing) {
        existing.quantity += supply.quantity;
      } else {
        byTypeMap.set(key, {
          meatType: supply.meatType,
          packageSize: supply.packageSize,
          quantity: supply.quantity,
        });
      }
    });

    return {
      total,
      byType: Array.from(byTypeMap.values()),
    };
  }

  private buildShipmentsSummary(shipments: Array<Shipment & { client?: Client }>) {
    const total = shipments.length;
    const paid = shipments.filter((s) => s.isPaid).length;
    const unpaid = total - paid;

    const byTypeMap = new Map<
      string,
      {
        meatType: MeatType;
        packageSize: PackageSize;
        quantity: number;
        paidQuantity: number;
        unpaidQuantity: number;
      }
    >();

    shipments.forEach((shipment) => {
      const key = `${shipment.meatType}-${shipment.packageSize}`;
      const existing = byTypeMap.get(key);

      if (existing) {
        existing.quantity += shipment.quantity;
        if (shipment.isPaid) {
          existing.paidQuantity += shipment.quantity;
        } else {
          existing.unpaidQuantity += shipment.quantity;
        }
      } else {
        byTypeMap.set(key, {
          meatType: shipment.meatType,
          packageSize: shipment.packageSize,
          quantity: shipment.quantity,
          paidQuantity: shipment.isPaid ? shipment.quantity : 0,
          unpaidQuantity: shipment.isPaid ? 0 : shipment.quantity,
        });
      }
    });

    const totalRevenue = shipments.reduce((sum: number, s) => sum + this.getShipmentAmount(s), 0);
    const paidRevenue = shipments
      .filter((s) => s.isPaid)
      .reduce((sum: number, s) => sum + this.getShipmentAmount(s), 0);
    const unpaidRevenue = totalRevenue - paidRevenue;

    return {
      total,
      paid,
      unpaid,
      byType: Array.from(byTypeMap.values()),
      revenue: {
        total: totalRevenue,
        paid: paidRevenue,
        unpaid: unpaidRevenue,
      },
    };
  }

  private getTopClientsFromShipments(
    shipments: Array<Shipment & { client?: Client }>,
    limit?: number,
  ) {
    const maxItems = limit ?? this.topClientsLimit;

    const clientsMap = new Map<
      string,
      {
        clientId: string;
        clientName: string;
        totalShipments: number;
        totalAmount: number;
      }
    >();

    shipments.forEach((shipment) => {
      const existing = clientsMap.get(shipment.clientId);
      const amount = this.getShipmentAmount(shipment);

      if (existing) {
        existing.totalShipments++;
        existing.totalAmount += amount;
      } else {
        clientsMap.set(shipment.clientId, {
          clientId: shipment.clientId,
          clientName: shipment.client?.name ?? 'Неизвестный клиент',
          totalShipments: 1,
          totalAmount: amount,
        });
      }
    });

    return Array.from(clientsMap.values())
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, maxItems);
  }

  private formatDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

  private getShipmentAmount(shipment: Shipment) {
    return shipment.totalAmount ? Number(shipment.totalAmount) : 0;
  }

  private getMeatLabel(type: MeatType) {
    return type === MeatType.CHICKEN ? 'Курица' : 'Говядина';
  }

  private getPackageSizeLabel(size: PackageSize) {
    if (size === PackageSize.SIZE_15) {
      return '15 кг';
    }
    if (size === PackageSize.SIZE_20) {
      return '20 кг';
    }
    return size;
  }

  private toCsv(rows: Array<Array<string | number | boolean>>) {
    return rows
      .map((row) =>
        row
          .map((value) => this.escapeCsvValue(String(value ?? '')))
          .join(','),
      )
      .join('\n');
  }

  private escapeCsvValue(value: string) {
    if (value.includes('"') || value.includes(',') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
