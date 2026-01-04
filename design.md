# AI Camera Pro - Mobile App Design

## Design Philosophy
A professional photography assistant that feels like a first-party iOS camera app with intelligent subject detection. The interface is **minimal, dark, and modern** with black and dark blue/purple accents. The focus is on the subject—UI elements fade away to let the camera viewfinder dominate.

## Theme & Visual Identity

### Color Palette
- **Primary Background**: Pure Black (#000000) - main screen background
- **Secondary Background**: Dark Blue-Black (#0A0A14) - cards and surfaces
- **Accent Blue**: Deep Blue (#1E3A8A) - primary actions, indicators
- **Accent Purple**: Dark Purple (#6B21A8) - secondary actions, highlights
- **Bright Blue**: Vivid Blue (#3B82F6) - active states, detection indicators
- **Bright Purple**: Vivid Purple (#A855F7) - style selections, emphasis
- **Text Primary**: White (#FFFFFF)
- **Text Secondary**: Gray (#9CA3AF)
- **Success**: Green (#22C55E) - capture success
- **Error**: Red (#EF4444) - errors

### Typography
- **Headers**: Bold, 24-32px
- **Body**: Regular, 14-16px
- **Captions**: Regular, 12px
- **Indicators**: Medium, 13px

### Design Principles
1. **One-handed operation**: All primary controls within thumb reach (bottom third of screen)
2. **Minimal UI**: Hide non-essential elements, show only when needed
3. **Subject-first**: Camera viewfinder is full-screen, UI overlays are translucent
4. **Instant feedback**: Haptic feedback + visual indicators for all actions
5. **Dark by default**: Optimized for low-light photography scenarios

## Screen List & Layout

### 1. Camera Viewfinder Screen (Primary)
**Purpose**: Real-time camera with subject detection and capture

**Layout** (Portrait 9:16):
```
┌─────────────────────────┐
│   [Status Bar Area]     │ ← Transparent, shows time/battery
├─────────────────────────┤
│                         │
│   FULL-SCREEN CAMERA    │
│      VIEWFINDER         │
│                         │
│  [Subject Indicator]    │ ← Top-left, floating badge
│  "Car Mode: Optimized"  │   Semi-transparent dark background
│                         │
│                         │
│                         │
│                         │
│                         │
│                         │
│                         │
├─────────────────────────┤
│   [Gallery] [Capture]   │ ← Bottom controls
│            [Settings]   │   Large touch targets
└─────────────────────────┘
```

**Key Elements**:
- **Subject Indicator Badge**: Floating top-left, rounded rectangle with dark background (80% opacity), shows detected subject type (Car/Portrait/Architecture/Generic) with icon
- **Capture Button**: Large circular button (80px diameter) at bottom center, white ring with blue/purple gradient fill
- **Gallery Button**: Bottom-left, shows thumbnail of last photo
- **Settings Button**: Bottom-right, gear icon
- **Detection Overlay**: Subtle bounding box around detected subject (optional, can be toggled)

**Interactions**:
- Tap capture button → Take photo, haptic feedback, brief flash animation
- Tap gallery button → Navigate to gallery
- Tap settings → Open settings sheet
- Subject indicator appears/disappears with fade animation

---

### 2. Photo Preview & Style Selection Screen
**Purpose**: Review captured photo and apply professional color grading styles

**Layout**:
```
┌─────────────────────────┐
│   [< Back]         [✓]  │ ← Header with back and save
├─────────────────────────┤
│                         │
│   PHOTO PREVIEW         │
│   (with applied style)  │
│                         │
│                         │
│                         │
├─────────────────────────┤
│ [Style Carousel]        │ ← Horizontal scroll
│ [Silver] [Chrome] [...]  │   Shows 6 professional styles
├─────────────────────────┤
│  [Retake]    [Save]     │ ← Action buttons
└─────────────────────────┘
```

**Key Elements**:
- **Photo Preview**: Full-width, 4:3 or 16:9 aspect ratio, centered
- **Style Carousel**: Horizontal scrollable list of style thumbnails
  - Each style shows: Small preview thumbnail + Style name
  - Active style has bright blue/purple border
  - Thumbnails are 80x80px with rounded corners
- **Style Names**:
  1. **The Silver Screen** (Teal/Orange icon)
  2. **Classic Chrome** (Desaturated icon)
  3. **Portra 400** (Warm golden icon)
  4. **Dark Mood** (Deep shadows icon)
  5. **Editorial Bright** (Clean whites icon)
  6. **Eterna** (Cinematic icon)
- **Retake Button**: Secondary button, bottom-left
- **Save Button**: Primary button (blue/purple gradient), bottom-right

**Interactions**:
- Swipe/tap style thumbnails → Preview updates instantly with selected style
- Tap Save → Save to gallery with haptic success feedback
- Tap Retake → Return to camera viewfinder
- Tap Back → Discard and return to camera

---

### 3. Gallery Screen
**Purpose**: View and manage saved photos

**Layout**:
```
┌─────────────────────────┐
│   Gallery        [Done] │ ← Header
├─────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │     │ │     │ │     │ │ ← Grid of photos
│ └─────┘ └─────┘ └─────┘ │   3 columns
│ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │     │ │     │ │     │ │
│ └─────┘ └─────┘ └─────┘ │
│ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │     │ │     │ │     │ │
│ └─────┘ └─────┘ └─────┘ │
└─────────────────────────┘
```

**Key Elements**:
- **Photo Grid**: 3 columns, square thumbnails with 2px gap
- **Photo Metadata**: Small badge on each thumbnail showing applied style name
- **Empty State**: "No photos yet" message with camera icon

**Interactions**:
- Tap photo → Open full-screen photo viewer with share/delete options
- Long-press photo → Select mode for batch operations
- Tap Done → Return to camera

---

### 4. Settings Screen (Modal Sheet)
**Purpose**: Configure app preferences

**Layout**:
```
┌─────────────────────────┐
│   Settings       [Done] │
├─────────────────────────┤
│                         │
│ Camera                  │
│ ├ Grid Lines    [Toggle]│
│ ├ Detection Box [Toggle]│
│                         │
│ Processing              │
│ ├ Auto-Style    [Toggle]│
│ ├ Save Original [Toggle]│
│                         │
│ About                   │
│ ├ Version 1.0           │
│ └ Help & Support        │
└─────────────────────────┘
```

**Key Elements**:
- **Section Headers**: Uppercase, gray text
- **Toggle Switches**: Blue/purple gradient when on
- **List Items**: White text with chevron for navigation

---

## Key User Flows

### Flow 1: Capture Photo with Subject Detection
```
User opens app
  ↓
Camera viewfinder appears (full-screen)
  ↓
AI detects subject in real-time (e.g., Car)
  ↓
"Car Mode: Optimized" indicator appears (top-left)
  ↓
User taps capture button
  ↓
Haptic feedback + brief flash animation
  ↓
Navigate to Photo Preview screen
  ↓
AI predicts best style (e.g., "The Silver Screen")
  ↓
Photo displayed with predicted style applied
  ↓
Style carousel shows all 6 options
```

### Flow 2: Apply Different Style
```
On Photo Preview screen
  ↓
User swipes through style carousel
  ↓
Each tap/swipe instantly updates preview
  ↓
User finds desired style
  ↓
Taps "Save" button
  ↓
Haptic success feedback
  ↓
Photo saved to gallery
  ↓
Return to camera viewfinder
```

### Flow 3: View Gallery
```
On Camera screen
  ↓
User taps gallery button (bottom-left)
  ↓
Navigate to Gallery screen
  ↓
Grid of saved photos displayed
  ↓
User taps a photo
  ↓
Full-screen photo viewer opens
  ↓
User can share or delete
  ↓
Tap back to return to gallery
  ↓
Tap "Done" to return to camera
```

---

## UI Component Specifications

### Buttons
1. **Primary Button** (Save, Capture):
   - Background: Blue-to-purple gradient (#3B82F6 → #A855F7)
   - Text: White, bold
   - Border radius: 12px
   - Height: 48px
   - Press state: Scale 0.97 + opacity 0.9

2. **Secondary Button** (Retake, Cancel):
   - Background: Dark surface (#1E2022)
   - Border: 1px solid #334155
   - Text: White
   - Border radius: 12px
   - Height: 48px
   - Press state: Opacity 0.7

3. **Icon Button** (Settings, Gallery):
   - Background: Semi-transparent dark (#00000080)
   - Icon: White
   - Size: 44x44px
   - Border radius: 22px (circular)
   - Press state: Opacity 0.6

### Cards & Surfaces
- **Background**: #0A0A14 (dark blue-black)
- **Border**: 1px solid #1E3A8A (dark blue)
- **Border radius**: 16px
- **Shadow**: None (dark theme)

### Indicators & Badges
- **Subject Detection Badge**:
  - Background: #000000CC (80% opacity black)
  - Border: 1px solid #3B82F6 (bright blue)
  - Border radius: 8px
  - Padding: 8px 12px
  - Text: White, 13px medium
  - Icon: 16x16px, blue/purple

### Style Carousel Items
- **Thumbnail**: 80x80px, border radius 12px
- **Active border**: 2px solid #A855F7 (purple)
- **Inactive border**: 1px solid #334155 (gray)
- **Label**: 12px, centered below thumbnail

---

## Animations & Transitions

### Screen Transitions
- **Camera → Preview**: Slide up (300ms)
- **Preview → Camera**: Slide down (300ms)
- **Camera → Gallery**: Slide left (300ms)
- **Gallery → Camera**: Slide right (300ms)

### Micro-interactions
- **Subject indicator appear**: Fade in + scale from 0.9 to 1.0 (200ms)
- **Capture button press**: Scale to 0.97 (80ms) + haptic light
- **Style selection**: Scale thumbnail 1.0 → 1.1 → 1.0 (150ms) + haptic medium
- **Photo save**: Checkmark animation + haptic success

### Loading States
- **Subject detection loading**: Pulsing blue ring around capture button
- **Photo processing**: Spinner overlay on preview (semi-transparent background)

---

## Accessibility & Usability

### Touch Targets
- Minimum size: 44x44px (Apple HIG standard)
- Capture button: 80x80px (extra large for primary action)
- Spacing between buttons: 16px minimum

### Contrast
- All text meets WCAG AA standards against dark backgrounds
- Indicators use bright blue/purple for visibility

### Haptic Feedback
- **Light**: Button taps, style selection
- **Medium**: Toggle switches, mode changes
- **Success**: Photo saved successfully
- **Error**: Capture failed, permission denied

### One-Handed Operation
- All primary controls in bottom third of screen
- Capture button centered for thumb reach
- Gallery and settings accessible from bottom corners

---

## Technical Implementation Notes

### Camera Permissions
- Request camera permission on first launch
- Show permission rationale if denied
- Graceful fallback: Show "Camera access required" message

### Subject Detection
- Use server AI (built-in LLM with vision capabilities)
- Send camera frame every 500ms for analysis
- Display indicator only if confidence > 70%
- Cache last detection for 2 seconds to avoid flickering

### Color Grading
- Apply filters using Canvas API or WebGL shaders
- Preload all 6 LUT configurations at app start
- Real-time preview updates (< 100ms)
- Save both original and styled versions (optional setting)

### Performance
- Throttle subject detection to 2 FPS (every 500ms)
- Use lower resolution for detection (640x480)
- Capture full resolution for final photo
- Compress saved photos to 90% quality

### Storage
- Use AsyncStorage for app settings
- Use Expo FileSystem for photo storage
- Optional: Sync to server if user is authenticated

---

## Future Enhancements (Not in MVP)
- Manual focus and exposure controls
- RAW photo capture
- Custom LUT import
- Social sharing integration
- Photo editing tools (crop, rotate, adjust)
- Batch processing for gallery photos
