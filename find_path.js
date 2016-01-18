function find_path(h,endx,endy){
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