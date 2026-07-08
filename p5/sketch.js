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

  p.background(247,244,238);

  let scale = 0.75;

  let w = chair.width * scale;
  let h = chair.height * scale;

  let x = (p.width - w)/2;
  let y = (p.height - h)/2;

  // keep the beige cover
  p.image(reveal,0,0);

  if(p.mouseIsPressed){

    reveal.erase();
    reveal.circle(p.mouseX,p.mouseY,70);
    reveal.noErase();

  }

  // clip the chair to the revealed area
  p.push();

  p.drawingContext.save();
  p.drawingContext.globalCompositeOperation = "destination-over";

  p.image(chair,x,y,w,h);

  p.drawingContext.restore();

  p.pop();

  // cursor
  p.noFill();
  p.stroke(90);
  p.circle(p.mouseX,p.mouseY,70);

}

};

new p5(drawSketch, "chair-sketch");
