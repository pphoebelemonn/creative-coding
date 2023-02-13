let v; 
let fluctuation;
let leaves = [];
let stems = [];
let num_leaves=0; 
let num_vines = 3; 

function preload() {
  img = loadImage("background/wall.jpg");
  img2 = loadImage('background/corner.png');
}

function setup() {
  createCanvas(800, 600);
  image(img, 0, 0, width, height);
  background(230, 225, 220, 130);
  frameRate(40); 
  
  console.log('Start/stop the growth by pressing the mouse.')
  console.log('Press any key to clear and create a new vine ')
  
  let rSeed = int(random(0,1000));
  let nSeed = int(random(0,1000));
  randomSeed(rSeed);
  noiseSeed(nSeed); 
  
  v = new Vine(0, height, 10,11*PI/6+0.05);
  v1 = new Vine(0, height-50, 10, 5*PI/3);
  v3 = new Vine(10,height, 10, 7*PI/4)
  
  stems= [];
  leaves = []
}


function draw() {
  push(); 
  scale(1.25); 
  //image(img2, 0, 0, 150, 95); 
  pop(); 
  noStroke();
  fill(255); 
  fill(0);
  textFont('Georgia');
  textSize(15);
  //text('Vine count: '+num_vines, 15,25);
  if (keyIsPressed) { 
    setup();
  }
  
  if (mouseIsPressed) {
    v.createVines(); 
    v1.createVines(); 
    v3.createVines(); 
    for (let i = 0; i<stems.length; i++){ 
      if (frameCount - stems[i].time > 40){
        stems[i].growStem();
      }
    }
  }
  for (let i = 0; i<stems.length; i++){ 
      if (frameCount - stems[i].time > 40){
        stems[i].growleaf();
      }
    }
}

class Vine {
  constructor(x, y, d, angle) { 
    this.vines = [] 
    this.x = x;
    this.y = y; 
    this.diameter = d;
    this.vine_thickness = 0.5;
    this.direction = angle;
    this.fluctuation = 0;
    this.noiseOffset = random(5);
    this.vine_created_time = frameCount;
    this.time_since_drawn = int(random(50, 80))*(this.diameter);
    }
  
  createVines() { 
    if (this.isOnScreen()) { 
      this.growThisVine(); 
      this.displayVine(true, color(122, 91, 17)); 
      this.growChildren(); 
      this.createStem(); 
    } 
    for (let i=0 ; i<this.vines.length; i++){ 
      this.vines[i].createVines();
    }
  }
  
  growThisVine() {
      this.fluctuation = map(noise(frameCount*0.03 + this.noiseOffset), 0, 1, -PI/2, PI/2);
      let amp = 2;
      this.x += cos(this.fluctuation + this.direction) * amp;
      this.y += sin(this.fluctuation + this.direction) * amp;
      
      if (this.diameter <=2) { 
        this.vine_thickness = 0; 
      }
      else {
        this.vine_thickness = 0.03;
      }
      this.diameter -=this.vine_thickness;
  }
  
  
  displayVine(shading, c){
    if (shading) {
      noStroke();
      fill(122, 91, 17); 
      ellipse(this.x, this.y+2, this.diameter, this.diameter);
    }
    
    stroke(172, 141, 67);
    fill(c);
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
  
  growChildren() { 
    if (frameCount%(this.vine_created_time+80)==0 && frameCount - this.vine_created_time <= 400) {
      this.vines.push(new Vine(this.x, this.y, this.diameter, this.direction+random(-PI/4,PI/4)));
      num_vines+=1;
      } 
  }
  
  isOnScreen(){
    if(this.x > width|| this.x < 0){
      return false;
    }
    if(this.y > height || this.y < 0){
      return false;
    }
    return true;
  }
  
  createStem() { 
    this.time_since_drawn-=8; 
    if (this.time_since_drawn<=0){
      stems.push(new Stem(this.x, this.y, this.diameter, this.direction));
      this.time_since_drawn = int(random(50, 80)/(this.diameter/4));
    }  
  }
}

class Leaf {
  constructor(x, y, d, angle) { 
    this.vineD = d; 
    this.leafX = x; 
    this.leafY = y; 
    this.leafA = angle-PI/6;
    this.current_size = 0;  
    this.max_size = random(0.3, 0.6);
    this.leaf_opacity = random(1, 80); 
  }
  
  continueGrowLeaf() {
      this.current_size+=0.01; 
      push(); 
      translate(this.leafX, this.leafY); 
      scale(this.current_size); 
      rotate(this.leafA+PI/2); 
      beginShape();
        stroke(145, 162, 56); 
        fill(104, 119, 40, this.leaf_opacity); 
        strokeJoin(ROUND); 
        vertex(0, 0); 
        vertex(15, 5); 
        vertex(30, -15); 
        vertex(16, -20); 
        vertex(10, -50);
        vertex(-8, -25);
        vertex(-25, -25);
        vertex(-20, 0); 
      endShape(CLOSE); 
      strokeWeight(2);
      line(0, 0, 10, -47);
      line(0, 0, 28, -12); 
      line(0, 0, -23, -22);  
    pop();
  }
}
class Stem {
  constructor(x, y, d, angle) { 
    this.stemX = x; 
    this.stemY = y; 
    this.stem_direction = [-1, 1][int(random(2))];
    this.stemA = (angle-PI/6*this.stem_direction)*this.stem_direction;
    this.stem_size = random(0.3, 0.6);
    this.VineDia = d;
    this.stemD = this.VineDia/3;
    if (this.stemD <=2) { 
      this.stemD = 2; 
    }
    
    this.end_length = this.VineDia*2; 
    if (this.end_length < 5) { 
      this.end_length = 5
    
    }
    this.s = new Vine(this.stemX, this.stemY, this.stemD, this.stemA);
    this.s_length = 0; 
    
    this.l = null; 
    this.time = frameCount; 
  }
  
  growleaf(){
    if (this.s_length>this.end_length) { 
      if (this.l.current_size <= this.l.max_size) {
        this.l.continueGrowLeaf();
      } 
    }
  }
  
  growStem(){
    let c = lerpColor(color(122, 91,17), color(94, 109, 30), this.s_length/this.end_length)
    if (this.s_length<this.end_length){ 
      this.s.growThisVine();
      this.s.displayVine(false, c); 
      this.s_length+=1; 
      }
      
    if (this.s_length== int(this.end_length)) { 
      this.l = new Leaf(this.s.x, this.s.y, this.VineDia, this.s.direction); 
      this.s_length++;
      }
    
    
  }
}
