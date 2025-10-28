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
exports.CreateSupplyDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var database_1 = require("@repo/database");
var CreateSupplyDto = function () {
    var _a;
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
    return _a = /** @class */ (function () {
            function CreateSupplyDto() {
                this.date = __runInitializers(this, _date_initializers, void 0);
                this.meatType = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _meatType_initializers, void 0));
                this.packageSize = (__runInitializers(this, _meatType_extraInitializers), __runInitializers(this, _packageSize_initializers, void 0));
                this.quantity = (__runInitializers(this, _packageSize_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
                __runInitializers(this, _quantity_extraInitializers);
            }
            return CreateSupplyDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _date_decorators = [(0, swagger_1.ApiProperty)({ example: '2024-01-15T10:00:00.000Z' }), (0, class_validator_1.IsDateString)()];
            _meatType_decorators = [(0, swagger_1.ApiProperty)({ enum: database_1.MeatType, example: database_1.MeatType.CHICKEN }), (0, class_validator_1.IsEnum)(database_1.MeatType)];
            _packageSize_decorators = [(0, swagger_1.ApiProperty)({ enum: database_1.PackageSize, example: database_1.PackageSize.SIZE_15 }), (0, class_validator_1.IsEnum)(database_1.PackageSize)];
            _quantity_decorators = [(0, swagger_1.ApiProperty)({ example: 100, description: 'Количество упаковок' }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            __esDecorate(null, null, _meatType_decorators, { kind: "field", name: "meatType", static: false, private: false, access: { has: function (obj) { return "meatType" in obj; }, get: function (obj) { return obj.meatType; }, set: function (obj, value) { obj.meatType = value; } }, metadata: _metadata }, _meatType_initializers, _meatType_extraInitializers);
            __esDecorate(null, null, _packageSize_decorators, { kind: "field", name: "packageSize", static: false, private: false, access: { has: function (obj) { return "packageSize" in obj; }, get: function (obj) { return obj.packageSize; }, set: function (obj, value) { obj.packageSize = value; } }, metadata: _metadata }, _packageSize_initializers, _packageSize_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: function (obj) { return "quantity" in obj; }, get: function (obj) { return obj.quantity; }, set: function (obj, value) { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateSupplyDto = CreateSupplyDto;
