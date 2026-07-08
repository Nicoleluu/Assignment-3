var drawSketch = function (p) {

  let chair;
  let revealed;

  p.preload = function () {
    chair = p.loadImage("p5/chair.png");
  };

  p.setup = function () {
    let canvas = p.createCanvas(900, 600);
    canvas.parent("chair-sketch");

    revealed = p.createGraphics(900, 600);
    revealed.clear();
  };

  p.draw = function () {
    p.background(247, 244, 238);

    let scale = 0.75;
    let w = chair.width * scale;
    let h = chair.height * scale;
    let x = (p.width - w) / 2;
    let y = (p.height - h) / 2;

    // faint guide image
    p.tint(0, 18);
    p.image(chair, x, y, w, h);
    p.noTint();

    // when dragging, reveal image onto hidden layer
    if (p.mouseIsPressed) {
      revealed.push();

      revealed.drawingContext.save();
      revealed.drawingContext.beginPath();
      revealed.drawingContext.arc(p.mouseX, p.mouseY, 45, 0, Math.PI * 2);
      revealed.drawingContext.clip();

      revealed.image(chair, x, y, w, h);

      revealed.drawingContext.restore();
      revealed.pop();
    }

    // draw revealed parts
    p.image(revealed, 0, 0);

    // brush cursor
    p.noFill();
    p.stroke(90, 120);
    p.strokeWeight(1);
    p.circle(p.mouseX, p.mouseY, 90);

    p.noStroke();
    p.fill(80);
    p.textAlign(p.CENTER);
    p.textSize(14);
    p.text("Hold and drag to reveal the chair sketch", p.width / 2, 565);
  };

};

new p5(drawSketch, "chair-sketch");
