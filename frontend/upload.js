document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    const uploadStatus = document.getElementById('uploadStatus');

    // Preview images when selected
    for (let i = 1; i <= 6; i++) {
        const input = document.getElementById(`frame${i}`);
        const preview = document.getElementById(`preview${i}`);

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        const movieTitle = document.getElementById('movieTitle').value;
        formData.append('movieTitle', movieTitle);
    
        // Get all file inputs
        const frameInputs = document.querySelectorAll('input[type="file"]');
        let selectedFrames = 0;
    
        // Append each file with the same field name 'frames'
        frameInputs.forEach(input => {
            if (input.files.length > 0) {
                selectedFrames++;
                formData.append('frame0'+ selectedFrames , input.files[0]);
            }
        });
    
        if (selectedFrames !== 6) {
            uploadStatus.textContent = 'Please select exactly 6 frames';
            uploadStatus.className = 'upload-status error';
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3001/api/upload-movie', {
                method: 'POST',
                body: formData // Don't set Content-Type header - browser will set it automatically
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }
    
            const result = await response.json();
            uploadStatus.textContent = 'Movie uploaded successfully!';
            uploadStatus.className = 'upload-status success';
            uploadForm.reset();
            // Clear previews
            document.querySelectorAll('.frame-preview').forEach(preview => {
                preview.style.display = 'none';
            });
        } catch (error) {
            uploadStatus.textContent = error.message;
            uploadStatus.className = 'upload-status error';
        }
    });
});