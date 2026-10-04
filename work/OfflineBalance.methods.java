// METHOD
public static int value(rtag data) {
    return Math.max(0,data._f("OfflineRealMoney"));
}
// METHOD
public static int add(rtag data, long amount) {
    int before=value(data);
    if (amount<=0L || amount>(long)Integer.MAX_VALUE-before) throw new IllegalArgumentException("Сумма должна быть больше нуля, итоговый баланс — не более 2147483647 руб.");
    int after=before+(int)amount;
    data._a("OfflineRealMoney",after);
    return after;
}
// METHOD
public static rtag account(jlas player) {
    rtag entity=player.getEntityData();
    if (!entity._c("PlayerPersisted")) entity._a("PlayerPersisted",new rtag());
    return entity._m("PlayerPersisted");
}
// METHOD
public static int spend(rtag data, int price) {
    int before=value(data);
    if (price<=0 || before<price) throw new IllegalArgumentException("Недостаточно рублей для открытия кейса.");
    int after=before-price;
    data._a("OfflineRealMoney",after);
    return after;
}
// METHOD
public static boolean handle(gloomyfolken.bundle.common.core.dfaj request, swfs handler) {
    if (!(request instanceof jgvm) && !(request instanceof aniy)) return false;
    if (handler==null) return true;
    jlas player=handler.getPlayer();
    if (player==null || player.field_70170_p==null || player.field_70170_p.field_72995_K) return true;
    synchronized(player) {
        int balance=value(account(player));
        if (request instanceof jgvm) {
            long now=System.currentTimeMillis();
            Long last=(Long)lastAddition.get(player);
            if (last!=null && now-last.longValue()<1000L) return true;
            try {
                balance=add(account(player),((jgvm)request)._a());
                lastAddition.put(player,Long.valueOf(now));
                player.func_71035_c("[Баланс] Локально добавлено "+((jgvm)request)._a()+" руб. Баланс: "+balance+" руб.");
            } catch (IllegalArgumentException invalid) {
                player.func_71035_c("[Баланс] "+invalid.getMessage());
                return true;
            }
        }
        ServerPacketHandler.sendPacketToPlayer(player,new xael(new flwp(balance)));
    }
    return true;
}
// METHOD
public static void receive(int balance) {
    klsl._a(balance);
    ywla screen=net.minecraft.client.qlfw._I()._B;
    for (int i=0; screen!=null && i<16; i++) {
        if (screen instanceof flwp$hrmt) ((flwp$hrmt)screen).setBalance(balance);
        if (!(screen instanceof gloomyfolken.mods.core.client.gui.engine.GuiScreenAdvanced)) break;
        screen=((gloomyfolken.mods.core.client.gui.engine.GuiScreenAdvanced)screen).parentScreen;
    }
}
