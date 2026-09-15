var TABEL_PRETURI_USI_GARAJ = {
    '55': {
        latimi: [1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500],
        inaltimi: [2100, 2250, 2500, 2750, 3000, 3250],
        preturi: [
            [165, 175, 190, 205, 220, 240, 255, 265, 295],
            [170, 180, 200, 210, 225, 245, 260, 285, 300],
            [180, 200, 215, 230, 250, 260, 295, 305, null],
            [190, 205, 225, 245, 260, 290, 305, null, null],
            [205, 220, 245, 255, 290, 305, null, null, null],
            [225, 245, 265, 280, 315, 330, null, null, null]
        ]
    },
    '77': {
        latimi: [2000, 2250, 2500, 2750, 3000, 3250, 3500, 4000, 4500, 5000, 5500],
        inaltimi: [2300, 2400, 2550, 2700, 2800, 3050, 3300, 3550, 3850],
        preturi: [
            [330, 345, 365, 390, 410, 440, 460, 495, 545, 740, 785],
            [335, 355, 375, 400, 420, 450, 475, 510, 555, 750, 800],
            [345, 360, 380, 410, 435, 460, 490, 525, 715, 765, 820],
            [360, 370, 395, 420, 445, 475, 500, 545, 740, 790, 840],
            [370, 380, 405, 440, 460, 495, 520, 690, 750, 800, 855],
            [390, 405, 430, 460, 485, 520, 665, 720, 780, 835, null],
            [405, 420, 450, 485, 510, 550, 690, 750, 805, null, null],
            [445, 460, 485, 525, 550, 690, 720, 780, 835, null, null],
            [470, 485, 515, 555, 582, 720, 750, 805, null, null, null]
        ]
    }
};

var MULTIPLICATOR_CULOARE_USA_GARAJ = {
    alb: 1,
    maro: 1,
    silver: 1.10,
    antracit: 1.10,
    stejar_auriu: 1.25,
    nuc: 1.25,
    wenghe: 1.25,
    mahon: 1.25
};

var MOTOARE_USI_GARAJ = {
    fara_motor: {denumire: 'FĂRĂ MOTOR', pret: 0},
    smart_home: {denumire: 'SMART HOME CU TELECOMANDĂ', pret: 250},
    somfy: {denumire: 'SOMFY CU TELECOMANDĂ', pret: 350}
};

var MONTAJ_USI_GARAJ = {
    fara_montaj: {denumire: 'FĂRĂ MONTAJ', pret: 0},
    montaj: {denumire: 'MONTAJ UȘĂ GARAJ', pret: 100}
};

var ADAOS_FIX_USA_GARAJ = 200;

function urmatoareaDimensiuneUsaGaraj(valori, valoareCeruta) {
    for (var i = 0; i < valori.length; i++) {
        if (valori[i] >= valoareCeruta) return {valoare: valori[i], index: i};
    }
    return null;
}

function cautaPretTabelUsaGaraj(lamela, latime, inaltime) {
    var tabel = TABEL_PRETURI_USI_GARAJ[String(lamela)];
    if (!tabel) return {eroare: 'Selectează lamela de 55 sau 77 mm.'};

    var latimeTabel = urmatoareaDimensiuneUsaGaraj(tabel.latimi, latime);
    var inaltimeTabel = urmatoareaDimensiuneUsaGaraj(tabel.inaltimi, inaltime);
    if (!latimeTabel || !inaltimeTabel) {
        return {eroare: 'Dimensiunea depășește limitele disponibile pentru lamela de ' + lamela + ' mm.'};
    }

    var pret = tabel.preturi[inaltimeTabel.index][latimeTabel.index];
    if (!(pret > 0)) {
        return {eroare: 'Combinația ' + latimeTabel.valoare + ' × ' + inaltimeTabel.valoare + ' mm nu este disponibilă în tabel pentru lamela de ' + lamela + ' mm.'};
    }

    return {
        pret: pret,
        latimeTabel: latimeTabel.valoare,
        inaltimeTabel: inaltimeTabel.valoare,
        eroare: ''
    };
}
