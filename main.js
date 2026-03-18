// Initialize AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });
});

// Header Scroll Effect
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('py-2', 'bg-alerce-black/80');
        header.classList.remove('py-4');
    } else {
        header.classList.remove('py-2', 'bg-alerce-black/80');
        header.classList.add('py-4');
    }
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuLinks = document.querySelectorAll('.menu-link');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Diagnostic Tool Logic
const diagContainer = document.getElementById('diag-container');
const diagSteps = document.querySelectorAll('.diag-step');
const diagOptions = document.querySelectorAll('.diag-option');
const diagResult = document.getElementById('diag-result');
const diagMessage = document.getElementById('diag-message');

let currentStep = 1;
let scores = {
    low: 0,
    mid: 0,
    high: 0
};
let diagnosticAnswers = [];

diagOptions.forEach(option => {
    option.addEventListener('click', () => {
        const value = option.getAttribute('data-value');
        const questionText = option.parentElement.previousElementSibling.innerText;
        const answerText = option.innerText;

        scores[value]++;
        diagnosticAnswers.push({
            step: currentStep,
            question: questionText,
            answer: answerText,
            value: value
        });

        const currentStepDiv = document.getElementById(`diag-step-${currentStep}`);
        currentStepDiv.classList.add('hidden');

        currentStep++;

        const nextStepDiv = document.getElementById(`diag-step-${currentStep}`);

        if (nextStepDiv) {
            nextStepDiv.classList.remove('hidden');
            nextStepDiv.classList.add('animate-fade-in');
        } else {
            // All questions answered, show contact step instead of direct results
            showContactStep();
        }
    });
});

function showContactStep() {
    const contactStep = document.getElementById('diag-step-4');
    if (contactStep) {
        contactStep.classList.remove('hidden');
        contactStep.classList.add('animate-fade-in');
    }
}

// Handle Diagnostic Contact Form
const diagContactForm = document.getElementById('diag-contact-form');
if (diagContactForm) {
    diagContactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('diag-name').value.trim();
        const email = document.getElementById('diag-email').value.trim();
        const phone = document.getElementById('diag-phone').value.trim();
        const errorDiv = document.getElementById('diag-error');
        const submitBtn = diagContactForm.querySelector('button[type="submit"]');

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            errorDiv.classList.remove('hidden');
            document.getElementById('diag-email').classList.add('border-red-500');
            return;
        } else {
            errorDiv.classList.add('hidden');
            document.getElementById('diag-email').classList.remove('border-red-500');
        }

        // Final Recommendation logic
        let recommendation = "";
        if (scores.low >= 2) {
            recommendation = "Tu negocio tiene un alto potencial de crecimiento mediante la automatización básica. Estás perdiendo tiempo valioso en tareas que hoy mismo podríamos delegar a la tecnología.";
        } else if (scores.high >= 2) {
            recommendation = "¡Vas por excelente camino! Tu enfoque ahora debería ser la Inteligencia de Negocios avanzada para encontrar ese 1% de mejora que escala tus resultados exponencialmente.";
        } else {
            recommendation = "Estás en una etapa intermedia ideal para integrar tus sistemas. La falta de conexión entre tus datos es lo que te impide tener una visión clara de hacia dónde ir.";
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerText = 'Procesando...';

        try {
            // 👇 ARIANA: Usando variables de entorno para mayor seguridad y flexibilidad
            const n8nDiagnosticUrl = import.meta.env.VITE_N8N_DIAGNOSTIC_WEBHOOK_URL;

            await fetch(n8nDiagnosticUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    phone: phone || "No proporcionado.",
                    answers: diagnosticAnswers,
                    recommendation,
                    scores,
                    date: new Date().toISOString()
                })
            });

            // Enviar evento de Lead a GA4
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'generate_lead', {
                    'event_category': 'engagement',
                    'form_name': 'diagnostico_cro'
                });
            }

            // Hide contact step and show results
            document.getElementById('diag-step-4').classList.add('hidden');
            showResult(recommendation);
        } catch (error) {
            console.error('Error enviando diagnóstico:', error);
            // Even if error, show results so we don't block user, but maybe show alert later
            document.getElementById('diag-step-4').classList.add('hidden');
            showResult(recommendation);
        }
    });
}

function showResult(message) {
    diagResult.classList.remove('hidden');
    diagResult.classList.add('animate-fade-in');
    diagMessage.innerText = message;
}

// Simple CSS Animation injection for the diagonal tool
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
    }
    
    /* Cursor Glow Effect */
    #cursor-glow {
        pointer-events: none;
        position: fixed;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(0,0,0,0) 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        transition: opacity 0.3s ease;
        opacity: 0;
    }
    
    @media (max-width: 768px) {
        #cursor-glow { display: none; }
    }
`;
document.head.appendChild(style);

// Cursor Glow Logic
const cursorGlow = document.createElement('div');
cursorGlow.id = 'cursor-glow';
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
});

// Scroll to Top Logic
const scrollTopBtn = document.getElementById('scroll-top-btn');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
            scrollTopBtn.classList.add('opacity-100', 'translate-y-0');
        } else {
            scrollTopBtn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
            scrollTopBtn.classList.remove('opacity-100', 'translate-y-0');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// N8N Form Submission Logic
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = document.getElementById('email-input').value;
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnContent = submitBtn.innerHTML;

        // Disable button & show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

        try {
            // 👇 ARIANA: Usando variables de entorno
            const n8nWebhookUrl = import.meta.env.VITE_N8N_GENERAL_WEBHOOK_URL;

            const response = await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Aquí enviamos el email, el origen y la fecha actual
                body: JSON.stringify({
                    email: emailInput,
                    source: 'Landing Page Alerce - Footer',
                    date: new Date().toISOString()
                })
            });

            if (response.ok) {
                formMessage.textContent = '¡Gracias! Nos pondremos en contacto pronto.';
                formMessage.className = 'absolute top-full mt-2 left-0 text-xs text-alerce-green block animate-fade-in';
                contactForm.reset();
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error enviando formulario:', error);
            formMessage.textContent = 'Hubo un error. Por favor, intenta de nuevo o escríbenos por WhatsApp.';
            formMessage.className = 'absolute top-full mt-2 left-0 text-xs text-red-500 block animate-fade-in';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;

            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                formMessage.classList.add('hidden');
                formMessage.classList.remove('block', 'animate-fade-in');
            }, 5000);
        }
    });
}

console.log('Equipo Alerce Landing Page Loaded');

// Track GA4 Clicks on WhatsApp Links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href*="wa.me"]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'click_whatsapp', {
                    'event_category': 'engagement',
                    'button_text': btn.innerText ? btn.innerText.trim() : 'WhatsApp Icon'
                });
            }
        });
    });
});
