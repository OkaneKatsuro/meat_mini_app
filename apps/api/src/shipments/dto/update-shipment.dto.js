"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateShipmentDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var create_shipment_dto_1 = require("./create-shipment.dto");
var UpdateShipmentDto = /** @class */ (function (_super) {
    __extends(UpdateShipmentDto, _super);
    function UpdateShipmentDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdateShipmentDto;
}((0, swagger_1.PartialType)(create_shipment_dto_1.CreateShipmentDto)));
exports.UpdateShipmentDto = UpdateShipmentDto;
