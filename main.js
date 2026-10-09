// Equipo Alerce — Main JS
import AOS from 'aos';
import 'aos/dist/aos.css';

document.addEventListener('DOMContentLoaded', () => {
    // Marcar que JS está habilitado para animaciones progresivas
    document.documentElement.classList.add('js');

    // Inicializar AOS suave
    try {
        AOS.init({
            duration: 650,
            easing: 'ease-out-cubic',
            once: true,
            offset: 30
        });
    } catch (e) {
        console.warn('AOS init skipped:', e);
    }

    initScrollReveal();
    initHeaderScroll();
    initMobileMenu();
    initDiagnosticEngine();
    initAnalyticsTracking();
});

// 1. Scroll reveal progresivo con IntersectionObserver
function initScrollReveal() {
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (!revealEls.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
}

// 2. Header con clase is-scrolled al hacer scroll
function initHeaderScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;

    const checkScroll = () => {
        if (window.scrollY > 24) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
}

// 3. Menú Mobile
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

// 4. Motor del Cuestionario de Diagnóstico y Conexión con Supabase
function initDiagnosticEngine() {
    // Configuración del Webhook y API Key
    const WEBHOOK_URL = import.meta.env.VITE_DIAGNOSTIC_WEBHOOK_URL || 'https://viqeohixvjnlbnjiafgn.supabase.co/functions/v1/webhook-landing-diagnostic';
    const API_KEY = import.meta.env.VITE_DIAGNOSTIC_API_KEY || 'alerce-landing-diag-2026';

    // Elementos del DOM
    const stepElements = {
        1: document.getElementById('step-q1'),
        2: document.getElementById('step-q2'),
        3: document.getElementById('step-q3'),
        4: document.getElementById('step-q4'),
        5: document.getElementById('step-contact'),
        6: document.getElementById('step-result')
    };

    const backBtn = document.getElementById('diag-back-btn');
    const stepCounter = document.getElementById('diag-step-counter');
    const progressBar = document.getElementById('diag-progress-bar');
    const headerNav = document.getElementById('diag-header-nav');
    const contactForm = document.getElementById('diag-contact-form');
    const submitBtn = document.getElementById('diag-submit-btn');
    const errorBox = document.getElementById('diag-error-box');
    const errorText = document.getElementById('diag-error-text');
    const retryBtn = document.getElementById('diag-retry-btn');
    const restartBtn = document.getElementById('diag-restart-btn');

    // Elementos de pantalla de resultado
    const resultCategory = document.getElementById('diag-result-category');
    const resultSummary = document.getElementById('diag-result-summary');
    const resultAction = document.getElementById('diag-result-action');
    const whatsappBtn = document.getElementById('diag-whatsapp-btn');

    // Estado del diagnóstico
    const state = {
        currentStep: 1,
        answers: {
            q1_problem: '',
            q2_current_method: '',
            q3_impact: '',
            q4_priority: ''
        },
        isSubmitting: false
    };

    // Mapeo de respuestas por paso
    const stepAnswerMap = {
        1: 'q1_problem',
        2: 'q2_current_method',
        3: 'q3_impact',
        4: 'q4_priority'
    };

    // Navegar a un paso específico
    function goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > 6) return;

        // Ocultar todos los pasos
        Object.values(stepElements).forEach(el => {
            if (el) el.classList.add('hidden');
        });

        // Mostrar el paso actual
        const targetStepEl = stepElements[stepNumber];
        if (targetStepEl) {
            targetStepEl.classList.remove('hidden');
            targetStepEl.classList.add('animate-fade-in');
        }

        state.currentStep = stepNumber;

        // Actualizar barra de progreso y contador
        if (stepNumber <= 4) {
            if (headerNav) headerNav.classList.remove('hidden');
            if (stepCounter) stepCounter.textContent = `Pregunta ${stepNumber} de 4`;
            if (progressBar) progressBar.style.width = `${stepNumber * 25}%`;
            if (backBtn) {
                if (stepNumber === 1) {
                    backBtn.classList.add('hidden');
                } else {
                    backBtn.classList.remove('hidden');
                }
            }
        } else if (stepNumber === 5) {
            // Paso de contacto
            if (headerNav) headerNav.classList.remove('hidden');
            if (stepCounter) stepCounter.textContent = 'Orientación lista';
            if (progressBar) progressBar.style.width = '100%';
            if (backBtn) backBtn.classList.remove('hidden');
        } else if (stepNumber === 6) {
            // Pantalla final de resultado
            if (headerNav) headerNav.classList.add('hidden');
        }

        // Si volvemos a un paso con respuesta previa, marcarla visualmente
        if (stepNumber <= 4 && targetStepEl) {
            const currentAnswerKey = stepAnswerMap[stepNumber];
            const currentSelectedValue = state.answers[currentAnswerKey];
            const currentButtons = targetStepEl.querySelectorAll('.diag-option-btn');
            
            currentButtons.forEach(btn => {
                if (btn.getAttribute('data-answer') === currentSelectedValue) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
            });
        }
    }

    // Configurar listeners de opciones en pasos 1 a 4
    document.querySelectorAll('.diag-option-btn').forEach(button => {
        button.addEventListener('click', () => {
            const step = parseInt(button.getAttribute('data-step'), 10);
            const answerText = button.getAttribute('data-answer');
            const answerKey = stepAnswerMap[step];

            if (answerKey) {
                state.answers[answerKey] = answerText;
            }

            // Resaltar visualmente
            const parent = button.closest('.diag-step');
            if (parent) {
                parent.querySelectorAll('.diag-option-btn').forEach(b => b.classList.remove('selected'));
            }
            button.classList.add('selected');

            // Avanzar automáticamente tras breve feedback visual (150ms)
            setTimeout(() => {
                goToStep(step + 1);
            }, 150);
        });
    });

    // Botón "Volver a la pregunta anterior"
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (state.currentStep > 1 && !state.isSubmitting) {
                goToStep(state.currentStep - 1);
            }
        });
    }

    // Cálculo determinístico local de diagnóstico (Fallback)
    function calculateLocalDiagnosis(answers) {
        const priority = answers.q4_priority || '';
        const problem = answers.q1_problem || '';

        if (priority.includes('Liberar tiempo') || problem.includes('repetitivas')) {
            return {
                category: 'Recuperar tiempo',
                summary: 'Hay tareas cotidianas que podrían simplificarse de raíz para que vos y tu equipo dediquen tiempo a lo que realmente mueve el negocio.',
                action: 'Mapear las tareas repetitivas que hoy consumen la mayor cantidad de horas semanales para sistematizarlas con circuitos prácticos.'
            };
        } else if (priority.includes('información más clara') || problem.includes('repartida')) {
            return {
                category: 'Ordenar la información',
                summary: 'Tu desafío principal no es generar más datos, sino tenerlos centralizados, limpios y accesibles sin depender de planillas cruzadas.',
                action: 'Centralizar fuentes dispersas en un esquema de registro único y accesible para decidir con datos al día.'
            };
        } else if (priority.includes('Mejorar los controles') || problem.includes('decisiones')) {
            return {
                category: 'Mejorar el control',
                summary: 'El negocio funciona y puede ganar previsibilidad inmediata, reduciendo errores y eliminando revisiones dobles innecesarias.',
                action: 'Definir puntos clave de control y validaciones automáticas para no tener que revisar manualmente cada comprobante o dato.'
            };
        } else {
            return {
                category: 'Preparar la próxima etapa',
                summary: 'La forma en que venías trabajando te trajo hasta acá. Es el momento justo de darle estructura para seguir creciendo sin depender de una sola persona.',
                action: 'Estandarizar tareas cotidianas en flujos sencillos que permitan delegar con tranquilidad y sostener el ritmo del negocio.'
            };
        }
    }

    // Renderizar resultados en pantalla
    function renderDiagnosisResult(diagData) {
        const cat = diagData.diagnosis_category || diagData.category || 'Recuperar tiempo';
        const sum = diagData.diagnosis_summary || diagData.summary || '';
        const act = diagData.recommended_action || diagData.action || '';

        if (resultCategory) resultCategory.textContent = cat;
        if (resultSummary) resultSummary.textContent = sum;
        if (resultAction) resultAction.textContent = act;

        // Configurar mensaje directo a WhatsApp con la categoría obtenida
        if (whatsappBtn) {
            const message = `Hola Equipo Alerce, completé el diagnóstico en su web. Mi resultado fue "${cat}" y me gustaría conversar sobre las oportunidades de mejora en mi negocio.`;
            whatsappBtn.href = `https://wa.me/542915394413?text=${encodeURIComponent(message)}`;
        }

        // Avanzar a la pantalla de resultados
        goToStep(6);
    }

    // Manejo de Envío del Formulario de Contacto
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (state.isSubmitting) return;

            const nameInput = document.getElementById('diag-name');
            const emailInput = document.getElementById('diag-email');
            const businessInput = document.getElementById('diag-business');
            const consentInput = document.getElementById('diag-consent');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
            const business = businessInput ? businessInput.value.trim() : '';
            const consent = consentInput ? consentInput.checked : true;

            // Validación de Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                if (errorBox && errorText) {
                    errorText.textContent = 'Por favor, ingresá un correo electrónico válido.';
                    errorBox.classList.remove('hidden');
                }
                if (emailInput) emailInput.focus();
                return;
            }

            // Ocultar error previo
            if (errorBox) errorBox.classList.add('hidden');

            // Estado de carga
            state.isSubmitting = true;
            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Ver mi orientación';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <svg class="animate-spin h-5 w-5 text-ink inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analizando respuestas...</span>
                `;
            }

            // Diagnóstico calculado localmente
            const localDiag = calculateLocalDiagnosis(state.answers);

            // Construir Payload según la especificación técnica de la Edge Function
            const payload = {
                contact: {
                    name: name,
                    email: email,
                    business_name: business
                },
                answers: {
                    q1_problem: state.answers.q1_problem,
                    q2_current_method: state.answers.q2_current_method,
                    q3_impact: state.answers.q3_impact,
                    q4_priority: state.answers.q4_priority
                },
                diagnosis: {
                    diagnosis_category: localDiag.category,
                    diagnosis_summary: localDiag.summary,
                    recommended_action: localDiag.action
                },
                tracking: {
                    source: 'equipo_alerce_web',
                    form_name: 'diagnostico_inicial',
                    submitted_at: new Date().toISOString(),
                    consent_marketing: consent
                }
            };

            try {
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-alerce-api-key': API_KEY
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok || !data.ok) {
                    throw new Error(data.message || data.error || 'Error en la respuesta del servidor');
                }

                // Disparo de Evento en GA4
                if (typeof window.gtag === 'function') {
                    window.gtag('event', 'generate_lead', {
                        event_category: 'engagement',
                        form_name: 'diagnostico_inicial',
                        diagnosis_category: data.diagnosis?.diagnosis_category || localDiag.category
                    });
                }

                // Priorizar el diagnóstico devuelto por la Edge Function
                const finalDiagnosis = data.diagnosis && data.diagnosis.diagnosis_category 
                    ? data.diagnosis 
                    : localDiag;

                renderDiagnosisResult(finalDiagnosis);

            } catch (err) {
                console.error('Error al enviar diagnóstico al CRM:', err);
                
                // Si la red falló, permitir ver el resultado local para no bloquear la experiencia de usuario
                if (typeof window.gtag === 'function') {
                    window.gtag('event', 'generate_lead', {
                        event_category: 'engagement',
                        form_name: 'diagnostico_inicial_fallback',
                        diagnosis_category: localDiag.category
                    });
                }
                renderDiagnosisResult(localDiag);

            } finally {
                state.isSubmitting = false;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                }
            }
        });
    }

    // Reintento manual ante error
    if (retryBtn && contactForm) {
        retryBtn.addEventListener('click', () => {
            contactForm.dispatchEvent(new Event('submit', { cancelable: true }));
        });
    }

    // Reiniciar diagnóstico
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            state.answers = {
                q1_problem: '',
                q2_current_method: '',
                q3_impact: '',
                q4_priority: ''
            };
            document.querySelectorAll('.diag-option-btn').forEach(btn => btn.classList.remove('selected'));
            if (contactForm) contactForm.reset();
            goToStep(1);
        });
    }

    // Iniciar en el paso 1
    goToStep(1);
}

// 5. Tracking de clics en WhatsApp para analítica
function initAnalyticsTracking() {
    document.querySelectorAll('a[href*="wa.me"]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'click_whatsapp', {
                    event_category: 'engagement',
                    button_text: btn.textContent ? btn.textContent.trim() : 'WhatsApp'
                });
            }
        });
    });
}
