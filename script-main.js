function majoreazaPretEuro(pret) {
    if (pret <= 0) {
        return pret;
    }

    var pretMajorat = parseFloat((pret * 1.10).toFixed(10));
    return Math.ceil(pretMajorat);
}

var CULORI_RULOURI_DETALIATE = {
    alb: {denumire: 'ALB', categorie: 'standard'},
    maro: {denumire: 'MARO', categorie: 'standard'},
    antracit: {denumire: 'ANTRACIT', categorie: 'antracit'},
    silver: {denumire: 'SILVER', categorie: 'antracit'},
    stejar_auriu: {denumire: 'STEJAR AURIU', categorie: 'imitatie'},
    nuc: {denumire: 'NUC', categorie: 'imitatie'},
    mahon: {denumire: 'MAHON', categorie: 'imitatie'},
    wenghe: {denumire: 'WENGHE', categorie: 'imitatie'}
};

var CULORI_PLASE_DETALIATE = {
    alb: {denumire: 'ALB', categorie: 'Standard'},
    maro: {denumire: 'MARO', categorie: 'Standard'},
    antracit: {denumire: 'ANTRACIT', categorie: 'Extra'},
    stejar_auriu: {denumire: 'STEJAR AURIU', categorie: 'Extra'},
    nuc: {denumire: 'NUC', categorie: 'Extra'},
    wenghe: {denumire: 'WENGHE', categorie: 'Extra'},
    mahon: {denumire: 'MAHON', categorie: 'Extra'}
};

function sincronizeazaCuloareRulou(nr) {
    var selector = document.getElementById('culoare_rulou_' + nr);
    var culoare = selector ? CULORI_RULOURI_DETALIATE[selector.value] : null;
    if (!culoare) culoare = CULORI_RULOURI_DETALIATE.alb;
    $('#opt3_' + nr).prop('checked', culoare.categorie === 'standard');
    $('#opt4_' + nr).prop('checked', culoare.categorie === 'imitatie');
    $('#opt9_' + nr).prop('checked', culoare.categorie === 'antracit');
    return culoare.denumire;
}

function culoareExactaRulou(nr) {
    var selector = document.getElementById('culoare_rulou_' + nr);
    var culoare = selector ? CULORI_RULOURI_DETALIATE[selector.value] : null;
    return culoare ? culoare.denumire : 'ALB';
}

function sincronizeazaCuloarePlasa(nr) {
    var selector = document.getElementById('culoare_plasa_' + nr);
    var culoare = selector ? CULORI_PLASE_DETALIATE[selector.value] : null;
    if (!culoare) culoare = CULORI_PLASE_DETALIATE.alb;
    $('#opt_culoare_1_' + nr).prop('checked', culoare.categorie === 'Standard');
    $('#opt_culoare_2_' + nr).prop('checked', culoare.categorie === 'Extra');
    return culoare.denumire;
}

function culoareExactaPlasa(nr) {
    var selector = document.getElementById('culoare_plasa_' + nr);
    var culoare = selector ? CULORI_PLASE_DETALIATE[selector.value] : null;
    return culoare ? culoare.denumire : 'ALB';
}

function aproximare_inaltime(x) {
    var rest;

    if (x < 400) {
        return -40;
    } else if (x > 3100) {
        return -41;
    } else if (x == 400) {
        return 500;
    } else if ((3000 <= x) && (x <= 3100)) {
        return 3000;
    } else {
        rest = x % 100;
        x = Math.floor(x / 100);
        x = x * 100;
        if (rest != 0) x = x + 100;
    }
    return (x);
}

function aproximare_latime(x) {
    var rest;

    if (x < 400) {
        return -40;
    } else if (x > 2800) {
        return -41;
    } else if (x == 400) {
        return 500;
    } else if ((2700 <= x) && (x <= 2800)) {
        return 2700;
    } else {
        rest = x % 100;
        x = Math.floor(x / 100);
        x = x * 100;
        if (rest != 0) x = x + 100;
    }
    return (x);
}

function ce_rulou(nr) {
    var rulou = $('#rulou' + nr);

    var v_rulou = "";
    v_rulou = v_rulou + "R_";

    var v_latime;
    v_latime = rulou.find($('#l_' + nr)).val();
    v_latime = aproximare_latime(v_latime);
    v_rulou = v_rulou + v_latime + "_";

    var v_inaltime;
    v_inaltime = rulou.find($('#h_' + nr)).val();
    v_inaltime = aproximare_inaltime(v_inaltime);
    v_rulou = v_rulou + v_inaltime + "_";
    var v_tip;
    if (typeof rulou.find($('#opt1_' + nr)) != "undefined" && rulou.find($('#opt1_' + nr)).prop('checked') == true) {
        v_tip = "sup";
    } else if (typeof rulou.find($('#opt2_' + nr)) != "undefined" && rulou.find($('#opt2_' + nr)).prop('checked') == true) {
        v_tip = "apl";
    } else if (typeof rulou.find($('#opt8_' + nr)) != "undefined" && rulou.find($('#opt8_' + nr)).prop('checked') == true) {
        v_tip = "apl";
    } else {
        v_tip = "err";
    }
    v_rulou = v_rulou + v_tip + "_";

    var v_culoare;
    if (typeof rulou.find($('#opt3_' + nr)) != "undefined" && rulou.find($('#opt3_' + nr)).prop('checked') == true) {
        v_culoare = "st";
    } else if (typeof rulou.find($('#opt4_' + nr)) != "undefined" && rulou.find($('#opt4_' + nr)).prop('checked') == true) {
        v_culoare = "im";
    } else if (typeof rulou.find($('#opt9_' + nr)) != "undefined" && rulou.find($('#opt9_' + nr)).prop('checked') == true) {
        v_culoare = "st";
    } else {
        v_culoare = "err";
    }
    v_rulou = v_rulou + v_culoare + "_";

    var v_pir;
    if (typeof rulou.find($('#opt5_' + nr)) != "undefined" && rulou.find($('#opt5_' + nr)).prop('checked') == true) {
        v_pir = "da";
    } else if (typeof rulou.find($('#opt6_' + nr)) != "undefined" && rulou.find($('#opt6_' + nr)).prop('checked') == true) {
        v_pir = "nu";
    } else {
        v_pir = "err";
    }
    v_rulou = v_rulou + v_pir;

    var v_210;
    if (typeof rulou.find($('#opt1_' + nr)) != "undefined" && rulou.find($('#opt1_' + nr)).prop('checked') == true) {
        if (typeof rulou.find($('#opt7_' + nr)) != "undefined" && rulou.find($('#opt7_' + nr)).prop('checked') == true) {
            v_210 = "210";
        } else {
            v_210 = "170";
        }
        v_rulou = v_rulou + "_" + v_210;
    }

    var v_ap_l;
    v_ap_l = "ap_l";
    var v_ap_h;
    v_ap_h = "ap_h";
    var v_tip_rulou;
    v_tip_rulou = "tip_rulou";

    rulou.find($('#ap_l_' + nr)).html(aproximare_latime(v_latime));
    rulou.find($('#ap_h_' + nr)).html(aproximare_inaltime(v_inaltime));
    rulou.find($('#tip_rulou_' + nr)).html(v_rulou);
    return v_rulou;
}

function hidereset(nr) {

    document.getElementById("l_" + nr).value = "0";
    document.getElementById("ap_l_" + nr).innerHTML = "0";
    document.getElementById("h_" + nr).value = "0";
    document.getElementById("ap_h_" + nr).innerHTML = "0";
    document.getElementById("c_" + nr).value = "1";
    document.getElementById("pret_rulou_" + nr).innerHTML = "0";
    document.getElementById("pret_total_" + nr).innerHTML = "0";

    document.getElementById("ruloul_" + nr).style.display = "none";

}

function getvalue() {
    var v_x;
    v_x = document.getElementById("valori").value;
    document.getElementById('value1').innerHTML = v_x;

    var i;
    for (i = 20; i > v_x; i--) {
        hidereset(i);
    }
    for (i = 1; i <= v_x; i++) {
        document.getElementById("ruloul_" + i).style.display = "block";
    }
}

function total() {
    var v_total_r;
    var i;
    var v_partial;
    v_total_r = 0;

    for (i = 0; i <= rulouriIndex.length; i++) {
        if (rulouriIndex[i]) {
            v_partial = pret(rulouriIndex[i]);
            if (v_partial > 0) {

                v_total_r = v_total_r + parseFloat(v_partial);
            }
        }
    }

    document.getElementById('pret_final_r').innerHTML = v_total_r;

    var v_total_a;
    v_total_a = 0;

    for (i = 0; i < aditionaleIndex.length; i++) {
        if (aditionaleIndex[i]) {
            v_partial = pret2(aditionaleIndex[i]);
            if (v_partial > 0) {

                v_total_a = v_total_a + parseFloat(v_partial);
            }
        }
    }

    document.getElementById('pret_final_a').innerHTML = v_total_a;

    var v_total_p;
    v_total_p = 0;
    for (i = 0; i < plaseIndex.length; i++) {
        if (plaseIndex[i]) {
            v_partial = pret3p(plaseIndex[i]);
            if (v_partial > 0) {
                v_total_p = v_total_p + parseFloat(v_partial);
            }
        }
    }

    document.getElementById('pret_final_p').innerHTML = v_total_p;

    var v_total_copertine = 0;
    for (i = 0; i < copertineIndex.length; i++) {
        if (copertineIndex[i]) {
            v_partial = pret4p(copertineIndex[i]);
            if (v_partial > 0) v_total_copertine += parseFloat(v_partial);
        }
    }
    document.getElementById('pret_final_copertine').innerHTML = v_total_copertine;

    var v_total_interioare = 0;
    for (i = 0; i < umbrireInterioaraIndex.length; i++) {
        if (umbrireInterioaraIndex[i]) {
            v_partial = pret5p(umbrireInterioaraIndex[i]);
            if (v_partial > 0) v_total_interioare += parseFloat(v_partial);
        }
    }
    document.getElementById('pret_final_interioare').innerHTML = v_total_interioare.toFixed(2);

    var v_total;
    v_total = v_total_r + v_total_a + v_total_p + v_total_copertine + v_total_interioare;
    v_total = parseFloat(v_total).toFixed(2);
    document.getElementById('pret_final').innerHTML = v_total;

}

function hidereset2(nr) {

    document.getElementById("select_ad_" + nr).value = "tip0";
    document.getElementById("pret_ad_" + nr).innerHTML = "0";
    document.getElementById("pret_total_ad_" + nr).innerHTML = "0";
    document.getElementById("c_ad_" + nr).value = "1";
    document.getElementById("aditional_" + nr).style.display = "none";

}

function getvalue2() {
    var v_x;
    v_x = document.getElementById("valori2").value;
    document.getElementById('value2').innerHTML = v_x;

    var i;
    for (i = 20; i > v_x; i--) {
        hidereset2(i);
    }
    for (i = 1; i <= v_x; i++) {
        document.getElementById("aditional_" + i).style.display = "block";
    }
}

function cauta_tip(nr) {
    var v_tip;
    var v_select;
    var v_value;
    v_select = "select_ad_" + nr;
    v_value = "value_ad_" + nr;
    v_tip = document.getElementById(v_select).value;
    document.getElementById(v_value).innerHTML = v_tip;
    return v_tip;
}

function adaugaRulou() {
    var newRulow = $('#templaterulou').clone();
    newRulow.appendTo($('#rulouri'));
    newRulow.attr("style", "display:block");
    numarRulouri++;
    $('#nr_rulouri').html(numarRulouri);
    indexRulouri++;
    rulouriIndex.push(indexRulouri);
    newRulow.append('<button type="button" style="background:red" onclick="stergeRulou(' + indexRulouri + ')">Sterge</button>');

    newRulow.attr("id", "rulou" + indexRulouri);
    newRulow.attr("numar", indexRulouri);
    newRulow.find($('#l')).attr("id", "l_" + indexRulouri);
    newRulow.find($('#h')).attr("id", "h_" + indexRulouri);
    newRulow.find($('#culoare_rulou')).attr("id", "culoare_rulou_" + indexRulouri);

    newRulow.find($('#opt1')).attr("name", newRulow.find($('#opt1')).attr("name") + "_" + indexRulouri);
    newRulow.find($('#opt2')).attr("name", newRulow.find($('#opt2')).attr("name") + "_" + indexRulouri);
    newRulow.find($('#opt3')).attr("name", newRulow.find($('#opt3')).attr("name") + "_" + indexRulouri);
    newRulow.find($('#opt4')).attr("name", newRulow.find($('#opt4')).attr("name") + "_" + indexRulouri);
    newRulow.find($('#opt5')).attr("name", newRulow.find($('#opt5')).attr("name") + "_" + indexRulouri);
    newRulow.find($('#opt6')).attr("name", newRulow.find($('#opt6')).attr("name") + "_" + indexRulouri);
    newRulow.find($('#opt7')).attr("name", newRulow.find($('#opt7')).attr("name") + "_" + indexRulouri);
    newRulow.find($('#opt8')).attr("name", newRulow.find($('#opt8')).attr("name") + "_" + indexRulouri);
    newRulow.find($('#opt9')).attr("name", newRulow.find($('#opt9')).attr("name") + "_" + indexRulouri);

    newRulow.find($('#opt1')).attr("id", "opt1_" + indexRulouri);
    newRulow.find($('#opt2')).attr("id", "opt2_" + indexRulouri);
    newRulow.find($('#opt3')).attr("id", "opt3_" + indexRulouri);
    newRulow.find($('#opt4')).attr("id", "opt4_" + indexRulouri);
    newRulow.find($('#opt5')).attr("id", "opt5_" + indexRulouri);
    newRulow.find($('#opt6')).attr("id", "opt6_" + indexRulouri);
    newRulow.find($('#opt7')).attr("id", "opt7_" + indexRulouri);
    newRulow.find($('#opt8')).attr("id", "opt8_" + indexRulouri);
    newRulow.find($('#opt9')).attr("id", "opt9_" + indexRulouri);

    newRulow.find($('#c')).attr("id", "c_" + indexRulouri);
    newRulow.find($('#pret_rulou')).attr("id", "pret_rulou_" + indexRulouri);
    newRulow.find($('#pret_total')).attr("id", "pret_total_" + indexRulouri);
    newRulow.find($('#tip_rulou')).attr("id", "tip_rulou_" + indexRulouri);
    newRulow.find($('#error')).attr("id", "error_" + indexRulouri);

    newRulow.find($('#ap_l')).attr("id", "ap_l_" + indexRulouri);
    newRulow.find($('#ap_h')).attr("id", "ap_h_" + indexRulouri);
    newRulow.find($('#tip_rulou')).attr("id", "tip_rulou_" + indexRulouri);

    $('#culoare_rulou_' + indexRulouri).change(function () {
        var nrRulou = parseInt($(this).closest('.rulou').attr('numar'), 10);
        sincronizeazaCuloareRulou(nrRulou);
        if (parseFloat($('#pret_total_' + nrRulou).text()) > 0) {
            pret(nrRulou);
            total();
        }
    });
    sincronizeazaCuloareRulou(indexRulouri);

}

function stergeRulou(numarRulou) {
    $('#rulou' + numarRulou).remove();
    rulouriIndex.splice(rulouriIndex.indexOf(numarRulou), 1);
    numarRulouri--;
    $('#nr_rulouri').html(numarRulouri);

}

function adaugaAditional() {
    var newAdditional = $('#templateaditional').clone();
    newAdditional.appendTo($('#aditionale'));
    newAdditional.attr("style", "display:block");
    numarAditionale++;
    $('#nr_aditionale').html(numarAditionale);
    indexAditionale++;
    aditionaleIndex.push(indexAditionale);
    newAdditional.attr("id", "additional" + indexAditionale);
    newAdditional.attr("numar", indexAditionale);
    newAdditional.append('<button type="button" style="background:red" onclick="stergeAditional(' + indexAditionale + ')">Sterge</button>');

    newAdditional.find($('#select_ad')).attr("id", "select_ad_" + indexAditionale);
    newAdditional.find($('#value_ad')).attr("id", "value_ad_" + indexAditionale);
    newAdditional.find($('#c_ad')).attr("id", "c_ad_" + indexAditionale);
    newAdditional.find($('#pret_ad')).attr("id", "pret_ad_" + indexAditionale);
    newAdditional.find($('#pret_total_ad')).attr("id", "pret_total_ad_" + indexAditionale);

}

function stergeAditional(numarAditional) {
    $('#additional' + numarAditional).remove();
    aditionaleIndex.splice(aditionaleIndex.indexOf(numarAditional), 1);
    numarAditionale--;
    $('#nr_aditionale').html(numarAditionale);

}


function adaugaPlasa() {
    var newPlase = $('#templateplase').clone();
    newPlase.appendTo($('#plase'));
    newPlase.attr("style", "display:block");
    numarPlase++;
    $('#nr_plase').html(numarPlase);
    indexPlase++;
    plaseIndex.push(indexPlase);
    newPlase.append('<button type="button" style="background:red" onclick="stergePlase(' + indexPlase + ')">Sterge</button>');

    newPlase.attr("id", "additional_" + indexPlase);
    newPlase.attr("numar", indexPlase);

    newPlase.find($('#l_plasa')).attr("id", "l_plasa_" + indexPlase);
    newPlase.find($('#h_plasa')).attr("id", "h_plasa_" + indexPlase);
    newPlase.find($('#select_plase')).attr("id", "select_plase_" + indexPlase);
    newPlase.find($('#culoare_plasa')).attr("id", "culoare_plasa_" + indexPlase);
    newPlase.find($('#opt_culoare_1')).attr("name", newPlase.find($('#opt_culoare_1')).attr("name") + "_" + indexPlase);
    newPlase.find($('#opt_culoare_2')).attr("name", newPlase.find($('#opt_culoare_2')).attr("name") + "_" + indexPlase);
    newPlase.find($('#pret_plasa')).attr("id", "pret_plasa" + indexPlase);
    newPlase.find($('#pret_total_plase')).attr("id", "pret_total_plase" + indexPlase);
    newPlase.find($('#c_pl')).attr("id", "c_pl_" + indexPlase);

    newPlase.find($('#opt_culoare_1')).attr("id", "opt_culoare_1_" + indexPlase);
    newPlase.find($('#opt_culoare_2')).attr("id", "opt_culoare_2_" + indexPlase);

    $('#culoare_plasa_' + indexPlase).change(function () {
        var nrPlasa = parseInt($(this).closest('.plase').attr('numar'), 10);
        sincronizeazaCuloarePlasa(nrPlasa);
        if (parseFloat($('#pret_total_plase' + nrPlasa).text()) > 0) {
            pret3p(nrPlasa);
            total();
        }
    });
    sincronizeazaCuloarePlasa(indexPlase);

}

function stergePlase(numarPlasa) {
    $('#additional_' + numarPlasa).remove();
    plaseIndex.splice(plaseIndex.indexOf(numarPlase), 1);
    numarPlase--;
    $('#nr_plase').html(numarPlase);

}

function adaugaCopertina() {
    var element = $('#templatecopertina').clone();
    element.appendTo($('#copertine'));
    element.attr('style', 'display:block');
    numarCopertine++;
    indexCopertine++;
    copertineIndex.push(indexCopertine);
    $('#nr_copertine').html(numarCopertine);

    var nr = indexCopertine;
    element.attr('id', 'copertina_' + nr);
    element.attr('numar', nr);

    var iduri = [
        'model_copertina', 'dimensiuni_copertina_discrete', 'dimensiuni_copertina_libere',
        'latime_copertina', 'proiectie_copertina', 'latime_copertina_libera', 'proiectie_copertina_libera',
        'optiuni_actionare_copertina', 'actionare_copertina', 'optiuni_senzor_copertina', 'senzor_copertina',
        'optiuni_extensie_copertina', 'extensie_copertina', 'optiuni_structura_copertina',
        'structura_copertina', 'stalp_copertina', 'culoare_copertina', 'cantitate_copertina',
        'pret_copertina', 'pret_total_copertina', 'pret_montaj_copertina',
        'pret_total_cu_montaj_copertina', 'eroare_copertina'
    ];
    for (var i = 0; i < iduri.length; i++) {
        element.find('#' + iduri[i]).attr('id', iduri[i] + '_' + nr);
    }

    element.append('<button type="button" class="buton-sterge-copertina" onclick="stergeCopertina(' + nr + ')">Șterge copertina</button>');
    $('#model_copertina_' + nr).change(function () { actualizeazaCampuriCopertina(nr); });
    $('#latime_copertina_' + nr).change(function () { actualizeazaProiectiiCopertina(nr); pretCopertina(nr); });
    $('#proiectie_copertina_' + nr + ', #actionare_copertina_' + nr + ', #senzor_copertina_' + nr + ', #extensie_copertina_' + nr + ', #latime_copertina_libera_' + nr + ', #proiectie_copertina_libera_' + nr + ', #cantitate_copertina_' + nr).change(function () { pretCopertina(nr); });
    $('#structura_copertina_' + nr).change(function () { actualizeazaInaltimeStalpCopertina(nr); });
    $('#stalp_copertina_' + nr).change(function () { pretCopertina(nr); });
    actualizeazaCampuriCopertina(nr);
}

function stergeCopertina(nr) {
    $('#copertina_' + nr).remove();
    var pozitie = copertineIndex.indexOf(nr);
    if (pozitie >= 0) copertineIndex.splice(pozitie, 1);
    numarCopertine = Math.max(0, numarCopertine - 1);
    $('#nr_copertine').html(numarCopertine);
    total();
}

function adaugaUmbrireInterioara() {
    var element = $('#templateroletaplisse').clone();
    element.appendTo($('#umbrire_interioara'));
    element.attr('style', 'display:block');
    numarUmbrireInterioara++;
    indexUmbrireInterioara++;
    umbrireInterioaraIndex.push(indexUmbrireInterioara);
    $('#nr_umbrire_interioara').html(numarUmbrireInterioara);

    var nr = indexUmbrireInterioara;
    element.attr('id', 'roleta_plisse_' + nr);
    element.attr('numar', nr);
    var iduri = [
        'produs_roleta_plisse', 'material_roleta_plisse', 'latime_roleta_plisse',
        'inaltime_roleta_plisse', 'cantitate_roleta_plisse', 'tip_material_roleta_plisse',
        'compozitie_roleta_plisse', 'pret_mp_roleta_plisse', 'suprafata_roleta_plisse',
        'suprafata_facturata_roleta_plisse', 'pret_roleta_plisse', 'pret_total_roleta_plisse',
        'adaos_fix_roleta_plisse', 'eroare_roleta_plisse'
    ];
    for (var i = 0; i < iduri.length; i++) {
        element.find('#' + iduri[i]).attr('id', iduri[i] + '_' + nr);
    }

    element.append('<button type="button" class="buton-sterge-copertina" onclick="stergeUmbrireInterioara(' + nr + ')">Șterge produsul</button>');
    $('#produs_roleta_plisse_' + nr).change(function () { actualizeazaProdusUmbrireInterioara(nr); total(); });
    $('#material_roleta_plisse_' + nr).change(function () { actualizeazaMaterialRoletaPlisse(nr); total(); });
    $('#latime_roleta_plisse_' + nr + ', #inaltime_roleta_plisse_' + nr + ', #cantitate_roleta_plisse_' + nr).change(function () { pretRoletaPlisse(nr); total(); });
    actualizeazaProdusUmbrireInterioara(nr);
    total();
}

function stergeUmbrireInterioara(nr) {
    $('#roleta_plisse_' + nr).remove();
    var pozitie = umbrireInterioaraIndex.indexOf(nr);
    if (pozitie >= 0) umbrireInterioaraIndex.splice(pozitie, 1);
    numarUmbrireInterioara = Math.max(0, numarUmbrireInterioara - 1);
    $('#nr_umbrire_interioara').html(numarUmbrireInterioara);
    total();
}








