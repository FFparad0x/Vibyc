const API_BASE = '/api';

// DOM Elements
const addVibeBtn = document.getElementById('addVibeBtn');
const uploadSection = document.getElementById('uploadSection');
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const photoCloud = document.getElementById('photoCloud');
const loadingSpinner = document.getElementById('loadingSpinner');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const downloadBtn = document.getElementById('downloadBtn');

let currentPhoto = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPhotos();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // CTA Button
    addVibeBtn.addEventListener('click', () => {
        uploadSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        uploadBox.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            uploadBox.style.animation = '';
        }, 500);
    });

    // File input
    uploadBox.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadBox.addEventListener('dragover', handleDragOver);
    uploadBox.addEventListener('dragleave', handleDragLeave);
    uploadBox.addEventListener('drop', handleDrop);

    // Modal
    modalClose.addEventListener('click', closeModal);
    downloadBtn.addEventListener('click', downloadCurrentPhoto);
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) closeModal();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// Load photos from server
async function loadPhotos() {
    try {
        loadingSpinner.style.display = 'flex';
        const response = await fetch(`${API_BASE}/photos`);
        const photos = await response.json();
        
        displayPhotos(photos);
    } catch (error) {
        console.error('Error loading photos:', error);
        photoCloud.innerHTML = '<p style="color: white; text-align: center;">Failed to load photos. Please try again.</p>';
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

// Display photos in cloud layout
function displayPhotos(photos) {
    if (photos.length === 0) {
        photoCloud.innerHTML = '<p style="color: white; text-align: center; font-size: 1.2rem;">No photos yet. Be the first to add your vibe! 🎉</p>';
        return;
    }

    photoCloud.innerHTML = '';
    
    photos.forEach((photo, index) => {
        const photoItem = createPhotoElement(photo, index);
        photoCloud.appendChild(photoItem);
    });
}

// Create photo element
function createPhotoElement(photo, index) {
    const item = document.createElement('div');
    item.className = 'photo-item';
    item.style.animationDelay = `${index * 0.1}s`;
    
    // Random size for cloud effect (between 150px and 250px)
    const size = 150 + Math.random() * 100;
    item.style.width = `${size}px`;
    item.style.height = `${size}px`;
    
    const img = document.createElement('img');
    img.src = photo.url;
    img.alt = photo.filename;
    img.loading = 'lazy';
    
    const overlay = document.createElement('div');
    overlay.className = 'photo-overlay';
    overlay.innerHTML = '<div class="download-icon">⬇️</div>';
    
    item.appendChild(img);
    item.appendChild(overlay);
    
    item.addEventListener('click', () => openModal(photo));
    
    return item;
}

// Handle file selection
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    uploadFiles(files);
}

// Drag and drop handlers
function handleDragOver(e) {
    e.preventDefault();
    uploadBox.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
        uploadFiles(files);
    }
}

// Upload files
async function uploadFiles(files) {
    for (const file of files) {
        await uploadFile(file);
    }
}

// Upload single file
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('photo', file);
    
    uploadProgress.style.display = 'block';
    progressFill.style.width = '0%';
    
    try {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                progressFill.style.width = `${percentComplete}%`;
            }
        });
        
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                progressFill.style.width = '100%';
                
                setTimeout(() => {
                    uploadProgress.style.display = 'none';
                    fileInput.value = '';
                    loadPhotos(); // Reload photos
                    
                    // Show success animation
                    uploadBox.style.animation = 'bounceIn 0.6s ease';
                    setTimeout(() => {
                        uploadBox.style.animation = '';
                    }, 600);
                }, 500);
            } else {
                throw new Error('Upload failed');
            }
        });
        
        xhr.addEventListener('error', () => {
            uploadProgress.style.display = 'none';
            alert('Upload failed. Please try again.');
        });
        
        xhr.open('POST', `${API_BASE}/upload`);
        xhr.send(formData);
        
    } catch (error) {
        console.error('Upload error:', error);
        uploadProgress.style.display = 'none';
        alert('Upload failed. Please try again.');
    }
}

// Open modal with photo
function openModal(photo) {
    currentPhoto = photo;
    modalImage.src = photo.url;
    modalImage.alt = photo.filename;
    imageModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    imageModal.classList.remove('active');
    document.body.style.overflow = '';
    currentPhoto = null;
}

// Download photo
function downloadCurrentPhoto() {
    if (!currentPhoto) return;
    
    const link = document.createElement('a');
    link.href = `${API_BASE}/download/${currentPhoto.filename}`;
    link.download = currentPhoto.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
