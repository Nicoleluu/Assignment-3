let chair;
let reveal;

function preload() {
  chair = p.loadImage("p5/chair.png");
}

function setup() {
  let canvas = createCanvas(900,600);
canvas.parent("chair-sketch");
  
  reveal = createGraphics(width,height);
  reveal.background(247,244,238);
}

function draw() {

  background(247,244,238);

  let scale = 0.75;

  let w = chair.width * scale;
  let h = chair.height * scale;

  let x = (width-w)/2;
  let y = (height-h)/2;

  image(chair,x,y,w,h);

  if(mouseIsPressed){

    reveal.erase();

    reveal.circle(mouseX,mouseY,70);

    reveal.noErase();

  }

  image(reveal,0,0);

  noFill();
  stroke(90);
  strokeWeight(1);
  circle(mouseX,mouseY,70);

}
new p5(drawSketch, "chair-sketch");
