// Set the date of the birthday
const birthdayDate = new Date("2024-09-10T00:00:00").getTime();
const flame = document.getElementById("flame");
const birthdayMessage = document.getElementById("birthdayMessage");
const backgroundMusic = document.getElementById("backgroundMusic");
const balloons = document.getElementById("balloons");

// Countdown timer
const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const timeLeft = birthdayDate - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML = `Tiempo hasta tu cumpleaños: ${days}d ${hours}h ${minutes}m ${seconds}s`;

    // If countdown reaches 0
    if (timeLeft < 0) {
        clearInterval(countdownInterval);
        document.getElementById("countdown").innerHTML = "🎉Prende tu micrófono y sopla la vela";
        lightCandle(); // Show the candle and start microphone detection
    }
}, 1000);

// Function to show balloons
function showBalloons() {
    balloons.classList.remove("hidden"); // Show balloons
}

// Function to light the candle
function lightCandle() {
    flame.classList.remove("hidden"); // Reveal the flame
    startMicrophoneDetection(); // Start microphone detection after lighting the candle
}

// Function to detect sound using the microphone
function startMicrophoneDetection() {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const microphone = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 128; // Reduce the size for better performance

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            microphone.connect(analyser);

            let previousVolume = 0;
            let checkInterval = 100; // Check every 100 milliseconds

            function detectBlow() {
                analyser.getByteFrequencyData(dataArray);
                const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

                // Threshold to detect blowing (adjust as needed)
                if (volume > 150 && volume > previousVolume) {
                    console.log("Detected blow!");
                    extinguishCandle(); // Call function to extinguish the candle
                }

                previousVolume = volume;
                setTimeout(detectBlow, checkInterval); // Check periodically
            }

            detectBlow(); // Start detecting sound
        })
        .catch(function(err) {
            console.error("Microphone access denied or not available.", err);
        });
    } else {
        console.log("getUserMedia not supported on your browser.");
    }
}

// Function to extinguish the candle
function extinguishCandle() {
    flame.classList.add("hidden"); // Hide the flame (candle extinguished)
    birthdayMessage.classList.remove("hidden"); // Show 'Happy Birthday' message

    // Play background music
    backgroundMusic.play();

    // Trigger confetti
    triggerConfetti();

    // Show balloons
    showBalloons();
}

// Function to trigger confetti
function triggerConfetti() {
    confetti({
        particleCount: 200, // Number of confetti particles
        spread: 70, // Spread of the confetti
        origin: { y: 0.6 } // Position where the confetti will start
    });
}
