# Language Corrector Implementation Plan

## Goal
Create a webpage called "Language Corrector" to help users practice speaking French. The app will generate topics, record the user's voice, and provide feedback including a transcript, corrected version, and a score.

## Architecture
- **Type**: Single Page Application (SPA).
- **Tech Stack**:
  - **HTML5**: Semantic structure.
  - **CSS3**: Modern styling (Flexbox/Grid) for the 3-panel layout.
  - **JavaScript (Vanilla)**: Logic for state management, API interactions, and DOM manipulation.
  - **AI Integration**: Google Gemini API (via SDK or direct fetch) for topic generation, transcription, correction, and scoring.

## User Interface Design
The layout will consist of three distinct panels arranged horizontally (or vertically on smaller screens).

### Panel 1: Topic Generator
- **Purpose**: Provide a conversation starter or debate topic.
- **Elements**:
  - **Topic Display Area**: Large text showing the current topic (e.g., "Debate: Is social media beneficial for society?").
  - **Reset Button**: A button labeled "New Topic" to generate a fresh prompt.

### Panel 2: Voice Recorder
- **Purpose**: Capture the user's speech.
- **Elements**:
  - **Record Button**: Starts the recording session.
  - **Stop Button**: Ends the recording and triggers the analysis.
  - **Visualizer (Optional)**: A simple waveform or pulsing indicator to show active recording.
  - **Status Indicator**: "Ready", "Recording...", "Processing...".

### Panel 3: Feedback & Analysis
- **Purpose**: Display the results of the user's attempt.
- **Elements**:
  - **Transcript Section**: "What you said: [User's original speech]"
  - **Correction Section**: "Corrected version: [Grammatically correct and natural French version]"
  - **Score Display**: A numerical score (e.g., 8/10) or star rating based on fluency, grammar, and pronunciation.
  - **Feedback Details**: Brief explanation of the score or specific tips, presented as a bulleted list.

## Data Flow
1.  **Initialization**: App loads, optionally fetches a default topic immediately.
2.  **Topic Generation**:
    - User clicks "New Topic".
    - App sends prompt to Gemini: "Generate a debate topic or conversation starter in French."
    - Display result in Panel 1.
3.  **Recording**:
    - User clicks "Record".
    - App uses `MediaRecorder` API to capture audio.
    - User clicks "Stop".
4.  **Processing**:
    - App sends the audio data (or text if using Web Speech API first) to Gemini.
    - **Prompt to Gemini**: "Analyze this audio/text. Provide a transcript, a corrected version in standard French, and a score from 1-10 based on fluency and grammar. Return JSON."
5.  **Result Display**:
    - Parse JSON response.
    - Update Panel 3 with Transcript, Correction, and Score.

## Implementation Steps (for Gemini CLI)
1.  **Setup**: Create `index.html`, `style.css`, `script.js`.
2.  **HTML Structure**: Create the main container and the three panel `div`s.
3.  **Styling**: Apply CSS for a clean, modern look (using Flexbox/Grid). Ensure distinct visual separation between panels.
4.  **JavaScript Logic**:
    - Initialize Gemini API client.
    - Implement `getTopic()` function.
    - Implement `startRecording()` and `stopRecording()` using `MediaRecorder`.
    - Implement `analyzeSpeech()` to send data to Gemini and handle the response.
    - Wire up the "New Topic" button.

## Verification Plan
- **Topic Test**: Click "New Topic" multiple times to ensure variety.
- **Recording Test**: Record a short French phrase. Verify the app captures audio.
- **Feedback Test**: Speak intentionally broken French (e.g., "Je suis allé au le magasin"). Verify the correction is "Je suis allé au magasin" and the score reflects the error.
