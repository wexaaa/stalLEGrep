// METHOD
public void func_73866_w_() {
    getElementsList().clearElements();
    search=new gloomyfolken.mods.core.client.gui.engine.component.McTextField(this,screenWidth/2-240,screenHeight/2-165,480,28);
    search.tipText="Поиск по имени или ID";
    search.setMaxStringLength(80);
    addElement(search);
    quantity=new gloomyfolken.mods.core.client.gui.engine.component.McTextField(this,screenWidth/2+170,screenHeight/2-165,70,28);
    quantity.setMaxStringLength(2);
    quantity.setText("1");
    addElement(quantity);
    rows=new java.util.ArrayList();
    all=items?OfflineSpawner.itemEntries():(anomalies?OfflineSpawner.anomalyEntries():OfflineSpawner.entries());
    page=0;
    query="";
    rebuild();
}
// METHOD
public void addButton(int x,int y,int width,String label,String action) {
    OfflineSpawnButton button=new OfflineSpawnButton(this,x,y,label,action);
    button.setSize(new uyud(width,26));
    addElement(button);
    rows.add(button);
}
// METHOD
public void rebuild() {
    for(int i=0;i<rows.size();i++) removeElement((gloomyfolken.mods.core.client.gui.engine.component.GuiComponent)rows.get(i));
    rows.clear();
    search.setSize(new uyud(items?360:480,28));
    quantity.setVisible(items);
    quantity.setEnabled(items);
    addButton(screenWidth/2-240,screenHeight/2-200,150,!anomalies && !items?"[ Сущности ]":"Сущности","@entities");
    addButton(screenWidth/2-75,screenHeight/2-200,150,anomalies?"[ Аномалии ]":"Аномалии","@anomalies");
    addButton(screenWidth/2+90,screenHeight/2-200,150,items?"[ Предметы ]":"Предметы","@items");
    if(items) {
        addButton(screenWidth/2-240,screenHeight/2-130,230,!stalcraft?"[ Обычный (блоки) ]":"Обычный (блоки)","@vanilla");
        addButton(screenWidth/2+10,screenHeight/2-130,230,stalcraft?"[ STALCRAFT ]":"STALCRAFT","@stalcraft");
    }
    java.util.List matches=new java.util.ArrayList();
    java.util.Iterator it=all.entrySet().iterator();
    while(it.hasNext()) {
        java.util.Map.Entry entry=(java.util.Map.Entry)it.next();
        if (((String)entry.getValue()).toLowerCase(java.util.Locale.ROOT).indexOf(query.toLowerCase(java.util.Locale.ROOT))>=0) matches.add(entry);
    }
    int perPage=items?9:10;
    pages=Math.max(1,(matches.size()+perPage-1)/perPage);
    page=Math.max(0,Math.min(page,pages-1));
    for(int row=0;row<perPage && page*perPage+row<matches.size();row++) {
        java.util.Map.Entry entry=(java.util.Map.Entry)matches.get(page*perPage+row);
        addButton(screenWidth/2-240,screenHeight/2+(items?-90:-125)+row*30,480,(String)entry.getValue(),(String)entry.getKey());
    }
    addButton(screenWidth/2-240,screenHeight/2+190,120,"Назад","@prev");
    addButton(screenWidth/2-60,screenHeight/2+190,120,"Закрыть","@close");
    addButton(screenWidth/2+120,screenHeight/2+190,120,"Далее","@next");
}
// METHOD
public void choose(String action) {
    if (action.equals("@close")) { closeScreen(); return; }
    if (action.equals("@vanilla") || action.equals("@stalcraft")) { stalcraft=action.equals("@stalcraft"); rebuild(); return; }
    if (action.equals("@entities") || action.equals("@anomalies") || action.equals("@items")) {
        anomalies=action.equals("@anomalies");
        items=action.equals("@items");
        all=items?OfflineSpawner.itemEntries():(anomalies?OfflineSpawner.anomalyEntries():OfflineSpawner.entries());
        page=0; query=""; search.setText(""); rebuild(); return;
    }
    if (action.equals("@prev")) { page--; rebuild(); return; }
    if (action.equals("@next")) { page++; rebuild(); return; }
    try {
        if(action.startsWith("item:")) {
            String amount=quantity.getText().trim();
            if(!amount.matches("[0-9]{1,2}")) throw new IllegalArgumentException("Введи количество от 1 до 64.");
            int count=Integer.parseInt(amount);
            if(count<1 || count>64) throw new IllegalArgumentException("Введи количество от 1 до 64.");
            action=action+":"+count+":"+(stalcraft?"stalcraft":"vanilla");
        }
        net.minecraft.client.qlfw._I()._t._f(OfflineSpawner.command(action));
        closeScreen();
    } catch(Exception error) { net.minecraft.client.qlfw._I()._t.func_71035_c("[Спавнер] "+error.getMessage()); }
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
    renderer.drawCenteredString("Локальный спавнер — F7",screenWidth/2,screenHeight/2-240,0xffffffff);
    renderer.drawCenteredString(items?"Клик выдаёт предмет. Учитывай вес и место в инвентаре!":(anomalies?"Аномалия на земле в 5–10 блоках. Осторожно: урон!":"Клик создаёт 1 сущность перед тобой. Враги атакуют!"),screenWidth/2,screenHeight/2-225,0xffffcc66);
    if(items) renderer.drawCenteredString("Кол-во 1–64",screenWidth/2+205,screenHeight/2-180,0xffffffff);
    super.func_73863_a(x,y,frame);
    renderer.drawCenteredString("Страница "+(page+1)+" / "+pages+"   |   Доступно: "+all.size(),screenWidth/2,screenHeight/2+225,0xffffffff);
}
