"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
var common_1 = require("@nestjs/common");
var database_1 = require("@repo/database");
var DashboardService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DashboardService = _classThis = /** @class */ (function () {
        function DashboardService_1(db) {
            this.db = db;
        }
        DashboardService_1.prototype.getInventory = function () {
            return __awaiter(this, void 0, void 0, function () {
                var supplies, shipments, inventory, meatTypes, packageSizes, _loop_1, _i, meatTypes_1, meatType;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.db.supply.groupBy({
                                by: ['meatType', 'packageSize'],
                                _sum: {
                                    quantity: true,
                                },
                            })];
                        case 1:
                            supplies = _c.sent();
                            return [4 /*yield*/, this.db.shipment.groupBy({
                                    by: ['meatType', 'packageSize'],
                                    _sum: {
                                        quantity: true,
                                    },
                                })];
                        case 2:
                            shipments = _c.sent();
                            inventory = [];
                            meatTypes = [database_1.MeatType.CHICKEN, database_1.MeatType.BEEF];
                            packageSizes = [database_1.PackageSize.SIZE_15, database_1.PackageSize.SIZE_20];
                            _loop_1 = function (meatType) {
                                var _loop_2 = function (packageSize) {
                                    var supplied = ((_a = supplies.find(function (s) { return s.meatType === meatType && s.packageSize === packageSize; })) === null || _a === void 0 ? void 0 : _a._sum.quantity) || 0;
                                    var shipped = ((_b = shipments.find(function (s) { return s.meatType === meatType && s.packageSize === packageSize; })) === null || _b === void 0 ? void 0 : _b._sum.quantity) || 0;
                                    inventory.push({
                                        meatType: meatType,
                                        packageSize: packageSize,
                                        totalSupplied: supplied,
                                        totalShipped: shipped,
                                        currentStock: supplied - shipped,
                                    });
                                };
                                for (var _d = 0, packageSizes_1 = packageSizes; _d < packageSizes_1.length; _d++) {
                                    var packageSize = packageSizes_1[_d];
                                    _loop_2(packageSize);
                                }
                            };
                            for (_i = 0, meatTypes_1 = meatTypes; _i < meatTypes_1.length; _i++) {
                                meatType = meatTypes_1[_i];
                                _loop_1(meatType);
                            }
                            return [2 /*return*/, inventory];
                    }
                });
            });
        };
        DashboardService_1.prototype.getDebtors = function () {
            return __awaiter(this, void 0, void 0, function () {
                var unpaidShipments, debtorsMap, _i, unpaidShipments_1, shipment, existing, amount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.db.shipment.findMany({
                                where: { isPaid: false },
                                include: { client: true },
                                orderBy: { date: 'asc' },
                            })];
                        case 1:
                            unpaidShipments = _a.sent();
                            debtorsMap = new Map();
                            for (_i = 0, unpaidShipments_1 = unpaidShipments; _i < unpaidShipments_1.length; _i++) {
                                shipment = unpaidShipments_1[_i];
                                existing = debtorsMap.get(shipment.clientId);
                                amount = shipment.totalAmount ? Number(shipment.totalAmount) : 0;
                                if (existing) {
                                    existing.unpaidShipmentsCount++;
                                    existing.totalUnpaidAmount += amount;
                                    if (shipment.date < existing.oldestUnpaidDate) {
                                        existing.oldestUnpaidDate = shipment.date;
                                    }
                                }
                                else {
                                    debtorsMap.set(shipment.clientId, {
                                        clientId: shipment.clientId,
                                        clientName: shipment.client.name,
                                        unpaidShipmentsCount: 1,
                                        totalUnpaidAmount: amount,
                                        oldestUnpaidDate: shipment.date,
                                    });
                                }
                            }
                            return [2 /*return*/, Array.from(debtorsMap.values()).sort(function (a, b) { return b.totalUnpaidAmount - a.totalUnpaidAmount; })];
                    }
                });
            });
        };
        DashboardService_1.prototype.getStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, totalSupplies, totalShipments, unpaidShipments, totalClients, totalUnpaidAmount;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.db.supply.count(),
                                this.db.shipment.count(),
                                this.db.shipment.count({ where: { isPaid: false } }),
                                this.db.client.count(),
                            ])];
                        case 1:
                            _a = _b.sent(), totalSupplies = _a[0], totalShipments = _a[1], unpaidShipments = _a[2], totalClients = _a[3];
                            return [4 /*yield*/, this.db.shipment.aggregate({
                                    where: { isPaid: false },
                                    _sum: { totalAmount: true },
                                })];
                        case 2:
                            totalUnpaidAmount = _b.sent();
                            return [2 /*return*/, {
                                    totalSupplies: totalSupplies,
                                    totalShipments: totalShipments,
                                    unpaidShipments: unpaidShipments,
                                    totalClients: totalClients,
                                    totalUnpaidAmount: totalUnpaidAmount._sum.totalAmount || 0,
                                }];
                    }
                });
            });
        };
        DashboardService_1.prototype.getDashboard = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, inventory, debtors, stats;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.getInventory(),
                                this.getDebtors(),
                                this.getStats(),
                            ])];
                        case 1:
                            _a = _b.sent(), inventory = _a[0], debtors = _a[1], stats = _a[2];
                            return [2 /*return*/, {
                                    inventory: inventory,
                                    debtors: debtors,
                                    stats: stats,
                                }];
                    }
                });
            });
        };
        return DashboardService_1;
    }());
    __setFunctionName(_classThis, "DashboardService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DashboardService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DashboardService = _classThis;
}();
exports.DashboardService = DashboardService;
