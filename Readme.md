# 🎉 Birthday Party Landing Page

## Привет, это landing page нашей тусовки 
---
Загружайте фотки, будьте весёлыми 

## Features

- ✨ Beautiful animated landing page
- 📸 Photo upload with drag & drop
- ☁️ Cloud-like photo album view
- ⬇️ Photo download functionality
- 🎨 Modern, flexible design with cool animations
- 🐳 Docker support for easy hosting

## Quick Start

### Using Docker (Recommended)

```bash
# Build the image
make build

# Run the container
make run

# Visit http://localhost:3000
```

### Using Makefile

```bash
# See all available commands
make help

# Build Docker image
make build

# Run container
make run

# Stop container
make stop

# Restart container
make restart

# View logs
make logs

# Development mode (with auto-reload)
make dev
```

### Manual Setup

```bash
# Install dependencies
npm install

# Start server
npm start

# Development mode (with nodemon)
npm run dev
```

## Usage

1. Click the **"✨ Add Vibe ✨"** button or scroll to the upload section
2. Upload photos by:
   - Clicking the upload box and selecting files
   - Dragging and dropping images onto the upload box
3. View your photos in the cloud-like album below
4. Click any photo to view it full-size
5. Download photos using the download button in the modal

## API Endpoints

- `GET /api/photos` - Get all photos
- `POST /api/upload` - Upload a photo
- `GET /api/download/:filename` - Download a photo
- `GET /health` - Health check

## Docker Deployment

The application is containerized and ready for deployment:

```bash
docker build -t birthday-party-landing .
docker run -d -p 3000:3000 -v $(pwd)/uploads:/app/uploads birthday-party-landing
```

## Environment Variables

- `PORT` - Server port (default: 3000)

## File Structure

```
.
├── server.js          # Express server
├── package.json       # Dependencies
├── Dockerfile         # Docker configuration
├── Makefile          # Build automation
├── public/           # Frontend files
│   ├── index.html   # Main page
│   ├── styles.css   # Styles
│   └── app.js       # Frontend logic
└── uploads/         # Uploaded photos (created automatically)
```

## Technologies

- Node.js + Express
- Vanilla JavaScript
- CSS3 Animations
- Multer (file upload)
- Docker

## License

MIT
