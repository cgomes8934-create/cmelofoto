// Photography services data
const servicesData = {
    'ensaio-casal': {
        name: "ENSAIO DE CASAL",
        photos: 40,
        hourlyRate: 250,
        minHours: 2
    },
    'evento-corporativo': {
        name: "EVENTO CORPORATIVO", 
        photos: 75,
        hourlyRate: 130,
        minHours: 3
    },
    'corporativa-individual': {
        name: "CORPORATIVAS (INDIVIDUAL)",
        photos: 20,
        hourlyRate: 150,
        minHours: 2
    },
    'ensaio-familia': {
        name: "ENSAIO DE FAMÍLIA",
        photos: 50,
        hourlyRate: 350,
        minHours: 2
    },
    'eventos-gerais': {
        name: "EVENTOS (EXCETO CASAMENTOS)",
        photos: 200,
        hourlyRate: 150,
        minHours: 3
    }
};

const paymentData = {
    'pix': {
        name: "PIX",
        modifier: -0.10,
        description: "10% de desconto"
    },
    'credito-1x': {
        name: "Crédito 1x",
        modifier: 0,
        description: "Sem alteração"
    },
    'credito-3x': {
        name: "Crédito até 3x",
        modifier: 0.05,
        description: "5% de acréscimo"
    }
};

// DOM elements
let serviceSelect, hoursInput, paymentSelect;
let minHoursDisplay, serviceDetailsSection, priceResultSection;
let photosDisplay, hourlyRateDisplay, hoursDisplay, subtotalDisplay;
let finalPriceDisplay, paymentInfoDisplay;

// Current state
let currentService = null;
let currentHours = 0;
let currentPayment = 'pix';

// Initialize DOM elements
function initializeElements() {
    serviceSelect = document.getElementById('serviceSelect');
    hoursInput = document.getElementById('hoursInput');
    paymentSelect = document.getElementById('paymentSelect');
    minHoursDisplay = document.getElementById('minHoursDisplay');
    serviceDetailsSection = document.getElementById('serviceDetailsSection');
    priceResultSection = document.getElementById('priceResultSection');
    photosDisplay = document.getElementById('photosDisplay');
    hourlyRateDisplay = document.getElementById('hourlyRateDisplay');
    hoursDisplay = document.getElementById('hoursDisplay');
    subtotalDisplay = document.getElementById('subtotalDisplay');
    finalPriceDisplay = document.getElementById('finalPriceDisplay');
    paymentInfoDisplay = document.getElementById('paymentInfoDisplay');
}

// Format currency (Brazilian Real)
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Format price for display (without R$ symbol)
function formatPrice(value) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

// Handle service selection
function handleServiceChange(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const selectedService = serviceSelect.value;
    
    if (!selectedService) {
        resetCalculator();
        return;
    }
    
    currentService = servicesData[selectedService];
    
    // Update minimum hours
    minHoursDisplay.textContent = currentService.minHours;
    
    // Enable and configure hours input
    hoursInput.disabled = false;
    hoursInput.min = currentService.minHours;
    hoursInput.value = currentService.minHours;
    hoursInput.placeholder = `Mínimo ${currentService.minHours} horas`;
    
    currentHours = currentService.minHours;
    
    // Update displays
    updateServiceDetails();
    calculatePrice();
}

// Handle hours change
function handleHoursChange(event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (!currentService) return;
    
    let hours = parseInt(hoursInput.value);
    
    // Validate minimum hours
    if (hours < currentService.minHours) {
        hours = currentService.minHours;
        hoursInput.value = hours;
    }
    
    currentHours = hours || currentService.minHours;
    
    updateServiceDetails();
    calculatePrice();
}

// Handle payment method change
function handlePaymentChange(event) {
    event.preventDefault();
    event.stopPropagation();
    
    currentPayment = paymentSelect.value;
    calculatePrice();
}

// Update service details display
function updateServiceDetails() {
    if (!currentService) {
        serviceDetailsSection.style.display = 'none';
        return;
    }
    
    // Update all detail fields
    photosDisplay.textContent = currentService.photos;
    hourlyRateDisplay.textContent = formatCurrency(currentService.hourlyRate);
    hoursDisplay.textContent = currentHours;
    
    const subtotalValue = currentService.hourlyRate * currentHours;
    subtotalDisplay.textContent = formatCurrency(subtotalValue);
    
    serviceDetailsSection.style.display = 'block';
}

// Calculate and display final price
function calculatePrice() {
    if (!currentService || !currentHours) {
        priceResultSection.style.display = 'none';
        return;
    }
    
    const payment = paymentData[currentPayment];
    
    // Calculate base price
    const basePrice = currentService.hourlyRate * currentHours;
    
    // Apply payment modifier
    const finalPrice = basePrice + (basePrice * payment.modifier);
    
    // Update price display
    finalPriceDisplay.textContent = formatPrice(finalPrice);
    
    // Update payment info
    let infoText = payment.description;
    if (payment.modifier !== 0) {
        const originalText = `Valor original: ${formatCurrency(basePrice)}`;
        infoText = `${originalText} • ${payment.description}`;
    }
    paymentInfoDisplay.textContent = infoText;
    
    priceResultSection.style.display = 'block';
}

// Reset calculator to initial state
function resetCalculator() {
    currentService = null;
    currentHours = 0;
    
    // Reset hours input
    hoursInput.disabled = true;
    hoursInput.value = '';
    hoursInput.placeholder = 'Selecione o tipo de sessão primeiro';
    minHoursDisplay.textContent = '-';
    
    // Hide sections
    serviceDetailsSection.style.display = 'none';
    priceResultSection.style.display = 'none';
}

// Initialize the application
function initializeApp() {
    initializeElements();
    
    // Remove any existing event listeners to prevent duplicates
    if (serviceSelect) {
        serviceSelect.removeEventListener('change', handleServiceChange);
        serviceSelect.addEventListener('change', handleServiceChange);
    }
    
    if (hoursInput) {
        hoursInput.removeEventListener('input', handleHoursChange);
        hoursInput.removeEventListener('change', handleHoursChange);
        hoursInput.addEventListener('input', handleHoursChange);
        hoursInput.addEventListener('change', handleHoursChange);
    }
    
    if (paymentSelect) {
        paymentSelect.removeEventListener('change', handlePaymentChange);
        paymentSelect.addEventListener('change', handlePaymentChange);
    }
    
    // Set initial state
    resetCalculator();
    
    // Set default payment method
    if (paymentSelect) {
        paymentSelect.value = 'pix';
        currentPayment = 'pix';
    }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}