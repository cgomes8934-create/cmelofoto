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

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    }).format(value);
}

// Update service details
function updateServiceDetails() {
    if (!currentService) return;
    
    const service = servicesData[currentService];
    const hours = currentHours || service.minHours;
    const subtotal = service.hourlyRate * hours;
    
    photosDisplay.textContent = service.photos;
    hourlyRateDisplay.textContent = formatCurrency(service.hourlyRate);
    hoursDisplay.textContent = hours;
    subtotalDisplay.textContent = formatCurrency(subtotal);
    
    serviceDetailsSection.style.display = 'block';
    updateFinalPrice();
}

// Update final price
function updateFinalPrice() {
    if (!currentService) return;
    
    const service = servicesData[currentService];
    const hours = currentHours || service.minHours;
    const subtotal = service.hourlyRate * hours;
    const payment = paymentData[currentPayment];
    const finalPrice = subtotal * (1 + payment.modifier);
    
    finalPriceDisplay.textContent = finalPrice.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    paymentInfoDisplay.textContent = payment.description;
    priceResultSection.style.display = 'block';
}

// Handle service selection
function handleServiceSelect() {
    const selectedValue = serviceSelect.value;
    
    if (!selectedValue) {
        currentService = null;
        hoursInput.disabled = true;
        hoursInput.value = '';
        hoursInput.placeholder = 'Selecione o tipo de sessão primeiro';
        minHoursDisplay.textContent = '-';
        serviceDetailsSection.style.display = 'none';
        priceResultSection.style.display = 'none';
        return;
    }
    
    currentService = selectedValue;
    const service = servicesData[selectedValue];
    
    hoursInput.disabled = false;
    hoursInput.min = service.minHours;
    hoursInput.value = service.minHours;
    hoursInput.placeholder = `Mínimo ${service.minHours} horas`;
    minHoursDisplay.textContent = service.minHours;
    
    currentHours = service.minHours;
    updateServiceDetails();
}

// Handle hours input
function handleHoursInput() {
    if (!currentService) return;
    
    const service = servicesData[currentService];
    let inputHours = parseInt(hoursInput.value);
    
    if (inputHours < service.minHours) {
        inputHours = service.minHours;
        hoursInput.value = service.minHours;
    }
    
    currentHours = inputHours;
    updateServiceDetails();
}

// Handle payment selection
function handlePaymentSelect() {
    currentPayment = paymentSelect.value;
    updateFinalPrice();
}

// Initialize the application
function initApp() {
    initializeElements();
    
    // Add event listeners
    serviceSelect.addEventListener('change', handleServiceSelect);
    hoursInput.addEventListener('input', handleHoursInput);
    paymentSelect.addEventListener('change', handlePaymentSelect);
    
    // Set initial payment method
    currentPayment = paymentSelect.value;
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);