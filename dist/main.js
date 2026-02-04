"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const morgan_1 = __importDefault(require("morgan"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, morgan_1.default)('dev'));
    app.enableCors({
        origin: ['https://front-end-gold-five.vercel.app'],
        credentials: true,
    });
    await app.listen(process.env.PORT || 3000);
    console.log(`🚀 Backend running on port ${process.env.PORT || 3000}`);
}
bootstrap();
//# sourceMappingURL=main.js.map