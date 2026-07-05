document.addEventListener('DOMContentLoaded', function() {
    // Image preview
    const imageInput = document.getElementById('carImages');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const preview = document.getElementById('imagePreview');
            if (!preview) return;
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

    // Form validation
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const required = this.querySelectorAll('[required]');
            let isValid = true;
            required.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                } else {
                    field.classList.remove('error');
                }
            });
            if (!isValid) {
                e.preventDefault();
                showNotification('Iltimos, barcha majburiy maydonlarni to\'ldiring', 'warning');
            }
        });
    });
});

console.log('✅ Forms Module loaded');