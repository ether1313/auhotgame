/**
 * Au Hot Games - Main JavaScript
 * Premium Gaming Experience
 */

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initPopup();
    initProviderTabs();
    initSearch();
    initScrollEffects();
    initRTPAnimations();
    initMobileMenu();
    initGameCardLinks();

    // Set current year in footer
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/**
 * Carousel Functionality
 */
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let autoplayInterval;
    const autoplayDelay = 5000;

    function goToSlide(index) {
        // Handle wrapping
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentIndex = index;
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoplay();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            startAutoplay();
        });
    });

    // Pause on hover
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            startAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            startAutoplay();
        }
    });

    // Start autoplay
    startAutoplay();
}

/**
 * Popup Modal
 */
function initPopup() {
    const popup = document.getElementById('popup');
    const closeBtn = document.getElementById('popupClose');

    if (!popup) return;

    function showPopup() {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hidePopup() {
        popup.classList.remove('active');
        document.body.style.overflow = '';
        // Store in session so it doesn't show again
        sessionStorage.setItem('popupShown', 'true');
    }

    // Show popup after 2 seconds (only if not shown before in this session)
    if (!sessionStorage.getItem('popupShown')) {
        setTimeout(showPopup, 2000);
    }

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', hidePopup);
    }

    // Close on overlay click
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            hidePopup();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            hidePopup();
        }
    });
}

/**
 * Pagination Functionality
 */
function initPagination() {
    const gamesGrid = document.querySelector('.games-grid');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const paginationNumbers = document.getElementById('paginationNumbers');

    if (!gamesGrid || !prevBtn || !nextBtn) return;

    let currentPage = 1;
    let itemsPerPage = getItemsPerPage();

    // Responsive items per page
    function getItemsPerPage() {
        const width = window.innerWidth;
        if (width <= 768) {
            return 9;  // 3 columns x 3 rows
        } else {
            return 10; // 5 columns x 2 rows
        }
    }

    // Get visible (filtered) cards
    function getVisibleCards() {
        const allCards = Array.from(gamesGrid.querySelectorAll('.game-card'));
        return allCards.filter(card => !card.classList.contains('filtered-out'));
    }

    // Calculate total pages
    function getTotalPages() {
        const visibleCards = getVisibleCards();
        return Math.ceil(visibleCards.length / itemsPerPage);
    }

    // Show cards for current page
    function showPage(page) {
        const visibleCards = getVisibleCards();
        const totalPages = getTotalPages();

        // Validate page number
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        currentPage = page;

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Hide all cards first, then show only current page
        visibleCards.forEach((card, index) => {
            if (index >= startIndex && index < endIndex) {
                card.style.display = '';
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.4s ease forwards';
                card.style.animationDelay = `${(index - startIndex) * 30}ms`;
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        });

        // Update button states
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;

        // Update pagination numbers
        renderPaginationNumbers();
    }

    // Render pagination numbers using safe DOM methods
    function renderPaginationNumbers() {
        const totalPages = getTotalPages();
        // Clear existing children safely
        while (paginationNumbers.firstChild) {
            paginationNumbers.removeChild(paginationNumbers.firstChild);
        }

        if (totalPages <= 1) return;

        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        // First page + ellipsis
        if (startPage > 1) {
            paginationNumbers.appendChild(createPageButton(1));
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationNumbers.appendChild(ellipsis);
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            paginationNumbers.appendChild(createPageButton(i));
        }

        // Last page + ellipsis
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationNumbers.appendChild(ellipsis);
            }
            paginationNumbers.appendChild(createPageButton(totalPages));
        }
    }

    // Create page button element
    function createPageButton(pageNum) {
        const btn = document.createElement('button');
        btn.className = 'pagination-number' + (pageNum === currentPage ? ' active' : '');
        btn.textContent = pageNum;
        btn.addEventListener('click', () => showPage(pageNum));
        return btn;
    }

    // Event listeners
    prevBtn.addEventListener('click', () => showPage(currentPage - 1));
    nextBtn.addEventListener('click', () => showPage(currentPage + 1));

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newItemsPerPage = getItemsPerPage();
            if (newItemsPerPage !== itemsPerPage) {
                itemsPerPage = newItemsPerPage;
                currentPage = 1;
                showPage(1);
            }
        }, 250);
    });

    // Initial render
    showPage(1);

    // Expose functions for external use (filtering)
    window.paginationUpdate = () => {
        currentPage = 1;
        showPage(1);
    };
    window.getCurrentPage = () => currentPage;
    window.showPage = showPage;
}

/**
 * Provider Tabs Filtering
 */
function initProviderTabs() {
    const providerTabs = document.querySelectorAll('.provider-tab');
    const navLinks = document.querySelectorAll('.nav-link[data-provider]');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link[data-provider]');
    const gameCards = document.querySelectorAll('.game-card');
    const searchInput = document.getElementById('gameSearch');
    const searchBox = document.querySelector('.search-box');

    if (gameCards.length === 0) return;

    let currentProvider = 'jili';

    function filterByProvider(provider) {
        currentProvider = provider;

        // Clear search
        if (searchInput) {
            searchInput.value = '';
            searchBox?.classList.remove('has-value');
        }

        // Update active states
        providerTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.provider === provider);
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.provider === provider);
        });
        mobileNavLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.provider === provider);
        });

        // Show/hide cards based on provider
        gameCards.forEach(card => {
            const cardProvider = card.dataset.provider;
            if (cardProvider === provider) {
                card.style.display = '';
                card.classList.remove('filtered-out');
            } else {
                card.style.display = 'none';
                card.classList.add('filtered-out');
            }
        });
    }

    // Provider tab click events
    providerTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterByProvider(tab.dataset.provider);
        });
    });

    // Header nav link click events
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            filterByProvider(link.dataset.provider);

            // Scroll to games section
            const gamesSection = document.querySelector('.games-section');
            if (gamesSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = gamesSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Expose function for external use
    window.filterByProvider = filterByProvider;

    // Initial filter - show JILI games by default
    filterByProvider('jili');
}

/**
 * Game Search
 */
function initSearch() {
    const searchInput = document.getElementById('gameSearch');
    const searchClear = document.getElementById('searchClear');
    const searchBox = document.querySelector('.search-box');
    const gameCards = document.querySelectorAll('.game-card');
    const gamesGrid = document.querySelector('.games-grid');

    if (!searchInput) return;

    // Create no results message
    const noResultsHTML = `
        <div class="no-results" style="display: none;">
            <svg class="no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
                <path d="M8 8l6 6M14 8l-6 6"/>
            </svg>
            <p class="no-results-text">No games found</p>
            <p class="no-results-hint">Try a different search term</p>
        </div>
    `;
    gamesGrid.insertAdjacentHTML('beforeend', noResultsHTML);
    const noResults = gamesGrid.querySelector('.no-results');

    function performSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        let visibleCount = 0;

        // Update search box state
        if (searchTerm) {
            searchBox.classList.add('has-value');
        } else {
            searchBox.classList.remove('has-value');
        }

        // Mark cards as filtered-out (pagination will handle display)
        gameCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const provider = card.querySelector('.provider-badge')?.textContent.toLowerCase() || '';
            const matches = title.includes(searchTerm) || provider.includes(searchTerm);

            if (matches || !searchTerm) {
                card.classList.remove('filtered-out');
                visibleCount++;
            } else {
                card.classList.add('filtered-out');
                card.style.display = 'none';
            }
        });

        // Show/hide no results message
        if (visibleCount === 0 && searchTerm) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }

        // Reset filters and provider tabs to "All" when searching
        if (searchTerm) {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === 'all');
            });
            document.querySelectorAll('.provider-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.provider === 'all');
            });
            document.querySelectorAll('.nav-link[data-provider]').forEach(link => {
                link.classList.toggle('active', link.dataset.provider === 'all');
            });
        }

        // Reset pagination to page 1
        if (window.paginationUpdate) {
            window.paginationUpdate();
        }
    }

    // Search input event
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });

    // Clear button
    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            performSearch('');
            searchInput.focus();
        });
    }

    // Clear on Escape key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            performSearch('');
            searchInput.blur();
        }
    });
}

/**
 * Game Filters
 */
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const gameCards = document.querySelectorAll('.game-card');
    const searchInput = document.getElementById('gameSearch');
    const searchBox = document.querySelector('.search-box');
    const noResults = document.querySelector('.no-results');

    if (filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Clear search when filter is clicked
            if (searchInput) {
                searchInput.value = '';
                searchBox?.classList.remove('has-value');
            }
            if (noResults) {
                noResults.style.display = 'none';
            }

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Mark cards as filtered-out (pagination will handle display)
            gameCards.forEach(card => {
                const rtp = parseInt(card.dataset.rtp);
                const isFeatured = card.classList.contains('featured');
                let show = true;

                switch (filter) {
                    case 'high':
                        show = rtp >= 80;
                        break;
                    case 'featured':
                        show = isFeatured;
                        break;
                    default:
                        show = true;
                }

                if (show) {
                    card.classList.remove('filtered-out');
                } else {
                    card.classList.add('filtered-out');
                    card.style.display = 'none';
                }
            });

            // Reset pagination to page 1
            if (window.paginationUpdate) {
                window.paginationUpdate();
            }
        });
    });
}

/**
 * Scroll Effects
 */
function initScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.game-card, .article-card, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

/**
 * RTP Badge Animations
 */
function initRTPAnimations() {
    const rtpBadges = document.querySelectorAll('.rtp-badge');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateRTP(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    rtpBadges.forEach(badge => observer.observe(badge));
}

function animateRTP(badge) {
    const circle = badge.querySelector('.rtp-ring circle:last-child');
    const valueEl = badge.querySelector('.rtp-value');

    if (!circle || !valueEl) return;

    const targetValue = parseInt(valueEl.textContent);
    const duration = 1000;
    const startTime = performance.now();

    // Set initial state
    circle.style.strokeDasharray = '0, 100';
    valueEl.textContent = '0%';

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out cubic)
        const eased = 1 - Math.pow(1 - progress, 3);

        const currentValue = Math.round(targetValue * eased);

        circle.style.strokeDasharray = `${currentValue}, 100`;
        valueEl.textContent = `${currentValue}%`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

/**
 * Smooth scroll for navigation
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Add hover sound effect (optional - uncomment to enable)
 */
/*
const hoverSound = new Audio('sounds/hover.mp3');
hoverSound.volume = 0.1;

document.querySelectorAll('.game-card, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
        hoverSound.currentTime = 0;
        hoverSound.play().catch(() => {});
    });
});
*/

/**
 * Mobile Menu
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const closeBtn = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    const overlay = document.getElementById('mobileNavOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (!menuBtn || !mobileNav) return;

    function openMenu() {
        mobileNav.classList.add('active');
        if (overlay) overlay.classList.add('active');
        menuBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileNav.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        menuBtn.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Toggle menu on button click
    menuBtn.addEventListener('click', () => {
        if (mobileNav.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close on close button click
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }

    // Close on overlay click
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });

    // Handle mobile nav link clicks
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const provider = link.dataset.provider;

            // Update active state in mobile nav
            mobileNavLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Also update desktop nav links
            const desktopLinks = document.querySelectorAll('.nav-link');
            desktopLinks.forEach(l => {
                l.classList.toggle('active', l.dataset.provider === provider);
            });

            // Also update provider tabs if they exist
            const providerTabs = document.querySelectorAll('.provider-tab');
            providerTabs.forEach(tab => {
                tab.classList.toggle('active', tab.dataset.provider === provider);
            });

            // Filter games
            filterGames(provider);

            // Close menu
            closeMenu();

            // Scroll to games section
            const gamesSection = document.querySelector('.provider-section') || document.querySelector('.games-section');
            if (gamesSection) {
                gamesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Close menu on window resize if it becomes desktop size
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Helper function for mobile nav filtering
function filterGames(provider) {
    const gameCards = document.querySelectorAll('.game-card');

    gameCards.forEach(card => {
        if (provider === 'all' || card.dataset.provider === provider) {
            card.classList.remove('filtered-out');
        } else {
            card.classList.add('filtered-out');
        }
    });

    // Update pagination if it exists
    if (window.paginationUpdate) {
        window.paginationUpdate();
    }
}

/**
 * Game Card Random Landing Page Links
 */
function initGameCardLinks() {
    const landingPages = [
        'https://gucci9office.com/RFLANDINGPAGE1',
        'https://me99aus.net/RFLANDINGPAGE2',
        'https://pokemonau.vip/RFLADINGPAGE3',
        'https://kingbet9aus.com/RFLANDINGPAGE3',
        'https://bigpay77.net/RFLANDINGPAGE4',
        'https://bybid9.com/RFLANDINGPAGE5',
        'https://queen13au.com/RFLANDINGPAGE6',
        'https://micky13.com/RFLANDINGPAGE7',
        'https://winnie13.net/RFLANDINGPAGE8',
        'https://mrbean9.com/RFLANDINGPAGE9',
        'https://rolex9au.com/RFLANDINGPAGEE9',
        'https://ipay9aud.com/RFLANDINGPAGE11'
    ];

    function getRandomLandingPage() {
        const randomIndex = Math.floor(Math.random() * landingPages.length);
        return landingPages[randomIndex];
    }

    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.open(getRandomLandingPage(), '_blank');
        });
    });

    // All buttons (JOIN NOW, WIN NOW, PLAY FREE, CLAIM NOW)
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(getRandomLandingPage(), '_blank');
        });
    });

    // Footer links, social icons, and provider logos
    const footerLinks = document.querySelectorAll('.footer-col a, .social-link, .footer-providers-logos img');
    footerLinks.forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(getRandomLandingPage(), '_blank');
        });
    });

    // Hero carousel slides
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    carouselSlides.forEach(slide => {
        slide.style.cursor = 'pointer';
        slide.addEventListener('click', () => {
            window.open(getRandomLandingPage(), '_blank');
        });
    });
}

console.log('%c Au Hot Games ', 'background: linear-gradient(135deg, #00d4ff, #0099cc); color: #070b14; padding: 10px 20px; font-family: Orbitron, sans-serif; font-weight: bold; font-size: 14px; border-radius: 4px;');
console.log('%c Premium Gaming Experience ', 'color: #ffd700; font-family: sans-serif;');
