// METHOD
public static void change(bbod packet,dhmd view) {
    htyp from=packet._d(),to=packet._e(); int requested=packet._a();
    if(from==null || to==null || from.equals(to) || requested<=0) throw new IllegalArgumentException("Выбери другую ячейку и положительное количество.");
    dhmd.vjtu src=view.bindMutable(from),dst=view.bindMutable(to);
    voib source=src._g(),target=dst._g();
    if(source==null || source._b<=0 || source._d()<=1 || requested>source._b) throw new IllegalArgumentException("Нельзя разделить эту стопку на выбранное количество.");
    if(!view.canPlayerTakeStacks(src._c()) || !view.canPlayerPutStack(dst._c(),source)) throw new IllegalArgumentException("Нет доступа к перемещению предмета.");
    if(target!=null && (target._b<=0 || !vmay._a._a(target,source))) throw new IllegalArgumentException("Выбранная ячейка занята другим предметом.");
    int limit=Math.min(source._d(),dst._c().getMaxStackSize(source));
    int space=limit-(target==null?0:target._b);
    int moved=Math.min(requested,space);
    if(moved<=0) throw new IllegalArgumentException("В выбранной ячейке нет места.");
    voib beforeSource=source._l(),beforeTarget=target==null?null:target._l();
    voib nextSource=source._b==moved?null:source._l();
    if(nextSource!=null) nextSource._b-=moved;
    voib nextTarget=target==null?source._l():target._l();
    nextTarget._b=(target==null?0:target._b)+moved;
    // Never mutate the original objects while preparing either half; this also isolates nested NBT.
    if(!view.canPlayerPutStack(src._c(),nextSource)) throw new IllegalArgumentException("Исходная ячейка недоступна.");
    java.util.Map before=new java.util.LinkedHashMap(); before.put(from,beforeSource); before.put(to,beforeTarget);
    boolean attemptedSource=false,attemptedTarget=false;
    try {
        // Native grid geometry treats an occupied slot as a collision, even with its own replacement.
        // Vacate both affected footprints inside this transaction before checked placement.
        attemptedSource=true;
        if(!src._a(null)) throw new IllegalArgumentException("Инвентарь отклонил освобождение исходной ячейки.");
        if(target!=null) {
            attemptedTarget=true;
            if(!dst._a(null)) throw new IllegalArgumentException("Инвентарь отклонил обновление целевой стопки.");
        }
        if(!src._a(nextSource)) throw new IllegalArgumentException("Инвентарь отклонил разделение стопки.");
        attemptedTarget=true;
        if(!dst._a(nextTarget)) throw new IllegalArgumentException("Предметы не помещаются в выбранную ячейку.");
    } catch(Exception failure) {
        if(attemptedTarget) dst._c().setStackAtUnchecked(to._c(),beforeTarget);
        if(attemptedSource) src._c().setStackAtUnchecked(from._c(),beforeSource);
        throw failure;
    }
    view.onInventoryChanged(before,new java.util.LinkedHashSet(before.keySet()));
}
// METHOD
public static void handle(bbod packet,jlas player) {
    if(packet==null || player==null || player.field_70170_p==null || player.field_70170_p.field_72995_K) return;
    synchronized(player) {
        dhmd view=null;
        try {
            ifxb properties=ifxb._a(player);
            if(properties==null) throw new IllegalArgumentException("Инвентарь игрока не загружен.");
            int window=packet._b();
            view=window==0 || window==-1?properties._d:properties._c(window);
            if(view==null || view.getViewOwner()!=player || !view.isUsableByPlayer(player)) throw new IllegalArgumentException("Окно инвентаря закрыто или недоступно. Открой его снова.");
            if(!OfflineArtifactContainers.seen(player,window,packet._c())) change(packet,view);
        } catch(Exception failure) {
            System.err.println("[OfflineInventorySplit] "+failure);
            player.func_71035_c("[Инвентарь] "+failure.getMessage());
        } finally {
            if(view!=null) view.detectAndSendChanges();
            ServerPacketHandler.syncInventory(player);
            if(packet._c()>=0) ServerPacketHandler.sendPacketToPlayer(player,new xael(new yepz(packet._b(),packet._c())));
        }
    }
}
