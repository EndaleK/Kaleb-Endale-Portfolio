# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Professional portfolio website for Kaleb Endale, Data Analyst & Developer. This is a static, single-page HTML application built on a modern responsive design with CSS custom properties for theming and vanilla JavaScript for interactivity.

## Development Commands

### Running a Local Server
```bash
# Python 3 (recommended)
python3 -m http.server 8000

# Python 2 (legacy)
python -m SimpleHTTPServer 8000

# Node.js (if available)
npx http-server -p 8000

# PHP (if available)
php -S localhost:8000
```

### Image Optimization
```bash
# Using ImageMagick (if installed)
convert images/original.jpg -resize 1200x1200\> -quality 85 images/optimized.jpg

# Batch resize all images in a directory
for img in images/*.jpg; do convert "$img" -resize 1200x1200\> -quality 85 "$img"; done
```

### HTML/CSS Validation
```bash
# W3C HTML validator (if installed)
npx html-validator index.html

# CSS validation via W3C online service
# Visit: https://jigsaw.w3.org/css-validator/
```

## Architecture & Key Components

### Project Structure
- **Single Page Application**: All content in `index.html` with modular CSS/JS
- **Static Assets**: Images in `/images/`, styles in `/assets/css/`, scripts in `/assets/js/`
- **No Build System**: Direct file serving, no compilation required
- **Mobile-First**: Responsive design with sidebar navigation

### Theme System
- **CSS Custom Properties**: All theming handled via CSS variables in `:root` and `[data-theme="dark"]`
- **Default State**: Light theme loads by default
- **Theme Toggle**: Floating button with Phosphor icons (sun/moon)
- **Persistence**: Uses `localStorage` with key `portfolio-theme`
- **System Detection**: Respects `prefers-color-scheme` media query on first visit
- **Theme Switching**: Managed entirely in `assets/js/main.js`

### JavaScript Architecture
- **Vanilla JavaScript**: No frameworks, uses modern ES6+ features with module type
- **Single Entry Point**: `assets/js/main.js` handles all functionality
- **Key Features**:
  - Theme management with localStorage persistence
  - Mobile sidebar navigation with overlay
  - Smooth scrolling with visual feedback
  - Contact form handling with EmailJS integration
  - Responsive behavior and accessibility

### CSS Architecture
- **Single CSS File**: All styles consolidated in `assets/css/main.css`
- **CSS Custom Properties**: Extensive use of CSS variables for theming
- **Modern CSS**: Uses CSS Grid, Flexbox, and modern selectors
- **Dark/Light Themes**: Implemented via `[data-theme="dark"]` attribute selector
- **Responsive Design**: Mobile-first approach with sidebar that transforms on mobile

### External Dependencies
- **Phosphor Icons**: Icon library loaded via CDN (`https://unpkg.com/phosphor-icons@1.4.2/src/css/icons.css`)
- **EmailJS**: Contact form service (`https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js`)
- **Google Fonts**: Preconnected for performance (`https://fonts.gstatic.com`)

## Common Modifications

### Adding Portfolio Items
```html
<!-- In index.html, within the portfolio section -->
<div class="portfolio__item animate-on-scroll" data-delay="100">
    <div class="portfolio__image">
        <img src="images/new-project.jpg" alt="Project Name">
        <div class="portfolio__overlay">
            <a href="#" class="portfolio__link">
                <i class="ph-eye"></i>
            </a>
        </div>
    </div>
    <div class="portfolio__content">
        <h3>Project Name</h3>
        <p>Brief description</p>
        <div class="portfolio__tags">
            <span class="tag">Tech Stack</span>
        </div>
    </div>
</div>
```

### Updating Color Scheme
Edit CSS custom properties in `assets/css/main.css`:
```css
:root {
    --primary-color: #64b5f6;     /* Main accent color */
    --secondary-color: #2c3e50;   /* Secondary color */
    --accent-color: #3498db;      /* Accent highlights */
    --text-color: #333333;        /* Main text color */
    --bg-color: #ffffff;          /* Background color */
    /* Additional variables available for comprehensive theming */
}

/* Dark theme overrides */
[data-theme="dark"] {
    --primary-color: #81c4e8;
    --text-color: #f1f5f9;
    --bg-color: #0f172a;
    /* All theme variables redefined for dark mode */
}
```

### Theme Toggle Customization
Theme switching is handled in `assets/js/main.js`:
- `setTheme(theme)` - Programmatically set theme
- `toggleTheme()` - Toggle between light/dark
- `localStorage.getItem('portfolio-theme')` - Persistence key
- Theme icons use Phosphor icon classes: `ph-sun` and `ph-moon`

### Contact Form Integration
Contact form uses EmailJS integration:
- **Service**: Configured in `assets/js/main.js`
- **Form ID**: `contact-form` in `index.html`
- **Email**: Routes to `kalebendale@protonmail.com`
- **Testing**: Form submissions work with EmailJS service
- **Modification**: Update EmailJS configuration in JavaScript

## Development Workflow

### Local Development
1. Start local server: `python3 -m http.server 8000`
2. Open `http://localhost:8000` in browser
3. Edit `index.html` for content changes
4. Edit `assets/css/main.css` for styling changes
5. Edit `assets/js/main.js` for functionality changes
6. Refresh browser to see changes (no build step required)

### Theme Development
- Light theme: Modify `:root` variables in `main.css`
- Dark theme: Modify `[data-theme="dark"]` variables in `main.css`
- Test theme switching with floating toggle button
- Theme persistence automatically handled by localStorage

### Content Updates
- **Portfolio Section**: Add/modify portfolio items in the `#portfolio` section of `index.html`
- **Resume Section**: Update experience/skills in the `#experience` section
- **About Section**: Modify personal information in the `#about` section
- **Contact Info**: Update contact details in the `#contact` section

## Deployment
Static site deployment options:
- **GitHub Pages**: Push to repository, enable Pages in settings
- **Netlify**: Drag and drop the entire folder
- **Vercel**: Connect repository for automatic deployments
- **Any Static Host**: Upload all files maintaining directory structure

## File Organization
- `index.html` - Complete single-page application
- `assets/css/main.css` - All styles including themes
- `assets/js/main.js` - All JavaScript functionality
- `images/` - Portfolio images and profile photo
- `Kaleb Endale - Comprehensive Resume.pdf` - Downloadable resume
- `kaleb-comprehensive-resume.md` - Resume in markdown format