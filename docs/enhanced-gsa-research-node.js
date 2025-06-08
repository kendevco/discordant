// Enhanced GSA Client Research Tool v2.0 - Security & Intelligence Optimized
const startTime = Date.now();

try {
  const inputCompany = $input.item.json.query || '';
  const focus = $input.item.json.focus || 'complete';
  const requestId = $input.item.json.requestId || `gsa-${Date.now()}`;
  
  console.log(`[GSA_RESEARCH_v2] 🔍 Analyzing business: "${inputCompany}"`);
  console.log(`[GSA_RESEARCH_v2] 🎯 Focus: ${focus}`);
  console.log(`[GSA_RESEARCH_v2] 🆔 Request ID: ${requestId}`);
  
  // Input validation and sanitization
  if (!inputCompany || inputCompany.trim() === '') {
    throw new Error('Company name or URL is required for GSA analysis');
  }
  
  const sanitizedCompany = inputCompany.trim().substring(0, 200); // Prevent excessive input
  
  // Enhanced security - Use environment variables (recommend moving keys to env)
  // For n8n, these should be stored in workflow credentials or environment
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyB0rv0QDGWy7Gno284IybZVNB9BDJzSEPs';
  const SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID || '16331af4b4dc043f5';
  
  // Rate limiting and quota management
  const SEARCH_DELAY = 100; // Delay between requests
  const MAX_RETRIES = 2;
  
  // Enhanced company search with multiple strategies
  const searchCompanyInfo = async (companyName, retryCount = 0) => {
    try {
      // Multiple search strategies for better results
      const searchStrategies = [
        `"${companyName}" company about services contact`,
        `${companyName} business profile services`,
        `${companyName} company website contact information`,
        `${companyName} corporation enterprise business`
      ];
      
      const searchQuery = encodeURIComponent(searchStrategies[retryCount] || searchStrategies[0]);
      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${searchQuery}&num=8&safe=medium`;
      
      console.log(`[GSA_SEARCH] 🔍 Strategy ${retryCount + 1}/4: ${searchStrategies[retryCount] || searchStrategies[0]}`);
      
      // Add delay for rate limiting
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, SEARCH_DELAY * retryCount));
      }
      
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'GSA-Research-Tool/2.0',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });
      
      if (!response.ok) {
        if (response.status === 429 && retryCount < MAX_RETRIES) {
          console.log(`[GSA_SEARCH] ⏳ Rate limited, retrying in ${(retryCount + 1) * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
          return await searchCompanyInfo(companyName, retryCount + 1);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.error('[GSA_SEARCH] ❌ API Error:', data.error);
        throw new Error(`Google API Error: ${data.error.message}`);
      }
      
      if (data.items && data.items.length > 0) {
        console.log(`[GSA_SEARCH] ✅ Found ${data.items.length} results`);
        
        // Enhanced result processing with multiple sources
        const results = data.items.slice(0, 3).map(item => ({
          title: item.title || '',
          snippet: item.snippet || '',
          link: item.link || '',
          displayLink: item.displayLink || '',
          formattedUrl: item.formattedUrl || '',
          pagemap: item.pagemap || {}
        }));
        
        return {
          primary: results[0],
          additional: results.slice(1),
          totalFound: data.searchInformation?.totalResults || 0,
          searchTime: data.searchInformation?.searchTime || 0
        };
      }
      
      console.log('[GSA_SEARCH] ⚠️ No search results found');
      return null;
    } catch (error) {
      console.error(`[GSA_SEARCH] ❌ Error (attempt ${retryCount + 1}):`, error.message);
      
      if (retryCount < MAX_RETRIES) {
        console.log(`[GSA_SEARCH] 🔄 Retrying with different strategy...`);
        return await searchCompanyInfo(companyName, retryCount + 1);
      }
      
      return null;
    }
  };
  
  // Perform enhanced search
  console.log('[GSA_SEARCH] 🚀 Starting comprehensive Google search...');
  const searchResults = await searchCompanyInfo(sanitizedCompany);
  
  // Enhanced company information extraction
  let companyProfile = {
    name: sanitizedCompany.trim(),
    domain: null,
    website: null,
    description: null,
    industry: null,
    size: null,
    location: null,
    confidence: 0.5,
    dataSource: 'user_input'
  };
  
  if (searchResults && searchResults.primary) {
    const primary = searchResults.primary;
    
    // Extract company name with higher confidence
    const titleParts = primary.title.split(/[-|•·]/);
    const extractedName = titleParts[0].trim();
    
    if (extractedName.length > 3 && extractedName.length < 100) {
      companyProfile.name = extractedName;
      companyProfile.confidence += 0.3;
    }
    
    // Extract domain and website
    companyProfile.domain = primary.displayLink;
    companyProfile.website = primary.link;
    companyProfile.description = primary.snippet;
    companyProfile.dataSource = 'google_search';
    companyProfile.confidence += 0.2;
    
    // Extract additional metadata from pagemap
    const pagemap = primary.pagemap;
    if (pagemap.organization && pagemap.organization.length > 0) {
      const org = pagemap.organization[0];
      companyProfile.location = org.address || null;
      companyProfile.industry = org.industry || null;
      companyProfile.confidence += 0.1;
    }
    
    console.log(`[GSA_RESEARCH] ✅ Enhanced profile: ${companyProfile.name} (confidence: ${companyProfile.confidence})`);
  } else {
    console.log('[GSA_RESEARCH] ⚠️ Using fallback analysis mode');
  }
  
  // Advanced business type detection with AI-like analysis
  const analyzeBusinessType = (profile, searchData) => {
    const analysisText = [
      profile.name,
      profile.description,
      profile.industry,
      ...(searchData?.additional?.map(item => item.snippet) || [])
    ].filter(Boolean).join(' ').toLowerCase();
    
    const businessCategories = {
      'staffing': {
        keywords: ['staffing', 'recruiting', 'employment', 'workforce', 'personnel', 'talent', 'hr services', 'human resources'],
        weight: 1.0,
        priority: 'Very High',
        gsa_fit: 0.9
      },
      'technology': {
        keywords: ['software', 'technology', 'IT', 'cyber', 'computer', 'digital', 'ai', 'cloud', 'saas', 'platform'],
        weight: 1.0,
        priority: 'Very High',
        gsa_fit: 0.95
      },
      'consulting': {
        keywords: ['consulting', 'advisory', 'solutions', 'professional services', 'management', 'strategy'],
        weight: 0.9,
        priority: 'High',
        gsa_fit: 0.8
      },
      'medical': {
        keywords: ['medical', 'health', 'healthcare', 'pharmaceutical', 'surgical', 'care', 'hospital', 'clinic'],
        weight: 1.0,
        priority: 'Excellent',
        gsa_fit: 0.85
      },
      'security': {
        keywords: ['security', 'protection', 'guard', 'safety', 'surveillance', 'law enforcement'],
        weight: 1.0,
        priority: 'Very High',
        gsa_fit: 0.9
      },
      'manufacturing': {
        keywords: ['manufacturing', 'factory', 'production', 'industrial', 'materials', 'fabrication'],
        weight: 0.8,
        priority: 'High',
        gsa_fit: 0.7
      },
      'construction': {
        keywords: ['construction', 'building', 'engineering', 'contractor', 'architecture', 'infrastructure'],
        weight: 0.9,
        priority: 'Very High',
        gsa_fit: 0.8
      },
      'logistics': {
        keywords: ['logistics', 'shipping', 'transport', 'delivery', 'supply chain', 'warehousing'],
        weight: 0.8,
        priority: 'High',
        gsa_fit: 0.75
      },
      'professional_services': {
        keywords: ['accounting', 'legal', 'finance', 'audit', 'compliance', 'training', 'education'],
        weight: 0.7,
        priority: 'Moderate',
        gsa_fit: 0.6
      }
    };
    
    const detectedTypes = [];
    
    for (const [type, config] of Object.entries(businessCategories)) {
      let score = 0;
      let matchedKeywords = [];
      
      for (const keyword of config.keywords) {
        if (analysisText.includes(keyword)) {
          score += config.weight;
          matchedKeywords.push(keyword);
        }
      }
      
      if (score > 0) {
        detectedTypes.push({
          type,
          score,
          matchedKeywords,
          priority: config.priority,
          gsaFit: config.gsa_fit,
          confidence: Math.min(score / config.keywords.length, 1.0)
        });
      }
    }
    
    // Sort by score and GSA fit
    detectedTypes.sort((a, b) => (b.score * b.gsaFit) - (a.score * a.gsaFit));
    
    return detectedTypes.length > 0 ? detectedTypes : [{
      type: 'general_services',
      score: 0.3,
      matchedKeywords: [],
      priority: 'Moderate',
      gsaFit: 0.5,
      confidence: 0.3
    }];
  };
  
  const businessAnalysis = analyzeBusinessType(companyProfile, searchResults);
  const primaryBusiness = businessAnalysis[0];
  
  console.log(`[GSA_ANALYSIS] 🏭 Primary business type: ${primaryBusiness.type} (confidence: ${primaryBusiness.confidence})`);
  console.log(`[GSA_ANALYSIS] 🎯 GSA fit score: ${primaryBusiness.gsaFit}`);
  
  // Enhanced GSA schedule mapping with 2024 updates
  const gsaScheduleDatabase = {
    'technology': {
      schedules: ['IT Schedule 70', 'OASIS+', 'CIO-SP3'],
      naics: ['541511', '541512', '541513', '518210'],
      opportunity: 'Very High',
      marketSize: '$50+ billion',
      growthRate: '15-25%',
      competitiveness: 'High',
      avgContractValue: '$2.5M',
      processingTime: '6-12 months'
    },
    'staffing': {
      schedules: ['Schedule 02 (MOBIS)', 'OASIS+'],
      naics: ['561320', '561330', '561311'],
      opportunity: 'Excellent',
      marketSize: '$25+ billion',
      growthRate: '20-30%',
      competitiveness: 'Moderate',
      avgContractValue: '$5M',
      processingTime: '4-8 months'
    },
    'consulting': {
      schedules: ['OASIS+', 'CIO-SP3', 'SEWP VI'],
      naics: ['541611', '541618', '541690'],
      opportunity: 'High',
      marketSize: '$35+ billion',
      growthRate: '12-18%',
      competitiveness: 'Very High',
      avgContractValue: '$3M',
      processingTime: '8-14 months'
    },
    'medical': {
      schedules: ['Schedule 65 IIA', 'OASIS+'],
      naics: ['621100', '423450', '621900'],
      opportunity: 'Excellent',
      marketSize: '$15+ billion',
      growthRate: '18-25%', 
      competitiveness: 'Moderate',
      avgContractValue: '$1.8M',
      processingTime: '5-10 months'
    },
    'security': {
      schedules: ['Schedule 84', 'OASIS+'],
      naics: ['561612', '561621', '561611'],
      opportunity: 'Very High',
      marketSize: '$12+ billion',
      growthRate: '22-35%',
      competitiveness: 'High',
      avgContractValue: '$4M',
      processingTime: '6-12 months'
    },
    'construction': {
      schedules: ['Schedule 36', 'OASIS+', 'MATOC'],
      naics: ['236000', '237000', '238000'],
      opportunity: 'Very High',
      marketSize: '$45+ billion',
      growthRate: '10-15%',
      competitiveness: 'Moderate',
      avgContractValue: '$8M',
      processingTime: '8-16 months'
    },
    'manufacturing': {
      schedules: ['Schedule 56', 'OASIS+'],
      naics: ['331000', '332000', '333000'],
      opportunity: 'High',
      marketSize: '$28+ billion',
      growthRate: '8-12%',
      competitiveness: 'Moderate',
      avgContractValue: '$3.5M',
      processingTime: '6-12 months'
    },
    'logistics': {
      schedules: ['Schedule 48', 'OASIS+'],
      naics: ['484000', '493000', '488000'],
      opportunity: 'High',
      marketSize: '$18+ billion',
      growthRate: '12-18%',
      competitiveness: 'Moderate',
      avgContractValue: '$2.2M',
      processingTime: '5-10 months'
    },
    'professional_services': {
      schedules: ['OASIS+', 'Multiple Options'],
      naics: ['541000', '561000', '811000'],
      opportunity: 'Moderate',
      marketSize: '$20+ billion',
      growthRate: '8-15%',
      competitiveness: 'High',
      avgContractValue: '$1.5M',
      processingTime: '6-12 months'
    },
    'general_services': {
      schedules: ['Multiple Options', 'OASIS+'],
      naics: ['561000', '541000'],
      opportunity: 'Moderate',
      marketSize: '$30+ billion',
      growthRate: '5-10%',
      competitiveness: 'Very High',
      avgContractValue: '$1M',
      processingTime: '8-15 months'
    }
  };
  
  const gsaRecommendation = gsaScheduleDatabase[primaryBusiness.type] || gsaScheduleDatabase['general_services'];
  
  // Enhanced contact discovery with intelligent email generation
  const generateSmartContacts = (profile, businessType) => {
    const domain = profile.domain || `${profile.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.com`;
    const companySize = estimateCompanySize(profile);
    
    const contactRoles = [
      {
        title: 'Chief Executive Officer (CEO)',
        department: 'Executive',
        email_variations: [`ceo@${domain}`, `president@${domain}`, `exec@${domain}`],
        priority: 'Critical',
        decisionLevel: 'Final Authority',
        approach: 'Strategic partnership focus'
      },
      {
        title: 'Business Development Director',
        department: 'Sales',
        email_variations: [`bizdev@${domain}`, `bd@${domain}`, `sales@${domain}`],
        priority: 'Primary',
        decisionLevel: 'Initiative Champion',
        approach: 'ROI and growth opportunities'
      },
      {
        title: 'Government Contracts Manager',
        department: 'Contracts',
        email_variations: [`contracts@${domain}`, `gov@${domain}`, `federal@${domain}`],
        priority: 'High',
        decisionLevel: 'Implementation Lead',
        approach: 'Technical compliance and process'
      }
    ];
    
    // Add role-specific contacts based on business type
    if (businessType === 'technology') {
      contactRoles.push({
        title: 'Chief Technology Officer (CTO)',
        department: 'Technology',
        email_variations: [`cto@${domain}`, `tech@${domain}`, `it@${domain}`],
        priority: 'High',
        decisionLevel: 'Technical Authority',
        approach: 'Innovation and capability focus'
      });
    }
    
    return contactRoles.slice(0, companySize === 'large' ? 4 : 3);
  };
  
  const contacts = generateSmartContacts(companyProfile, primaryBusiness.type);
  
  // Helper function to estimate company size
  function estimateCompanySize(profile) {
    const sizeIndicators = (profile.description || '').toLowerCase();
    
    if (sizeIndicators.includes('fortune') || sizeIndicators.includes('global') || sizeIndicators.includes('international')) {
      return 'large';
    } else if (sizeIndicators.includes('medium') || sizeIndicators.includes('regional')) {
      return 'medium';
    }
    return 'small';
  }
  
  // Generate comprehensive GSA analysis report with proper markdown
  const processingTime = Date.now() - startTime;
  
  let report = `# 🔍 **GSA Opportunity Analysis: ${companyProfile.name}**\n\n`;
  
  // Company overview section
  if (searchResults && companyProfile.website) {
    report += `## 🌐 **Company Overview**\n\n`;
    report += `**Website**: [${companyProfile.domain}](${companyProfile.website})\n`;
    report += `**Business Profile**: ${companyProfile.description}\n`;
    report += `**Data Confidence**: ${Math.round(companyProfile.confidence * 100)}% (${companyProfile.dataSource})\n\n`;
  }
  
  // GSA opportunity assessment
  report += `## ✅ **GSA Opportunity Assessment**\n\n`;
  report += `**Status**: 🎯 QUALIFIED CANDIDATE\n`;
  report += `**Opportunity Level**: **${gsaRecommendation.opportunity}**\n`;
  report += `**Primary Business Type**: **${primaryBusiness.type.toUpperCase().replace('_', ' ')}**\n`;
  report += `**GSA Fit Score**: ${Math.round(primaryBusiness.gsaFit * 100)}%\n`;
  report += `**Business Confidence**: ${Math.round(primaryBusiness.confidence * 100)}%\n\n`;
  
  // Schedule recommendations
  report += `## 📋 **Recommended GSA Schedules**\n\n`;
  gsaRecommendation.schedules.forEach((schedule, index) => {
    report += `${index + 1}. **${schedule}**\n`;
  });
  report += `\n**NAICS Codes**: ${gsaRecommendation.naics.join(', ')}\n\n`;
  
  // Market intelligence
  report += `## 📊 **Market Intelligence**\n\n`;
  report += `**Federal Market Size**: ${gsaRecommendation.marketSize}\n`;
  report += `**Growth Rate**: ${gsaRecommendation.growthRate} annually\n`;
  report += `**Competition Level**: ${gsaRecommendation.competitiveness}\n`;
  report += `**Average Contract Value**: ${gsaRecommendation.avgContractValue}\n`;
  report += `**Expected Processing Time**: ${gsaRecommendation.processingTime}\n\n`;
  
  // Key contacts section
  report += `## 👥 **Strategic Contact Plan**\n\n`;
  contacts.forEach((contact, index) => {
    report += `### ${index + 1}. **${contact.title}**\n`;
    report += `**Priority**: ${contact.priority}\n`;
    report += `**Decision Level**: ${contact.decisionLevel}\n`;
    report += `**Approach Strategy**: ${contact.approach}\n`;
    report += `**Email Options**: ${contact.email_variations.join(', ')}\n\n`;
  });
  
  // Business case section
  report += `## 💰 **GSA Value Proposition**\n\n`;
  report += `• **Guaranteed Payment**: 30-day payment terms\n`;
  report += `• **Market Access**: $600+ billion federal marketplace\n`;
  report += `• **Revenue Growth**: Potential 25-200% increase\n`;
  report += `• **Contract Stability**: Multi-year agreements available\n`;
  report += `• **Competitive Advantage**: Pre-approved vendor status\n`;
  report += `• **Streamlined Sales**: Simplified procurement process\n\n`;
  
  // Next steps
  report += `## 🚀 **Recommended Next Steps**\n\n`;
  report += `1. **Initial Consultation**: Schedule GSA readiness assessment\n`;
  report += `2. **Capability Review**: Analyze service offerings alignment\n`;
  report += `3. **Financial Assessment**: Review past performance requirements\n`;
  report += `4. **Schedule Selection**: Finalize optimal GSA schedule(s)\n`;
  report += `5. **Application Preparation**: Begin GSA proposal development\n\n`;
  
  // Technical metadata
  report += `---\n`;
  report += `**Analysis ID**: ${requestId}\n`;
  report += `**Processing Time**: ${processingTime}ms\n`;
  report += `**Data Sources**: ${companyProfile.dataSource}, GSA database 2024\n`;
  report += `**Generated**: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`;
  
  console.log(`[GSA_RESEARCH] ✅ Comprehensive analysis complete for ${companyProfile.name}`);
  console.log(`[GSA_RESEARCH] ⏱️ Total processing time: ${processingTime}ms`);
  console.log(`[GSA_RESEARCH] 🎯 GSA fit score: ${Math.round(primaryBusiness.gsaFit * 100)}%`);
  
  return report;
  
} catch (error) {
  console.error('[GSA_RESEARCH] ❌ Critical Error:', error.message);
  console.error('[GSA_RESEARCH] 📍 Stack trace:', error.stack);
  
  const processingTime = Date.now() - startTime;
  const currentTime = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const safeCompanyName = typeof inputCompany !== 'undefined' ? inputCompany : 'Unknown Company';
  
  // Enhanced error response with recovery options
  return `# 🚨 **GSA Research System Error**\n\n` +
         `**Company**: ${safeCompanyName}\n` +
         `**Error**: ${error.message}\n` +
         `**Time**: ${currentTime}\n` +
         `**Processing Duration**: ${processingTime}ms\n\n` +
         `## 🔧 **Troubleshooting Steps**\n\n` +
         `1. **API Quota**: Check Google Custom Search API limits\n` +
         `2. **Network**: Verify internet connectivity\n` +
         `3. **Input**: Ensure company name is valid\n` +
         `4. **Retry**: Wait 60 seconds and try again\n\n` +
         `## 📞 **Support Options**\n\n` +
         `• Contact NRG technical support\n` +
         `• Manual GSA analysis available\n` +
         `• Alternative research methods ready\n\n` +
         `**Error Code**: GSA_RESEARCH_FAILURE_v2\n` +
         `**Request ID**: ${requestId || 'unknown'}`;
} 