"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlugService = void 0;
const common_1 = require("@nestjs/common");
let SlugService = class SlugService {
    generateSlug(title, companyName) {
        if (!title) {
            throw new Error('Title is required for slug generation');
        }
        let slug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
        if (companyName && companyName.trim()) {
            const companySlug = companyName
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-+|-+$/g, '');
            slug += `-at-${companySlug}`;
        }
        if (slug.length > 100) {
            slug = slug.substring(0, 97).replace(/-+$/, '');
        }
        return slug;
    }
    async generateUniqueSlug(title, companyName, checkExistsFn) {
        let baseSlug = this.generateSlug(title, companyName);
        let slug = baseSlug;
        let counter = 1;
        while (await checkExistsFn(slug)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
            if (counter > 1000) {
                throw new Error('Unable to generate unique slug after 1000 attempts');
            }
        }
        return slug;
    }
    validateSlug(slug) {
        if (!slug || typeof slug !== 'string') {
            return false;
        }
        const slugRegex = /^[a-z0-9-]+$/;
        const validStartEnd = !slug.startsWith('-') && !slug.endsWith('-');
        const noConsecutiveHyphens = !slug.includes('--');
        const validLength = slug.length >= 3 && slug.length <= 100;
        return slugRegex.test(slug) && validStartEnd && noConsecutiveHyphens && validLength;
    }
    extractKeywords(slug) {
        return slug
            .split('-')
            .filter(word => word.length > 2)
            .filter(word => !['at', 'the', 'and', 'or', 'but', 'in', 'on', 'for', 'with', 'to'].includes(word))
            .slice(0, 10);
    }
    generateMetaDescription(slug, maxLength = 160) {
        const keywords = this.extractKeywords(slug);
        const title = slug.replace(/-at-.*$/, '').replace(/-/g, ' ');
        let description = `Looking for ${title}? `;
        if (keywords.length > 0) {
            description += `This position requires experience in ${keywords.slice(0, 5).join(', ')}. `;
        }
        description += 'Apply now and join our team.';
        if (description.length > maxLength) {
            description = description.substring(0, maxLength - 3) + '...';
        }
        return description;
    }
};
exports.SlugService = SlugService;
exports.SlugService = SlugService = __decorate([
    (0, common_1.Injectable)()
], SlugService);
//# sourceMappingURL=slug.service.js.map