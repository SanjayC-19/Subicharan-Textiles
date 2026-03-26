const fs = require('fs');
let code = fs.readFileSync('src/client/pages/HomePage.jsx', 'utf8');

// 1. Add Link import
code = code.replace("import { useEffect, useState, useRef } from 'react';", "import { useEffect, useState, useRef } from 'react';\nimport { Link } from 'react-router-dom';");

// 2. Remove states if present
code = code.replace(/ *?\/\/ Filters State[\s\S]*?const \[sortBy, setSortBy\] = useState\('newest'\);\n?/g, '');

// 3. Remove filteredAndSortedMaterials logic
code = code.replace(/ *?const filteredAndSortedMaterials[\s\S]*?return 0;\n *?\n? *?\n? *?\}\);\n?/g, '');

// 4. Transform maps & counts
code = code.replace(/\{filteredAndSortedMaterials\.map\(\(material\)/g, '{materials.slice(0, 8).map((material)');
code = code.replace(/filteredAndSortedMaterials\.length === 0/g, 'materials.length === 0');

// 5. Update hero link
code = code.replace(/<a\s+href="#materials"[\s\S]*?<\/a>/, '<Link to="/collections" className="group inline-flex items-center justify-center gap-3 bg-emerald-600 border border-emerald-600 text-white font-sans text-xs md:text-sm font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-300 rounded-sm hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"><span>View Collections</span><ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></Link>');

// 6. Remove Filter Bar completely
code = code.replace(/ *?\{\/\* Filters Bar \*\/\}\n[\s\S]*?<\/div>\n *?<\/div>\n *?<\/div>\n/, '');

fs.writeFileSync('src/client/pages/HomePage.jsx', code);
console.log('Done');
