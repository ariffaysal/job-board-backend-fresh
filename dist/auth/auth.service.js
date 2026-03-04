"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const agency_entity_1 = require("../agency/entities/agency.entity");
let AuthService = class AuthService {
    constructor(agencyRepo, jwtService, configService) {
        this.agencyRepo = agencyRepo;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(name, email, password) {
        const existing = await this.agencyRepo.findOne({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException('Email already registered');
        }
        const bcryptRounds = parseInt(this.configService.get('BCRYPT_ROUNDS') || '10');
        const hashedPassword = await bcrypt.hash(password, bcryptRounds);
        const agency = this.agencyRepo.create({
            name,
            email,
            password: hashedPassword,
        });
        const savedAgency = await this.agencyRepo.save(agency);
        const payload = {
            sub: savedAgency.id,
            email: savedAgency.email,
            name: savedAgency.name,
            role: 'agency',
            agencyId: savedAgency.id,
        };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user: {
                id: savedAgency.id,
                name: savedAgency.name,
                email: savedAgency.email,
                role: 'agency',
                agencyId: savedAgency.id,
            },
        };
    }
    async login(email, password) {
        const agency = await this.agencyRepo.findOne({ where: { email } });
        if (!agency) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, agency.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: agency.id,
            email: agency.email,
            name: agency.name,
            role: 'agency',
            agencyId: agency.id,
        };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user: {
                id: agency.id,
                name: agency.name,
                email: agency.email,
                role: 'agency',
                agencyId: agency.id,
            },
        };
    }
    async validateUser(email, password) {
        const agency = await this.agencyRepo.findOne({ where: { email } });
        if (agency && await bcrypt.compare(password, agency.password)) {
            const { password, ...result } = agency;
            return result;
        }
        return null;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agency_entity_1.Agency)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map