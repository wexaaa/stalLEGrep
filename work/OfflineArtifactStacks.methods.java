// METHOD
public static boolean moveOne(dhmd view,htyp from,htyp to,java.util.Map before) {
    if(from.equals(to)) return false;
    dhmd.vjtu src=view.bindMutable(from),dst=view.bindMutable(to);
    voib original=src._g();
    if(original==null || original._b<=1 || !(original._a() instanceof bsmb) || dst._g()!=null) return false;
    voib old=original._l(),rest=original._l(),one=original._l();rest._b--;one._b=1;
    if(!view.canPlayerTakeStacks(src._c()) || !view.canPlayerPutStack(src._c(),rest) || !view.canPlayerPutStack(dst._c(),one)) return false;
    boolean attemptedSource=false,attemptedTarget=false;
    try {
        attemptedSource=true;
        if(!src._a(null) || !src._a(rest)) throw new IllegalArgumentException("Source grid rejected artifact split");
        attemptedTarget=true;
        if(!dst._a(one)) throw new IllegalArgumentException("Destination grid rejected artifact split");
    } catch(Exception failure) {
        if(attemptedTarget) dst._c().setStackAtUnchecked(to._c(),null);
        if(attemptedSource) src._c().setStackAtUnchecked(from._c(),old);
        return false;
    }
    if(!before.containsKey(from)) before.put(from,old);
    if(!before.containsKey(to)) before.put(to,null);
    return true;
}
// METHOD
public static int normalizeView(jlas player,dhmd view) {
    mbgk main=zyjs._b(player);
    if(main==null || view==null || view.getViewOwner()!=player || !view.isUsableByPlayer(player) || !view.getInventories().containsValue(main)) return 0;
    java.util.Map before=new java.util.LinkedHashMap();
    java.util.Iterator sections=main.getSections().values().iterator();int moved=0;
    try {
        while(sections.hasNext()) {
            zhku section=(zhku)sections.next();
            java.util.List indices=new java.util.ArrayList(section.getContentsIndex().keySet());
            java.util.Iterator it=indices.iterator();
            while(it.hasNext()) {
                Integer index=(Integer)it.next();htyp from=view.getIndex(main,section,index.intValue());
                voib stack=view.get(from);
                while(stack!=null && stack._b>1 && stack._a() instanceof bsmb) {
                    voib one=stack._l();one._b=1;
                    htyp to=OfflineArtifactContainers.findEmpty(view,player,one);
                    if(to==null || !moveOne(view,from,to,before)) break;
                    moved++;stack=view.get(from);
                }
            }
        }
    } finally {
        if(!before.isEmpty()) view.onInventoryChanged(before,new java.util.LinkedHashSet(before.keySet()));
    }
    return moved;
}
// METHOD
public static void normalize(jlas player) {
    if(player==null || player.field_70170_p==null || player.field_70170_p.field_72995_K) return;
    synchronized(player) {
        if(busy.contains(player)) return;
        busy.add(player);
        try {
            ifxb properties=ifxb._a(player);
            if(properties!=null && normalizeView(player,properties._d)>0) properties._d.detectAndSendChanges();
        } catch(Exception failure) {
            System.err.println("[OfflineArtifactStacks] "+failure);
        } finally { busy.remove(player); }
    }
}
