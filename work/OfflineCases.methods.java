// METHOD
public static void tell(jlas player, String text) {
    player.func_71035_c("[Кейсы] " + text);
}
// METHOD
public static int price(int caseId) {
    if (caseId==0) return 10;
    if (caseId==1) return 25;
    if (caseId==2) return 50;
    if (caseId==3) return 75;
    return 100;
}
// METHOD
public static gloomyfolken.bundle.common.cases.CaseData catalog() {
    gloomyfolken.bundle.common.shop.ShopDataContainer container = gloomyfolken.bundle.common.shop.ShopDataContainer._b();
    synchronized (container) {
        if (container._e() == null) container._h();
        gloomyfolken.bundle.common.cases.CaseData data = (gloomyfolken.bundle.common.cases.CaseData)container._e();
        if (data == null) throw new IllegalStateException("Local case catalog is missing");
        for (int i=0; i<data.typeList.size(); i++) {
            gloomyfolken.bundle.common.cases.CaseType type = (gloomyfolken.bundle.common.cases.CaseType)data.typeList.get(i);
            type.price=price(type.case_id);
            type.discountedPrice=-1;
        }
        return data;
    }
}
// METHOD
public static voib[] roll(mqpx loot) {
    if (loot == null || loot.groups == null || loot.groups.isEmpty()) throw new IllegalStateException("Missing loot table");
    java.util.List results = loot._b();
    voib[] rewards = new voib[results.size()];
    for (int i=0; i<rewards.length; i++) {
        rewards[i] = ((ncoe)results.get(i))._a();
        if (rewards[i] == null || rewards[i]._b <= 0 || rewards[i]._a() == null) throw new IllegalStateException("Unavailable reward item");
    }
    return rewards;
}
// METHOD
public static void deliver(jlas player, voib[] rewards) {
    for (int i=0; i<rewards.length; i++) ServerPacketHandler.giveItemToPlayer(player, rewards[i]._l());
    ServerPacketHandler.syncInventory(player);
    if (rewards.length == 0) tell(player,"В этот раз предметы не выпали.");
}
// METHOD
public static gqvn findKey(jlas player, int id, voib box) {
    ifxb properties = ifxb._a(player);
    if (properties == null || properties._d == null) return null;
    java.util.Iterator inventories = properties._d.getInventories().values().iterator();
    while (inventories.hasNext()) {
        hcxt inventory = (hcxt)inventories.next();
        java.util.List slots = inventory.listSlots();
        for (int i=0; i<slots.size(); i++) {
            gqvn slot=(gqvn)slots.get(i);
            voib stack=slot._b();
            if (stack != null && stack != box && stack._d==id && stack._b>0) return slot;
        }
    }
    return null;
}
// METHOD
public static gloomyfolken.bundle.common.cases.CaseType preview(voib box, mqpx loot, voib[] rewards) {
    gloomyfolken.bundle.common.cases.CaseType type = new gloomyfolken.bundle.common.cases.CaseType();
    type.case_id=-1;
    type.name=box._s();
    type.icon="greycase";
    type.loot=new mqpx();
    int perReward=Math.max(1,48/Math.max(1,rewards.length));
    int nextGroup=0;
    for (int i=0; i<rewards.length; i++) {
        voib reward=rewards[i];
        pixj group=null;
        for (int g=nextGroup; g<loot.groups.size() && group==null; g++) {
            pixj candidate=(pixj)loot.groups.get(g);
            for (int j=0; j<candidate.entryList.size(); j++) {
                voib possible=((hscf)candidate.entryList.get(j))._k();
                if (possible!=null && possible._d==reward._d && possible._f==reward._f) {
                    group=candidate;
                    nextGroup=g+1;
                    break;
                }
            }
        }
        java.util.List entries = new java.util.ArrayList();
        if (group!=null) for (int j=0; j<group.entryList.size() && entries.size()<perReward-1; j++) {
            hscf entry=(hscf)group.entryList.get(j);
            voib possible=entry._k();
            if (possible!=null && possible._d>=0 && possible._a()!=null) entries.add(entry);
        }
        entries.add(new hscf(reward._d,reward._b,reward._f,reward._e,0,1.0f));
        type.loot.groups.add(new pixj(group==null ? "Награда" : group.name,entries,1.0f));
    }
    return type;
}
// METHOD
public static void openInventory(stjr item, jlas player, voib box, dhmd$vjtu slot) {
    if (player==null || player.field_70170_p==null || player.field_70170_p.field_72995_K) return;
    synchronized (player) {
        try {
            if (box==null || box._b<=0 || slot==null || slot._f()!=box || !slot._h() || !item.canUseItem(player,box,slot)) return;
            gqvn key = item._a == -1 ? null : findKey(player,item._a,box);
            if (item._a != -1 && key == null) { tell(player,"Для этого кейса нужен ключ."); return; }
            mqpx loot=gloomyfolken.mods.customitem.CustomItemsMod._a(item._b);
            voib[] rewards=roll(loot);
            if (item._c != null) for (int i=0; i<rewards.length; i++) ognf._a(rewards[i],player.func_70005_c_(),item._c.toMillis());
            mrxe animation=null;
            if (rewards.length>0) {
                try {
                    animation=new mrxe(preview(box,loot,rewards),rewards);
                    java.io.ByteArrayOutputStream buffer=new java.io.ByteArrayOutputStream();
                    animation.write(new java.io.DataOutputStream(buffer));
                    if (buffer.size()>30000) animation=null;
                } catch (Exception oversized) { animation=null; }
            }
            voib remaining = box._b>1 ? box._l() : null;
            if (remaining != null) remaining._b--;
            if (!slot._a(remaining)) { tell(player,"Не удалось списать кейс."); return; }
            if (key != null) {
                voib keyStack=key._b();
                voib keyRemaining=keyStack._b>1 ? keyStack._l() : null;
                if (keyRemaining!=null) keyRemaining._b--;
                key._b(keyRemaining);
            }
            deliver(player,rewards);
            if (animation!=null) ServerPacketHandler.sendPacketToPlayer(player,new xael(animation));
            else if (rewards.length>0) tell(player,"Кейс открыт: награда выдана в инвентарь.");
        } catch (Exception error) {
            System.err.println("[OfflineCases] inventory: "+error);
            tell(player,"Не удалось открыть кейс. Подробности в журнале игры.");
        }
    }
}
// METHOD
public static voib useStack(voib stack, lrzy world, jlas player, dhmd view, htyp index) {
    if (!(stack._a() instanceof stjr)) return stack._a(world,player);
    if (!view.isOwnedView() || view.getViewOwner()!=player || !view.isMutable(index)) return stack;
    ((stjr)stack._a()).useItem(player,stack,index._b(view));
    return view.get(index);
}
// METHOD
public static boolean handle(gloomyfolken.bundle.common.core.dfaj request, swfs handler) {
    if (!(request instanceof zwqr)) return false;
    if (handler==null) return true;
    jlas player=handler.getPlayer();
    if (player==null || player.field_70170_p==null || player.field_70170_p.field_72995_K) return true;
    synchronized (player) {
        Long last=(Long)lastMenuOpen.get(player);
        long now=System.currentTimeMillis();
        if (last!=null && now-last.longValue()<1500L) return true;
        lastMenuOpen.put(player,Long.valueOf(now));
        try {
            zwqr packet=(zwqr)request;
            gloomyfolken.bundle.common.cases.CaseType type=catalog()._a(packet._b());
            if (type==null || !type.isListable) { tell(player,"Неизвестный кейс."); return true; }
            rtag account=OfflineBalance.account(player);
            if (OfflineBalance.value(account)<type._h()) {
                tell(player,"Недостаточно рублей. Нужно "+type._h()+" руб.; баланс "+OfflineBalance.value(account)+" руб.");
                ServerPacketHandler.sendPacketToPlayer(player,new xael(new flwp(OfflineBalance.value(account))));
                return true;
            }
            voib[] rewards=roll(type.loot);
            java.util.List won=new java.util.ArrayList();
            for (int i=0; i<rewards.length; i++) won.add(new ncoe(rewards[i]));
            xael animation=won.isEmpty() ? null : new xael(new dfpv(type.case_id,won,"Открытие за "+type._h()+" руб."));
            int balance=OfflineBalance.spend(account,type._h());
            deliver(player,rewards);
            ServerPacketHandler.sendPacketToPlayer(player,new xael(new flwp(balance)));
            if (animation!=null) ServerPacketHandler.sendPacketToPlayer(player,animation);
        } catch (Exception error) {
            System.err.println("[OfflineCases] menu: "+error);
            tell(player,"Не удалось открыть кейс. Подробности в журнале игры.");
        }
    }
    return true;
}
