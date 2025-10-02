# SecondMarket Design System

## Overview
This document describes the design system implemented for SecondMarket, a modern marketplace application targeting young users in Mexico.

## Color Palette

### Primary Colors
- **Primary**: `#6366F1` (Indigo) - Main brand color, used for CTAs and important elements
- **Primary Hover**: `#4F46E5` - Hover state for primary elements
- **Primary Light**: `#EEF2FF` - Backgrounds and subtle highlights

### Secondary Colors
- **Secondary**: `#EC4899` (Pink) - Accent color for prices and special elements
- **Secondary Hover**: `#DB2777` - Hover state for secondary elements
- **Secondary Light**: `#FCE7F3` - Backgrounds for secondary elements

### Semantic Colors
- **Success**: `#10B981` (Green) - Success messages and positive actions
- **Warning**: `#F59E0B` (Amber) - Warnings and cautions
- **Error**: `#EF4444` (Red) - Errors and destructive actions

### Neutral Colors
- **Neutral 50-900**: Grayscale from `#F9FAFB` to `#111827`
- Used for text, backgrounds, borders, and UI elements

## Typography

### Font Family
- **Sans**: System fonts stack for optimal performance
- **Mono**: Monospace fonts for code

### Font Sizes
- **xs**: 12px - Small labels, captions
- **sm**: 14px - Secondary text, form labels
- **base**: 16px - Body text (default)
- **lg**: 18px - Emphasized text
- **xl**: 20px - Small headings
- **2xl**: 24px - Section headings
- **3xl**: 30px - Page titles
- **4xl**: 36px - Hero text

## Spacing System

Based on 8px grid:
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

## Border Radius
- **sm**: 6px - Small elements
- **md**: 8px - Standard elements (buttons, inputs)
- **lg**: 12px - Cards, modals
- **xl**: 16px - Large containers
- **full**: 9999px - Pills, avatars

## Shadows
- **sm**: Subtle shadow for slight elevation
- **md**: Standard shadow for cards
- **lg**: Prominent shadow for modals
- **xl**: Maximum shadow for overlays

## Transitions
- **fast**: 150ms - Quick interactions
- **base**: 200ms - Standard transitions (default)
- **slow**: 300ms - Smooth, noticeable transitions

## Components

### Buttons
```css
.btn - Base button class
.btn-primary - Primary action button (indigo)
.btn-secondary - Secondary action button (pink)
.btn-success - Success button (green)
.btn-error - Destructive button (red)
.btn-neutral - Neutral button (gray)
.btn-outline - Outlined button
.btn-sm - Small button
.btn-lg - Large button
.btn-full - Full width button
```

### Forms
```css
.form-group - Form field container
.form-label - Form field label
.form-input - Text input
.form-textarea - Textarea
.form-select - Select dropdown
.form-error - Error message
.form-hint - Helper text
```

### Cards
```css
.card - Base card with shadow and hover effect
.card-white - White card with padding
```

### Alerts
```css
.alert - Base alert
.alert-success - Success message
.alert-error - Error message
.alert-warning - Warning message
.alert-info - Info message
```

### Modals
```css
.modal-backdrop - Modal overlay
.modal-content - Modal container
.modal-header - Modal header
.modal-body - Modal body
.modal-footer - Modal footer
```

### Badges
```css
.badge - Base badge
.badge-primary - Primary badge
.badge-secondary - Secondary badge
.badge-success - Success badge
.badge-new - Animated new badge
```

## Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 768px
- **Desktop**: 768px - 1024px
- **Large Desktop**: 1024px - 1280px
- **Extra Large**: > 1280px

### Mobile-First Approach
All styles are written mobile-first, with larger screens using media queries.

### Touch Targets
Minimum 44x44px touch targets on mobile devices for accessibility.

## Accessibility

### Focus States
- All interactive elements have visible focus states
- Focus ring: 2px solid primary color with 2px offset

### Color Contrast
- All text meets WCAG AA standards
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text

### Screen Reader Support
- `.sr-only` class for screen reader only content
- Proper ARIA labels on interactive elements

## Animations

### Available Animations
- `fadeIn` - Fade in effect
- `slideUp` - Slide up from bottom
- `slideDown` - Slide down from top
- `pulse` - Pulsing effect for badges
- `spin` - Rotating spinner

### Usage
```css
.animate-fade-in
.animate-slide-up
.animate-slide-down
```

## Grid System

### Responsive Grid
```css
.grid - Base grid
.grid-cols-1 to .grid-cols-4 - Column count
.sm\:grid-cols-* - Tablet breakpoint
.md\:grid-cols-* - Desktop breakpoint
.lg\:grid-cols-* - Large desktop breakpoint
.xl\:grid-cols-* - Extra large breakpoint
```

## Best Practices

### 1. Use CSS Variables
Always use CSS variables instead of hardcoded values:
```css
/* Good */
color: var(--color-primary);
padding: var(--spacing-md);

/* Bad */
color: #6366F1;
padding: 16px;
```

### 2. Mobile-First
Write styles for mobile first, then add media queries for larger screens:
```css
/* Mobile styles */
.element {
  padding: var(--spacing-md);
}

/* Desktop styles */
@media (min-width: 768px) {
  .element {
    padding: var(--spacing-xl);
  }
}
```

### 3. Consistent Spacing
Use the spacing system for all margins and padding:
```css
margin-bottom: var(--spacing-lg);
gap: var(--spacing-md);
```

### 4. Smooth Transitions
Add transitions to interactive elements:
```css
transition: all var(--transition-base);
```

### 5. Accessible Touch Targets
Ensure minimum 44x44px touch targets on mobile:
```css
@media (max-width: 768px) {
  button {
    min-height: 44px;
    min-width: 44px;
  }
}
```

## Examples

### Creating a Card
```jsx
<div className="card">
  <div style={{ padding: 'var(--spacing-lg)' }}>
    <h3 style={{ color: 'var(--color-primary)' }}>Card Title</h3>
    <p style={{ color: 'var(--color-neutral-600)' }}>Card content</p>
  </div>
</div>
```

### Creating a Button
```jsx
<button className="btn btn-primary btn-full">
  Click Me
</button>
```

### Creating a Form
```jsx
<div className="form-group">
  <label className="form-label">Email</label>
  <input type="email" className="form-input" />
  <span className="form-error">Error message</span>
</div>
```

## Resources

- All CSS variables are defined in `frontend/src/index.css`
- Global styles and utilities in `frontend/src/App.css`
- Component-specific styles in their respective `.css` files

## Maintenance

When adding new components or styles:
1. Use existing CSS variables
2. Follow the naming conventions
3. Ensure mobile responsiveness
4. Test accessibility
5. Add smooth transitions
6. Document any new patterns
