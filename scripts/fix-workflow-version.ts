#!/usr/bin/env node

/**
 * Fix Version Mismatch in Enhanced Business Intelligence AI Agent Workflow
 * Updates the workflow name to match the filename version or vice versa
 */

const fs = require('fs');
const path = require('path');

function updateWorkflowVersion() {
  const workflowPath = path.join(process.cwd(), 'docs/workflows/Enhanced Business Intelligence AI Agent v5.5.json');
  
  try {
    // Check if file exists
    if (!fs.existsSync(workflowPath)) {
      console.error('❌ Workflow file not found:', workflowPath);
      return;
    }

    // Read the current workflow
    const workflowContent = fs.readFileSync(workflowPath, 'utf8');
    const workflow: any = JSON.parse(workflowContent);
    
    console.log('📁 Current filename version: v5.5');
    console.log('📄 Current workflow name:', workflow.name);
    
    // Option 1: Update workflow name to match filename
    const updatedWorkflow = {
      ...workflow,
      name: 'Enhanced Business Intelligence AI Agent v5.5'
    };
    
    // Write back the corrected version
    fs.writeFileSync(workflowPath, JSON.stringify(updatedWorkflow, null, 2));
    
    console.log('✅ Updated workflow name to match filename: v5.5');
    console.log('📊 Workflow version consistency restored');
    
    // Option 2: Rename file to match workflow content (commented out)
    /*
    const newFilename = 'Enhanced Business Intelligence AI Agent v5.6.json';
    const newPath = path.join(path.dirname(workflowPath), newFilename);
    fs.renameSync(workflowPath, newPath);
    console.log('✅ Renamed file to match workflow content: v5.6');
    */
    
  } catch (error) {
    console.error('❌ Error fixing workflow version:', error);
  }
}

// Run the fix
if (require.main === module) {
  console.log('🔧 Fixing Enhanced Business Intelligence AI Agent version mismatch...');
  updateWorkflowVersion();
}

export { updateWorkflowVersion }; 