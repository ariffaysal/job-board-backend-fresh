export declare class SlugService {
    generateSlug(title: string, companyName?: string): string;
    generateUniqueSlug(title: string, companyName: string, checkExistsFn: (slug: string) => Promise<boolean>): Promise<string>;
    validateSlug(slug: string): boolean;
    extractKeywords(slug: string): string[];
    generateMetaDescription(slug: string, maxLength?: number): string;
}
