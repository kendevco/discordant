export interface TenantConfig {
  id: string;
  name: string;
  domain: string;
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    favicon: string;
  };
  features: {
    calendar: boolean;
    research: boolean;
    phone: boolean;
    documents: boolean;
    customWorkflows: string[];
  };
  n8n: {
    baseUrl: string;
    workflowPrefix: string;
  };
  clerk: {
    publishableKey: string;
    secretKey?: string; // Only in server env
  };
  metadata: {
    industry: string;
    employeeCount: string;
    primaryUseCase: string;
  };
}

// Tenant configurations
export const TENANTS: Record<string, TenantConfig> = {
  'discordant.kendev.co': {
    id: 'kendev',
    name: 'KenDev Development',
    domain: 'discordant.kendev.co',
    branding: {
      logo: '/logos/kendev.png',
      primaryColor: '#7364c0',
      secondaryColor: '#02264a',
      favicon: '/favicon.ico'
    },
    features: {
      calendar: true,
      research: true,
      phone: true,
      documents: true,
      customWorkflows: ['all']
    },
    n8n: {
      baseUrl: 'https://n8n.kendev.co/webhook',
      workflowPrefix: 'dev'
    },
    clerk: {
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!
    },
    metadata: {
      industry: 'Technology',
      employeeCount: '1-10',
      primaryUseCase: 'Development and Testing'
    }
  },
  
  'meet.nationalregistrationgroup.com': {
    id: 'nrg',
    name: 'National Registration Group',
    domain: 'meet.nationalregistrationgroup.com',
    branding: {
      logo: '/logos/nrg.png',
      primaryColor: '#003366',
      secondaryColor: '#FF6B35',
      favicon: '/nrg-favicon.ico'
    },
    features: {
      calendar: true,
      research: true,
      phone: true,
      documents: true,
      customWorkflows: [
        'doc-prep-assistant',
        'lead-research-scoring',
        'doc-ready-notification',
        'follow-up-automation',
        'compliance-checker',
        'client-onboarding'
      ]
    },
    n8n: {
      baseUrl: 'https://n8n.kendev.co/webhook',
      workflowPrefix: 'nrg'
    },
    clerk: {
      publishableKey: process.env.NEXT_PUBLIC_NRG_CLERK_KEY!
    },
    metadata: {
      industry: 'Business Services',
      employeeCount: '10-50',
      primaryUseCase: 'Document Preparation and B2B Sales'
    }
  }
};

// Get current tenant based on domain
export function getCurrentTenant(): TenantConfig {
  const domain = typeof window !== 'undefined' 
    ? window.location.hostname 
    : process.env.NEXT_PUBLIC_DOMAIN || 'discordant.kendev.co';
    
  return TENANTS[domain] || TENANTS['discordant.kendev.co'];
}

// Get tenant-specific workflow routes
export function getTenantWorkflows(tenantId: string) {
  const tenant = Object.values(TENANTS).find(t => t.id === tenantId);
  if (!tenant) return [];
  
  // Return workflow configurations based on tenant's custom workflows
  return tenant.features.customWorkflows;
} 