let videoIdle;
let videoWork;
let cam;

let prevFrame;
let isPlaying = false;

function setup() {
  createCanvas(640, 480);

  // 📸 webcam
  cam = createCapture(VIDEO);
  cam.size(640, 480);
  cam.hide();

  // 🎥 HTML video 직접 생성 (중요🔥)
  videoIdle = document.createElement('video');
  videoIdle.src = '12.mp4';
  videoIdle.muted = true;
  videoIdle.loop = true;
  videoIdle.playsInline = true;
  videoIdle.autoplay = true;
  videoIdle.play();

  videoWork = document.createElement('video');
  videoWork.src = '123.mp4';
  videoWork.muted = true;
  videoWork.playsInline = true;
}

function draw() {
  background(0);

  if (videoIdle.readyState < 2) return;

  cam.loadPixels();

  let motionCount = 0;

  if (prevFrame) {
    for (let i = 0; i < cam.pixels.length; i += 4) {
      let diff = abs(cam.pixels[i] - prevFrame[i]);
      if (diff > 30) motionCount++;
    }
  }

  prevFrame = cam.pixels.slice();

  // 🔥 상태 바뀔 때만 play
  if (motionCount > 5000 && !isPlaying) {
    isPlaying = true;

    videoWork.currentTime = 0;
    videoWork.play();
  }

  if (isPlaying) {
    image(videoWork, 0, 0, width, height);

    if (videoWork.ended) {
      isPlaying = false;
    }

  } else {
    image(videoIdle, 0, 0, width, height);
  }
}
