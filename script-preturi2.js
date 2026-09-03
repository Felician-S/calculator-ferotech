function pretAditional(buttonEl) {
    var aditionalEl = buttonEl.closest(".aditional");
    var numarAditional = aditionalEl.attr("numar");
    return pret2(numarAditional);
}

function pretPlase(buttonPl) {
    var rulouPl = buttonPl.closest(".plase");
    var numarPlasa = rulouPl.attr("numar");
    return pret3p(numarPlasa)
}

function pret3p(nr) {
    var select = "select_plase_" + nr
    var e = document.getElementById(select);
    var value = e.value;
    var name = "culoare_plasa_" + nr;
    var color = document.querySelector('input[name=' + name + ']:checked').value;

    var v_inaltime_plasa = document.getElementById('l_plasa_' + nr).value
    var v_latime_plasa = document.getElementById('h_plasa_' + nr).value
    v_arie = v_inaltime_plasa / 1000 * v_latime_plasa / 1000;

    return pretcampai3(value, color, nr);

}

function pret2(nr) {
    var x;
    x = cauta_tip(nr);
    var pret1;
    pret1 = -32;
    if (x == "tip0") pret1 = 0;
    if (x == "tip1") pret1 = 110;
    if (x == "tip2") pret1 = 110;
    if (x == "tip3") pret1 = 195;
    if (x == "tip4") pret1 = 250;
    if (x == "tip5") pret1 = 65;
    if (x == "tip6") pret1 = 90;
    if (x == "tip7") pret1 = 155;
    if (x == "tip8") pret1 = 148;
    if (x == "tip9") pret1 = 600;
    if (x == "tip10") pret1 = 60;
    if (x == "tip11") pret1 = 50;
    if (x == "tip12") pret1 = 195;
    if (x == "tip13") pret1 = 350;
    if (x == "tip14") pret1 = 8;
    if (x == "tip15") pret1 = 40;
    if (x == "tip16") pret1 = 40;
    if (x == "tip17") pret1 = 15;
    if (x == "tip18") pret1 = 8;
    if (x == "tip19") pret1 = 8;
    if (x == "tip20") pret1 = 6;
    if (x == "tip21") pret1 = 14;

    pret1 = majoreazaPretEuro(pret1);

    var v_pret_ad;
    v_pret_ad = "pret_ad_" + nr;
    document.getElementById(v_pret_ad).innerHTML = pret1;

    var pret2;
    var v_cantitate;
    var v_c;
    v_c = "c_ad_" + nr;
    v_cantitate = document.getElementById(v_c).value;
    pret2 = v_cantitate * pret1;

    var v_pret_total;
    v_pret_total = "pret_total_ad_" + nr;
    document.getElementById(v_pret_total).innerHTML = pret2;
    return pret2;
}

function pretcampai3(tip, color, nr) {
    if (color == 'Standard') {
        switch (tip) {
            case 'tip1':
                functie1(45, 30)
                break
            case 'tip2':
                functie2(45, 20);
                break
            case 'tip3':
                functie3(150);
                break
            case 'tip4':
                functie3(330);
                break
            case 'tip5':
                functie3(160);
                break
            case 'tip6':
                functie3(190);
                break
            case 'tip7':
                functie3(380);
                break
            case 'tip8':
                functie1(27, 15);
                break
        }
    } else {
        switch (tip) {
            case 'tip1':
                functie1(55, 30)
                break
            case 'tip2':
                functie2(55, 20);
                break
            case 'tip3':
                functie3(190);
                break
            case 'tip4':
                functie3(380);
                break
            case 'tip5':
                functie3(200);
                break
            case 'tip6':
                functie3(250);
                break
            case 'tip7':
                functie3(460);
                break
            case 'tip8':
                functie1(33, 15);
                break
        }
    }

    pret3 = majoreazaPretEuro(pret3);

    v_c = "c_pl_" + nr;
    v_cantitate = document.getElementById(v_c).value;
    document.getElementById("pret_plasa" + nr).innerHTML = pret3;

    pret3 = pret3 * v_cantitate;
    document.getElementById("pret_total_plase" + nr).innerHTML = pret3;
    return pret3;
}

function functie1(pret, adaosFix) {
    adaosFix = adaosFix || 0;
    if (v_arie < 0.8) {
        pret3 = 0.8 * pret + adaosFix;
    } else {
        pret3 = v_arie * pret + adaosFix;
    }
}

function functie2(pret, adaosFix) {
    adaosFix = adaosFix || 0;
    if (v_arie < 1.5) {
        pret3 = 1.5 * pret + adaosFix;
    } else {
        pret3 = v_arie * pret + adaosFix;
    }
}

function functie3(pret) {
    pret3 = pret + 20;
}
