import { Injectable } from '@nestjs/common';

@Injectable()
export class SlugService {
  /**
   * Generate a URL-friendly slug from a title and company name
   * Example: "Senior React Developer" + "Acme Corp" -> "senior-react-developer-at-acme-corp"
   */
  generateSlug(title: string, companyName?: string): string {
    if (!title) {
      throw new Error('Title is required for slug generation');
    }

    // Convert title to slug format
    let slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    // Add company name if provided
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

    // Ensure slug is not too long (max 100 characters for SEO)
    if (slug.length > 100) {
      slug = slug.substring(0, 97).replace(/-+$/, ''); // Remove trailing hyphen if truncated
    }

    return slug;
  }

  /**
   * Generate a unique slug by appending a number if the slug already exists
   */
  async generateUniqueSlug(
    title: string,
    companyName: string,
    checkExistsFn: (slug: string) => Promise<boolean>,
  ): Promise<string> {
    let baseSlug = this.generateSlug(title, companyName);
    let slug = baseSlug;
    let counter = 1;

    // Keep trying until we find a unique slug
    while (await checkExistsFn(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;

      // Prevent infinite loop
      if (counter > 1000) {
        throw new Error('Unable to generate unique slug after 1000 attempts');
      }
    }

    return slug;
  }

  /**
   * Validate if a slug is properly formatted
   */
  validateSlug(slug: string): boolean {
    if (!slug || typeof slug !== 'string') {
      return false;
    }

    // Slug should only contain lowercase letters, numbers, and hyphens
    const slugRegex = /^[a-z0-9-]+$/;
    
    // Should not start or end with hyphen
    const validStartEnd = !slug.startsWith('-') && !slug.endsWith('-');
    
    // Should not have consecutive hyphens
    const noConsecutiveHyphens = !slug.includes('--');
    
    // Should be between 3 and 100 characters
    const validLength = slug.length >= 3 && slug.length <= 100;

    return slugRegex.test(slug) && validStartEnd && noConsecutiveHyphens && validLength;
  }

  /**
   * Extract keywords from a slug for SEO
   */
  extractKeywords(slug: string): string[] {
    return slug
      .split('-')
      .filter(word => word.length > 2) // Filter out very short words
      .filter(word => !['at', 'the', 'and', 'or', 'but', 'in', 'on', 'for', 'with', 'to'].includes(word)) // Filter out common words
      .slice(0, 10); // Limit to top 10 keywords
  }

  /**
   * Generate meta description from slug
   */
  generateMetaDescription(slug: string, maxLength: number = 160): string {
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
}
