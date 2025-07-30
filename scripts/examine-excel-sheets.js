#!/usr/bin/env node

/**
 * EXAMINE ALL SHEETS in dim_users.xlsx
 * Check if there are more employees in other sheets
 */

const XLSX = require('xlsx');
const path = require('path');

console.log('🔍 EXAMINING ALL EXCEL SHEETS');
console.log('===============================\n');

function examineAllSheets() {
  const filePath = path.join(__dirname, '../data/dim_users.xlsx');
  const workbook = XLSX.readFile(filePath);
  
  console.log(`📋 Total sheets: ${workbook.SheetNames.length}`);
  console.log(`📄 Sheet names: ${workbook.SheetNames.join(', ')}\n`);
  
  workbook.SheetNames.forEach((sheetName, index) => {
    console.log(`📊 SHEET ${index + 1}: ${sheetName}`);
    console.log('='.repeat(30));
    
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`📈 Rows: ${data.length}`);
    
    if (data.length > 0) {
      console.log('📋 Columns:', Object.keys(data[0]).join(', '));
      console.log('👤 Sample data:');
      console.log(JSON.stringify(data[0], null, 2));
      
      if (data.length > 1) {
        console.log('\n👤 Second record:');
        console.log(JSON.stringify(data[1], null, 2));
      }
    } else {
      console.log('❌ No data found in this sheet');
    }
    
    console.log('\n');
  });
}

examineAllSheets();