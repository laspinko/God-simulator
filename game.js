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
            //console.log(i);
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
function colorPoint(r,g,b,h){
    this.r=r;this.g=g;this.b=b;this.h=h;
    return this;
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
function human(x,y){
    this.x=x;this.y=y;this.route=[];
    this.fx=x;this.fy=y;
    return this;
}
function way(x,y){
    this.x=x;this.y=y;
    return this;
}
for(var i=0;i<50;i++){
    humans.push(new human(size/2,size/2));
}
window.addEventListener("keydown", function (args) {
	
}, false);

window.addEventListener("keyup", function (args) {
	
}, false);

window.addEventListener("mouseup", function (args) {	
	
}, false);

window.addEventListener("mousemove", function (args) {	
	
}, false);

window.addEventListener("mousedown", function (args) {	
	
}, false);


function update() {
    for(var i=0;i<humans.length;i++){
        if(humans[i].route.length==0)
            /*while(!*/dijkstra(humans[i],Math.floor(Math.random()*size),Math.floor(Math.random()*size));
    
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
function dijkstra(h,endx,endy){
    var use=[],fx=[],fy=[];
    for(var x=0;x<=size;x++){
        use[x]=[];
        fx[x]=[];
        fy[x]=[];
        for(var y=0;y<=size;y++){
            use[x][y]=false;
            fx[x][y]=x;
            fy[x][y]=y;
        }
    }
    var st=new PriorityQueue({ comparator: function(a, b) { return a.pr - b.pr; }}),usest=[];
    st.queue({x:h.x,y:h.y,pr:0});
    usest[0]=true;
    use[h.x][h.y]=true;
    var cx,cy;
    var ans=[];
    var from=0;
    var m;
    while(st.length>0){
        cx=st.peek().x;
        cy=st.peek().y;
        use[cx][cy]=true;
        if(cx==endx && cy==endy){
            var bx=cx,by=cy;
            while(bx!=h.x || by!=h.y){
                ans.unshift(new way(bx-fx[bx][by],by-fy[bx][by]));
                var z=bx;
                bx=fx[z][by];
                by=fy[z][by];
            }
            h.route=ans;
            h.fx=endx;
            h.fy=endy;
            return true;
        }
        if(cx-1>=0 && cx-1<size && cy>0 && cy<=size && !use[cx-1][cy] && map[cx-1][cy]>0){
            st.queue({x:cx-1,y:cy,pr:st.peek().pr+(Math.abs(map[cx-1][cy]-map[cx][cy])*size*size*(1-road[cx][cy])+1)});
            usest[usest.length]=true;
            fx[cx-1][cy]=cx;
            fy[cx-1][cy]=cy;
            use[cx-1][cy]=true;
        }
        if(cx>=0 && cx<size && cy-1>0 && cy-1<=size && !use[cx][cy-1] && map[cx][cy-1]>0){
            st.queue({x:cx,y:cy-1,pr:st.peek().pr+(Math.abs(map[cx][cy-1]-map[cx][cy])*size*size*(1-road[cx][cy])+1)});
            usest[usest.length]=true;
            fx[cx][cy-1]=cx;
            fy[cx][cy-1]=cy;
            use[cx][cy-1]=true;
        }
        if(cx+1>=0 && cx+1<size && cy>0 && cy<=size && !use[cx+1][cy] && map[cx+1][cy]>0){
            st.queue({x:cx+1,y:cy,pr:st.peek().pr+(Math.abs(map[cx+1][cy]-map[cx][cy])*size*size*(1-road[cx][cy])+1)});
            usest[usest.length]=true;
            fx[cx+1][cy]=cx;
            fy[cx+1][cy]=cy;
            use[cx+1][cy]=true;
        }
        if(cx>=0 && cx<size && cy+1>0 && cy+1<=size && !use[cx][cy+1] && map[cx][cy+1]>0){
            st.queue({x:cx,y:cy+1,pr:st.peek().pr+(Math.abs(map[cx][cy+1]-map[cx][cy])*size*size*(1-road[cx][cy])+1)});
            usest[usest.length]=true;
            fx[cx][cy+1]=cx;
            fy[cx][cy+1]=cy;
            use[cx][cy+1]=true;
        }
        st.dequeue();
    }
    return false;
}
function null_roads(){
    for(var x=0;x<size;x++){
        for(var y=0;y<size;y++){
            road[x][y]=0;
        }
    }
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
var card=ctx.getImageData(0,0,800,800),card_img=new Image();
var roadmap=ctx.createImageData(800,800),roadmap_img=new Image();
for(var x=0;x<size;x++){
    for(var y=0;y<size;y++){
        for(var sx=0;sx<cs;sx++){
            for(var sy=0;sy<cs;sy++){
                draw_pixel_imageData(roadmap,Math.floor(x*cs)+sx,Math.floor(y*cs)+sy,1281,128,128,0);
            }
        }
    }
}
function draw_pixel_imageData(i,x,y,r,g,b,a){
    var n=(y*i.width+x)*4;
    i.data[n]=r;
    i.data[n+1]=g;
    i.data[n+2]=b;
    i.data[n+3]=a;
}
var merge=ctx.createImageData(800,800);
function merdge_img(a,b){
    for(var i=0;i<a.data.length;i+=4){
        merge.data[i]=a.data[i]*a.data[i+3]+b.data[i]*b.data[i+3];
        merge.data[i+1]=a.data[i+1]*a.data[i+3]+b.data[i+1]*b.data[i+3];
        merge.data[i+2]=a.data[i+2]*a.data[i+3]+b.data[i+2]*b.data[i+3];
    }
}
merdge_img(card,roadmap);
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
    //requestAnimationFrame(draw);
}
update();
draw();