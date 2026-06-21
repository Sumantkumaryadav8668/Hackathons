# System Inspector Pro

System Inspector Pro is a modern frontend-only dashboard that reads safe current system information from the browser and presents it like a developer monitoring tool. It uses only HTML5, CSS3, and Vanilla JavaScript.

## Features

- Landing page with animated terminal preview
- Dashboard cards for current operating system hints, CPU core count, memory estimate, browser runtime, network state, and browser security limitations
- Live Inspector Lab with refresh scan, health score, browser capability audit, battery/network/storage checks, and permission states
- Runtime values table with search, filter, and sort
- File manager with Create, Read, Update, and Delete simulation
- LocalStorage persistence for file records
- JSON system report generation and download
- Copy current system snapshot and copy generated report JSON
- Exception handling for unsupported browser APIs, LocalStorage failures, startup errors, and blocked downloads
- Documentation section that explains each feature
- Animated particles, loading screen, toasts, page transitions, hover states, and counters
- Responsive layout for desktop, tablet, and mobile

## Technologies Used

- HTML5 for semantic page structure
- CSS3 for glassmorphism, responsive layouts, gradients, and animations
- Vanilla JavaScript for DOM rendering, events, LocalStorage, CRUD, filtering, sorting, and downloads

## Folder Structure

```text
System-Inspector-Pro/
|-- index.html
|-- style.css
|-- script.js
|-- data.js
|-- README.md
```

## Complete User Flow

```text
User opens website
|
Landing page appears
|
User clicks Open Dashboard
|
Information cards are displayed
|
User refreshes live scan or copies current snapshot
|
User explores environment variables
|
User creates, edits, views, and deletes files
|
Report is generated
|
User downloads JSON report
|
User reads documentation
```

## Pages

### Home

The home page introduces System Inspector Pro, explains what a system inspector is, and shows an animated terminal-style preview.

### Dashboard

The dashboard dynamically renders cards from live browser APIs. It can show OS hints, platform, architecture hints, logical CPU cores, approximate device memory, JavaScript heap limit when supported, browser name, battery status when supported, network information when supported, online status, language, screen details, and viewport size.

The Live Inspector Lab adds:

- Refresh Scan: re-reads current browser system signals
- Copy Snapshot: copies the current raw system snapshot as JSON
- System Health Score: estimates how many browser-readable signals are available
- Browser Access Map: shows which APIs are available, unavailable, or blocked
- Permission checks: camera, microphone, geolocation, and notifications when the Permissions API supports them

Because this is a browser-only project, some values are intentionally blocked by browser security. Exact processor model, true machine hostname, real operating system environment variables, full RAM, and Node.js version are not available without a backend or desktop app permissions. The dashboard displays clear fallback text for those values instead of using fake data.

### Environment Variables

The environment page now shows browser-accessible runtime values, such as user agent, browser, platform, OS hint, architecture hint, CPU cores, approximate memory, language, online status, time zone, screen size, cookies, and security-blocked fields. Users can search by variable name or value, filter by category, and sort alphabetically.

### File Manager

The file manager simulates real file operations. Users can create new file cards, read saved file contents, update existing files, and delete files.

### Report

The report page generates a JSON preview from the current browser-readable system details and the current number of saved files. The JSON can be copied or downloaded as `system-inspector-report.json`.

### Documentation

The docs page explains system information, CPU architecture, hostname, environment variables, and CRUD in beginner-friendly language.

## CRUD Implementation Strategy

LocalStorage is used to simulate file operations:

- Create: a new file object is added to the saved array
- Read: saved file objects are rendered as cards
- Update: an existing file object is replaced with edited values
- Delete: the selected file object is removed from the saved array

This keeps the project frontend-only while still behaving like a small file management application. If LocalStorage is disabled or blocked, the app catches the error and falls back to temporary starter files.

## JavaScript Function Guide

- `bindEvents()` connects clicks, form submits, search input, filtering, sorting, and report buttons.
- `navigateTo(pageId)` switches between sections and updates the active navigation link.
- `refreshCurrentSystemInfo()` collects current browser-readable system information and prepares dashboard/table data.
- `collectBrowserSystemInfo()` reads safe values from `navigator`, `window.screen`, `Intl`, and `performance`.
- `getBatteryInfo()` reads battery percentage and charging state when the Battery API is available.
- `getConnectionInfo()` reads network type and downlink estimate when the Network Information API is available.
- `getPermissionStates()` checks selected browser permission states when the Permissions API is available.
- `getStorageInfo()` reads browser storage usage/quota estimates when available.
- `renderHealthPanel()` updates the live score card.
- `renderCapabilityList()` renders the browser access audit list.
- `calculateHealthScore()` scores how many useful signals are available.
- `refreshDashboardScan()` reruns the live scan and refreshes the dashboard/table.
- `copyCurrentSnapshot()` copies the current raw snapshot JSON.
- `safeRead()` wraps browser API access so unsupported values do not crash the app.
- `createUnavailableSystemSnapshot()` provides fallback values when browser APIs fail.
- `renderFallbackState()` keeps the interface usable after startup errors.
- `renderSystemCards()` creates dashboard cards from the current system snapshot.
- `renderEnvironmentTable()` searches, filters, sorts, and renders environment rows.
- `toggleEnvironmentSort()` changes between A-Z and Z-A sorting.
- `getFiles()` reads files from LocalStorage, seeds starter files on first load, and handles invalid or blocked storage.
- `setFiles(files)` saves the file array to LocalStorage and returns whether saving worked.
- `renderFiles()` displays every saved file card and attaches edit/delete buttons.
- `saveFile(event)` creates a new file or updates an existing file.
- `editFile(id)` loads a file into the form for editing.
- `deleteFile(id)` removes a file from LocalStorage.
- `clearFileForm()` resets the file form to create mode.
- `createReport()` builds a JSON report preview.
- `copyJsonReport()` copies the generated JSON report.
- `downloadJsonReport()` downloads the generated report and handles blocked download exceptions.
- `renderDocs()` creates documentation cards.
- `animateCounters()` animates dashboard numbers.
- `showToast(message)` displays short notification messages.
- `typeTerminalText()` creates the home page terminal typing effect.
- `setupParticles()` draws animated background particles on canvas.
- `escapeHtml(value)` prevents file content from being interpreted as HTML.

## Animation Implementation

CSS handles page fade-ins, card slide animations, button hover motion, the loading spinner, toast entrances, terminal floating, and button pulse effects. JavaScript powers the canvas particle background, typing animation, and number counting animation.

## Exception Handling

The app uses `try...catch`, safe fallback values, and global error listeners to avoid breaking when a browser blocks or does not support an API. Unsupported values are shown as `Unavailable`, `Unavailable in this browser`, or `Blocked by browser security`.

Handled cases include unsupported browser APIs, denied/unsupported permission checks, Battery API failures, Storage API failures, LocalStorage failures, invalid LocalStorage JSON, blocked clipboard writes, blocked downloads, navigation hash errors, and startup errors.

## Important Browser Limitation

HTML, CSS, and Vanilla JavaScript cannot read private system data such as real environment variables, exact processor model, full physical RAM, hostname, installed Node.js version, or real filesystem contents. A Node.js backend, Electron app, browser extension, or native desktop app would be required for those deeper system permissions.

## How to Run

Open `index.html` in a browser. No installation, server, backend, or package manager is required.

## Future Improvements

- Add a Node.js backend for real system information
- Add real filesystem access with secure permissions
- Add charts for CPU, memory, and disk usage
- Add import and export for saved file collections
- Add light and dark theme switching
