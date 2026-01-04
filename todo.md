# AI Camera Pro - TODO

## Theme & Branding
- [x] Configure dark theme with black and dark blue/purple colors in theme.config.js
- [x] Generate custom camera app logo
- [x] Update app branding in app.config.ts

## Camera Viewfinder Screen
- [x] Set up camera permissions and Expo Camera
- [x] Implement full-screen camera viewfinder
- [x] Add floating subject detection indicator badge
- [x] Add large circular capture button with gradient
- [x] Add gallery thumbnail button (bottom-left)
- [x] Add settings button (bottom-right)
- [x] Implement capture button press animation and haptic feedback

## Subject Detection
- [x] Integrate server AI for image analysis
- [x] Implement real-time frame capture (every 500ms)
- [x] Send frames to AI for subject classification
- [x] Parse AI response for subject type (Car/Portrait/Architecture/Generic)
- [x] Display subject indicator with appropriate icon and text
- [x] Add fade in/out animations for indicator

## Photo Preview & Style Selection Screen
- [x] Create photo preview screen layout
- [x] Display captured photo in preview
- [x] Implement horizontal style carousel with 6 professional styles
- [x] Create style thumbnails with names and icons
- [x] Implement style selection with instant preview update
- [x] Add save and retake buttons
- [x] Implement navigation back to camera

## Color Grading Engine
- [x] Implement "The Silver Screen" filter (high contrast, teal/orange)
- [x] Implement "Classic Chrome" filter (desaturated, punchy mid-tones)
- [x] Implement "Portra 400" filter (warm golden tones)
- [x] Implement "Dark Mood" filter (low exposure, deep shadows)
- [x] Implement "Editorial Bright" filter (high dynamic range, clean whites)
- [x] Implement "Eterna" filter (cinematic, low-saturation)
- [x] Apply filters using Canvas API or image manipulation library
- [x] Optimize filter application for real-time preview

## Gallery Screen
- [x] Create gallery screen with 3-column grid layout
- [x] Load saved photos from file system
- [x] Display photo thumbnails with style badges
- [x] Implement photo tap to open full-screen viewer
- [x] Add share and delete functionality in photo viewer
- [x] Add empty state for no photos

## Settings Screen
- [ ] Create settings modal sheet
- [ ] Add grid lines toggle
- [ ] Add detection box toggle
- [ ] Add auto-style prediction toggle
- [ ] Add save original photo toggle
- [ ] Add about section with version info
- [ ] Persist settings to AsyncStorage

## Photo Storage
- [x] Implement photo save to file system using Expo FileSystem
- [x] Store photo metadata (style applied, timestamp, subject type)
- [x] Implement photo deletion
- [x] Add photo compression for storage optimization

## Polish & Optimization
- [x] Add screen transition animations
- [x] Add micro-interactions for all buttons
- [x] Implement loading states for AI processing
- [x] Optimize performance for real-time detection
- [x] Test on physical device
- [x] Add error handling for camera and permissions
- [x] Add error handling for AI service failures
