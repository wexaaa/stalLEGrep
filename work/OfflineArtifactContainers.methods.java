// METHOD
public static htyp findEmpty(dhmd view,jlas player,voib item) {
    mbgk main=zyjs._b(player);
    if(main==null || !view.getInventories().containsValue(main)) return null;
    java.util.Iterator sections=main.getSections().values().iterator();
    while(sections.hasNext()) {
        zhku section=(zhku)sections.next();
        if(!view.canPlayerPutStack(section,item) || !view.canPlayerTakeStacks(section)) continue;
        Integer index=section.getFirstFreeIndex(item);
        if(index==null) continue;
        htyp slot=view.getIndex(main,section,index.intValue());
        if(view.get(slot)==null && view.isMutable(slot)) return slot;
    }
    return null;
}
// METHOD
public static void change(kldc packet,jlas player,dhmd view) {
    if(packet._a==null) throw new IllegalArgumentException("Не выбран контейнер.");
    if(packet._b!=null && packet._a.equals(packet._b)) throw new IllegalArgumentException("Совпадают ячейки предметов.");
    dhmd.vjtu containerSlot=view.bindMutable(packet._a);
    voib original=containerSlot._g();
    if(original==null || original._b!=1 || !(original._a() instanceof apiz)) throw new IllegalArgumentException("Выбери один контейнер для артефактов.");
    apiz item=(apiz)original._a();
    if(packet._c<0 || packet._c>=item._c) throw new IllegalArgumentException("У контейнера нет такого слота.");
    Integer position=Integer.valueOf(packet._c);
    dhmd.vjtu sourceSlot=packet._b==null?null:view.bindMutable(packet._b);
    voib source=sourceSlot==null?null:sourceSlot._g();
    if(sourceSlot!=null && (source==null || source._b<=0 || !(source._a() instanceof bsmb) || !((bsmb)source._a())._r_(source))) throw new IllegalArgumentException("Сначала исследуй артефакт на станке.");
    voib previous=item._b(original,position);
    if(previous!=null && (previous._b!=1 || !(previous._a() instanceof bsmb) || !((bsmb)previous._a())._r_(previous))) throw new IllegalArgumentException("Внутри контейнера некорректные данные. Изменение отменено.");
    if(source==null && previous==null) return;
    voib nextContainer=original._l();
    voib incoming=source==null?null:source._l();
    if(incoming!=null) incoming._b=1;
    item._a(nextContainer,incoming,position);
    voib stored=item._b(nextContainer,position);
    if(incoming==null?stored!=null:(stored==null || !voib._b(incoming,stored))) throw new IllegalArgumentException("Контейнер отклонил артефакт.");
    java.util.Map changes=new java.util.LinkedHashMap();
    changes.put(packet._a,nextContainer);
    if(source!=null) {
        voib leftover=source._b>1?source._l():null;
        if(leftover!=null) leftover._b--;
        changes.put(packet._b,leftover);
    }
    if(previous!=null) {
        htyp target=source!=null && source._b==1?packet._b:findEmpty(view,player,previous);
        if(target==null) throw new IllegalArgumentException("Освободи ячейку в инвентаре STALCRAFT для возвращаемого артефакта.");
        if(target.equals(packet._a)) throw new IllegalArgumentException("Нет свободной ячейки для артефакта.");
        changes.put(target,previous._l());
    }
    // Stage all copies and validate every destination before changing a real inventory slot.
    java.util.Map before=new java.util.LinkedHashMap();
    java.util.Map bindings=new java.util.LinkedHashMap();
    java.util.Iterator it=changes.entrySet().iterator();
    while(it.hasNext()) {
        java.util.Map.Entry entry=(java.util.Map.Entry)it.next();
        htyp slot=(htyp)entry.getKey(); voib next=(voib)entry.getValue();
        dhmd.vjtu binding=view.bindMutable(slot);
        zhku section=binding._c();
        voib old=binding._g();
        // A legacy oversized source stack can shrink, but never grow or enter another slot oversized.
        boolean shrinking=old!=null && next!=null && old._d==next._d && old._f==next._f && next._b<old._b && voib._a(old,next);
        if(!view.canPlayerTakeStacks(section) || !view.canPlayerPutStack(section,next) || (next!=null && (next._b<=0 || (next._b>section.getMaxStackSize(next) && !shrinking)))) throw new IllegalArgumentException("Предмет не помещается в выбранную ячейку.");
        before.put(slot,old==null?null:old._l());
        bindings.put(slot,binding);
    }
    java.util.List attempted=new java.util.ArrayList();
    try {
        it=changes.entrySet().iterator();
        while(it.hasNext()) {
            java.util.Map.Entry entry=(java.util.Map.Entry)it.next(); htyp slot=(htyp)entry.getKey();
            attempted.add(slot);
            if(!((dhmd.vjtu)bindings.get(slot))._a((voib)entry.getValue())) throw new IllegalArgumentException("Инвентарь отклонил перемещение артефакта.");
        }
    } catch(Exception failure) {
        for(int i=attempted.size()-1;i>=0;i--) {
            htyp slot=(htyp)attempted.get(i); dhmd.vjtu binding=(dhmd.vjtu)bindings.get(slot);
            binding._c().setStackAtUnchecked(slot._c(),(voib)before.get(slot));
        }
        throw failure;
    }
    // Notify the native equipment/stat pipeline only after the complete transaction commits.
    view.onInventoryChanged(before,new java.util.LinkedHashSet(changes.keySet()));
    player.func_71035_c("[Артефакты] "+(incoming==null?"Артефакт извлечён в инвентарь.":previous==null?"Артефакт установлен в контейнер.":"Артефакт заменён; предыдущий возвращён в инвентарь.")+" Для бонусов экипируй контейнер в слот спины.");
}
// METHOD
public static boolean seen(jlas player,int window,int action) {
    if(action<0) return false;
    java.util.LinkedHashMap history=(java.util.LinkedHashMap)processed.get(player);
    if(history==null) { history=new java.util.LinkedHashMap(); processed.put(player,history); }
    String key=window+":"+action;
    if(history.containsKey(key)) return true;
    history.put(key,Boolean.TRUE);
    if(history.size()>128) history.remove(history.keySet().iterator().next());
    return false;
}
// METHOD
public static void handle(kldc packet,jlas player) {
    if(packet==null || player==null || player.field_70170_p==null || player.field_70170_p.field_72995_K) return;
    synchronized(player) {
        dhmd view=null;
        try {
            ifxb properties=ifxb._a(player);
            if(properties==null) throw new IllegalArgumentException("Инвентарь игрока не загружен.");
            int window=packet._b();
            view=window==0 || window==-1?properties._d:properties._c(window);
            if(view==null || view.getViewOwner()!=player || !view.isUsableByPlayer(player)) throw new IllegalArgumentException("Окно инвентаря закрыто или недоступно. Открой контейнер снова.");
            if(!seen(player,window,packet._c())) change(packet,player,view);
        } catch(Exception failure) {
            System.err.println("[OfflineArtifactContainers] "+failure);
            player.func_71035_c("[Артефакты] "+failure.getMessage());
        } finally {
            // Even rejected or repeated actions must be acknowledged to release the client's action queue.
            if(view!=null) view.detectAndSendChanges();
            ServerPacketHandler.syncInventory(player);
            if(packet._c()>=0) ServerPacketHandler.sendPacketToPlayer(player,new xael(new yepz(packet._b(),packet._c())));
        }
    }
}
