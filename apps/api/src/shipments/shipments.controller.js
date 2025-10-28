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
exports.ShipmentsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var ShipmentsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('shipments'), (0, common_1.Controller)('shipments')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAll_decorators;
    var _getUnpaidShipments_decorators;
    var _findOne_decorators;
    var _update_decorators;
    var _markAsPaid_decorators;
    var _remove_decorators;
    var ShipmentsController = _classThis = /** @class */ (function () {
        function ShipmentsController_1(shipmentsService) {
            this.shipmentsService = (__runInitializers(this, _instanceExtraInitializers), shipmentsService);
        }
        ShipmentsController_1.prototype.create = function (createShipmentDto) {
            return this.shipmentsService.create(createShipmentDto);
        };
        ShipmentsController_1.prototype.findAll = function (isPaid) {
            var isPaidBoolean = isPaid === 'true' ? true : isPaid === 'false' ? false : undefined;
            return this.shipmentsService.findAll(isPaidBoolean);
        };
        ShipmentsController_1.prototype.getUnpaidShipments = function () {
            return this.shipmentsService.getUnpaidShipments();
        };
        ShipmentsController_1.prototype.findOne = function (id) {
            return this.shipmentsService.findOne(id);
        };
        ShipmentsController_1.prototype.update = function (id, updateShipmentDto) {
            return this.shipmentsService.update(id, updateShipmentDto);
        };
        ShipmentsController_1.prototype.markAsPaid = function (id) {
            return this.shipmentsService.markAsPaid(id);
        };
        ShipmentsController_1.prototype.remove = function (id) {
            return this.shipmentsService.remove(id);
        };
        return ShipmentsController_1;
    }());
    __setFunctionName(_classThis, "ShipmentsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiOperation)({ summary: 'Create a new shipment' })];
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get all shipments' }), (0, swagger_1.ApiQuery)({ name: 'isPaid', required: false, type: Boolean })];
        _getUnpaidShipments_decorators = [(0, common_1.Get)('unpaid'), (0, swagger_1.ApiOperation)({ summary: 'Get all unpaid shipments' })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get a shipment by ID' })];
        _update_decorators = [(0, common_1.Patch)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update a shipment' })];
        _markAsPaid_decorators = [(0, common_1.Patch)(':id/mark-paid'), (0, swagger_1.ApiOperation)({ summary: 'Mark shipment as paid' })];
        _remove_decorators = [(0, common_1.Delete)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Delete a shipment' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUnpaidShipments_decorators, { kind: "method", name: "getUnpaidShipments", static: false, private: false, access: { has: function (obj) { return "getUnpaidShipments" in obj; }, get: function (obj) { return obj.getUnpaidShipments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _markAsPaid_decorators, { kind: "method", name: "markAsPaid", static: false, private: false, access: { has: function (obj) { return "markAsPaid" in obj; }, get: function (obj) { return obj.markAsPaid; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ShipmentsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ShipmentsController = _classThis;
}();
exports.ShipmentsController = ShipmentsController;
