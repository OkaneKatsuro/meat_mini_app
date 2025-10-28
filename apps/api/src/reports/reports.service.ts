import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MeatType, PackageSize } from '@repo/database';

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
  constructor(private readonly db: DatabaseService) {}

  async generatePeriodReport(
    startDate: Date,
    endDate: Date,
  ): Promise<PeriodReport> {
    const [supplies, shipments, topClientsData] = await Promise.all([
      this.getSuppliesInPeriod(startDate, endDate),
      this.getShipmentsInPeriod(startDate, endDate),
      this.getTopClients(startDate, endDate),
    ]);

    return {
      period: {
        startDate,
        endDate,
      },
      supplies,
      shipments,
      topClients: topClientsData,
    };
  }

  private async getSuppliesInPeriod(startDate: Date, endDate: Date) {
    const supplies = await this.db.supply.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const total = supplies.reduce((sum, s) => sum + s.quantity, 0);

    const byTypeMap = new Map<string, { meatType: MeatType; packageSize: PackageSize; quantity: number }>();

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

  private async getShipmentsInPeriod(startDate: Date, endDate: Date) {
    const shipments = await this.db.shipment.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const total = shipments.length;
    const paid = shipments.filter((s) => s.isPaid).length;
    const unpaid = total - paid;

    const byTypeMap = new Map<string, {
      meatType: MeatType;
      packageSize: PackageSize;
      quantity: number;
      paidQuantity: number;
      unpaidQuantity: number;
    }>();

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

    const totalRevenue = shipments.reduce(
      (sum, s) => sum + (s.totalAmount ? Number(s.totalAmount) : 0),
      0,
    );
    const paidRevenue = shipments
      .filter((s) => s.isPaid)
      .reduce((sum, s) => sum + (s.totalAmount ? Number(s.totalAmount) : 0), 0);
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

  private async getTopClients(startDate: Date, endDate: Date, limit: number = 10) {
    const shipments = await this.db.shipment.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        client: true,
      },
    });

    const clientsMap = new Map<string, {
      clientId: string;
      clientName: string;
      totalShipments: number;
      totalAmount: number;
    }>();

    shipments.forEach((shipment) => {
      const existing = clientsMap.get(shipment.clientId);
      const amount = shipment.totalAmount ? Number(shipment.totalAmount) : 0;

      if (existing) {
        existing.totalShipments++;
        existing.totalAmount += amount;
      } else {
        clientsMap.set(shipment.clientId, {
          clientId: shipment.clientId,
          clientName: shipment.client.name,
          totalShipments: 1,
          totalAmount: amount,
        });
      }
    });

    return Array.from(clientsMap.values())
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, limit);
  }
}
