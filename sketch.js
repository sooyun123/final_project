let videoIdle;
let videoWork;
let cam;

let prevFrame;
let isPlaying = false;

function setup() {
  createCanvas(640, 480);

  // 📸 웹캠
  cam = createCapture(VIDEO);
  cam.size(640, 480);
  cam.hide();

  // 🎥 영상 로드
  videoIdle = createVideo('12.mp4');
  videoWork = createVideo('123.mp4');

  // 🔥 Chrome autoplay 해결 (핵심)
  videoIdle.elt.muted = true;
  videoWork.elt.muted = true;

  videoIdle.attribute('muted', '');
  videoWork.attribute('muted', '');

  videoIdle.attribute('autoplay', '');
  videoIdle.attribute('playsinline', '');

  videoWork.attribute('playsinline', '');

  // 🎬 영상 설정
  videoIdle.loop();
  videoIdle.play();

  videoWork.pause();
  videoWork.time(0);

  // 화면에 숨기고 canvas에만 출력
  videoIdle.hide();
  videoWork.hide();
}

function draw() {
  background(0);

  cam.loadPixels();

  let motionCount = 0;

  if (prevFrame) {
    for (let i = 0; i < cam.pixels.length; i += 4) {
      let diff = abs(cam.pixels[i] - prevFrame[i]);

      if (diff > 30) {
        motionCount++;
      }
    }
  }

  prevFrame = cam.pixels.slice();

  // 🔥 움직임 감지 → work 영상 실행
  if (motionCount > 5000 && !isPlaying) {
    isPlaying = true;

    videoWork.time(0);
    videoWork.play();
  }

  // 🎭 상태별 출력
  if (isPlaying) {
    image(videoWork, 0, 0, width, height);

    // 끝나면 idle로 복귀
    if (videoWork.elt.ended) {
      isPlaying = false;
      videoWork.pause();
      videoWork.time(0);
    }

  } else {
    image(videoIdle, 0, 0, width, height);
  }
}
