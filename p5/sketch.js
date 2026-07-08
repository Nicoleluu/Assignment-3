var drawSketch = function (p) {

  let chair;
  let reveal;

  p.preload = function () {
    chair = p.loadImage("p5/chair.png");
  };

  p.setup = function () {

    let canvas = p.createCanvas(900, 600);
    canvas.parent("chair-sketch");

    reveal = p.createGraphics(900, 600);
    reveal.background(247, 244, 238, 255);

  };

  p.draw = function () {

    p.background(247, 244, 238);

    let scale = 0.75;

    let w = chair.width * scale;
    let h = chair.height * scale;

    let x = (p.width - w) / 2;
    let y = (p.height - h) / 2;

    // Draw the chair
    p.image(chair, x, y, w, h);

    // Erase mask where the mouse is held
    if (p.mouseIsPressed) {

      reveal.erase();

      reveal.circle(p.mouseX, p.mouseY, 70);

      reveal.noErase();

    }

    // Draw mask over image
    p.image(reveal, 0, 0);

    // Cursor
    p.noFill();
    p.stroke(90);
    p.strokeWeight(1);
    p.circle(p.mouseX, p.mouseY, 70);

    // Instructions
    p.noStroke();
    p.fill(80);
    p.textAlign(p.CENTER);
    p.textSize(14);
    p.text("Click and drag to reveal the drawing", p.width / 2, 565);

  };

};

new p5(drawSketch, "chair-sketch");
