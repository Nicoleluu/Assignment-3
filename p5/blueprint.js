function setup() {

  let canvas = createCanvas(1100, 550));

  canvas.parent("blueprint-canvas");

}

function draw() {
  background(247, 244, 238);

  // -----------------------------
  // Title
  // -----------------------------
  noStroke();
  fill(50);
  textAlign(LEFT);
  textSize(26);
  text("Bent Laminated Plywood", 50, 55);

  textSize(14);
  fill(120);
  text("Move the mouse → Flat to Formed", 50, 80);

  // Progress (0–1)
  let t = map(mouseX, 0, width, 0, 1);
  t = constrain(t, 0, 1);

  // Maximum bend
  let maxBend = 90;

  // Draw plywood layers
  strokeWeight(3);
  noFill();

  for (let y = 170; y <= 430; y += 12) {

    let wood = map(y,170,430,175,215);
    stroke(wood,145,90);

    beginShape();

    for (let x = 120; x <= 780; x += 8) {

      // normalized x (0 → 1)
      let u = map(x,120,780,0,1);

      // nice smooth arch
      let curve = sin(u * PI);

      // whole sheet bends together
      let offset = -maxBend * curve * t;

      vertex(x, y + offset);

    }

    endShape();
  }

  // -----------------------------
  // Mold
  // -----------------------------
  noFill();
  stroke(80,80);
  strokeWeight(2);

  beginShape();
  for(let x=120;x<=780;x+=8){

    let u=map(x,120,780,0,1);
    let curve=sin(u*PI);

    vertex(x,170-maxBend*curve);

  }
  endShape();

  beginShape();
  for(let x=120;x<=780;x+=8){

    let u=map(x,120,780,0,1);
    let curve=sin(u*PI);

    vertex(x,430-maxBend*curve);

  }
  endShape();

  // -----------------------------
  // Progress text
  // -----------------------------
  noStroke();
  fill(80);
  textAlign(CENTER);
  textSize(14);

  if(t < 0.33){
    text("Stage 1 · Flat Veneers", width/2, 520);
  }
  else if(t < 0.66){
    text("Stage 2 · Pressing into Mold", width/2, 520);
  }
  else{
    text("Stage 3 · Formed Plywood", width/2, 520);
  }

  // Progress bar
  stroke(180);
  line(180,550,720,550);

  noStroke();
  fill(90);
  ellipse(180 + t*540,550,14);
}
