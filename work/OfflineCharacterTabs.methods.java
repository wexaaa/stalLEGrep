// METHOD
public static boolean handle(gloomyfolken.bundle.common.core.dfaj packet,swfs connection) {
    if(!OfflineCharacterStats.enabled() || (!(packet instanceof xsri) && !(packet instanceof hdci))) return false;
    if(connection==null) return true;
    jlas player=connection.getPlayer();
    if(player==null || player.field_70170_p==null || player.field_70170_p.field_72995_K) return true;
    try {
        lofu info=ognf._a(player);
        if(info==null) return true;
        ifxb handler=ifxb._a(info);
        if(handler==null || handler._b==null || handler._c==null || handler._d==null) return true;
        boolean character=packet instanceof xsri;
        dhmd view=character?(handler._e instanceof qnrd?handler._e:new qnrd(handler._b,handler._c)):handler._d;
        dhmd previous=handler._e;
        // Owned screens share inventories, but use different view indices. Keep the
        // native active view in step with the acknowledgement sent to this player.
        if(previous!=null && previous!=view && previous.isOwnedView() && previous.isOpened()) handler._a(previous);
        int window=character?1:0;
        ifxb._a(handler,view,window);
        grbk response=character?(grbk)new xsri():(grbk)new hdci();
        response.setWindowId(window);
        ServerPacketHandler.sendPacket(connection,new xael(response));
        ServerPacketHandler.syncInventory(player);
        System.out.println("[OfflineCharacterTabs] Open "+(character?"character":"equipment")+" window="+window);
    } catch(Exception failure) {
        System.err.println("[OfflineCharacterTabs] open failed: "+failure);
        failure.printStackTrace();
    }
    return true;
}
// METHOD
public static void syncActive(jlas player) {
    if(!OfflineCharacterStats.enabled() || player==null || player.field_70170_p==null || player.field_70170_p.field_72995_K) return;
    try {
        lofu info=ognf._a(player);
        if(info==null) return;
        ifxb handler=ifxb._a(info);
        if(handler==null || !(handler._e instanceof qnrd) || !handler._e.isOpened()) return;
        dhmd view=handler._e;
        java.util.Iterator entries=view.getInventories().entrySet().iterator();
        while(entries.hasNext()) {
            java.util.Map.Entry entry=(java.util.Map.Entry)entries.next();
            ServerPacketHandler.sendPacketToPlayer(player,new xael(new yvrb(view.getWindowId(),((Integer)entry.getKey()).intValue(),(hcxt)entry.getValue())));
        }
    } catch(Exception failure) {
        System.err.println("[OfflineCharacterTabs] inventory sync failed: "+failure);
    }
}
// METHOD
public static void closeClientCharacter(jlas player) {
    if(player==null || player.field_70170_p==null || !player.field_70170_p.field_72995_K) return;
    lofu info=ognf._a(player);
    if(info==null) return;
    ifxb handler=ifxb._a(info);
    if(handler!=null && handler._e instanceof qnrd) handler._a(handler._e);
}
