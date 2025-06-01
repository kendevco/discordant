import axios from "axios";

export interface CompanyInfo {
  name?: string;
  description?: string;
  industry?: string;
  location?: string;
  website?: string;
  employees?: string;
  founded?: string;
  revenue?: string;
  technologies?: string[];
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface ResearchResult {
  url: string;
  title?: string;
  description?: string;
  companyInfo?: CompanyInfo;
  metadata?: {
    type: 'company' | 'website' | 'article' | 'unknown';
    confidence: number;
    extractedAt: string;
  };
  error?: string;
}

export class ResearchAgent {
  private static readonly COMPANY_INDICATORS = [
    'about', 'company', 'corp', 'inc', 'llc', 'ltd', 'careers', 
    'jobs', 'team', 'leadership', 'investors', 'contact'
  ];

  private static readonly SOCIAL_DOMAINS = [
    'linkedin.com', 'twitter.com', 'facebook.com', 'instagram.com',
    'youtube.com', 'github.com', 'gitlab.com', 'bitbucket.org'
  ];

  /**
   * Detects if a message contains URLs that should be researched
   */
  static shouldResearch(content: string): boolean {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = content.match(urlRegex);
    
    if (!urls) return false;

    // Check if any URL looks like a company or business website
    return urls.some(url => {
      try {
        const parsed = new URL(url);
        const domain = parsed.hostname.toLowerCase();
        
        // Skip common social media and file hosting sites
        if (this.SOCIAL_DOMAINS.some(social => domain.includes(social))) {
          return false;
        }
        
        // Skip file extensions
        if (url.match(/\.(pdf|jpg|jpeg|png|gif|mp4|mp3|doc|docx|zip)$/i)) {
          return false;
        }
        
        // Look for company indicators
        const path = parsed.pathname.toLowerCase();
        return this.COMPANY_INDICATORS.some(indicator => 
          domain.includes(indicator) || path.includes(indicator)
        ) || this.isBusinessDomain(domain);
        
      } catch {
        return false;
      }
    });
  }

  /**
   * Extracts URLs from message content
   */
  static extractUrls(content: string): string[] {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.match(urlRegex) || [];
  }

  /**
   * Research a URL and extract company/website information
   */
  static async researchUrl(url: string): Promise<ResearchResult> {
    try {
      console.log(`[RESEARCH_AGENT] Researching: ${url}`);
      
      // Basic URL validation
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Invalid protocol');
      }

      // Fetch the webpage
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ResearchBot/1.0; +https://discordant.kendev.co)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
        },
        maxRedirects: 5,
        validateStatus: (status) => status < 400,
      });

      const html = response.data;
      const extracted = this.extractMetadata(html, url);
      
      // Determine if this looks like a company website
      const companyInfo = this.extractCompanyInfo(html, url);
      const isCompany = this.isCompanyWebsite(html, url);

      return {
        url,
        title: extracted.title,
        description: extracted.description,
        companyInfo: isCompany ? companyInfo : undefined,
        metadata: {
          type: isCompany ? 'company' : 'website',
          confidence: this.calculateConfidence(html, url, isCompany),
          extractedAt: new Date().toISOString(),
        },
      };

    } catch (error) {
      console.error(`[RESEARCH_AGENT] Error researching ${url}:`, error);
      return {
        url,
        error: error instanceof Error ? error.message : 'Research failed',
        metadata: {
          type: 'unknown',
          confidence: 0,
          extractedAt: new Date().toISOString(),
        },
      };
    }
  }

  /**
   * Research multiple URLs concurrently
   */
  static async researchUrls(urls: string[]): Promise<ResearchResult[]> {
    const promises = urls.slice(0, 3).map(url => this.researchUrl(url)); // Limit to 3 URLs
    return Promise.all(promises);
  }

  /**
   * Extract basic metadata from HTML
   */
  private static extractMetadata(html: string, url: string) {
    const title = this.extractTag(html, 'title') || 
                  this.extractMetaContent(html, 'og:title') ||
                  this.extractMetaContent(html, 'twitter:title') ||
                  'Unknown Title';

    const description = this.extractMetaContent(html, 'description') ||
                       this.extractMetaContent(html, 'og:description') ||
                       this.extractMetaContent(html, 'twitter:description') ||
                       'No description available';

    return { title: title.slice(0, 200), description: description.slice(0, 500) };
  }

  /**
   * Extract company-specific information
   */
  private static extractCompanyInfo(html: string, url: string): CompanyInfo {
    const info: CompanyInfo = {};
    
    // Extract company name
    info.name = this.extractMetaContent(html, 'og:site_name') ||
                this.extractTag(html, 'title')?.split(/[-|•]/)[0]?.trim();

    // Extract description
    const description = this.extractMetaContent(html, 'description') ||
                       this.extractMetaContent(html, 'og:description');
    info.description = description || undefined;

    // Look for structured data
    const jsonLd = this.extractJsonLd(html);
    if (jsonLd?.['@type'] === 'Organization') {
      info.name = info.name || jsonLd.name;
      info.description = info.description || jsonLd.description;
      info.website = jsonLd.url;
    }

    // Extract location from various sources
    const location = this.extractMetaContent(html, 'geo.placename') ||
                    this.extractMetaContent(html, 'location');
    info.location = location || undefined;

    return info;
  }

  /**
   * Determine if a website looks like a company website
   */
  private static isCompanyWebsite(html: string, url: string): boolean {
    const domain = new URL(url).hostname.toLowerCase();
    const content = html.toLowerCase();
    
    // Check for company indicators in content
    const companyKeywords = [
      'about us', 'our team', 'careers', 'jobs', 'leadership',
      'investors', 'press', 'news', 'contact us', 'headquarters',
      'founded', 'employees', 'mission', 'vision', 'values'
    ];

    const keywordMatches = companyKeywords.filter(keyword => 
      content.includes(keyword)
    ).length;

    // Check domain structure
    const isDotCom = domain.endsWith('.com') || domain.endsWith('.co');
    const hasSubdomain = domain.split('.').length > 2;

    return keywordMatches >= 2 || (isDotCom && !hasSubdomain && this.isBusinessDomain(domain));
  }

  /**
   * Check if domain looks like a business domain
   */
  private static isBusinessDomain(domain: string): boolean {
    const businessTlds = ['.com', '.co', '.io', '.net', '.org', '.biz'];
    const excludePatterns = [
      'blog', 'news', 'wiki', 'forum', 'support', 'help',
      'docs', 'api', 'cdn', 'static', 'assets'
    ];

    return businessTlds.some(tld => domain.endsWith(tld)) &&
           !excludePatterns.some(pattern => domain.includes(pattern));
  }

  /**
   * Calculate confidence score for the research result
   */
  private static calculateConfidence(html: string, url: string, isCompany: boolean): number {
    let confidence = 0.3; // Base confidence

    if (this.extractTag(html, 'title')) confidence += 0.2;
    if (this.extractMetaContent(html, 'description')) confidence += 0.2;
    if (this.extractJsonLd(html)) confidence += 0.2;
    if (isCompany) confidence += 0.2;

    return Math.min(confidence, 1.0);
  }

  /**
   * Extract content from HTML tags
   */
  private static extractTag(html: string, tag: string): string | null {
    const regex = new RegExp(`<${tag}[^>]*>([^<]+)<\/${tag}>`, 'i');
    const match = html.match(regex);
    return match ? match[1].trim() : null;
  }

  /**
   * Extract meta tag content
   */
  private static extractMetaContent(html: string, name: string): string | null {
    const patterns = [
      new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'),
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'),
      new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'),
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) return match[1].trim();
    }

    return null;
  }

  /**
   * Extract JSON-LD structured data
   */
  private static extractJsonLd(html: string): any {
    try {
      const regex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([^<]+)<\/script>/gi;
      const matches = html.match(regex);
      
      if (matches && matches.length > 0) {
        const jsonText = matches[0].replace(/<[^>]+>/g, '');
        return JSON.parse(jsonText);
      }
    } catch (error) {
      // Ignore JSON parsing errors
    }
    return null;
  }

  /**
   * Format research results for chat display
   */
  static formatForChat(results: ResearchResult[]): string {
    if (results.length === 0) return '';

    let formatted = '🔍 **Research Results:**\n\n';

    results.forEach((result, index) => {
      if (result.error) {
        formatted += `❌ **Error researching:** ${result.url}\n${result.error}\n\n`;
        return;
      }

      formatted += `**${result.title || 'Unknown Site'}**\n`;
      formatted += `🌐 ${result.url}\n`;
      
      if (result.description) {
        formatted += `📄 ${result.description}\n`;
      }

      if (result.companyInfo) {
        if (result.companyInfo.location) {
          formatted += `📍 ${result.companyInfo.location}\n`;
        }
      }

      if (result.metadata) {
        const confidence = Math.round(result.metadata.confidence * 100);
        formatted += `📊 ${result.metadata.type} (${confidence}% confidence)\n`;
      }

      formatted += '\n';
    });

    return formatted.trim();
  }
} 