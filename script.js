const canvas = document.getElementById('signature-pad');
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let currentColor = '#000000';
        let currentBrushSize = 3;

        // Set up canvas
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Drawing functions
        function startDrawing(e) {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
        }

        function draw(e) {
            if (!isDrawing) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = currentBrushSize;
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        function stopDrawing() {
            isDrawing = false;
            ctx.beginPath();
        }

        // Touch support for mobile
        function getTouchPos(e) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }

        function startTouchDrawing(e) {
            e.preventDefault();
            const touch = getTouchPos(e);
            isDrawing = true;
            ctx.beginPath();
            ctx.moveTo(touch.x, touch.y);
        }

        function touchDraw(e) {
            if (!isDrawing) return;
            e.preventDefault();
            
            const touch = getTouchPos(e);
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = currentBrushSize;
            ctx.lineTo(touch.x, touch.y);
            ctx.stroke();
        }

        function stopTouchDrawing(e) {
            e.preventDefault();
            isDrawing = false;
            ctx.beginPath();
        }

        // Mouse events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Touch events
        canvas.addEventListener('touchstart', startTouchDrawing);
        canvas.addEventListener('touchmove', touchDraw);
        canvas.addEventListener('touchend', stopTouchDrawing);

        // Color selection
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelector('.color-btn.active').classList.remove('active');
                this.classList.add('active');
                currentColor = this.dataset.color;
            });
        });

        // Brush size control
        const brushSizeSlider = document.getElementById('brushSize');
        const brushSizeValue = document.getElementById('brushSizeValue');
        
        brushSizeSlider.addEventListener('input', function() {
            currentBrushSize = this.value;
            brushSizeValue.textContent = this.value;
        });

        // Save button
        // document.getElementById('save').addEventListener('click', function() {
        //     // Create a new canvas to combine image and drawing
        //     const tempCanvas = document.createElement('canvas');
        //     const tempCtx = tempCanvas.getContext('2d');
        //     tempCanvas.width = 400;
        //     tempCanvas.height = 200;
            
        //     // Draw the background image
        //     const img = document.querySelector('img');
        //     tempCtx.drawImage(img, 0, 0, 400, 200);
            
        //     // Draw the signature canvas on top
        //     tempCtx.drawImage(canvas, 0, 0);
            
        //     // Convert to data URL and open in new window
        //     const dataURL = tempCanvas.toDataURL('image/png');
        //     window.open(dataURL);
        // });

        // // Clear button
        // document.getElementById('clear').addEventListener('click', function() {
        //     ctx.clearRect(0, 0, canvas.width, canvas.height);
        // });
        
    
        var signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)' // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
        });

        document.getElementById('save-png').addEventListener('click', function () {

        if (signaturePad.isEmpty()) {
            return alert("Please provide a signature first.");
        }
        
        var data = signaturePad.toDataURL('image/png');
        console.log(data);
        window.open(data);
        });

        document.getElementById('save-jpeg').addEventListener('click', function () {
        if (signaturePad.isEmpty()) {
            return alert("Please provide a signature first.");
        }

        var data = signaturePad.toDataURL('image/jpeg');
        console.log(data);
        window.open(data);
        });

        document.getElementById('save-svg').addEventListener('click', function () {
        if (signaturePad.isEmpty()) {
            return alert("Please provide a signature first.");
        }

        var data = signaturePad.toDataURL('image/svg+xml');
        console.log(data);
        console.log(atob(data.split(',')[1]));
        window.open(data);
        });

        document.getElementById('clear').addEventListener('click', function () {
        signaturePad.clear();
        });

        document.getElementById('undo').addEventListener('click', function () {
            var data = signaturePad.toData();
        if (data) {
            data.pop(); // remove the last dot or line
            signaturePad.fromData(data);
        }
        });