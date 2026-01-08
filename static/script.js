import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
import { GEMINI_API_KEY } from "/config.js"; // Point to your Flask route

// DOM Elements
const newTopicBtn = document.getElementById('newTopicBtn');
const topicDisplay = document.getElementById('topicDisplay');
const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const visualizer = document.getElementById('visualizer');
const statusIndicator = document.getElementById('statusIndicator');
const timerDisplay = document.getElementById('timerDisplay');

// Results Elements
const transcriptText = document.getElementById('transcriptText');
const correctionText = document.getElementById('correctionText');
const scoreDisplay = document.getElementById('scoreDisplay');
const feedbackDetails = document.getElementById('feedbackDetails');

// State
let genAI;
let model;
let mediaRecorder;
let audioChunks = [];
let timerInterval;

// Initialize
if (GEMINI_API_KEY) {
    console.log("Using API Key from environment");
    initializeGemini(GEMINI_API_KEY);
} else {
    console.error("GEMINI_API_KEY not found. Please set it in your environment.");
    statusIndicator.textContent = "Error: API Key missing";
}

// Event Listeners
newTopicBtn.addEventListener('click', generateTopic);
recordBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);

function initializeGemini(key) {
    try {
        genAI = new GoogleGenerativeAI(key);
        // Using the 2026 flagship model
        model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        console.log("Gemini initialized");
    } catch (error) {
        console.error("Initialization error:", error);
        alert("Invalid API Key or initialization failed.");
    }
}

async function generateTopic() {
    if (!model) return alert("Please set your API Key first.");

    topicDisplay.textContent = "Generating topic...";
    newTopicBtn.disabled = true;

    try {
        const prompt = "Generate a random, engaging French conversation topic or debate question for a language learner. Reply with ONLY the topic in French.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        topicDisplay.textContent = response.text();
    } catch (error) {
        console.error("Topic error:", error);
        topicDisplay.textContent = `Error: ${error.message || error.toString()}`;
    } finally {
        newTopicBtn.disabled = false;
    }
}

async function startRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return alert("Microphone access is not supported in this browser.");
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = processAudio;

        mediaRecorder.start();

        // UI Updates
        recordBtn.disabled = true;
        stopBtn.disabled = false;
        visualizer.classList.add('recording');
        statusIndicator.textContent = "Recording...";
        startTimer();

        // Reset results
        transcriptText.textContent = "...";
        correctionText.textContent = "---";
        scoreDisplay.textContent = "-/10";
        feedbackDetails.textContent = "---";

    } catch (err) {
        console.error("Mic error:", err);
        alert("Could not access microphone.");
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        stopTimer();
        recordBtn.disabled = false;
        stopBtn.disabled = true;
        visualizer.classList.remove('recording');
        statusIndicator.textContent = "Processing...";

        // Trigger vertical flip to reveal Panel 4
        const flipper = document.getElementById('panel2Flipper');
        if (flipper) {
            flipper.classList.add('flipped');
        }
    }
}

async function processAudio() {
    if (!model) return alert("Please set your API Key first.");

    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' }); // Chrome/Firefox usually use webm

    // Convert Blob to Base64
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1]; // Remove "data:audio/webm;base64," prefix

        try {
            const prompt = `
                You are a strict French language tutor. Analyze the user's speech from the audio.
                Return a JSON object with this exact structure (no markdown formatting, just raw JSON):
                {
                    "transcript": "What the user said",
                    "correction": "Corrected French version",
                    "score": "A number 1-10 based on grammar and pronunciation",
                    "feedback": "Bulleted points (using •) of advice on what to improve, each on a new line"
                }
            `;

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        mimeType: "audio/webm", // Adjust if browser uses mp4/ogg, but webm is standard for MediaRecorder
                        data: base64Audio
                    }
                }
            ]);

            const responseText = result.response.text();
            console.log("Raw response:", responseText);

            // Clean markdown code blocks if present
            const cleanJson = responseText.replace(/```json|```/g, '').trim();
            const data = JSON.parse(cleanJson);

            // Update UI
            transcriptText.textContent = data.transcript;
            correctionText.textContent = data.correction;
            scoreDisplay.textContent = data.score + "/10";
            feedbackDetails.innerText = data.feedback;
            statusIndicator.textContent = "Ready";

        } catch (error) {
            console.error("Analysis error:", error);
            statusIndicator.textContent = "Error processing audio.";
            transcriptText.textContent = "Error. See console for details.";
        }
    };
}

function startTimer() {
    let timeLeft = 270; // 4 minutes 30 seconds
    
    const updateDisplay = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${mins}:${secs}`;
    };

    updateDisplay(timeLeft);
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            timeLeft = 0;
            updateDisplay(timeLeft);
            stopRecording();
        } else {
            updateDisplay(timeLeft);
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}
