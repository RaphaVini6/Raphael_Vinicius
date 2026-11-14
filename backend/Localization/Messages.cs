namespace Backend.Localization;

// Translated server strings. {0}, {1}... are string.Format args.
public static class Messages
{
    public static string Get(string key, string lang, params object[] args)
    {
        var template = All.TryGetValue(key, out var text) ? text.Get(lang) : key;
        return args.Length == 0 ? template : string.Format(Lang.Culture(lang), template, args);
    }

    private static LocalizedText T(string en, string pt, string es, string fr) =>
        new() { ["en"] = en, ["pt"] = pt, ["es"] = es, ["fr"] = fr };

    private static readonly Dictionary<string, LocalizedText> All = new()
    {
        // errors
        ["err.probeNotFound"] = T("Probe '{0}' not found.", "Sonda '{0}' não encontrada.", "Sonda '{0}' no encontrada.", "Sonde '{0}' introuvable."),
        ["err.componentNotFound"] = T("Component '{0}' not found.", "Componente '{0}' não encontrado.", "Componente '{0}' no encontrado.", "Composant '{0}' introuvable."),
        ["err.wrongCategory"] = T("Component '{0}' is not in the {1} category.", "O componente '{0}' não é da categoria {1}.", "El componente '{0}' no pertenece a la categoría {1}.", "Le composant '{0}' n'appartient pas à la catégorie {1}."),
        ["err.emptyText"] = T("Text is empty.", "Texto vazio.", "El texto está vacío.", "Le texte est vide."),
        ["err.librasUnavailable"] = T("Libras service unavailable.", "Serviço de Libras indisponível.", "Servicio de Libras no disponible.", "Service Libras indisponible."),
        ["err.speechUnavailable"] = T("Speech service unavailable.", "Serviço de voz indisponível.", "Servicio de voz no disponible.", "Service vocal indisponible."),

        // simulation
        ["sim.noRelay"] = T(
            "No communication: the UHF radio needs a relay orbiter, and there was none at the Moon.",
            "Sem comunicação: o rádio UHF precisa de um orbitador retransmissor, e não havia nenhum na Lua.",
            "Sin comunicación: la radio UHF necesita un orbitador repetidor y no había ninguno en la Luna.",
            "Aucune communication : la radio UHF a besoin d'un orbiteur relais, et il n'y en avait aucun autour de la Lune."),
        ["sim.noAtmosphere"] = T(
            "A rotor cannot create lift without an atmosphere: the helicopter cannot take off on the Moon.",
            "O rotor não gera sustentação sem atmosfera: o helicóptero não decola na Lua.",
            "Un rotor no genera sustentación sin atmósfera: el helicóptero no puede despegar en la Luna.",
            "Un rotor ne produit aucune portance sans atmosphère : l'hélicoptère ne peut pas décoller sur la Lune."),
        ["sim.overheat"] = T(
            "Overheating: the environment reaches {0}°C and the probe tolerates {1}°C. Reduced operations during the hottest hours.",
            "Superaquecimento: o ambiente chega a {0}°C e a sonda suporta {1}°C. Operações reduzidas nas horas mais quentes.",
            "Sobrecalentamiento: el entorno llega a {0}°C y la sonda soporta {1}°C. Operaciones reducidas en las horas más calurosas.",
            "Surchauffe : l'environnement atteint {0}°C et la sonde supporte {1}°C. Opérations réduites aux heures les plus chaudes."),
        ["sim.froze"] = T(
            "Froze on the first night: the environment reaches {0}°C and the probe only tolerates down to {1}°C.",
            "Congelou na primeira noite: o ambiente chega a {0}°C e a sonda só suporta até {1}°C.",
            "Se congeló la primera noche: el entorno llega a {0}°C y la sonda solo soporta hasta {1}°C.",
            "Gelée dès la première nuit : l'environnement descend à {0}°C et la sonde ne supporte que {1}°C."),
        ["sim.storm"] = T(
            "{0}: sunlight drops to {1:P0}.",
            "{0}: a luz do Sol cai para {1:P0}.",
            "{0}: la luz solar cae al {1:P0}.",
            "{0} : la lumière du Soleil tombe à {1:P0}."),
        ["sim.wakeUp"] = T(
            "Enough power again: the probe wakes up from hibernation.",
            "Energia suficiente de novo: a sonda sai da hibernação.",
            "Vuelve a haber energía suficiente: la sonda sale de la hibernación.",
            "De nouveau assez d'énergie : la sonde sort d'hibernation."),
        ["sim.hibernate"] = T(
            "Not enough power: the probe enters hibernation (only essential systems on).",
            "Energia insuficiente: a sonda entra em hibernação (só o essencial ligado).",
            "Energía insuficiente: la sonda entra en hibernación (solo lo esencial encendido).",
            "Énergie insuffisante : la sonde passe en hibernation (seuls les systèmes essentiels restent allumés)."),
        ["sim.noBattery"] = T(
            "No usable battery: the probe shut down and did not survive the dark period.",
            "Sem bateria utilizável: a sonda desligou e não sobreviveu ao período sem luz.",
            "Sin batería utilizable: la sonda se apagó y no sobrevivió al período sin luz.",
            "Aucune batterie utilisable : la sonde s'est éteinte et n'a pas survécu à la période sans lumière."),
        ["sim.batteryEmpty"] = T(
            "The battery ran out and there was no way to generate more power.",
            "A bateria acabou e não havia como gerar mais energia.",
            "La batería se agotó y no había forma de generar más energía.",
            "La batterie s'est vidée et il n'y avait aucun moyen de produire de l'énergie."),
        ["sim.noPower"] = T(
            "Out of power: not even in hibernation could the probe stay on.",
            "Falta de energia: nem em hibernação a sonda conseguiu se manter ligada.",
            "Sin energía: ni siquiera en hibernación la sonda pudo mantenerse encendida.",
            "Panne d'énergie : même en hibernation, la sonde n'a pas pu rester allumée."),
        ["sim.windClean"] = T(
            "A gust of wind cleaned the solar panels!",
            "Uma rajada de vento limpou os painéis solares!",
            "¡Una ráfaga de viento limpió los paneles solares!",
            "Une rafale de vent a nettoyé les panneaux solaires !"),
        ["sim.rotorBroken"] = T(
            "The rotor blades were damaged: the helicopter can no longer fly.",
            "As pás do rotor se danificaram: o helicóptero não pode mais voar.",
            "Las palas del rotor se dañaron: el helicóptero ya no puede volar.",
            "Les pales du rotor sont endommagées : l'hélicoptère ne peut plus voler."),
        ["sim.wornOut"] = T(
            "{0} reached the end of its service life: the probe now operates stationary.",
            "{0} chegou ao fim da vida útil: a sonda passa a operar parada.",
            "{0} llegó al final de su vida útil: la sonda pasa a operar inmóvil.",
            "{0} est arrivé en fin de vie : la sonde fonctionne désormais à l'arrêt."),
        ["sim.radiationFatal"] = T(
            "Radiation permanently damaged the computer ({0}).",
            "A radiação danificou permanentemente o computador ({0}).",
            "La radiación dañó permanentemente la computadora ({0}).",
            "Les radiations ont endommagé définitivement l'ordinateur ({0})."),
        ["sim.stillRunning"] = T(
            "The probe was still working at the end of the simulation ({0} days).",
            "A sonda ainda funcionava ao final da simulação ({0} dias).",
            "La sonda seguía funcionando al final de la simulación ({0} días).",
            "La sonde fonctionnait encore à la fin de la simulation ({0} jours)."),
        ["sim.reboots"] = T(
            "The computer rebooted {0} time(s) because of radiation.",
            "O computador reiniciou {0} vez(es) por causa da radiação.",
            "La computadora se reinició {0} vez/veces por la radiación.",
            "L'ordinateur a redémarré {0} fois à cause des radiations."),
        ["sim.hibernationSummary"] = T(
            "The probe spent {0} day(s) in hibernation.",
            "A sonda passou {0} dia(s) em hibernação.",
            "La sonda pasó {0} día(s) en hibernación.",
            "La sonde a passé {0} jour(s) en hibernation."),

        // narration
        ["nar.type.Lander"] = T("Lander", "Módulo de pouso", "Módulo de aterrizaje", "Atterrisseur"),
        ["nar.type.Rover"] = T("Rover", "Veículo explorador", "Vehículo explorador", "Astromobile"),
        ["nar.type.Helicopter"] = T("Helicopter", "Helicóptero", "Helicóptero", "Hélicoptère"),
        ["nar.type.LanderWithRover"] = T("Lander with rover", "Módulo de pouso com veículo explorador", "Módulo de aterrizaje con vehículo explorador", "Atterrisseur avec astromobile"),
        ["nar.dest.Moon"] = T("bound for the Moon", "com destino à Lua", "con destino a la Luna", "à destination de la Lune"),
        ["nar.dest.Mars"] = T("bound for Mars", "com destino a Marte", "con destino a Marte", "à destination de Mars"),
        ["nar.intro"] = T("{0}. {1} of the {2} mission, {3}.", "{0}. {1} da missão {2}, {3}.", "{0}. {1} de la misión {2}, {3}.", "{0}. {1} de la mission {2}, {3}."),
        ["nar.dates"] = T("Launch: {0}. Landing: {1}.", "Lançamento: {0}. Pouso: {1}.", "Lanzamiento: {0}. Aterrizaje: {1}.", "Lancement : {0}. Atterrissage : {1}."),
        ["nar.active"] = T("Status: in operation.", "Status: em operação.", "Estado: en operación.", "Statut : en activité."),
        ["nar.inactive"] = T("Status: no longer operating. {0}", "Status: fora de operação. {0}", "Estado: fuera de operación. {0}", "Statut : hors service. {0}"),
        ["nar.location"] = T("Location: {0}.", "Localização: {0}.", "Ubicación: {0}.", "Emplacement : {0}."),
        ["nar.function"] = T("Scientific goal: {0}", "Objetivo científico: {0}", "Objetivo científico: {0}", "Objectif scientifique : {0}"),
        ["nar.reuse"] = T("Mechanical reuse: {0}", "Reutilização mecânica: {0}", "Reutilización mecánica: {0}", "Réutilisation mécanique : {0}"),
        ["nar.image"] = T("Image description: {0}", "Descrição da imagem: {0}", "Descripción de la imagen: {0}", "Description de l'image : {0}"),
        ["nar.source"] = T("Source: {0}.", "Fonte: {0}.", "Fuente: {0}.", "Source : {0}."),
        ["nar.dateFormat"] = T("MMMM d, yyyy", "d 'de' MMMM 'de' yyyy", "d 'de' MMMM 'de' yyyy", "d MMMM yyyy"),
        ["nar.day"] = T("1 day", "1 dia", "1 día", "1 jour"),
        ["nar.days"] = T("{0} days", "{0} dias", "{0} días", "{0} jours"),
        ["nar.sim.title"] = T("Simulation result for the {0} scenario.", "Resultado da simulação no cenário de {0}.", "Resultado de la simulación en el escenario de {0}.", "Résultat de la simulation pour le scénario {0}."),
        ["nar.sim.survived"] = T("Your probe worked for {0}.", "Sua sonda funcionou por {0}.", "Tu sonda funcionó durante {0}.", "Votre sonde a fonctionné pendant {0}."),
        ["nar.sim.planned"] = T("The planned mission was {0}.", "A missão planejada era de {0}.", "La misión planificada era de {0}.", "La mission prévue durait {0}."),
        ["nar.sim.actual"] = T("The real probe lasted {0}.", "A sonda real durou {0}.", "La sonda real duró {0}.", "La vraie sonde a duré {0}."),
        ["nar.sim.success"] = T("Mission accomplished!", "Missão cumprida!", "¡Misión cumplida!", "Mission accomplie !"),
        ["nar.sim.fail"] = T("The mission was not accomplished.", "A missão não foi cumprida.", "La misión no se cumplió.", "La mission n'a pas été accomplie."),
        ["nar.sim.score"] = T("Score: {0} out of 100.", "Pontuação: {0} de 100.", "Puntuación: {0} de 100.", "Score : {0} sur 100."),
        ["nar.sim.events"] = T("Key events:", "Principais acontecimentos:", "Principales acontecimientos:", "Événements clés :"),
        ["nar.sim.event"] = T("On day {0}: {1}", "No dia {0}: {1}", "El día {0}: {1}", "Le jour {0} : {1}"),
    };
}
