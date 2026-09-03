var COPERTINE_MODELE = {
    loggia: {
        nume: 'LOGGIA',
        latimeMin: 1720,
        latimeMax: 6000,
        latimeInitiala: 4000,
        proiectiiValide: [1500, 2000, 2500, 3000, 3500],
        limiteProiectie: {1500: [1720, 6000], 2000: [2480, 6000], 2500: [3000, 6000], 3000: [3480, 6000], 3500: [4000, 5000]},
        latimi: [1720, 2480, 3000, 3480, 4000, 4500, 5000, 5500, 6000],
        proiectii: {
            1720: [1500],
            2480: [1500, 2000],
            3000: [1500, 2000, 2500],
            3480: [1500, 2000, 2500, 3000],
            4000: [1500, 2000, 2500, 3000, 3500],
            4500: [1500, 2000, 2500, 3000, 3500],
            5000: [1500, 2000, 2500, 3000, 3500],
            5500: [1500, 2000, 2500, 3000],
            6000: [1500, 2000, 2500, 3000]
        }
    },
    monobloc: {
        nume: 'MONOBLOC',
        latimeMin: 2140,
        latimeMax: 6000,
        latimeInitiala: 3000,
        proiectiiValide: [1500, 2000, 2500, 3000, 3500, 4000],
        limiteProiectie: {1500: [2140, 6000], 2000: [2640, 6000], 2500: [3180, 6000], 3000: [3640, 6000], 3500: [4140, 6000], 4000: [4640, 6000]},
        latimi: [2140, 2640, 3180, 3640, 4140, 4640, 5000, 5500, 6000],
        proiectii: {
            2140: [1500],
            2640: [1500, 2000],
            3180: [1500, 2000, 2500],
            3640: [1500, 2000, 2500, 3000],
            4140: [1500, 2000, 2500, 3000, 3500],
            4640: [1500, 2000, 2500, 3000, 3500, 4000],
            5000: [1500, 2000, 2500, 3000, 3500, 4000],
            5500: [1500, 2000, 2500, 3000, 3500, 4000],
            6000: [1500, 2000, 2500, 3000, 3500, 4000]
        }
    },
    kset30: {
        nume: 'K-SET 30',
        latimeMin: 2500,
        latimeMax: 6000,
        latimeInitiala: 4000,
        proiectiiValide: [2000, 2500, 3000],
        limiteProiectie: {2000: [2500, 6000], 2500: [3000, 6000], 3000: [3450, 6000]},
        latimi: [2500, 3000, 3450, 4000, 4500, 5000, 5500, 6000],
        proiectii: {
            2500: [2000],
            3000: [2000, 2500],
            3450: [2000, 2500, 3000],
            4000: [2000, 2500, 3000],
            4500: [2000, 2500, 3000],
            5000: [2000, 2500, 3000],
            5500: [2000, 2500, 3000],
            6000: [2000, 2500, 3000]
        }
    },
    extensie: {
        nume: 'EXTENSIE',
        dimensiuniLibere: true
    },
    teraspro: {
        nume: 'TERAS PRO',
        latimeMin: 2000,
        latimeMax: 5000,
        latimeInitiala: 4000,
        proiectiiValide: [1500, 2000, 2500, 3000, 3500, 4000],
        limiteProiectie: {1500: [2000, 5000], 2000: [2000, 5000], 2500: [2000, 5000], 3000: [2000, 5000], 3500: [2000, 5000], 4000: [2000, 5000]},
        latimi: [2000, 3000, 4000, 5000],
        proiectii: {
            2000: [1500, 2000, 2500, 3000, 3500, 4000],
            3000: [1500, 2000, 2500, 3000, 3500, 4000],
            4000: [1500, 2000, 2500, 3000, 3500, 4000],
            5000: [1500, 2000, 2500, 3000, 3500, 4000]
        }
    }
};

var PRETURI_ACTIUNI_COPERTINE = {
    manuala: 0,
    motor_somfy: 172.27,
    motor_manivela: 247.90
};

var PRETURI_SENZORI_COPERTINE = {
    nu: 0,
    vant: 67.23,
    soare_vant: 127.73
};

var PRET_MONTAJ_COPERTINA = 100;

function valoareNumericaCopertina(id) {
    var element = document.getElementById(id);
    if (!element) return 0;
    return parseFloat(String(element.value).replace(',', '.')) || 0;
}

function selecteazaCopertina(id) {
    var element = document.getElementById(id);
    return element ? element.value : '';
}

function pretExcelLoggia(latimeMm, proiectieMm, actionare, senzor) {
    var latimeCm = latimeMm / 10;
    var proiectieCm = proiectieMm / 10;
    var brate = {150: 72.28, 200: 82.11, 250: 97.89, 300: 104.66, 350: 111.97}[proiectieCm];
    if (!brate) return -1;

    var manuala = actionare === 'manuala';
    var pretFaraTva = brate * 1.55 + 80.1815 + (latimeCm / 100) * 15.717 + 1.612 + 10.199;
    if (manuala) pretFaraTva += 3.875 + 7.75 + 8.525;
    pretFaraTva += 2.015;
    pretFaraTva += (latimeCm / 100) * 8.37;
    pretFaraTva += latimeCm * (proiectieCm + 60) / 10000 * 9.3;
    pretFaraTva += latimeCm * 2 / 100 * 0.62;
    pretFaraTva += latimeCm * 1.5 / 100 * 0.5425;

    return (pretFaraTva + PRETURI_ACTIUNI_COPERTINE[actionare] + PRETURI_SENZORI_COPERTINE[senzor]) * 1.19;
}

function pretExcelMonobloc(latimeMm, proiectieMm, actionare, senzor) {
    var latimeCm = latimeMm / 10;
    var proiectieCm = proiectieMm / 10;
    var brate = {150: 72.28, 200: 82.11, 250: 97.89, 300: 104.66, 350: 111.97, 400: 209.65}[proiectieCm];
    if (!brate) return -1;

    var manuala = actionare === 'manuala';
    var pretFaraTva = brate * 1.52 + 42.1192 + (latimeCm / 100) * 15.4128 + 1.5808 + 10.0016;
    pretFaraTva += 70.3304 + 71.1664 + 0.5776 + (latimeCm / 100) * 5.32;
    if (manuala) pretFaraTva += 3.8 + 7.6;
    pretFaraTva += 1.976 + (latimeCm / 100) * 8.208;
    pretFaraTva += latimeCm * (proiectieCm + 60) / 10000 * 9.12;
    pretFaraTva += latimeCm * 2 / 100 * 0.608;
    pretFaraTva += latimeCm * 1.5 / 100 * 0.532;

    return (pretFaraTva + PRETURI_ACTIUNI_COPERTINE[actionare] + PRETURI_SENZORI_COPERTINE[senzor]) * 1.19;
}

function pretExcelKset30(latimeMm, proiectieMm, senzor) {
    var latimeCm = latimeMm / 10;
    var proiectieCm = proiectieMm / 10;
    var brate = {200: 82.11, 250: 97.89, 300: 104.66}[proiectieCm];
    if (!brate) return -1;

    var pretFaraTva = brate * 1.40 + (latimeCm / 100) * 89.11 + 135.17 + 27.58 + 1.12 + 1.82;
    pretFaraTva += (latimeCm / 100) * 7.56;
    pretFaraTva += latimeCm * (proiectieCm + 60) / 10000 * 8.4;
    pretFaraTva += latimeCm * 2 / 100 * 0.56;

    return (pretFaraTva + PRETURI_ACTIUNI_COPERTINE.motor_somfy + PRETURI_SENZORI_COPERTINE[senzor]) * 1.19;
}

function pretExcelExtensie(latimeMm, inaltimeMm, cuExtensie) {
    var latimeCm = latimeMm / 10;
    var inaltimeCm = inaltimeMm / 10;
    if (!(latimeCm > 0 && inaltimeCm > 0)) return -1;

    var pretFaraTva = 24.2 + 10 + 1.84 + (latimeCm / 100) * 14;
    if (cuExtensie === 'da') pretFaraTva += 33.46;
    pretFaraTva += 10 + (latimeCm / 100) * 8.3;
    pretFaraTva += latimeCm * (inaltimeCm + 50) / 10000 * 12;
    pretFaraTva += latimeCm * 3 / 100 * 0.8;
    return pretFaraTva * 1.19;
}

function pretExcelTerasPro(latimeMm, proiectieMm, structura, inaltimeStalpMm) {
    var latimeCm = latimeMm / 10;
    var proiectieCm = proiectieMm / 10;
    var latimeM = latimeCm / 100;
    var ghidajeM = proiectieCm * 2 / 100;
    if (!(latimeM > 0 && ghidajeM > 0)) return -1;

    var pretFaraTva = latimeM * 113.8464 + ghidajeM * 32.6558 + 241.3742;
    pretFaraTva += ghidajeM * 6.097 + ghidajeM * 2 * 1.8358 + ghidajeM / 2 * 7.3164;
    pretFaraTva += (ghidajeM * 2 + 1) * 2.4388 + 4 * 13.9226;
    pretFaraTva += latimeM * 7.236;
    pretFaraTva += latimeCm * (proiectieCm + 40) / 10000 * 8.04;
    pretFaraTva += latimeM * 2 * 0.536 + 139.36 + 24.12;

    if (structura === 'da') {
        var inaltimeM = inaltimeStalpMm / 1000;
        pretFaraTva += (latimeM + inaltimeM * 2) * 32.0528;
        pretFaraTva += 2 * 13.0382 + 2 * 23.9056;
    }
    return pretFaraTva * 1.19;
}

function configuratieCopertina(nr) {
    var model = selecteazaCopertina('model_copertina_' + nr);
    var modelInfo = COPERTINE_MODELE[model];
    var latime = modelInfo && modelInfo.dimensiuniLibere
        ? valoareNumericaCopertina('latime_copertina_libera_' + nr)
        : valoareNumericaCopertina('latime_copertina_' + nr);
    var proiectie = modelInfo && modelInfo.dimensiuniLibere
        ? valoareNumericaCopertina('proiectie_copertina_libera_' + nr)
        : valoareNumericaCopertina('proiectie_copertina_' + nr);

    return {
        model: model,
        modelInfo: modelInfo,
        latime: latime,
        proiectie: proiectie,
        actionare: selecteazaCopertina('actionare_copertina_' + nr) || 'manuala',
        senzor: selecteazaCopertina('senzor_copertina_' + nr) || 'nu',
        extensie: selecteazaCopertina('extensie_copertina_' + nr) || 'nu',
        structura: selecteazaCopertina('structura_copertina_' + nr) || 'nu',
        inaltimeStalp: valoareNumericaCopertina('stalp_copertina_' + nr),
        culoare: (document.getElementById('culoare_copertina_' + nr) || {}).value || 'La alegere din paletar',
        cantitate: Math.max(1, Math.floor(valoareNumericaCopertina('cantitate_copertina_' + nr) || 1))
    };
}

function calculeazaPretCopertinaExcel(config) {
    if (!config.modelInfo) return -1;
    if (!config.modelInfo.dimensiuniLibere) {
        var limite = config.modelInfo.limiteProiectie[config.proiectie];
        if (!limite || config.latime < limite[0] || config.latime > limite[1]) return -1;
    }
    if (config.model === 'loggia') return pretExcelLoggia(config.latime, config.proiectie, config.actionare, config.senzor);
    if (config.model === 'monobloc') return pretExcelMonobloc(config.latime, config.proiectie, config.actionare, config.senzor);
    if (config.model === 'kset30') return pretExcelKset30(config.latime, config.proiectie, config.senzor);
    if (config.model === 'extensie') return pretExcelExtensie(config.latime, config.proiectie, config.extensie);
    if (config.model === 'teraspro') return pretExcelTerasPro(config.latime, config.proiectie, config.structura, config.inaltimeStalp);
    return -1;
}

function calculeazaPretVanzareCopertina(config) {
    var pretExcel = calculeazaPretCopertinaExcel(config);
    if (!(pretExcel > 0)) return -1;
    return Math.ceil(parseFloat((pretExcel * 2).toFixed(10)));
}

function pretCopertina(buton) {
    var container = buton && buton.closest ? buton.closest('.copertina') : null;
    var nr = container ? parseInt(container.attr('numar'), 10) : parseInt(buton, 10);
    var config = configuratieCopertina(nr);
    var pretUnitar = calculeazaPretVanzareCopertina(config);
    var eroare = document.getElementById('eroare_copertina_' + nr);

    if (!(pretUnitar > 0)) {
        document.getElementById('pret_copertina_' + nr).innerHTML = '0';
        document.getElementById('pret_total_copertina_' + nr).innerHTML = '0';
        document.getElementById('pret_montaj_copertina_' + nr).innerHTML = '0';
        document.getElementById('pret_total_cu_montaj_copertina_' + nr).innerHTML = '0';
        if (eroare) eroare.textContent = 'Completează modelul și dimensiunile copertinei.';
        return -1;
    }

    document.getElementById('pret_copertina_' + nr).innerHTML = pretUnitar;
    document.getElementById('pret_total_copertina_' + nr).innerHTML = pretUnitar * config.cantitate;
    document.getElementById('pret_montaj_copertina_' + nr).innerHTML = PRET_MONTAJ_COPERTINA;
    document.getElementById('pret_total_cu_montaj_copertina_' + nr).innerHTML = (pretUnitar + PRET_MONTAJ_COPERTINA) * config.cantitate;
    if (eroare) eroare.textContent = '';
    return (pretUnitar + PRET_MONTAJ_COPERTINA) * config.cantitate;
}

function pret4p(nr) {
    return pretCopertina(nr);
}

function umpleSelectCopertina(element, valori) {
    if (!element) return;
    var html = '';
    for (var i = 0; i < valori.length; i++) html += '<option value="' + valori[i] + '">' + valori[i] + ' mm</option>';
    element.innerHTML = html;
}

function actualizeazaProiectiiCopertina(nr) {
    var model = selecteazaCopertina('model_copertina_' + nr);
    var modelInfo = COPERTINE_MODELE[model];
    if (!modelInfo || modelInfo.dimensiuniLibere) return;
    umpleSelectCopertina(document.getElementById('proiectie_copertina_' + nr), modelInfo.proiectiiValide || []);
}

function actualizeazaCampuriCopertina(nr) {
    var model = selecteazaCopertina('model_copertina_' + nr);
    var modelInfo = COPERTINE_MODELE[model];
    var discrete = document.getElementById('dimensiuni_copertina_discrete_' + nr);
    var libere = document.getElementById('dimensiuni_copertina_libere_' + nr);
    var actiune = document.getElementById('optiuni_actionare_copertina_' + nr);
    var senzor = document.getElementById('optiuni_senzor_copertina_' + nr);
    var extensie = document.getElementById('optiuni_extensie_copertina_' + nr);
    var structura = document.getElementById('optiuni_structura_copertina_' + nr);

    discrete.style.display = modelInfo && !modelInfo.dimensiuniLibere ? 'flex' : 'none';
    libere.style.display = modelInfo && modelInfo.dimensiuniLibere ? 'flex' : 'none';
    actiune.style.display = model === 'loggia' || model === 'monobloc' ? 'block' : 'none';
    senzor.style.display = model === 'loggia' || model === 'monobloc' || model === 'kset30' ? 'block' : 'none';
    extensie.style.display = model === 'extensie' ? 'block' : 'none';
    structura.style.display = model === 'teraspro' ? 'flex' : 'none';

    if (modelInfo && !modelInfo.dimensiuniLibere) {
        var latimeInput = document.getElementById('latime_copertina_' + nr);
        latimeInput.min = modelInfo.latimeMin;
        latimeInput.max = modelInfo.latimeMax;
        latimeInput.placeholder = modelInfo.latimeMin + '–' + modelInfo.latimeMax + ' mm';
        var latimeCurenta = parseFloat(latimeInput.value);
        if (!(latimeCurenta >= modelInfo.latimeMin && latimeCurenta <= modelInfo.latimeMax)) latimeInput.value = modelInfo.latimeInitiala;
        actualizeazaProiectiiCopertina(nr);
    }
    pretCopertina(nr);
}

function actualizeazaInaltimeStalpCopertina(nr) {
    var select = document.getElementById('stalp_copertina_' + nr);
    if (select) select.disabled = selecteazaCopertina('structura_copertina_' + nr) !== 'da';
    pretCopertina(nr);
}

function denumireActionareCopertina(valoare) {
    return {manuala: 'Manuală', motor_somfy: 'Motor Somfy', motor_manivela: 'Motor cu manivelă'}[valoare] || 'Manuală';
}

function denumireSenzorCopertina(valoare) {
    return {nu: 'Fără senzor', vant: 'Senzor de vânt', soare_vant: 'Senzor soare-vânt'}[valoare] || 'Fără senzor';
}
