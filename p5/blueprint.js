var materialSketch = function (p) {

  p.setup = function () {

    let canvas = p.createCanvas(1100, 550);
    canvas.parent("material-canvas");

  };

  p.draw = function () {

    p.background(247, 244, 238);

    // -----------------------------
    // Title
    // -----------------------------
    p.noStroke();
    p.fill(50);
    p.textAlign(p.LEFT);
    p.textSize(26);
    p.text("Bent Lamination", 50, 55);

    p.textSize(14);
    p.fill(120);
    p.text("Move the mouse → Flat to Formed", 50, 80);

    // Progress
    let t = p.map(p.mouseX, 0, p.width, 0, 1);
    t = p.constrain(t, 0, 1);

    let maxBend = 90;

    // -----------------------------
    // Plywood Layers
    // -----------------------------
    p.strokeWeight(3);
    p.noFill();

    for (let y = 170; y <= 430; y += 12) {

      let wood = p.map(y, 170, 430, 175, 215);

      p.stroke(wood, 145, 90);

      p.beginShape();

      for (let x = 120; x <= 780; x += 8) {

        let u = p.map(x, 120, 780, 0, 1);

        let curve = p.sin(u * p.PI);

        let offset = -maxBend * curve * t;

        p.vertex(x, y + offset);

      }

      p.endShape();

    }

    // -----------------------------
    // Mold
    // -----------------------------
    p.noFill();
    p.stroke(80, 80);
    p.strokeWeight(2);

    p.beginShape();

    for (let x = 120; x <= 780; x += 8) {

      let u = p.map(x, 120, 780, 0, 1);

      let curve = p.sin(u * p.PI);

      p.vertex(x, 170 - maxBend * curve);

    }

    p.endShape();

    p.beginShape();

    for (let x = 120; x <= 780; x += 8) {

      let u = p.map(x, 120, 780, 0, 1);

      let curve = p.sin(u * p.PI);

      p.vertex(x, 430 - maxBend * curve);

    }

    p.endShape();

    // -----------------------------
    // Stage Text
    // -----------------------------
    p.noStroke();
    p.fill(80);
    p.textAlign(p.CENTER);
    p.textSize(14);

    if (t < 0.33) {

      p.text("Stage 1 · Flat Veneers", p.width / 2, 520);

    } else if (t < 0.66) {

      p.text("Stage 2 · Pressing into Mold", p.width / 2, 520);

    } else {

      p.text("Stage 3 · Formed Plywood", p.width / 2, 520);

    }

    // -----------------------------
    // Progress Bar
    // -----------------------------
    p.stroke(180);
    p.line(180, 540, 720, 540);

    p.noStroke();
    p.fill(90);
    p.ellipse(180 + t * 540, 540, 14);

  };

};

new p5(materialSketch);
