import { useEffect } from "react";

import { useSizeValues } from "@/contexts/contextSize";

const AudioVisualizer = ({ url }) => {
  const { width, height } = useSizeValues();

  var BufferLoader = function (sources) {
    this.buffers = {};
    this.context = new AudioContext();
    this.buffer = null;
    this.init();
  };

  BufferLoader.prototype.init = function () {
    try {
      this.context = new AudioContext();
    } catch (_) {
      alert("Web Audio API is not supported in this browser");
    }
  };

  BufferLoader.prototype.onBufferLoadError = function (e) {
    console.log(e);
  };

  BufferLoader.prototype.onBufferLoad = function (
    bufferName,
    srcBuffer,
    callback
  ) {
    this.context?.decodeAudioData(
      srcBuffer,
      function onSuccess(buffer) {
        this.buffers[bufferName] = buffer;
        if (typeof callback === "function") {
          callback();
        }
      }.bind(this),
      this.onBufferError
    );
  };

  BufferLoader.prototype.load = function (bufferName, file, callback) {
    reader = new FileReader();
    reader.onload = function (data) {
      if (data.target && data.target.result) {
        this.onBufferLoad(bufferName, data.target.result, callback);
      }
    }.bind(this);
    reader.readAsArrayBuffer(file);
  };

  BufferLoader.prototype._playBuffer = function (name, gain, time) {
    if (this.context) {
      var source = this.context.createBufferSource();
      source.buffer = this.buffer;
  
      var analyser = this.context.createAnalyser();
  
      source.connect(analyser);
      source.connect(this.context.destination);
      source.start(time);
    }
  };

  BufferLoader.prototype.play = function (name, gain, time) {
    // Default values for time and gain
    gain = typeof gain !== "undefined" ? gain : 1;
    time = typeof time !== "undefined" ? time : 0;

    this.buffer = this.buffers[name];
    if (this.buffer) {
      this._playBuffer(name, time, gain);
    } else {
      throw new Error("Buffer does not exist");
    }
  };

  var rafID = null;
  var analyser = null;
  var c = null;
  var cDraw = null;
  var ctx = null;
  var ctxDraw = null;

  var filename;
  var fileChosen = false;
  var hasSetupUserMedia = false;
  var start = false;

  // Create the context.
  var context;
  var loader;

  // Progress on transfers from the server to the client(downloads)
  function playSample(url) {
    fileChosen = true;
    setupAudioNodes();
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    // When loaded decode the data
    request.onload = function () {
      onWindowResize();
      context.decodeAudioData(request.response, function (buffer) {
        sourceNode.buffer = buffer;
        sourceNode.start(0);
        start = true;
      });
    };
    request.send();
  }

  function initBinCanvas() {
    // Add new canvas
    c = document.getElementById("freq");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    // Get context from canvas for drawing
    ctx = c.getContext("2d");

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    window.addEventListener("resize", onWindowResize, false);

    // Create gradient for the bins
    var gradient = ctx.createLinearGradient(
      0,
      c.height - 300,
      0,
      window.innerHeight - 25
    );
    gradient.addColorStop(1, "#00f"); // black
    gradient.addColorStop(0.75, "#f00"); // red
    gradient.addColorStop(0.25, "#f00"); // yellow
    gradient.addColorStop(0, "#ffff00"); // white

    ctx.fillStyle = "#9c0001";
  }

  function onWindowResize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  }

  var audioBuffer;
  var sourceNode;
  function setupAudioNodes() {
    context = new AudioContext();
    analyser = context.createAnalyser();
    sourceNode = context.createBufferSource();
    sourceNode.connect(analyser);
    rafID = window.requestAnimationFrame(updateVisualization);
  }

  function reset() {
    if (typeof sourceNode !== "undefined" && start == true) {
      sourceNode.stop(0);
      start = false;
    }
  }

  function updateVisualization() {
    // Get the average, bincount is fftsize / 2
    if (fileChosen || hasSetupUserMedia) {
      var array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);

      drawBars(array);
    }
    // setTextAnimation(array);

    rafID = window.requestAnimationFrame(updateVisualization);
  }

  function drawBars(array) {
    // Just show bins with a value over the treshold
    var threshold = 0;
    // Clear the current state
    ctx.clearRect(0, 0, c.width, c.height);
    // The max count of bins for the visualization
    var maxBinCount = array.length;
    // Space between bins
    var space = 3;

    ctx.save();

    ctx.globalCompositeOperation = "source-over";

    ctx.scale(0.5, 0.5);
    ctx.translate(window.innerWidth, window.innerHeight);
    ctx.fillStyle = "#fff";

    var bass = Math.floor(array[1]); // 1Hz Frequenz
    var radius =
      0.45 * width <= 450
        ? -(bass * 0.25 + 0.45 * width)
        : -(bass * 0.25 + 450);

    var bar_length_factor = 1;
    if (width >= 785) {
      bar_length_factor = 1;
    } else if (width < 785) {
      bar_length_factor = 1.5;
    } else if (width < 500) {
      bar_length_factor = 20.0;
    }

    // Go over each bin
    for (var i = 0; i < maxBinCount; i++) {
      var value = array[i];
      if (value >= threshold) {
        // Draw bin
        // ctx.fillRect(0 + i * space, c.height - value, 2 , c.height);
        // ctx.fillRect(i * space, c.height, 2, -value);
        ctx.fillRect(
          0,
          radius,
          width <= 450 ? 2 : 3,
          -value / bar_length_factor
        );
        ctx.rotate(((180 / 128) * Math.PI) / 180);
      }
    }

    for (var i = 0; i < maxBinCount; i++) {
      var value = array[i];
      if (value >= threshold) {
        // Draw bin
        ctx.rotate((-(180 / 128) * Math.PI) / 180);
        ctx.fillRect(
          0,
          radius,
          width <= 450 ? 2 : 3,
          -value / bar_length_factor
        );
      }
    }

    for (var i = 0; i < maxBinCount; i++) {
      var value = array[i];
      if (value >= threshold) {
        // Draw bin
        ctx.rotate(((180 / 128) * Math.PI) / 180);
        ctx.fillRect(
          0,
          radius,
          width <= 450 ? 2 : 3,
          -value / bar_length_factor
        );
      }
    }

    ctx.restore();
  }

  useEffect(() => {
    // Using requestAnimationFrame instead of timeout...
    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = window.webkitRequestAnimationFrame;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    context = new AudioContext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loader = new BufferLoader();

    initBinCanvas();

    playSample(url);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <canvas
      className="absolute left-1/2 -translate-x-1/2 pointer-events-none scale-100 md:scale-75"
      style={{ top: `${-5 + 4 * (height / 3876)}%` }}
      id="freq"
      width={300}
      height={300}
    ></canvas>
  );
};

export default AudioVisualizer;
