const input = document.querySelector('input');
const audioElem = document.querySelector('audio');
const canvas = document.querySelector('canvas');

const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;

    audioElem.src = URL.createObjectURL(file);
    audioElem.play();


    // Audio Processing

    // 1. Create Audio Context
    // 2. Create Audio Source
    // 3. Create Audio Effects (in our case, we'll analyze)
    // 4. Create Audio Destination

    // Audio context processing graph or simple modular route
    const audioContext = new AudioContext();

    // Source Node
    const audioSource = audioContext.createMediaElementSource(audioElem);

    // Analyzer Node
    const analyser = audioContext.createAnalyser();

    audioSource.connect(analyser);

    // Destination Node
    analyser.connect(audioContext.destination); // Hardware speaker

    analyser.fftSize = 512; // determinses count of sound bar
    const bufferDataLength = analyser.frequencyBinCount; // how many actual number of sound bars

    const bufferDataArr = new Uint8Array(bufferDataLength);

    const barWidth = canvas.width / bufferDataLength;
    let x = 0;

    function drawAndAnimateSoundBars() {
        x = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);

        analyser.getByteFrequencyData(bufferDataArr);

        bufferDataArr.forEach(dataValue => {
            const barHeight = dataValue;

            const red = (barHeight * 2) % 150;
            const green = (barHeight * 5) % 200;
            const blue = (barHeight * 7) % 120;

            context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            context.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth;
        })

        if (!audioElem.ended) requestAnimationFrame(drawAndAnimateSoundBars);
    }

    drawAndAnimateSoundBars();
})