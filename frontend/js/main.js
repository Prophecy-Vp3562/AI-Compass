let allTools = [];
let savedTools = JSON.parse(localStorage.getItem('savedTools') || '[]');

// DOM Elements
const featuredGrid = document.getElementById('featuredGrid');
const newestGrid = document.getElementById('newestGrid');
const topRatedGrid = document.getElementById('topRatedGrid');
const openSourceGrid = document.getElementById('openSourceGrid');
const searchResultsGrid = document.getElementById('searchResultsGrid');
const sectionTitle = document.getElementById('sectionTitle');

const btnFeatured = document.getElementById('btnFeatured');
const btnNewest = document.getElementById('btnNewest');
const btnTopRated = document.getElementById('btnTopRated');
const btnOpenSource = document.getElementById('btnOpenSource');
const btnFree = document.getElementById('btnFree');
const btnPremium = document.getElementById('btnPremium');

const searchInput = document.getElementById('searchInput');
const searchDropdown = document.getElementById('searchDropdown');

// Top Nav Elements
const navExplore = document.getElementById('navExplore');
const navCategories = document.getElementById('navCategories');
const btnSavedTools = document.getElementById('btnSavedTools');

function updateTopNavActive(activeId) {
    [navExplore, navCategories, btnSavedTools].forEach(nav => {
        if (!nav) return;
        if (nav.id === activeId) {
            nav.className = nav.id === 'btnSavedTools' 
                ? "text-white font-bold border-b-2 border-[#00d4ff] pb-1 font-headline flex items-center gap-1.5 cursor-pointer"
                : "text-white font-bold border-b-2 border-[#00d4ff] pb-1 font-headline cursor-pointer";
        } else {
            nav.className = nav.id === 'btnSavedTools'
                ? "text-white/60 hover:text-white transition-colors font-headline flex items-center gap-1.5 cursor-pointer"
                : "text-white/60 hover:text-white transition-colors font-headline cursor-pointer";
        }
    });
}

// Initial Load
async function loadInitialTools() {
    try {
        const response = await fetch('/api/tools');
        allTools = await response.json();
        renderActiveTab();
    } catch (err) {
        console.error("Failed to fetch initial tools:", err);
    }
}

function renderToolCard(tool) {
    if (tool.isNew) {
        const isSaved = savedTools.includes(tool.id);
        const fillStyle = isSaved ? "style=\"font-variation-settings: 'FILL' 1;\"" : "style=\"font-variation-settings: 'FILL' 0;\"";
        const textColor = isSaved ? "text-primary" : "text-white/20";
        
        return `<div class="group flex flex-col glass-card rounded-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,212,255,0.1)]">
            <div class="relative h-56 flex items-center justify-center bg-gradient-to-br ${tool.gradient || 'from-indigo-900/40 to-black'} overflow-hidden relative">
                ${tool.img ? `<div class="absolute inset-0 bg-[url('${tool.img}')] bg-cover bg-center opacity-20"></div>` : ''}
                <span class="material-symbols-outlined text-6xl text-${tool.color || 'primary'}/80 z-10">${tool.icon || 'star'}</span>
                <div class="absolute top-4 right-4 bg-${tool.color || 'primary'}/20 backdrop-blur-md px-3 py-1 rounded-full border border-${tool.color || 'primary'}/30 z-10">
                    <span class="text-[10px] font-bold text-${tool.color || 'primary'} uppercase tracking-widest">${tool.pricing || 'Freemium'}</span>
                </div>
            </div>
            <div class="p-6 flex flex-col flex-grow">
                <div class="flex items-center gap-2 mb-2"><h3 class="font-headline font-bold text-xl">${tool.name}</h3></div>
                <p class="text-on-surface-variant text-sm line-clamp-2 mb-6 h-10">${tool.description}</p>
                <div class="flex flex-wrap gap-2 mb-8"><span class="px-2 py-1 rounded bg-white/5 text-[10px] font-medium text-white/60">${tool.category}</span></div>
                <div class="mt-auto flex items-center justify-between">
                    <a href="${tool.link}" target="_blank" class="text-primary text-sm font-bold flex items-center gap-2 group/btn">Visit Site <span class="material-symbols-outlined text-lg transition-transform group-hover/btn:translate-x-1">arrow_forward</span></a>
                    <span class="material-symbols-outlined ${textColor} hover:text-primary cursor-pointer transition-colors" ${fillStyle} onclick="toggleSave('${tool.id}', this)">bookmark</span>
                </div>
            </div>
        </div>`;
    } else {
        const isSaved = savedTools.includes(tool.id);
        const fillStyle = isSaved ? "style=\"font-variation-settings: 'FILL' 1;\"" : "style=\"font-variation-settings: 'FILL' 0;\"";
        const textColor = isSaved ? "text-primary" : "text-white/20";
        
        return `<div class="group flex flex-col glass-card rounded-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,212,255,0.1)]">
            <div class="relative h-56 overflow-hidden">
                <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="${tool.img}" alt="${tool.name}"/>
                <div class="absolute top-4 right-4 bg-${tool.color || 'primary'}/20 backdrop-blur-md px-3 py-1 rounded-full border border-${tool.color || 'primary'}/30 z-10">
                    <span class="text-[10px] font-bold text-${tool.color || 'primary'} uppercase tracking-widest">${tool.pricing || 'Freemium'}</span>
                </div>
            </div>
            <div class="p-6 flex flex-col flex-grow z-20">
                <div class="flex items-center gap-2 mb-2">
                    <h3 class="font-headline font-bold text-xl">${tool.name}</h3>
                </div>
                <p class="text-on-surface-variant text-sm line-clamp-2 mb-6 h-10">${tool.description}</p>
                <div class="flex flex-wrap gap-2 mb-8">
                    <span class="px-2 py-1 rounded bg-white/5 text-[10px] font-medium text-white/60">${tool.category}</span>
                </div>
                <div class="mt-auto flex items-center justify-between">
                    <a href="${tool.link}" target="_blank" class="text-primary text-sm font-bold flex items-center gap-2 group/btn">
                        Visit Site <span class="material-symbols-outlined text-lg transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                    </a>
                    <span class="material-symbols-outlined ${textColor} hover:text-primary cursor-pointer transition-colors" ${fillStyle} onclick="toggleSave('${tool.id}', this)">bookmark</span>
                </div>
            </div>
        </div>`;
    }
}

function hideAllGrids() {
    [featuredGrid, newestGrid, topRatedGrid, openSourceGrid, searchResultsGrid].forEach(grid => {
        if (grid) {
            grid.classList.add('hidden');
            grid.style.display = 'none';
        }
    });
}

function showGrid(grid) {
    if (grid) {
        hideAllGrids();
        grid.classList.remove('hidden');
        grid.style.display = 'grid';
        triggerStaggerAnimation(grid);
    }
}

function resetButtons() {
    [btnFeatured, btnNewest, btnTopRated, btnOpenSource].forEach(btn => {
        if(btn) btn.className = "filter-btn whitespace-nowrap px-4 py-1.5 rounded-full border border-white/10 hover:bg-white/5 text-sm font-medium transition-colors cursor-pointer";
    });
    if(btnFree) btnFree.className = "filter-btn whitespace-nowrap px-4 py-1.5 rounded-full border border-success/40 text-success hover:bg-success/10 text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer";
    if(btnPremium) btnPremium.className = "filter-btn whitespace-nowrap px-4 py-1.5 rounded-full border border-danger/40 text-danger hover:bg-danger/10 text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer";
}

function setActiveButton(btn) {
    resetButtons();
    if(btn) btn.className = "filter-btn whitespace-nowrap px-4 py-1.5 rounded-full bg-primary text-on-primary text-sm font-bold transition-colors shadow-[0_0_15px_rgba(0,212,255,0.3)] cursor-pointer flex items-center gap-1.5";
}

function triggerStaggerAnimation(grid) {
    if(!grid) return;
    const cards = grid.querySelectorAll('.glass-card');
    cards.forEach((card, index) => {
        card.classList.remove('animate-stagger');
        void card.offsetWidth; // trigger reflow
        card.style.animationDelay = `${index * 0.05}s`;
        card.classList.add('animate-stagger');
    });
}

// Category Filter SPA Logic
window.filterByCategory = (categoryName) => {
    // Clear search
    searchInput.value = '';
    searchDropdown.classList.add('hidden');
    resetButtons();

    // Filter tools
    const lowercaseQuery = categoryName.toLowerCase();
    const filteredTools = allTools.filter(tool => {
        const catMatch = tool.category && tool.category.toLowerCase().includes(lowercaseQuery);
        const legacyCatMatch = tool.cat && tool.cat.toLowerCase().includes(lowercaseQuery);
        return catMatch || legacyCatMatch;
    });

    sectionTitle.innerHTML = `<span class="w-12 h-0.5 bg-primary"></span> ${categoryName} Tools`;
    searchResultsGrid.innerHTML = filteredTools.length > 0 ? filteredTools.map(renderToolCard).join('') : '<p class="col-span-full text-center text-white/50 text-lg">No tools found in this category.</p>';
    showGrid(searchResultsGrid);
    updateTopNavActive('navCategories');
};

// Render Functions for Tabs
function renderActiveTab() {
    if (btnNewest && btnNewest.classList.contains('bg-primary')) {
        renderNewestTab();
    } else if (btnTopRated && btnTopRated.classList.contains('bg-primary')) {
        renderTopRatedTab();
    } else if (btnOpenSource && btnOpenSource.classList.contains('bg-primary')) {
        renderOpenSourceTab();
    } else if (btnFree && btnFree.classList.contains('bg-primary')) {
        renderFreeTab();
    } else if (btnPremium && btnPremium.classList.contains('bg-primary')) {
        renderPremiumTab();
    } else {
        renderFeaturedTab();
    }
}

function renderFeaturedTab() {
    setActiveButton(btnFeatured);
    sectionTitle.innerHTML = `<span class="w-12 h-0.5 bg-primary"></span> Featured Selections`;
    if(featuredGrid) featuredGrid.innerHTML = allTools.filter(t => !t.isNew).map(renderToolCard).join('');
    showGrid(featuredGrid);
    updateTopNavActive('navExplore');
}

function renderNewestTab() {
    setActiveButton(btnNewest);
    sectionTitle.innerHTML = `<span class="w-12 h-0.5 bg-primary"></span> Just Added (Newest AI Tools)`;
    if(newestGrid) newestGrid.innerHTML = allTools.filter(t => t.isNew).map(renderToolCard).join('');
    showGrid(newestGrid);
}

function renderTopRatedTab() {
    setActiveButton(btnTopRated);
    sectionTitle.innerHTML = `<span class="w-12 h-0.5 bg-primary"></span> Top Rated AI Tools`;
    if(topRatedGrid) topRatedGrid.innerHTML = allTools.filter(t => t.isTopRated).map(renderToolCard).join('');
    showGrid(topRatedGrid);
}

function renderOpenSourceTab() {
    setActiveButton(btnOpenSource);
    sectionTitle.innerHTML = `<span class="w-12 h-0.5 bg-primary"></span> Open Source Tools`;
    if(openSourceGrid) openSourceGrid.innerHTML = allTools.filter(t => t.isOpenSource).map(renderToolCard).join('');
    showGrid(openSourceGrid);
}

function renderFreeTab() {
    setActiveButton(btnFree);
    sectionTitle.innerHTML = `<span class="w-12 h-0.5 bg-primary"></span> Free Tools`;
    searchResultsGrid.innerHTML = allTools.filter(t => t.pricing && t.pricing.toLowerCase() === 'free').map(renderToolCard).join('');
    showGrid(searchResultsGrid);
}

function renderPremiumTab() {
    setActiveButton(btnPremium);
    sectionTitle.innerHTML = `<span class="w-12 h-0.5 bg-primary"></span> Premium Tools`;
    searchResultsGrid.innerHTML = allTools.filter(t => t.pricing && t.pricing.toLowerCase() === 'premium').map(renderToolCard).join('');
    showGrid(searchResultsGrid);
}

// Event Listeners for Tabs
if(btnFeatured) btnFeatured.addEventListener('click', renderFeaturedTab);
if(btnNewest) btnNewest.addEventListener('click', renderNewestTab);
if(btnTopRated) btnTopRated.addEventListener('click', renderTopRatedTab);
if(btnOpenSource) btnOpenSource.addEventListener('click', renderOpenSourceTab);
if(btnFree) btnFree.addEventListener('click', renderFreeTab);
if(btnPremium) btnPremium.addEventListener('click', renderPremiumTab);

// Profile Dropdown functionality
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

if(profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('hidden');
    });
}

document.getElementById('btnSavedTools')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (profileDropdown) profileDropdown.classList.add('hidden');
    renderSavedToolsTab();
    const sectionTitle = document.getElementById('sectionTitle');
    if (sectionTitle) sectionTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
    updateTopNavActive('btnSavedTools');
});

navExplore?.addEventListener('click', (e) => {
    e.preventDefault();
    renderFeaturedTab();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

navCategories?.addEventListener('click', (e) => {
    // Categories naturally scrolls to #categories because of the href in HTML
    updateTopNavActive('navCategories');
});

function toggleSave(id, element) {
    const index = savedTools.indexOf(id);
    if (index === -1) {
        savedTools.push(id);
        element.style.fontVariationSettings = "'FILL' 1";
        element.classList.add('text-primary');
        element.classList.remove('text-white/20');
    } else {
        savedTools.splice(index, 1);
        element.style.fontVariationSettings = "'FILL' 0";
        element.classList.add('text-white/20');
        element.classList.remove('text-primary');
    }
    localStorage.setItem('savedTools', JSON.stringify(savedTools));
}

function renderSavedToolsTab() {
    resetButtons();
    sectionTitle.innerHTML = `<span class="w-12 h-0.5 bg-primary"></span> Saved Tools`;
    const saved = allTools.filter(t => savedTools.includes(t.id));
    searchResultsGrid.innerHTML = saved.length > 0 ? saved.map(renderToolCard).join('') : '<p class="col-span-full text-center text-white/50 text-lg">No tools saved yet. Click the bookmark icon on any tool to save it here!</p>';
    showGrid(searchResultsGrid);
    updateTopNavActive('btnSavedTools');
}

// Category Scrolling
document.getElementById('btnScrollLeft')?.addEventListener('click', () => {
    document.getElementById('categoryContainer').scrollBy({ left: -300, behavior: 'smooth' });
});
document.getElementById('btnScrollRight')?.addEventListener('click', () => {
    document.getElementById('categoryContainer').scrollBy({ left: 300, behavior: 'smooth' });
});

// Search functionality
let searchTimeout;
document.addEventListener('click', (e) => {
    if (searchInput && searchDropdown && !searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.add('hidden');
        const searchOverlay = document.getElementById('searchOverlay');
        const searchContainer = document.getElementById('searchContainer');
        if (searchOverlay && searchContainer) {
            searchOverlay.classList.add('opacity-0');
            setTimeout(() => { if(searchOverlay.classList.contains('opacity-0')) searchOverlay.classList.add('hidden'); }, 300);
            searchContainer.classList.remove('scale-105', '-translate-y-2');
        }
    }
    if (profileDropdown && !profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
        profileDropdown.classList.add('hidden');
    }
});

if(searchInput) {
    searchInput.addEventListener('mousedown', (e) => {
        const wave = document.createElement('div');
        wave.classList.add('liquid-wave');
        const clickX = e.clientX, clickY = e.clientY;
        const maxDistance = Math.max(
            Math.hypot(clickX, clickY), Math.hypot(clickX - window.innerWidth, clickY),
            Math.hypot(clickX, clickY - window.innerHeight), Math.hypot(clickX - window.innerWidth, clickY - window.innerHeight)
        );
        wave.style.width = wave.style.height = `${maxDistance * 2}px`;
        wave.style.left = `${clickX}px`; wave.style.top = `${clickY}px`;
        document.body.appendChild(wave);
        wave.addEventListener('animationend', () => wave.remove());
    });

    searchInput.addEventListener('focus', () => {
        const searchOverlay = document.getElementById('searchOverlay');
        const searchContainer = document.getElementById('searchContainer');
        if (searchOverlay && searchContainer) {
            searchOverlay.classList.remove('hidden');
            setTimeout(() => searchOverlay.classList.remove('opacity-0'), 10);
            searchContainer.classList.add('scale-105', '-translate-y-2');
        }
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = e.target.value.trim();
            if (query !== '') {
                const sectionTitle = document.getElementById('sectionTitle');
                if (sectionTitle) sectionTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                searchDropdown.classList.add('hidden');
                const searchOverlay = document.getElementById('searchOverlay');
                const searchContainer = document.getElementById('searchContainer');
                if (searchOverlay && searchContainer) {
                    searchOverlay.classList.add('opacity-0');
                    setTimeout(() => { if(searchOverlay.classList.contains('opacity-0')) searchOverlay.classList.add('hidden'); }, 300);
                    searchContainer.classList.remove('scale-105', '-translate-y-2');
                }
                searchInput.blur();
            }
        }
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        clearTimeout(searchTimeout);
        
        if (query === '') {
            searchDropdown.classList.add('hidden');
            renderActiveTab();
            return;
        }

        searchTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const tools = await response.json();
                
                if (tools.length > 0) {
                    searchDropdown.innerHTML = tools.map(tool => `
                        <div class="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl cursor-pointer transition-colors group" onclick="document.getElementById('searchInput').value='${tool.name.replace(/'/g, "\\'")}'; document.getElementById('searchInput').dispatchEvent(new Event('input')); setTimeout(() => document.getElementById('searchInput').dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'})), 100);">
                            <span class="material-symbols-outlined text-${tool.color || 'primary'} text-xl group-hover:scale-110 transition-transform">${tool.icon || 'star'}</span>
                            <div class="flex flex-col">
                                <span class="text-white font-medium text-sm font-headline">${tool.name}</span>
                                <span class="text-white/50 text-xs">${tool.category || tool.cat || ''}</span>
                            </div>
                        </div>
                    `).join('');
                } else {
                    searchDropdown.innerHTML = '<div class="px-4 py-3 text-white/50 text-sm text-center">No tools found matching your search.</div>';
                }
                searchDropdown.classList.remove('hidden');
                
                sectionTitle.innerHTML = `<span class="w-12 h-0.5 bg-primary"></span> Search Results for "${query}"`;
                searchResultsGrid.innerHTML = tools.length > 0 ? tools.map(renderToolCard).join('') : '<p class="col-span-full text-center text-white/50 text-lg">No tools found matching your search.</p>';
                showGrid(searchResultsGrid);
                
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        }, 300);
    });
}

const str1 = "Discover the ";
const str2 = "Future of AI";
let typeIndex = 0;

function initTypewriter() {
    const p1 = document.getElementById('textPart1');
    const p2 = document.getElementById('textPart2');
    const cursor = document.getElementById('typeCursor');
    if(!p1 || !p2) return;
    
    function type() {
        if (typeIndex < str1.length) {
            p1.innerHTML += str1.charAt(typeIndex);
            typeIndex++;
            setTimeout(type, 70); // 70ms per character
        } else if (typeIndex < str1.length + str2.length) {
            p2.innerHTML += str2.charAt(typeIndex - str1.length);
            typeIndex++;
            setTimeout(type, 70);
        } else {
            setTimeout(() => { if(cursor) cursor.style.opacity = '0'; }, 3000);
        }
    }
    setTimeout(type, 300); // 300ms initial delay
}

// Init
window.addEventListener('DOMContentLoaded', () => {
    loadInitialTools();
    initTypewriter();
});
