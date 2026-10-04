// METHOD
public int visibleRows() {
    return Math.max(1,(getSize().height-30)/lineHeight);
}
// METHOD
public void refresh() {
    jlas player=net.minecraft.client.qlfw._I()._t;
    rows=OfflineCharacterStats.rows(player);
    clamp();
}
// METHOD
public void clamp() {
    int count=rows==null?0:rows.size();
    offset=Math.max(0,Math.min(offset,Math.max(0,count-visibleRows())));
}
// METHOD
public void tick() {
    refresh();
}
// METHOD
public void handleWheel(int delta,gloomyfolken.mods.core.client.gui.engine.Point mouse) {
    if(delta==0 || !isMouseInBounds(mouse)) return;
    offset+=delta<0?3:-3;
    clamp();
}
// METHOD
public void seek(gloomyfolken.mods.core.client.gui.engine.Point mouse) {
    if(rows==null) return;
    int max=Math.max(0,rows.size()-visibleRows());
    float fraction=(float)(mouse.y-getLocation().y-10)/(float)Math.max(1,getSize().height-30);
    offset=Math.round(Math.max(0.0f,Math.min(1.0f,fraction))*max);
    clamp();
}
// METHOD
public void mouseClicked(gloomyfolken.mods.core.client.gui.engine.Point mouse,int button) {
    if(button==0 && isMouseInBounds(mouse) && mouse.x>=getLocation().x+getSize().width-14) {
        dragging=true;
        seek(mouse);
    }
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
    renderer.drawRect(pos,new uyud(width,height),0xf01c1d1b);
    renderer.drawRect(pos,new uyud(width,1),0xff484a44);
    int visible=visibleRows(),end=Math.min(rows.size(),offset+visible);
    for(int i=offset;i<end;i++) {
        String[] row=(String[])rows.get(i);
        int y=pos.y+8+(i-offset)*lineHeight;
        if(row[2].equals("header")) {
            renderer.drawString(row[0],new gloomyfolken.mods.core.client.gui.engine.Point(pos.x+10,y),0xffc6c5bd);
            renderer.drawRect(new gloomyfolken.mods.core.client.gui.engine.Point(pos.x+10,y+lineHeight-3),new uyud(width-32,1),0xff505149);
        } else {
            if(i%2==0) renderer.drawRect(new gloomyfolken.mods.core.client.gui.engine.Point(pos.x+6,y-1),new uyud(width-26,lineHeight),0x18111111);
            int right=pos.x+width-23;
            int labelWidth=Math.max(20,width-35-renderer.getStringWidth(row[1])-12);
            String label=renderer.trimToWidth(row[0],labelWidth,false);
            renderer.drawString(label,new gloomyfolken.mods.core.client.gui.engine.Point(pos.x+10,y),0xffc2c2bb);
            renderer.drawRightAlignedString(row[1],new gloomyfolken.mods.core.client.gui.engine.Point(right,y),Integer.parseInt(row[2]));
        }
    }
    int max=Math.max(0,rows.size()-visible),track=height-30;
    int thumb=Math.max(18,Math.round((float)track*(float)visible/(float)Math.max(visible,rows.size())));
    int travel=Math.max(0,track-thumb),thumbY=pos.y+8+(max==0?0:Math.round((float)travel*(float)offset/(float)max));
    renderer.drawRect(new gloomyfolken.mods.core.client.gui.engine.Point(pos.x+width-12,pos.y+8),new uyud(4,track),0xff373a34);
    renderer.drawRect(new gloomyfolken.mods.core.client.gui.engine.Point(pos.x+width-12,thumbY),new uyud(4,thumb),0xff858c78);
    renderer.drawString("Колесо мыши  ·  "+(offset+1)+"–"+end+" / "+rows.size(),new gloomyfolken.mods.core.client.gui.engine.Point(pos.x+10,pos.y+height-17),0xff81867b);
}
