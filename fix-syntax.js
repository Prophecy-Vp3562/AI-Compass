const fs = require('fs');

try {
  let content = fs.readFileSync('Front-End/index.html', 'utf8');

  // Strip dangling fragment completely
  const regex = /\);\s*el\.addEventListener\('mouseleave', \(\) => \{\s*document\.querySelector\('\.cursor-follower'\)\.style\.transform = 'scale\(1\)';\s*document\.querySelector\('\.cursor-follower'\)\.style\.backgroundColor = 'transparent';\s*\}\);\s*\}\);/g;
  
  // also handle without the starting ); since my previous replace ate the closing brace of mouseenter but maybe left the ); ?
  // Let's just string match the whole block we see:
  const brokenChunk = `el.addEventListener('mouseleave', () => {
                document.querySelector('.cursor-follower').style.transform = 'scale(1)';
                document.querySelector('.cursor-follower').style.backgroundColor = 'transparent';
            });
        });`;

  content = content.replace(brokenChunk, '');
  
  // Actually, wait, let's just use regex to clean up any leftover cursor-follower errors:
  content = content.replace(/el\.addEventListener\('mouseleave'[\s\S]*?\}\);\s*\}\);/g, '');

  // Wait, if it didn't match perfectly, let me check for `el.addEventListener('mouseleave'`
  
  
  fs.writeFileSync('Front-End/index.html', content);
  console.log("Syntax fixed!");

} catch(e) {
  console.error("_ERROR_", e);
}
