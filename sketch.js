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

  videoIdle = createVideo('12.mp4');
  videoWork = createVideo('123.mp4');

  // autoplay 대응
  videoIdle.elt.muted = true;
  videoWork.elt.muted = true;

  videoIdle.attribute('muted', '');
  videoIdle.attribute('autoplay', '');
  videoIdle.attribute('playsinline', '');

  videoIdle.loop();
  videoIdle.play(); // 여기서 한 번만 실행

  videoWork.pause();

  videoIdle.hide();
  videoWork.hide();
}

function draw() {
  background(0);

  if (videoIdle.elt.readyState < 2) return;

  cam.loadPixels();

  let motionCount = 0;

  if (prevFrame) {
    for (let i = 0; i < cam.pixels.length; i += 4) {
      let diff = abs(cam.pixels[i] - prevFrame[i]);
      if (diff > 30) motionCount++;
    }
  }

  prevFrame = cam.pixels.slice();

  // 🔥 여기 중요: 상태 바뀔 때만 play 실행
  if (motionCount > 5000 && !isPlaying) {
    isPlaying = true;

    videoWork.time(0);
    videoWork.play();
  }

  if (isPlaying) {
    if (videoWork.elt.readyState >= 2) {
      image(videoWork, 0, 0, width, height);
    }

    if (videoWork.elt.ended) {
      isPlaying = false;

      videoWork.pause();
      videoWork.time(0);
    }

  } else {
    image(videoIdle, 0, 0, width, height);
  }
}
