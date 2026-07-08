var drawSketch = function (p) {

  let chair;

  p.preload = function () {
    chair = p.loadImage(
      "p5/chair.png",
      () => console.log("IMAGE LOADED"),
      () => console.log("IMAGE FAILED")
    );
  };

  p.setup = function () {
    let canvas = p.createCanvas(900, 600);
    canvas.parent("chair-sketch");
  };

  p.draw = function () {
    p.background(240);

    if (chair) {
      p.image(chair, 100, 50, 500, 500);
    }
  };

};

new p5(drawSketch, "chair-sketch");
