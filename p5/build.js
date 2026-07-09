let buildSketch = function(p){

    let step = 0;
    let timer = 0;

    p.setup = function(){

        let canvas = p.createCanvas(700,500);

        canvas.parent("build-canvas");

        p.rectMode(p.CENTER);

    };

    p.draw = function(){

        p.background(247,244,238);

        p.translate(p.width/2,p.height/2+80);

        timer++;

        if(timer>60){
            step++;
            timer=0;

            if(step>5){
                step=5;
            }
        }

        p.noStroke();
        p.fill(120,78,45);

        // legs
        if(step>=1){

            p.rect(-70,20,14,120);
            p.rect(70,20,14,120);

        }

        // back legs
        if(step>=2){

            p.rect(-40,0,14,120);
            p.rect(40,0,14,120);

        }

        // seat
        if(step>=3){

            p.rect(0,-35,150,16);

        }

        // back support
        if(step>=4){

            p.rect(0,-105,16,110);

        }

        // backrest
        if(step>=5){

            p.rect(0,-155,120,70);

        }

    };

};

new p5(buildSketch);
