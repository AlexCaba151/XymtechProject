// Portfolio functionality
document.addEventListener('DOMContentLoaded', function() {
    initPortfolio();
});

let uploadedImages = [];

const defaultPortfolioItems = [
    {
        src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
        alt: 'Centro de datos empresarial',
        title: 'Infraestructura de Data Center',
        description: 'Implementación completa de centro de datos para empresa multinacional'
    },
    {
        src: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=600&h=400&fit=crop',
        alt: 'Configuración de seguridad de red',
        title: 'Sistema de Seguridad Avanzado',
        description: 'Despliegue de firewall y sistemas de monitoreo 24/7'
    },
    {
        src: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop',
        alt: 'Instalación de fibra óptica',
        title: 'Red de Fibra Óptica',
        description: 'Cableado estructurado de fibra óptica para campus corporativo'
    },
    {
        src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
        alt: 'Desarrollo de software',
        title: 'Aplicación Empresarial',
        description: 'Sistema ERP personalizado con integración de múltiples plataformas'
    },
    {
        src: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop',
        alt: 'Diseño de red WiFi',
        title: 'Red WiFi Empresarial',
        description: 'Cobertura WiFi 6 para edificio corporativo de 20 pisos'
    },
    {
        src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop',
        alt: 'Sistema de cámaras de seguridad',
        title: 'Videovigilancia IP',
        description: 'Sistema de seguridad con reconocimiento facial y IA'
    }
];

function initPortfolio() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    const imageUpload = document.getElementById('image-upload');
    const uploadArea = document.getElementById('upload-area');
    
    if (portfolioGrid) {
        renderPortfolio();
    }
    
    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }
    
    if (uploadArea) {
        // Drag and drop functionality
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('drop', handleDrop);
        uploadArea.addEventListener('dragleave', handleDragLeave);
    }
}

function renderPortfolio() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (!portfolioGrid) return;
    
    portfolioGrid.innerHTML = '';
    
    // Render default portfolio items
    defaultPortfolioItems.forEach((item, index) => {
        const portfolioItem = createPortfolioItem(item, false, index);
        portfolioGrid.appendChild(portfolioItem);
    });
    
    // Render uploaded images
    uploadedImages.forEach((item, index) => {
        const portfolioItem = createPortfolioItem(item, true, index);
        portfolioGrid.appendChild(portfolioItem);
    });
    
    // Add "Add More" card
    const addMoreCard = createAddMoreCard();
    portfolioGrid.appendChild(addMoreCard);
}

function createPortfolioItem(item, isUploaded = false, index = 0) {
    const portfolioItem = document.createElement('div');
    portfolioItem.className = 'portfolio-item fade-in-up';
    
    const removeButton = isUploaded ? `
        <button class="portfolio-remove" onclick="removeUploadedImage(${index})" aria-label="Eliminar imagen">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    ` : '';
    
    const title = isUploaded ? `<span class="mono-text green">[NUEVO_PROYECTO]</span>` : item.title;
    const description = isUploaded ? 'Proyecto personalizado agregado al portafolio' : item.description;
    
    portfolioItem.innerHTML = `
        ${removeButton}
        <div class="portfolio-image">
            <img src="${item.src}" alt="${item.alt}" loading="lazy">
        </div>
        <div class="portfolio-content">
            <h3 class="portfolio-title">${title}</h3>
            <p class="portfolio-description">${description}</p>
        </div>
    `;
    
    return portfolioItem;
}

function createAddMoreCard() {
    const addMoreCard = document.createElement('div');
    addMoreCard.className = 'portfolio-add';
    
    addMoreCard.innerHTML = `
        <label for="image-upload" class="portfolio-add-content">
            <div class="portfolio-add-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.828 14.828C15.5 14.156 16 13.207 16 12.172C16 10.343 14.657 8.828 13 8.828C11.343 8.828 10 10.343 10 12.172C10 13.207 10.5 14.156 11.172 14.828" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 12C21 16.418 16.97 20 12 20C7.03 20 3 16.418 3 12C3 7.582 7.03 4 12 4C16.97 4 21 7.582 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div>
                <p class="portfolio-add-text">Agregar Más Proyectos</p>
                <p class="portfolio-add-hint mono-text">[CLICK_TO_UPLOAD]</p>
            </div>
        </label>
    `;
    
    return addMoreCard;
}

function handleImageUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    Array.from(files).forEach(file => {
        if (!validTypes.includes(file.type)) {
            window.XymTech.showToast(
                'Formato No Válido',
                `El archivo ${file.name} no es un formato de imagen válido.`,
                'error'
            );
            return;
        }
        
        if (file.size > maxSize) {
            window.XymTech.showToast(
                'Archivo Muy Grande',
                `El archivo ${file.name} excede el tamaño máximo de 5MB.`,
                'error'
            );
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = {
                src: e.target.result,
                alt: `Proyecto personalizado ${uploadedImages.length + 1}`,
                title: 'Nuevo Proyecto',
                description: 'Proyecto personalizado agregado al portafolio'
            };
            
            uploadedImages.push(imageData);
            renderPortfolio();
        };
        reader.readAsDataURL(file);
    });
    
    if (files.length > 0) {
        window.XymTech.showToast(
            'Imágenes Cargadas',
            `${files.length} imagen(es) agregada(s) al portafolio.`,
            'success'
        );
    }
    
    // Reset input
    event.target.value = '';
}

function removeUploadedImage(index) {
    uploadedImages.splice(index, 1);
    renderPortfolio();
    
    window.XymTech.showToast(
        'Imagen Eliminada',
        'La imagen ha sido removida del portafolio.',
        'success'
    );
}

// Drag and Drop functionality
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.5)';
    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.7)';
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.borderColor = '';
    e.currentTarget.style.background = '';
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    e.currentTarget.style.borderColor = '';
    e.currentTarget.style.background = '';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const imageUpload = document.getElementById('image-upload');
        if (imageUpload) {
            // Create a new FileList-like object
            const dt = new DataTransfer();
            Array.from(files).forEach(file => dt.items.add(file));
            imageUpload.files = dt.files;
            
            // Trigger the change event
            const event = new Event('change', { bubbles: true });
            imageUpload.dispatchEvent(event);
        }
    }
}

// Make functions globally available
window.removeUploadedImage = removeUploadedImage;

// Initialize portfolio image lazy loading
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', initLazyLoading);