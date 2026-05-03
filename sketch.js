let videoIdle;
let videoWork;
let cam;

let prevFrame;
let isPlaying = false;

function setup() {
  createCanvas(640, 480);

  cam = createCapture(VIDEO);
  cam.size(640, 480);
  cam.hide();

  // 🎥 idle 영상
  videoIdle = document.createElement('video');
  videoIdle.src = '12.mp4';
  videoIdle.muted = true;
  videoIdle.loop = true;
  videoIdle.playsInline = true;
  videoIdle.autoplay = true;
  videoIdle.play();

  // 🎥 work 영상 (처음엔 src 안 넣음🔥)
  videoWork = document.createElement('video');
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

  // 🔥 움직임 감지 시에만 videoWork 로드
  if (motionCount > 5000 && !isPlaying) {
    isPlaying = true;

    videoWork.src = '123.mp4'; // 여기서 처음 로드🔥
    videoWork.currentTime = 0;
    videoWork.play();
  }

  if (isPlaying) {
    if (videoWork.readyState >= 2) {
      image(videoWork, 0, 0, width, height);
    }

    if (videoWork.ended) {
      isPlaying = false;
      videoWork.src = ''; // 🔥 다시 비워서 충돌 방지
    }

  } else {
    image(videoIdle, 0, 0, width, height);
  }
}
