"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var DashboardController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('dashboard'), (0, common_1.Controller)('dashboard')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getDashboard_decorators;
    var _getInventory_decorators;
    var _getDebtors_decorators;
    var _getStats_decorators;
    var DashboardController = _classThis = /** @class */ (function () {
        function DashboardController_1(dashboardService) {
            this.dashboardService = (__runInitializers(this, _instanceExtraInitializers), dashboardService);
        }
        DashboardController_1.prototype.getDashboard = function () {
            return this.dashboardService.getDashboard();
        };
        DashboardController_1.prototype.getInventory = function () {
            return this.dashboardService.getInventory();
        };
        DashboardController_1.prototype.getDebtors = function () {
            return this.dashboardService.getDebtors();
        };
        DashboardController_1.prototype.getStats = function () {
            return this.dashboardService.getStats();
        };
        return DashboardController_1;
    }());
    __setFunctionName(_classThis, "DashboardController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getDashboard_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get complete dashboard data' })];
        _getInventory_decorators = [(0, common_1.Get)('inventory'), (0, swagger_1.ApiOperation)({ summary: 'Get current inventory status' })];
        _getDebtors_decorators = [(0, common_1.Get)('debtors'), (0, swagger_1.ApiOperation)({ summary: 'Get list of debtors' })];
        _getStats_decorators = [(0, common_1.Get)('stats'), (0, swagger_1.ApiOperation)({ summary: 'Get general statistics' })];
        __esDecorate(_classThis, null, _getDashboard_decorators, { kind: "method", name: "getDashboard", static: false, private: false, access: { has: function (obj) { return "getDashboard" in obj; }, get: function (obj) { return obj.getDashboard; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getInventory_decorators, { kind: "method", name: "getInventory", static: false, private: false, access: { has: function (obj) { return "getInventory" in obj; }, get: function (obj) { return obj.getInventory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDebtors_decorators, { kind: "method", name: "getDebtors", static: false, private: false, access: { has: function (obj) { return "getDebtors" in obj; }, get: function (obj) { return obj.getDebtors; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStats_decorators, { kind: "method", name: "getStats", static: false, private: false, access: { has: function (obj) { return "getStats" in obj; }, get: function (obj) { return obj.getStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DashboardController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DashboardController = _classThis;
}();
exports.DashboardController = DashboardController;
