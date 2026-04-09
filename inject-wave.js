const fs = require('fs');

try {
  let content = fs.readFileSync('frontend/index.html', 'utf8');

  // Insert CSS if it doesn't already exist
  if (!content.includes('ripple-wave')) {
      const cssToInject = `
        @keyframes ripple-wave {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; filter: blur(0px); }
            100% { transform: translate(-50%, -50%) scale(50); opacity: 0; filter: blur(20px); }
        }
        .wave-effect {
            position: fixed;
            width: 50px;
            height: 50px;
            background: radial-gradient(circle, rgba(0,212,255,0.3) 0%, rgba(0,212,255,0) 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple-wave 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            z-index: 10000;
        }
    </style>`;
      content = content.replace('</style>', cssToInject);
  }

  // Insert JS
  if (!content.includes('wave.className = \'wave-effect\'')) {
      const jsToInject = `searchInput.addEventListener('click', (e) => {
            const wave = document.createElement('div');
            wave.className = 'wave-effect';
            wave.style.left = e.clientX + 'px';
            wave.style.top = e.clientY + 'px';
            document.body.appendChild(wave);
            
            setTimeout(() => {
                wave.remove();
            }, 1000);
        });

        searchInput.addEventListener('input'`;
      content = content.replace("searchInput.addEventListener('input'", jsToInject);
  }

  fs.writeFileSync('frontend/index.html', content);
  console.log("Wave effect injected successfully.");

} catch(e) {
  console.error("_ERROR_", e);
}
