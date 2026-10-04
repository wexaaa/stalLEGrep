// METHOD
public java.util.List wrap(String text,int width) {
    java.util.List lines=new java.util.ArrayList();
    String remaining=text;
    while(remaining.length()>0) {
        if(renderer.getStringWidth(remaining)<=width) {lines.add(remaining);break;}
        String fit=renderer.trimToWidth(remaining,Math.max(12,width),false);
        if(fit.length()==0) fit=remaining.substring(0,1);
        int space=fit.lastIndexOf(' ');
        int count=space>0?space:fit.length();
        lines.add(remaining.substring(0,count));
        remaining=remaining.substring(count).trim();
    }
    if(lines.isEmpty()) lines.add("");
    return lines;
}
// METHOD
public int rowHeight(String[] row,int index) {
    boolean header=row[2].equals("header");
    int available=getSize().width-26-(header?0:renderer.getStringWidth(row[1])+10);
    int count=wrap(row[0],available).size();
    return count*lineHeight+(header?(index==0?12:23):4);
}
// METHOD
public int viewport() {
    return Math.max(1,getSize().height-16);
}
// METHOD
public int maximum() {
    return Math.max(0,contentHeight-viewport());
}
// METHOD
public void clamp() {
    offset=Math.max(0,Math.min(offset,maximum()));
}
// METHOD
public void refresh() {
    rows=OfflineCharacterStats.rows(net.minecraft.client.qlfw._I()._t);
    contentHeight=0;
    for(int i=0;i<rows.size();i++) contentHeight+=rowHeight((String[])rows.get(i),i);
    clamp();
}
// METHOD
public void tick() {
    refresh();
}
// METHOD
public void handleWheel(int delta,gloomyfolken.mods.core.client.gui.engine.Point mouse) {
    if(delta==0 || !isMouseInBounds(mouse)) return;
    offset+=(delta<0?1:-1)*lineHeight*3;
    clamp();
}
// METHOD
public int thumbHeight() {
    return Math.min(viewport(),Math.max(20,Math.round((float)viewport()*viewport()/Math.max(viewport(),contentHeight))));
}
// METHOD
public int thumbY() {
    return getLocation().y+8+(maximum()==0?0:Math.round((float)(viewport()-thumbHeight())*offset/maximum()));
}
// METHOD
public void seek(gloomyfolken.mods.core.client.gui.engine.Point mouse) {
    int travel=Math.max(1,viewport()-thumbHeight());
    float fraction=(float)(mouse.y-getLocation().y-8-grabOffset)/travel;
    offset=Math.round(Math.max(0.0f,Math.min(1.0f,fraction))*maximum());
    clamp();
}
// METHOD
public void mouseClicked(gloomyfolken.mods.core.client.gui.engine.Point mouse,int button) {
    if(button!=0 || !isMouseInBounds(mouse) || mouse.x<getLocation().x+getSize().width-12 || maximum()==0) return;
    dragging=true;
    int top=thumbY();
    if(mouse.y>=top && mouse.y<top+thumbHeight()) grabOffset=mouse.y-top;
    else {grabOffset=thumbHeight()/2;seek(mouse);}
}
// METHOD
public void mouseDrag(gloomyfolken.mods.core.client.gui.engine.Point mouse,int button) {
    if(button==0 && dragging) seek(mouse);
}
// METHOD
public void mouseUp(gloomyfolken.mods.core.client.gui.engine.Point mouse,int button) {
    dragging=false;
}
// METHOD
public void drawComponent(gloomyfolken.mods.core.client.gui.engine.Point mouse,float frame) {
    if(rows==null) refresh();
    clamp();
    gloomyfolken.mods.core.client.gui.engine.Point pos=getLocation();
    int width=getSize().width,height=getSize().height;
    renderer.drawRect(pos,new uyud(width,height),0xff1d1e1c);
    int cursor=pos.y+8-offset,bottom=pos.y+height-8,right=pos.x+width-18;
    for(int i=0;i<rows.size();i++) {
        String[] row=(String[])rows.get(i);
        boolean header=row[2].equals("header");
        int block=rowHeight(row,i),gap=header && i>0?11:0;
        int available=width-26-(header?0:renderer.getStringWidth(row[1])+10);
        java.util.List lines=wrap(row[0],available);
        // Skip partial rows: no text or alternating stripe may escape the column.
        if(cursor>=pos.y+8 && cursor+block<=bottom) {
            if(!header && i%2==0) renderer.drawRect(new gloomyfolken.mods.core.client.gui.engine.Point(pos.x+5,cursor),new uyud(width-21,block),0xff252623);
            for(int j=0;j<lines.size();j++) renderer.drawString((String)lines.get(j),new gloomyfolken.mods.core.client.gui.engine.Point(pos.x+7,cursor+gap+j*lineHeight),header?0xffc6c5bd:0xffc2c2bb);
            if(header) renderer.drawRect(new gloomyfolken.mods.core.client.gui.engine.Point(pos.x+7,cursor+block-5),new uyud(width-25,1),0xff858680);
            else renderer.drawRightAlignedString(row[1],new gloomyfolken.mods.core.client.gui.engine.Point(right,cursor+(lines.size()-1)*lineHeight/2),Integer.parseInt(row[2]));
        }
        cursor+=block;
        if(cursor>=bottom) break;
    }
    renderer.drawRect(new gloomyfolken.mods.core.client.gui.engine.Point(pos.x+width-7,pos.y+8),new uyud(3,viewport()),0xff383a35);
    renderer.drawRect(new gloomyfolken.mods.core.client.gui.engine.Point(pos.x+width-7,thumbY()),new uyud(3,thumbHeight()),0xffbfc2b8);
}
