# GSA Modular Implementation Guide

## Quick Start: Converting Monolithic to Modular

### Step 1: Create Sub-Workflow Template

First, create a new workflow in n8n called "GSA-Research-Subflow":

```json
{
  "name": "GSA-Research-Subflow",
  "nodes": [],
  "connections": {},
  "active": true,
  "settings": {
    "executionOrder": "v1"
  }
}
```

### Step 2: Add Specialized Nodes

#### Node 1: Input Processor
```javascript
// Replace the complex input handling with focused validation
const input = $input.first().json;
const inputCompany = input.query || input.company || '';

if (!inputCompany || inputCompany.trim() === '') {
  throw new Error('Company name or URL is required');
}

return {
  originalInput: inputCompany,
  cleanCompany: inputCompany.trim(),
  focus: input.focus || 'complete',
  timestamp: new Date().toISOString(),
  processingStartTime: Date.now()
};
```

#### Node 2: Google Search Integration
```javascript
// Extracted from the original 337-line tool
const GOOGLE_API_KEY = 'AIzaSyB0rv0QDGWy7Gno284IybZVNB9BDJzSEPs';
const SEARCH_ENGINE_ID = '16331af4b4dc043f5';

const searchCompanyInfo = async (companyName) => {
  const searchQuery = encodeURIComponent(`${companyName} company about contact`);
  const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${searchQuery}&num=5`;
  
  const response = await fetch(searchUrl);
  const data = await response.json();
  
  if (data.items && data.items.length > 0) {
    const firstResult = data.items[0];
    return {
      title: firstResult.title,
      snippet: firstResult.snippet,
      link: firstResult.link,
      displayLink: firstResult.displayLink,
      searchSuccessful: true
    };
  }
  
  return { searchSuccessful: false };
};

const input = $input.first().json;
const searchResults = await searchCompanyInfo(input.cleanCompany);

// Extract company info from search results
let extractedCompany = input.cleanCompany;
let companyDomain = null;
let realBusinessInfo = null;

if (searchResults.searchSuccessful) {
  extractedCompany = searchResults.title.split(' - ')[0].split(' | ')[0] || extractedCompany;
  companyDomain = searchResults.displayLink;
  realBusinessInfo = searchResults.snippet;
}

return {
  ...input,
  extractedCompany,
  companyDomain,
  realBusinessInfo,
  searchResults: searchResults.searchSuccessful ? searchResults : null,
  searchStatus: searchResults.searchSuccessful ? 'success' : 'failed'
};
```

#### Node 3: Industry Classification
```javascript
// Separated industry detection logic
const detectBusinessType = (companyName, searchInfo) => {
  const searchText = (searchInfo || '').toLowerCase();
  const name = companyName.toLowerCase();
  const types = [];
  
  const serviceKeywords = {
    'staffing': ['staffing', 'recruiting', 'employment', 'workforce'],
    'medical': ['medical', 'health', 'healthcare', 'pharma'],
    'technology': ['tech', 'software', 'IT', 'cyber', 'computer'],
    'security': ['security', 'protection', 'guard', 'safety'],
    'consulting': ['consulting', 'advisory', 'solutions', 'services'],
    'manufacturing': ['manufacturing', 'factory', 'production'],
    'construction': ['construction', 'building', 'engineering'],
    'logistics': ['logistics', 'shipping', 'transport', 'delivery']
  };
  
  for (const [type, keywords] of Object.entries(serviceKeywords)) {
    if (keywords.some(keyword => name.includes(keyword) || searchText.includes(keyword))) {
      types.push(type);
    }
  }
  
  if (types.length === 0) {
    types.push('services');
  }
  
  return types;
};

const input = $input.first().json;
const businessTypes = detectBusinessType(input.extractedCompany, input.realBusinessInfo);
const primaryType = businessTypes[0] || 'services';

return {
  ...input,
  businessTypes,
  primaryType,
  industryClassified: true
};
```

#### Node 4: GSA Schedule Matching
```javascript
// Separated GSA schedule logic
const gsaScheduleOpportunities = {
  'consulting': { schedule: 'OASIS+', naics: ['541611', '541618'], opportunity: 'High' },
  'staffing': { schedule: 'Schedule 02', naics: ['561320', '561330'], opportunity: 'Very High' },
  'technology': { schedule: 'Schedule 70', naics: ['541511', '541512'], opportunity: 'Very High' },
  'medical': { schedule: 'Schedule 65', naics: ['621100', '423450'], opportunity: 'Excellent' },
  'security': { schedule: 'Schedule 84', naics: ['561612', '561621'], opportunity: 'Very High' },
  'services': { schedule: 'Multiple Options', naics: ['561000', '541000'], opportunity: 'Moderate' }
};

const input = $input.first().json;
const scheduleInfo = gsaScheduleOpportunities[input.primaryType] || gsaScheduleOpportunities['services'];

return {
  ...input,
  gsaSchedule: scheduleInfo.schedule,
  naicsCodes: scheduleInfo.naics,
  opportunityLevel: scheduleInfo.opportunity,
  scheduleMatched: true
};
```

#### Node 5: Contact Generation
```javascript
// Separated contact generation logic
const generateContacts = (companyName, domain) => {
  const realDomain = domain || `${companyName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.com`;
  
  return [
    {
      title: 'President/CEO',
      email_formats: [`president@${realDomain}`, `ceo@${realDomain}`, `info@${realDomain}`],
      priority: 'Primary Decision Maker'
    },
    {
      title: 'Business Development Director',
      email_formats: [`bizdev@${realDomain}`, `sales@${realDomain}`, `bd@${realDomain}`],
      priority: 'Key Contact'
    }
  ];
};

const input = $input.first().json;
const contacts = generateContacts(input.extractedCompany, input.companyDomain);

return {
  ...input,
  contacts,
  contactsGenerated: true
};
```

#### Node 6: Response Formatting
```javascript
// Separated response formatting logic
const input = $input.first().json;

let response = `🔍 **Real-Time GSA Analysis: ${input.extractedCompany}**\n\n`;

if (input.searchResults) {
  response += `**🌐 Company Website**: ${input.searchResults.link}\n`;
  response += `**📄 Business Profile**: ${input.realBusinessInfo}\n\n`;
}

response += `**✅ GSA Status**: POTENTIAL CANDIDATE\n` +
            `**📊 Opportunity Level**: ${input.opportunityLevel}\n` +
            `**🏭 Business Type**: ${input.primaryType.toUpperCase()}\n` +
            `**📋 Recommended Schedule**: ${input.gsaSchedule}\n` +
            `**🔢 NAICS Codes**: ${input.naicsCodes.join(', ')}\n\n`;

response += `**👥 KEY DECISION MAKERS**:\n`;
if (input.contacts && input.contacts.length > 0) {
  response += input.contacts.map(dm => `• **${dm.title}**: ${dm.email_formats[0]}`).join('\n');
}

response += `\n\n**🚀 NEXT STEPS**: Schedule consultation with NRG GSA specialists`;

return response;
```

### Step 3: Update Main Workflow

Replace the complex GSA Client Research Tool with a sub-workflow executor:

```json
{
  "parameters": {
    "workflowId": "GSA-Research-Subflow"
  },
  "id": "modular-gsa-research",
  "name": "GSA_Client_Research_Modular", 
  "type": "n8n-nodes-base.subWorkflow",
  "typeVersion": 1,
  "position": [1320, -80]
}
```

### Step 4: Testing Strategy

#### Unit Testing Each Node
1. **Input Processor**: Test with various company name formats
2. **Google Search**: Test API failures and rate limiting
3. **Industry Classification**: Test edge cases and unknown industries
4. **GSA Schedule Matching**: Verify all industry mappings
5. **Contact Generation**: Test domain extraction and email formats
6. **Response Formatting**: Test error states and missing data

#### Integration Testing
```javascript
// Test complete flow with known companies
const testCases = [
  "Gulf Aluminum Products",
  "Microsoft Corporation", 
  "Unknown Startup XYZ",
  "https://acmecorp.com"
];

testCases.forEach(async (company) => {
  const result = await executeSubWorkflow('GSA-Research-Subflow', { query: company });
  console.log(`Result for ${company}:`, result);
});
```

### Step 5: Performance Monitoring

Add monitoring to each node:

```javascript
// Add to each node for performance tracking
const nodeStartTime = Date.now();
// ... node logic ...
const nodeEndTime = Date.now();
console.log(`[${nodeName}] Processing time: ${nodeEndTime - nodeStartTime}ms`);
```

### Step 6: Error Recovery

Implement graceful degradation:

```javascript
// Add to each node after Input Processor
const input = $input.first().json;

if (input.error) {
  return input; // Pass through errors
}

try {
  // ... node logic ...
} catch (error) {
  console.error(`[${nodeName}] Error:`, error.message);
  return {
    ...input,
    [`${nodeName}Error`]: error.message,
    [`${nodeName}Failed`]: true
  };
}
```

### Step 7: Migration Checklist

- [ ] Create sub-workflow with all 8 nodes
- [ ] Test each node individually  
- [ ] Test complete workflow end-to-end
- [ ] Compare results with original tool
- [ ] Deploy to staging environment
- [ ] A/B test with production traffic
- [ ] Monitor performance metrics
- [ ] Complete migration to modular version

### Benefits Validation

After implementation, you should see:

**✅ Improved Debugging**
- Clear visibility into which stage failed
- Detailed logging at each step
- Easier to identify API vs logic issues

**✅ Better Maintainability** 
- Individual nodes can be updated independently
- Clear separation of concerns
- Easier onboarding for new developers

**✅ Enhanced Reliability**
- Isolated error handling
- Graceful degradation when components fail
- Better recovery mechanisms

**✅ Performance Gains**
- Optimized resource usage per node
- Parallel processing opportunities
- Reduced memory footprint

This modular approach transforms the complex 337-line monolithic tool into a maintainable, debuggable, and scalable solution while preserving all existing functionality. 