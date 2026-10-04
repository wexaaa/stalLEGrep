// METHOD
public void func_73866_w_() {
    getElementsList().clearElements();
    search=new gloomyfolken.mods.core.client.gui.engine.component.McTextField(this,screenWidth/2-240,screenHeight/2-165,480,28);
    search.tipText="Поиск артефакта в своём инвентаре";
    search.setMaxStringLength(80);
    addElement(search);
    rows=new java.util.ArrayList();
    all=OfflineResearch.entries(net.minecraft.client.qlfw._I()._t);
    page=0; query=""; rebuild();
}
// METHOD
public void addButton(int x,int y,int width,String label,String action) {
    OfflineResearchButton button=new OfflineResearchButton(this,x,y,label,action);
    button.setSize(new uyud(width,26));
    addElement(button); rows.add(button);
}
// METHOD
public void rebuild() {
    for(int i=0;i<rows.size();i++) removeElement((gloomyfolken.mods.core.client.gui.engine.component.GuiComponent)rows.get(i));
    rows.clear();
    java.util.List matches=new java.util.ArrayList();
    java.util.Iterator it=all.entrySet().iterator();
    while(it.hasNext()) {
        java.util.Map.Entry entry=(java.util.Map.Entry)it.next();
        if(((String)entry.getValue()).toLowerCase(java.util.Locale.ROOT).indexOf(query.toLowerCase(java.util.Locale.ROOT))>=0) matches.add(entry);
    }
    pages=Math.max(1,(matches.size()+9)/10); page=Math.max(0,Math.min(page,pages-1));
    for(int row=0;row<10 && page*10+row<matches.size();row++) {
        java.util.Map.Entry entry=(java.util.Map.Entry)matches.get(page*10+row);
        addButton(screenWidth/2-240,screenHeight/2-125+row*30,480,(String)entry.getValue(),(String)entry.getKey());
    }
    addButton(screenWidth/2-240,screenHeight/2+190,120,"Назад","@prev");
    addButton(screenWidth/2-60,screenHeight/2+190,120,"Закрыть","@close");
    addButton(screenWidth/2+120,screenHeight/2+190,120,"Далее","@next");
}
// METHOD
public void choose(String action) {
    if(action.equals("@close")) { closeScreen(); return; }
    if(action.equals("@prev")) { page--; rebuild(); return; }
    if(action.equals("@next")) { page++; rebuild(); return; }
    try { net.minecraft.client.qlfw._I()._t._f(OfflineSpawner.command(action)); closeScreen(); }
    catch(Exception failure) { net.minecraft.client.qlfw._I()._t.func_71035_c("[Исследование] "+failure.getMessage()); }
}
// METHOD
public void func_73876_c() {
    super.func_73876_c();
    String text=search.getText();
    if(!text.equals(query)) { query=text; page=0; rebuild(); }
}
// METHOD
public void func_73863_a(int x,int y,float frame) {
    renderer.drawRect(0.0d,0.0d,(double)screenWidth,(double)screenHeight,0xe0181818);
    renderer.drawCenteredString("Станок исследования артефактов",screenWidth/2,screenHeight/2-240,0xffffffff);
    renderer.drawCenteredString("Бесплатно. Клик исследует один артефакт в инвентаре.",screenWidth/2,screenHeight/2-225,0xffffcc66);
    renderer.drawCenteredString("Если артефакты в стопке, сначала раздели её по одному.",screenWidth/2,screenHeight/2-200,0xffcccccc);
    if(all.isEmpty()) renderer.drawCenteredString("В твоём инвентаре нет неисследованных артефактов.",screenWidth/2,screenHeight/2,0xffffffff);
    super.func_73863_a(x,y,frame);
    renderer.drawCenteredString("Страница "+(page+1)+" / "+pages+"   |   Доступно: "+all.size(),screenWidth/2,screenHeight/2+225,0xffffffff);
}
