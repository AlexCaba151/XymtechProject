// Forms functionality
document.addEventListener('DOMContentLoaded', function() {
    initForms();
});

function initForms() {
    const contactForm = document.getElementById('contact-form');
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Initialize form validation
    initFormValidation();
}

async function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('contact-submit');
    const btnText = document.getElementById('contact-btn-text');
    
    if (!validateContactForm(form)) {
        return;
    }
    
    // Show loading state
    setLoadingState(submitBtn, btnText, '[TRANSMITIENDO...]');
    
    try {
        // Enviar formulario usando fetch
        const formData = new FormData(form);
        
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Show success message
            window.XymTech.showToast(
                'Mensaje Enviado',
                'Tu consulta ha sido procesada. Te contactaremos en menos de 24 horas.',
                'success'
            );
            
            // Reset form
            form.reset();
            clearAllFieldErrors(form);
        } else {
            throw new Error('Error en el envío');
        }
        
    } catch (error) {
        console.error('Contact form error:', error);
        
        window.XymTech.showToast(
            'Error del Sistema',
            'Fallo en la transmisión. Intenta nuevamente.',
            'error'
        );
    } finally {
        // Reset button state
        resetLoadingState(submitBtn, btnText, '[EJECUTAR_TRANSMISIÓN]');
    }
}

async function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = document.getElementById('newsletter-email');
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = document.getElementById('newsletter-btn-text');
    
    if (!validateEmail(emailInput.value)) {
        window.XymTech.showToast(
            'Email Inválido',
            'Por favor, ingresa un email válido.',
            'error'
        );
        return;
    }
    
    // Show loading state
    setLoadingState(submitBtn, btnText, '[...]');
    
    try {
        // Enviar formulario usando fetch
        const formData = new FormData(form);
        
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Show success message
            window.XymTech.showToast(
                'Suscripción Activa',
                'Acceso concedido a actualizaciones de seguridad.',
                'success'
            );
            
            // Reset form
            emailInput.value = '';
        } else {
            throw new Error('Error en la suscripción');
        }
        
    } catch (error) {
        console.error('Newsletter error:', error);
        
        window.XymTech.showToast(
            'Acceso Denegado',
            'Error en la suscripción. Reintenta.',
            'error'
        );
    } finally {
        // Reset button state
        resetLoadingState(submitBtn, btnText, '[HACK]');
    }
}

function validateContactForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Este campo es requerido');
            isValid = false;
        } else {
            clearFieldError(field);
            
            // Validate email field specifically
            if (field.type === 'email' && !validateEmail(field.value)) {
                showFieldError(field, 'Ingresa un email válido');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#ef4444';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.textContent = message;
    
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function clearAllFieldErrors(form) {
    const errorElements = form.querySelectorAll('.field-error');
    errorElements.forEach(error => error.remove());
    
    const fields = form.querySelectorAll('.form-input, .form-textarea');
    fields.forEach(field => {
        field.style.borderColor = '';
    });
}

function setLoadingState(button, textElement, loadingText) {
    button.disabled = true;
    button.classList.add('loading');
    if (textElement) {
        textElement.textContent = loadingText;
    }
}

function resetLoadingState(button, textElement, originalText) {
    button.disabled = false;
    button.classList.remove('loading');
    if (textElement) {
        textElement.textContent = originalText;
    }
}

function initFormValidation() {
    // Real-time validation for email fields
    const emailInputs = document.querySelectorAll('input[type="email"]');
    
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                showFieldError(this, 'Ingresa un email válido');
            } else {
                clearFieldError(this);
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value && validateEmail(this.value)) {
                clearFieldError(this);
            }
        });
    });
    
    // Real-time validation for required fields
    const requiredInputs = document.querySelectorAll('[required]');
    
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                showFieldError(this, 'Este campo es requerido');
            } else {
                clearFieldError(this);
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                clearFieldError(this);
            }
        });
    });
}

// Export functions for external use
window.XymTechForms = {
    validateEmail,
    showFieldError,
    clearFieldError
};