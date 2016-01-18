var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var canvas = document.getElementById("canvas-id");
canvas.width = 800;
canvas.height = 800;
var ctx = canvas.getContext("2d");

var map=[],road=[],size=128;
var cp=[];//color points on the height map
for(var i=0;i<size+1;i++){
    map[i]=[];
    road[i]=[];
    for(var k=0;k<size+1;k++){
        map[i][k]=0;
        road[i][k]=0;
    }
}
map[0][0]=0;
map[0][size]=0;
map[size][0]=0;
map[size][size]=0;
for(var i=size;i>1;i/=2){
    for(var x=0;x<size;x+=i){
        for(var y=0;y<size;y+=i){
            map[x+i/2][y+i/2]=(map[x][y]+map[x][y+i]+map[x+i][y]+map[x+i][y+i])/4+rand(i/size);
            map[x][y+i/2]=(map[x][y]+map[x][y+i])/2+rand(i/size);
            map[x+i][y+i/2]=(map[x+i][y]+map[x+i][y+i])/2+rand(i/size);
            map[x+i/2][y]=(map[x][y]+map[x+i][y])/2+rand(i/size);
            map[x+i/2][y+i]=(map[x][y+i]+map[x+i][y+i])/2+rand(i/size);
        }
    }
    map[size/2][size/2]=0.1;
}
function rand(x){
    return (Math.random()-0.5)*x*2;
}
cp.push(new colorPoint(0,0,256,-1));//blue
cp.push(new colorPoint(128,128,265,0));//white blue
cp.push(new colorPoint(0,256,0,0));//green
cp.push(new colorPoint(192,192,96,0.5))//white
cp.push(new colorPoint(256,256,200,0.25));//yellow
cp.push(new colorPoint(139,69,19,1));//brown
cp.push(new colorPoint(256,256,256,1.1));
cp.push(new colorPoint(256,256,256,2));
cp.sort(function (a,b){return a.h-b.h});//sort the colors by height

var humans=[];
for(var i=0;i<50;i++){
    humans.push(new human(size/2,size/2));
}
function update() {
    for(var i=0;i<humans.length;i++){
        if(humans[i].route.length==0)
            find_path(humans[i],Math.floor(Math.random()*size),Math.floor(Math.random()*size));
    
        if(humans[i].route.length>0){
            if(road[humans[i].x][humans[i].y]<1){
                road[humans[i].x][humans[i].y]+=0.05;
                if(road[humans[i].x][humans[i].y]>1)   road[humans[i].x][humans[i].y]=1; 
            }
            humans[i].x+=humans[i].route[0].x;
            humans[i].y+=humans[i].route[0].y;
            humans[i].route.shift();
        }
    }
    for(var x=0;x<size;x++){
        for(var y=0;y<size;y++){
            if(road[x][y]>0)road[x][y]-=0.001;
        }
    }
    draw();
   setTimeout(update, 20);
}
function get_color(a){
    for(var i=0;i<cp.length-1;i++){
        if(a<=cp[i+1].h){
            var minr=cp[i].r>cp[i+1].r?cp[i+1].r:cp[i].r,maxr=cp[i].r<cp[i+1].r?cp[i+1].r:cp[i].r,
                ming=cp[i].g>cp[i+1].g?cp[i+1].g:cp[i].g,maxg=cp[i].g<cp[i+1].g?cp[i+1].g:cp[i].g,
                minb=cp[i].b>cp[i+1].b?cp[i+1].b:cp[i].b,maxb=cp[i].b<cp[i+1].b?cp[i+1].b:cp[i].b;
            var pr=1-(cp[i+1].h-a)/(cp[i+1].h-cp[i].h)
            var r=pr*cp[i+1].r+(1-pr)*cp[i].r,
                g=pr*cp[i+1].g+(1-pr)*cp[i].g,
                b=pr*cp[i+1].b+(1-pr)*cp[i].b;
            return "rgb("+Math.round(r)+","+Math.round(g)+","+Math.round(b)+")";
        }
    }
    return 'black';
}
var cs=Math.round(800/size);
for(var x=0;x<size+1;x++){
    for(var y=0;y<size+1;y++){
        ctx.fillStyle=get_color(map[x][y]);
        ctx.fillRect(x*cs,y*cs,cs,cs);
    }
}
var card=ctx.getImageData(0,0,800,800);
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.fillStyle='grey';    
    ctx.putImageData(card,0,0);
    for(var x=0;x<size;x++){
        for(var y=0;y<=size;y++){
            if(road[x][y]>0){
                ctx.globalAlpha=road[x][y]>1?1:road[x][y];
                ctx.fillRect(x*cs,y*cs,cs,cs);
            }
        }
    }
    ctx.globalAlpha=1;
    for(var i=0;i<humans.length;i++){
        ctx.fillStyle='black';
        ctx.beginPath();
        ctx.arc(humans[i].x*cs+cs/2,humans[i].y*cs+cs/2,cs/2,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
    ctx.fillStyle='red';
        ctx.beginPath();
        ctx.arc(humans[i].fx*cs+cs/2,humans[i].fy*cs+cs/2,cs/2,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
    
    }
}
update();
draw();