const fs = require('fs');

const pristinePath = 'c:/Users/Rohith V/AppData/Roaming/Code/User/workspaceStorage/1e5417fd622cae8248a9af9e5525d55f/GitHub.copilot-chat/chat-session-resources/af7fc675-1591-4a0c-b676-3c60c4f76b57/call_MHxOcFBSajRPckZHSnc3dlBhdGU__vscode-1773641216063/content.txt';
let code = fs.readFileSync(pristinePath, 'utf8');

// 1. Add Link import
code = code.replace("import { useEffect, useState, useRef } from 'react';", "import { useEffect, useState, useRef } from 'react';\nimport { Link } from 'react-router-dom';");

// 2. Remove states
code = code.replace(/  \/\/ Filters State[\s\S]*?setSortBy\('newest'\);\n/, '');

// 3. Remove filteredAndSortedMaterials logic
code = code.replace(/  const filteredAndSortedMaterials[\s\S]*?return 0;\n      \}\);\n/, '');

// 4. Update the map statements and empty states
code = code.split('filteredAndSortedMaterials.map').join('materials.slice(0, 8).map');
code = code.split('filteredAndSortedMaterials.length === 0').join('materials.length === 0');

// 5. Update hero link
code = code.replace(/<a\n\s+href="#materials"[\s\S]*?<\/a>/, '<Link to="/collections" className="group inline-flex items-center justify-center gap-3 bg-emerald-600 border border-emerald-600 text-white font-sans text-xs md:text-sm font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-300 rounded-sm hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"><span>View Collections</span><ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></Link>');

// 6. Delete the Filter Bar HTML block (safely finding indices)
const filterBarStart = code.indexOf('{/* Filters Bar */}');
if (filterBarStart !== -1) {
  const loadingStart = code.indexOf('{loading ?', filterBarStart);
  if (loadingStart !== -1) {
    code = code.substring(0, filterBarStart) + code.substring(loadingStart);
  }
}

// 7. Delete the Clear Filters button safely
const clearFiltersIdx = code.indexOf('Clear Filters');
if (clearFiltersIdx !== -1) {
  const buttonStart = code.lastIndexOf('<button', clearFiltersIdx);
  const buttonEnd = code.indexOf('</button>', clearFiltersIdx) + 9;
  code = code.substring(0, buttonStart) + code.substring(buttonEnd);
}

// 8. Add View Collections
const gridEnd = code.lastIndexOf('</div>\n            )}');
if (gridEnd !== -1) {
  const injection = `</div>
            )}
            
            {!loading && materials.length > 0 && (
              <div className="mt-16 flex justify-center">
                <Link
                  to="/collections"
                  className="group inline-flex items-center justify-center gap-3 bg-white border border-zinc-200 text-zinc-900 font-sans text-sm font-bold tracking-[0.15em] uppercase px-10 py-5 hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-300 rounded-lg shadow-sm hover:shadow-md"
                >
                  <span>View All Collections</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-emerald-600" />
                </Link>
              </div>
            )}`;
  code = code.substring(0, gridEnd) + injection + code.substring(gridEnd + 22);
}

// Clean BOM if any
code = code.replace(/^\uFEFF/, '').replace(/^\uFFFE/, '');
fs.writeFileSync('src/client/pages/HomePage.jsx', code, 'utf8');
console.log('Hero and grid successfully replaced');
