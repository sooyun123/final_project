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

  // 🎥 영상
  videoIdle = createVideo('12.mp4');
  videoWork = createVideo('123.mp4');

  // idle만 반복
  videoIdle.loop();

  // work는 수동 제어
  videoWork.pause();
  videoWork.time(0);

  // 화면에 안 보이게
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

      // 🔥 작은 노이즈 무시
      if (diff > 30) {
        motionCount++;
      }
    }
  }

  prevFrame = cam.pixels.slice();

  // 🔥 움직임 감지 → work 시작
  if (motionCount > 5000 && !isPlaying) {
    isPlaying = true;
    videoWork.time(0);
    videoWork.play();
  }

  // 🎭 상태에 따라 출력
  if (isPlaying) {
    image(videoWork, 0, 0, width, height);

    // 영상 끝나면 idle로
    if (videoWork.elt.ended) {
      isPlaying = false;
      videoWork.pause();
      videoWork.time(0);
    }

  } else {
    image(videoIdle, 0, 0, width, height);
  }
}