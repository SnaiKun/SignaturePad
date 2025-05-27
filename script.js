const canvas = document.getElementById('signature-pad');
        
// Initialize SignaturePad
const signaturePad = new SignaturePad(canvas, {
    backgroundColor: 'rgba(255, 255, 255, 0)', // transparent background
    penColor: '#000000',
    minWidth: 1,
    maxWidth: 3
});

// Canvas resize function for high DPI displays
function resizeCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
    signaturePad.clear(); // otherwise isEmpty() might return incorrect value
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Color selection
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelector('.color-btn.active').classList.remove('active');
        this.classList.add('active');
        signaturePad.penColor = this.dataset.color;
    });
});

// Brush size control
const brushSizeSlider = document.getElementById('brushSize');
const brushSizeValue = document.getElementById('brushSizeValue');

brushSizeSlider.addEventListener('input', function() {
    const size = parseFloat(this.value);
    brushSizeValue.textContent = size;
    signaturePad.minWidth = size * 0.5;
    signaturePad.maxWidth = size;
});

// Save as PNG
document.getElementById('save-png').addEventListener('click', function () {
    if (signaturePad.isEmpty()) {
        return alert("Please draw something first.");
    }
    
    // Create composite image with background
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = 400;
    tempCanvas.height = 200;
    
    // Draw background image first
    const img = document.querySelector('img');
    if (img.complete) {
        tempCtx.drawImage(img, 0, 0, 400, 200);
        // Draw signature on top
        tempCtx.drawImage(canvas, 0, 0);
        
        const dataURL = tempCanvas.toDataURL('image/png');
        window.open(dataURL);
    } else {
        img.onload = function() {
            tempCtx.drawImage(img, 0, 0, 400, 200);
            tempCtx.drawImage(canvas, 0, 0);
            const dataURL = tempCanvas.toDataURL('image/png');
            window.open(dataURL);
        };
    }
});

// Save as JPEG
document.getElementById('save-jpeg').addEventListener('click', function () {
    if (signaturePad.isEmpty()) {
        return alert("Please draw something first.");
    }

    // Create composite image with white background for JPEG
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = 400;
    tempCanvas.height = 200;
    
    // Fill with white background for JPEG
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, 400, 200);
    
    // Draw background image
    const img = document.querySelector('img');
    if (img.complete) {
        tempCtx.drawImage(img, 0, 0, 400, 200);
        // Draw signature on top
        tempCtx.drawImage(canvas, 0, 0);
        
        const dataURL = tempCanvas.toDataURL('image/jpeg', 0.9);
        window.open(dataURL);
    } else {
        img.onload = function() {
            tempCtx.drawImage(img, 0, 0, 400, 200);
            tempCtx.drawImage(canvas, 0, 0);
            const dataURL = tempCanvas.toDataURL('image/jpeg', 0.9);
            window.open(dataURL);
        };
    }
});

// Save as SVG
document.getElementById('save-svg').addEventListener('click', function () {
    if (signaturePad.isEmpty()) {
        return alert("Please draw something first.");
    }

    const dataURL = signaturePad.toDataURL('image/svg+xml');
    const link = document.createElement('a');
    link.download = 'drawing.svg';
    link.href = dataURL;
    link.click();
});

// Clear button
document.getElementById('clear').addEventListener('click', function () {
    signaturePad.clear();
});

// Undo button
document.getElementById('undo').addEventListener('click', function () {
    const data = signaturePad.toData();
    if (data && data.length > 0) {
        data.pop(); // remove the last stroke
        signaturePad.fromData(data);
    }
});