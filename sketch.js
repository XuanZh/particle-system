
var particleSystem = [];

var song;

var attractors = [];

function preload(){
    
    song = loadSound('1.wav');
    
}

function setup(){
    var canvas = createCanvas(windowWidth, windowHeight);
    //background(0);
    frameRate(30);
    
    
    colorMode(HSB, 360, 100, 100, 100);
    
    //var at = new Attractor(createVector(width/2, height/2), 5)
    //attractors.push(at);

}


function draw(){
    background(0);
    blendMode(SCREEN);
    
    for(var i=particleSystem.length-1; i>=0; i--){
        var p = particleSystem[i];
        if(p.areYouDeadYet()){
            //removes the particle from the array
            
            particleSystem.splice(i, 1);
            
            /*if(particleSystem.length<300){
            createMightyParticles(p.getPos());}*/
            
        }else{
            //updates and renders the particle
            p.update();
            p.draw();
            
        }
    }
    
    if(mouseIsPressed){
        createMightyParticles();
    
    }
    attractors.forEach(function(at){
       at.draw();
    });
            
}
        

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);

}



var Particle = function(position, velocity, acceleration, hue, A){
    var position = position.copy();
    var velocity = velocity.copy();
    var acceleration = acceleration.copy();
    
    this.size = random(10, 50);
    //this.size = 30;
    
    //var initiallifeSpan = random(10,100);
    var initiallifeSpan = 50;
        
    this.lifeSpan = initiallifeSpan;
    
    this.hue = (random(hue-5, hue+5));
    //this.hue = 200;
    
    //this.pos.add(0);
    
    
    this.update = function(){
        this.lifeSpan -= 0.1; //  此处是每次减小0.1，
        
        //因为一个particle sys对应一个attractor，之前我们已经存入了即line 177处注释。所以在这里我们提取它A，不要foreach了，因为只对应一个attractor。再计算相对的距离。
        //attractors.forEach(function(A){
                var att = p5.Vector.sub(A.getPos(),position);
                var distanceSq = att.magSq();
                att.rotate(HALF_PI/3);  //逆时针旋转30度,每次旋转速度的方向和速率都会变，一直到106行

                if(distanceSq > 1){
                    att.div(distanceSq);
                    att.mult(16*A.getStrength());
                    acceleration.add(att);
                }            
            //}
        //});
        
        velocity.add(acceleration);  
        position.add(velocity); 
    
        acceleration.mult(0);
        velocity.limit(100);
    }
        
    this. getPos = function (){
        return position.copy();
    }
      
     this. getVel = function (){
        return velocity.copy();
    }
     this. Acceleration = function (){
        return acceleration.copy();
    }
    
    
     
     
    this.draw = function(){
      
        var transparency = map(this.lifeSpan, 0, initiallifeSpan, 0, 50);
        
    
        //strokeWeight(0.5);
        //stroke(0,100,100,transparence);
        //line(position.x,position.y,position.x-5*velocity.x,position.y-5*velocity.y);
        
        ellipse(position.x,position.y,this.size*this.lifeSpan/120, this.size*this.lifeSpan/120);
        
        noStroke();
        
        fill(this.hue, 200, 50, transparency);
        //ellipse(position.x, position.y, this.size*this.lifeSpan/100, this.size*this.lifeSpan/100);
        
    }
    this.areYouDeadYet = function(){
        return this.lifeSpan <= 0;
        
    }
    

}

function createMightyParticles(initialPos){
  
    var att = new Attractor(createVector(mouseX, mouseY), 5); // 每点一下鼠标，我们就产生一个新的attractor。
    attractors.push(att);
    
      
    song.play();
    
    var hue = random(10, 500);

    
    for(var i=0; i<200; i++){
        
        var pos;
        var change = i*TWO_PI/20; // 在一个圆上画20点，
        
        if(!initialPos){
            pos = createVector(mouseX+200*cos(change), mouseY+200*sin(change));  // pos 是particle system里点的位置， 让这些点同时出现一个圆上
        }
        else{
            pos = initialPos.copy();

        }
        //var pos = createVector(mouseX, mouseY);
        var vel = createVector(0,1); // 初速度改成0，0
        var acceleration = createVector(0, 0);
        vel.rotate(random(10, TWO_PI));
        //vel.mult(random(1, 10));
        
        var newBorn = new Particle(pos, vel, acceleration, hue, att); //将新建的attractor， att存入新建的particle sys。
        particleSystem.push(newBorn);
        
    }
    
}


function mouseClicked(){

    createMightyParticles();
    
}

var Attractor = function(pos,s){
    
   var pos = pos.copy();
   var strength = s;
    
    this.draw = function(){
        //noStroke();
        
        //fill(100,100,100);

        //ellipse(pos.x, pos.y, strength, strength);
    }
    
    this.getStrength = function (){
        return strength;
    }
    this.getPos = function(){
        return pos.copy();
    }

};

// A vector P that points from A to B is given by B minus A. P = sub (B,A);