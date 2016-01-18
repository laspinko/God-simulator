function colorPoint(r,g,b,h){
    this.r=r;this.g=g;this.b=b;this.h=h;
    return this;
}
function human(x,y){
    this.x=x;this.y=y;this.route=[];
    this.fx=x;this.fy=y;
    return this;
}
function way(x,y){
    this.x=x;this.y=y;
    return this;
}