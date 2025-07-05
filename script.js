    let counter = 0;
    const counterEl = document.getElementById("counter");
    const addBtn = document.getElementById("addBtn");
    const name="Sitora"

    addBtn.addEventListener("click", () => {
      counter++;
      counterEl.innerText = counter;
      dropCandles(1);
    });

    function dropCandles(num) {
      const container = document.getElementById("candles-container");
      for (let i = 0; i < num; i++) {
        const candle = document.createElement("div");
        candle.classList.add("candle");

        const baseLeft = Math.random() * 240 + 40;
        const offset = (Math.random() - 0.5) * 20;
        const finalLeft = baseLeft + offset;
        candle.style.left = `${finalLeft}px`;

        const levels = [-150, -165, -180];
        const randomY = levels[Math.floor(Math.random() * levels.length)];
        candle.dataset.targetTop = randomY;

        container.appendChild(candle);
        setTimeout(() => {
          candle.style.top = `${candle.dataset.targetTop}px`;
        }, 50);
      }
    }

    function enableMicrophone() {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const audioContext = new AudioContext();
          const mic = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          mic.connect(analyser);

          function checkVolume() {
            analyser.getByteFrequencyData(dataArray);
            const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;

            if (avg > 60) {
              extinguishCandlesRandomly();
            }
            requestAnimationFrame(checkVolume);
          }
          checkVolume();
        });
    }

    function extinguishCandlesRandomly() {
      const candles = Array.from(document.querySelectorAll(".candle:not(.extinguished)"));
      const shuffled = candles.sort(() => Math.random() - 0.5);
      shuffled.forEach((candle, i) => {
        const delay = Math.random() * 700 + i * 50;
        setTimeout(() => {
          candle.classList.add("extinguished");
          if (i === shuffled.length - 1) {
            setTimeout(showPopup, 800);
          }
        }, delay);
      });
    }

    function showPopup() {
      const popup = document.createElement("div");
      popup.className = "popup";
      popup.innerText = `Happy birthday, ${name}!`;
      document.body.appendChild(popup);
      throwConfetti();
      setTimeout(() => {
        popup.remove();
        resetCake();
      }, 5000);
    }

    function throwConfetti() {
      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = `-${Math.random() * 100}px`;
        confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
      }
    }

    function resetCake() {
      document.querySelectorAll(".candle").forEach(el => el.remove());
      counter = 0;
      counterEl.innerText = counter;
    }

    enableMicrophone();