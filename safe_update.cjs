const fs = require('fs');

let code = fs.readFileSync('src/client/pages/HomePage.jsx', 'utf8');

// 1. Add Link import
code = code.replace("import { useEffect, useState, useRef } from 'react';", "import { useEffect, useState, useRef } from 'react';\nimport { Link } from 'react-router-dom';");

// 2. Remove states
code = code.replace(/  \/\/ Filters State\n  const \[searchQuery.*?;\n  const \[selectedType.*?;\n  const \[sortBy.*?;\n/, '');

// 3. Remove filteredAndSortedMaterials logic
code = code.replace(/  const filteredAndSortedMaterials[\s\S]*?return 0;\n      \}\);\n/, '');

// 4. Update the map statements and empty states
code = code.split('filteredAndSortedMaterials.map').join('materials.slice(0, 8).map');
code = code.split('filteredAndSortedMaterials.length === 0').join('materials.length === 0');

// 5. Update hero link
code = code.replace(/<a\n\s+href="#materials"\n\s+className="group inline-flex items-center justify-center\s+gap-3 bg-emerald-600 border border-emerald-600 text-white font-sans text-xs\s+md:text-sm font-bold tracking-\[0\.15em\] uppercase px-8 py-4\n\s+hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-300\s+rounded-sm hover:shadow-\[0_0_30px_rgba\(16,185,129,0\.3\)\]"\n\s+>\n\s+<span>View Collections<\/span>\n\s+<ArrowRight size={16} className="group-hover:translate-x-1\s+transition-transform" \/>\n\s+<\/a>/g, '<Link to="/collections" className="group inline-flex items-center justify-center gap-3 bg-emerald-600 border border-emerald-600 text-white font-sans text-xs md:text-sm font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-300 rounded-sm hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"><span>View Collections</span><ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></Link>');

// 6. Delete the Filter Bar HTML block (safely finding indices)
const filterBarStart = code.indexOf('{/* Filters Bar */}');
if (filterBarStart !== -1) {
  // It ends before {loading ?
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

// 8. Add "View All Collections" after materials grid
const endGridIdx = code.indexOf('          )}', code.indexOf('materials.slice'));
if (endGridIdx !== -1) {
  const replacement = `          )}

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
  code = code.substring(0, endGridIdx) + replacement + code.substring(endGridIdx + 12);
}

fs.writeFileSync('src/client/pages/HomePage.jsx', code);
console.log('Update Complete.');
