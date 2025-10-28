import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MeatType, PackageSize } from '@repo/database';

export interface InventoryItem {
  meatType: MeatType;
  packageSize: PackageSize;
  totalSupplied: number;
  totalShipped: number;
  currentStock: number;
}

export interface DebtorInfo {
  clientId: string;
  clientName: string;
  unpaidShipmentsCount: number;
  totalUnpaidAmount: number;
  oldestUnpaidDate: Date;
}

@Injectable()
export class DashboardService {
  constructor(private readonly db: DatabaseService) {}

  async getInventory(): Promise<InventoryItem[]> {
    const supplies = await this.db.supply.groupBy({
      by: ['meatType', 'packageSize'],
      _sum: {
        quantity: true,
      },
    });

    const shipments = await this.db.shipment.groupBy({
      by: ['meatType', 'packageSize'],
      _sum: {
        quantity: true,
      },
    });

    const inventory: InventoryItem[] = [];
    const meatTypes = [MeatType.CHICKEN, MeatType.BEEF];
    const packageSizes = [PackageSize.SIZE_15, PackageSize.SIZE_20];

    for (const meatType of meatTypes) {
      for (const packageSize of packageSizes) {
        const supplied = supplies.find(
          (s) => s.meatType === meatType && s.packageSize === packageSize,
        )?._sum.quantity || 0;

        const shipped = shipments.find(
          (s) => s.meatType === meatType && s.packageSize === packageSize,
        )?._sum.quantity || 0;

        inventory.push({
          meatType,
          packageSize,
          totalSupplied: supplied,
          totalShipped: shipped,
          currentStock: supplied - shipped,
        });
      }
    }

    return inventory;
  }

  async getDebtors(): Promise<DebtorInfo[]> {
    const unpaidShipments = await this.db.shipment.findMany({
      where: { isPaid: false },
      include: { client: true },
      orderBy: { date: 'asc' },
    });

    const debtorsMap = new Map<string, DebtorInfo>();

    for (const shipment of unpaidShipments) {
      const existing = debtorsMap.get(shipment.clientId);
      const amount = shipment.totalAmount ? Number(shipment.totalAmount) : 0;

      if (existing) {
        existing.unpaidShipmentsCount++;
        existing.totalUnpaidAmount += amount;
        if (shipment.date < existing.oldestUnpaidDate) {
          existing.oldestUnpaidDate = shipment.date;
        }
      } else {
        debtorsMap.set(shipment.clientId, {
          clientId: shipment.clientId,
          clientName: shipment.client.name,
          unpaidShipmentsCount: 1,
          totalUnpaidAmount: amount,
          oldestUnpaidDate: shipment.date,
        });
      }
    }

    return Array.from(debtorsMap.values()).sort(
      (a, b) => b.totalUnpaidAmount - a.totalUnpaidAmount,
    );
  }

  async getStats() {
    const [
      totalSupplies,
      totalShipments,
      unpaidShipments,
      totalClients,
    ] = await Promise.all([
      this.db.supply.count(),
      this.db.shipment.count(),
      this.db.shipment.count({ where: { isPaid: false } }),
      this.db.client.count(),
    ]);

    const totalUnpaidAmount = await this.db.shipment.aggregate({
      where: { isPaid: false },
      _sum: { totalAmount: true },
    });

    return {
      totalSupplies,
      totalShipments,
      unpaidShipments,
      totalClients,
      totalUnpaidAmount: totalUnpaidAmount._sum.totalAmount || 0,
    };
  }

  async getDashboard() {
    const [inventory, debtors, stats] = await Promise.all([
      this.getInventory(),
      this.getDebtors(),
      this.getStats(),
    ]);

    return {
      inventory,
      debtors,
      stats,
    };
  }
}
