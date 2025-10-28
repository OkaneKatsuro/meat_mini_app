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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateShipmentDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var database_1 = require("@repo/database");
var CreateShipmentDto = function () {
    var _a;
    var _clientId_decorators;
    var _clientId_initializers = [];
    var _clientId_extraInitializers = [];
    var _date_decorators;
    var _date_initializers = [];
    var _date_extraInitializers = [];
    var _meatType_decorators;
    var _meatType_initializers = [];
    var _meatType_extraInitializers = [];
    var _packageSize_decorators;
    var _packageSize_initializers = [];
    var _packageSize_extraInitializers = [];
    var _quantity_decorators;
    var _quantity_initializers = [];
    var _quantity_extraInitializers = [];
    var _isPaid_decorators;
    var _isPaid_initializers = [];
    var _isPaid_extraInitializers = [];
    var _totalAmount_decorators;
    var _totalAmount_initializers = [];
    var _totalAmount_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateShipmentDto() {
                this.clientId = __runInitializers(this, _clientId_initializers, void 0);
                this.date = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _date_initializers, void 0));
                this.meatType = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _meatType_initializers, void 0));
                this.packageSize = (__runInitializers(this, _meatType_extraInitializers), __runInitializers(this, _packageSize_initializers, void 0));
                this.quantity = (__runInitializers(this, _packageSize_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
                this.isPaid = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _isPaid_initializers, void 0));
                this.totalAmount = (__runInitializers(this, _isPaid_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
                this.notes = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
            return CreateShipmentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _clientId_decorators = [(0, swagger_1.ApiProperty)({ example: 'client-id-here' }), (0, class_validator_1.IsString)()];
            _date_decorators = [(0, swagger_1.ApiProperty)({ example: '2024-01-15T10:00:00.000Z' }), (0, class_validator_1.IsDateString)()];
            _meatType_decorators = [(0, swagger_1.ApiProperty)({ enum: database_1.MeatType, example: database_1.MeatType.CHICKEN }), (0, class_validator_1.IsEnum)(database_1.MeatType)];
            _packageSize_decorators = [(0, swagger_1.ApiProperty)({ enum: database_1.PackageSize, example: database_1.PackageSize.SIZE_15 }), (0, class_validator_1.IsEnum)(database_1.PackageSize)];
            _quantity_decorators = [(0, swagger_1.ApiProperty)({ example: 50, description: 'Количество упаковок' }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _isPaid_decorators = [(0, swagger_1.ApiProperty)({ example: false }), (0, class_validator_1.IsBoolean)()];
            _totalAmount_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '15000.00' }), (0, class_validator_1.IsOptional)()];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Доставка до 18:00' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: function (obj) { return "clientId" in obj; }, get: function (obj) { return obj.clientId; }, set: function (obj, value) { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            __esDecorate(null, null, _meatType_decorators, { kind: "field", name: "meatType", static: false, private: false, access: { has: function (obj) { return "meatType" in obj; }, get: function (obj) { return obj.meatType; }, set: function (obj, value) { obj.meatType = value; } }, metadata: _metadata }, _meatType_initializers, _meatType_extraInitializers);
            __esDecorate(null, null, _packageSize_decorators, { kind: "field", name: "packageSize", static: false, private: false, access: { has: function (obj) { return "packageSize" in obj; }, get: function (obj) { return obj.packageSize; }, set: function (obj, value) { obj.packageSize = value; } }, metadata: _metadata }, _packageSize_initializers, _packageSize_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: function (obj) { return "quantity" in obj; }, get: function (obj) { return obj.quantity; }, set: function (obj, value) { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _isPaid_decorators, { kind: "field", name: "isPaid", static: false, private: false, access: { has: function (obj) { return "isPaid" in obj; }, get: function (obj) { return obj.isPaid; }, set: function (obj, value) { obj.isPaid = value; } }, metadata: _metadata }, _isPaid_initializers, _isPaid_extraInitializers);
            __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: function (obj) { return "totalAmount" in obj; }, get: function (obj) { return obj.totalAmount; }, set: function (obj, value) { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateShipmentDto = CreateShipmentDto;
