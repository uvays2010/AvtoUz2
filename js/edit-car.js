document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.edit-car-section')) return;
    
    initEditCar();
});

// ===== CAR DATA =====
let currentCar = null;

// ===== INIT =====
function initEditCar() {
    const params = getUrlParams();
    const carId = params.id;
    
    if (!carId) {
        showNotification('Mashina ID si topilmadi', 'error');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
        return;
    }
    
    document.getElementById('carId').value = carId;
    loadCarData(carId);
    initFormSubmit();
    initDeleteCar();
    initImagePreview();
}

// ===== LOAD CAR DATA =====
function loadCarData(carId) {
    // In production: API.cars.getById(carId)
    // Demo data
    const car = getCarById(parseInt(carId));
    
    if (!car) {
        showNotification('Mashina topilmadi', 'error');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
        return;
    }
    
    currentCar = car;
    fillForm(car);
    showCurrentImages(car);
    selectFeatures(car.features);
}

function getCarById(id) {
    const cars = [
        {
            id: 1,
            brand: 'BMW',
            model: 'X5',
            year: 2024,
            price: 85000000,
            oldPrice: 92000000,
            category: 'SUV',
            fuelType: 'Dizel',
            transmission: 'Avtomat',
            engine: '3.0L',
            power: 286,
            color: 'Qora',
            mileage: 0,
            condition: 'Yangi',
            status: 'Aktiv',
            description: 'BMW X5 - hashamatli va kuchli SUV. Zamonaviy dizayn, yuqori sifatli interyer va kuchli dvigatel.',
            features: ['Parktronik', 'Kamera', 'Sunroof', 'Iqlim nazorati'],
            images: ['cars/bmw-x5-1.jpg', 'cars/bmw-x5-2.jpg']
        },
        {
            id: 2,
            brand: 'Mercedes-Benz',
            model: 'S-Class',
            year: 2024,
            price: 120000000,
            oldPrice: null,
            category: 'Sedan',
            fuelType: 'Benzin',
            transmission: 'Avtomat',
            engine: '4.0L',
            power: 503,
            color: 'Kumush',
            mileage: 0,
            condition: 'Yangi',
            status: 'Aktiv',
            description: 'Mercedes-Benz S-Class - eng hashamatli sedan.',
            features: ['MBUX', 'Massajli o\'rindiqlar', 'Burmester audio'],
            images: ['cars/mercedes-s-class-1.jpg']
        }
    ];
    
    return cars.find(c => c.id === id);
}

// ===== FILL FORM =====
function fillForm(car) {
    document.getElementById('carBrand').value = car.brand || '';
    document.getElementById('carModel').value = car.model || '';
    document.getElementById('carYear').value = car.year || '';
    document.getElementById('carCategory').value = car.category || '';
    document.getElementById('carPrice').value = car.price || '';
    document.getElementById('carOldPrice').value = car.oldPrice || '';
    document.getElementById('carFuel').value = car.fuelType || '';
    document.getElementById('carTransmission').value = car.transmission || '';
    document.getElementById('carEngine').value = car.engine || '';
    document.getElementById('carPower').value = car.power || '';
    document.getElementById('carColor').value = car.color || '';
    document.getElementById('carMileage').value = car.mileage || 0;
    document.getElementById('carCondition').value = car.condition || '';
    document.getElementById('carStatus').value = car.status || 'Aktiv';
    document.getElementById('carDescription').value = car.description || '';
}

// ===== SHOW CURRENT IMAGES =====
function showCurrentImages(car) {
    const container = document.getElementById('currentImages');
    if (!container) return;
    
    if (!car.images || car.images.length === 0) {
        container.innerHTML = '<p style="color: var(--gray-500); font-size: var(--font-sm);">Rasmlar mavjud emas</p>';
        return;
    }
    
    container.innerHTML = car.images.map(img => `
        <div class="current-image">
            <img src="../images/${img}" alt="${car.brand} ${car.model}">
            <button type="button" class="remove-image" onclick="removeImage('${img}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// ===== SELECT FEATURES =====
function selectFeatures(features) {
    if (!features) return;
    const checkboxes = document.querySelectorAll('#featuresGrid input[type="checkbox"]');
    checkboxes.forEach(cb => {
        if (features.includes(cb.value)) {
            cb.checked = true;
        }
    });
}

// ===== IMAGE PREVIEW =====
function initImagePreview() {
    document.getElementById('carImages').addEventListener('change', function(e) {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = '';
        const files = Array.from(this.files);
        files.forEach(file => {
            if (file.size > 5 * 1024 * 1024) {
                showNotification(`"${file.name}" hajmi 5MB dan katta`, 'warning');
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.cssText = 'width:100px;height:100px;object-fit:cover;border-radius:8px;margin:5px;border:2px solid #e9ecef;';
                preview.appendChild(img);
            }
            reader.readAsDataURL(file);
        });
    });
}

// ===== REMOVE IMAGE =====
function removeImage(imageName) {
    if (confirm('Bu rasmni o\'chirishni xohlaysizmi?')) {
        if (currentCar) {
            currentCar.images = currentCar.images.filter(img => img !== imageName);
            showCurrentImages(currentCar);
            showNotification('Rasm o\'chirildi', 'info');
        }
    }
}

// ===== FORM SUBMIT =====
function initFormSubmit() {
    document.getElementById('editCarForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const id = parseInt(document.getElementById('carId').value);
        const brand = document.getElementById('carBrand').value;
        const model = document.getElementById('carModel').value.trim();
        const year = document.getElementById('carYear').value;
        const category = document.getElementById('carCategory').value;
        const price = document.getElementById('carPrice').value;
        const oldPrice = document.getElementById('carOldPrice').value;
        const fuel = document.getElementById('carFuel').value;
        const transmission = document.getElementById('carTransmission').value;
        const engine = document.getElementById('carEngine').value.trim();
        const power = document.getElementById('carPower').value;
        const color = document.getElementById('carColor').value.trim();
        const mileage = document.getElementById('carMileage').value || 0;
        const condition = document.getElementById('carCondition').value;
        const status = document.getElementById('carStatus').value;
        const description = document.getElementById('carDescription').value.trim();
        
        // Get features
        const features = [];
        document.querySelectorAll('#featuresGrid input:checked').forEach(cb => {
            features.push(cb.value);
        });
        
        // Validate
        if (!brand) {
            showNotification('Iltimos, brendni tanlang', 'warning');
            document.getElementById('carBrand').focus();
            return;
        }
        
        if (!model) {
            showNotification('Iltimos, modelni kiriting', 'warning');
            document.getElementById('carModel').focus();
            return;
        }
        
        if (!year) {
            showNotification('Iltimos, yilni tanlang', 'warning');
            document.getElementById('carYear').focus();
            return;
        }
        
        if (!category) {
            showNotification('Iltimos, kategoriyani tanlang', 'warning');
            document.getElementById('carCategory').focus();
            return;
        }
        
        if (!price || parseInt(price) <= 0) {
            showNotification('Iltimos, to\'g\'ri narx kiriting', 'warning');
            document.getElementById('carPrice').focus();
            return;
        }
        
        if (!fuel) {
            showNotification('Iltimos, yoqilg\'i turini tanlang', 'warning');
            document.getElementById('carFuel').focus();
            return;
        }
        
        if (!transmission) {
            showNotification('Iltimos, transmissiyani tanlang', 'warning');
            document.getElementById('carTransmission').focus();
            return;
        }
        
        if (!engine) {
            showNotification('Iltimos, dvigatel hajmini kiriting', 'warning');
            document.getElementById('carEngine').focus();
            return;
        }
        
        if (!power || parseInt(power) <= 0) {
            showNotification('Iltimos, quvvatni kiriting', 'warning');
            document.getElementById('carPower').focus();
            return;
        }
        
        if (!color) {
            showNotification('Iltimos, rangni kiriting', 'warning');
            document.getElementById('carColor').focus();
            return;
        }
        
        if (!condition) {
            showNotification('Iltimos, holatni tanlang', 'warning');
            document.getElementById('carCondition').focus();
            return;
        }
        
        if (!description) {
            showNotification('Iltimos, tavsifni kiriting', 'warning');
            document.getElementById('carDescription').focus();
            return;
        }
        
        // Build car data
        const carData = {
            id,
            brand,
            model,
            year: parseInt(year),
            price: parseInt(price),
            oldPrice: oldPrice ? parseInt(oldPrice) : null,
            category,
            fuelType: fuel,
            transmission,
            engine,
            power: parseInt(power),
            color,
            mileage: parseInt(mileage),
            condition,
            status,
            description,
            features,
            images: currentCar ? currentCar.images : ['cars/default.jpg']
        };
        
        // Submit
        updateCar(carData);
    });
}

// ===== UPDATE CAR =====
function updateCar(carData) {
    const btn = document.querySelector('#editCarForm button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saqlanmoqda...';
    
    // In production: API.cars.update(carData.id, carData)
    setTimeout(() => {
        console.log('Updated car:', carData);
        showNotification('Mashina muvaffaqiyatli yangilandi! ✅', 'success');
        btn.innerHTML = '<i class="fas fa-check"></i> Saqlandi';
        btn.style.background = 'var(--success)';
        btn.style.borderColor = 'var(--success)';
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 1500);
}

// ===== DELETE CAR =====
function initDeleteCar() {
    document.getElementById('deleteCarBtn').addEventListener('click', function() {
        const carId = document.getElementById('carId').value;
        if (confirm('Mashinani o\'chirishni xohlaysizmi? Bu amalni qaytarib bo\'lmaydi!')) {
            // In production: API.cars.delete(carId)
            showNotification('Mashina o\'chirildi', 'info');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }
    });
}

// ===== EXPOSE =====
window.removeImage = removeImage;

console.log('✅ Edit Car Module loaded');