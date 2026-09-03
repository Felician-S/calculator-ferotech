function formateazaLei(valoare) {
    var parti = parseFloat(valoare).toFixed(2).split('.');
    parti[0] = parti[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parti.join(',');
}

function escapeHtml(valoare) {
    return String(valoare || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function valoareCamp(id) {
    var camp = document.getElementById(id);
    return camp ? escapeHtml(camp.value) : '';
}

async function descarcaOfertaPdf(buton) {
    var textInitial = buton ? buton.innerHTML : 'Descarcă PDF';
    var continutOferta = null;

    if (typeof html2pdf != 'function') {
        alert('Modulul PDF nu s-a putut încărca. Verifică legătura la internet și reîncarcă pagina.');
        return;
    }

    try {
        if (buton) {
            buton.disabled = true;
            buton.innerHTML = 'Se generează PDF-ul...';
        }

        continutOferta = document.getElementById('adaug-here');
        if (!continutOferta || !continutOferta.innerHTML.trim()) {
            throw new Error('Oferta nu este generată.');
        }
        continutOferta.classList.add('generare-pdf');

        var dataFisier = new Date().toISOString().slice(0, 10);
        var optiuniPdf = {
            margin: 0,
            filename: 'Oferta_Ferotech_' + dataFisier + '.pdf',
            image: {type: 'jpeg', quality: 0.98},
            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                scrollX: 0,
                scrollY: 0
            },
            jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'},
            pagebreak: {mode: ['css', 'legacy'], avoid: ['tr', '.card-total', '.galerie-card']}
        };

        await html2pdf().set(optiuniPdf).from(continutOferta).save();
    } catch (eroare) {
        console.error(eroare);
        alert('PDF-ul nu a putut fi generat. Reîncarcă pagina și încearcă din nou.');
    } finally {
        if (continutOferta) continutOferta.classList.remove('generare-pdf');
        if (buton) {
            buton.disabled = false;
            buton.innerHTML = textInitial;
        }
    }
}

var dataCursEuroBt = '';
var cursEuroBtMemorat = null;
var momentCursEuroBtMemorat = 0;
var promisiuneCursEuroBt = null;

async function obtineCursVanzareEuroBt() {
    if (typeof fetch != 'function' || typeof DOMParser != 'function') return null;

    var acum = Date.now();
    var durataCacheCursBt = 10 * 60 * 1000;
    if (cursEuroBtMemorat !== null && acum - momentCursEuroBtMemorat < durataCacheCursBt) {
        return cursEuroBtMemorat;
    }
    if (promisiuneCursEuroBt) return promisiuneCursEuroBt;

    promisiuneCursEuroBt = (async function () {
        try {
            var controler = typeof AbortController == 'function' ? new AbortController() : null;
            var limitaAsteptare = setTimeout(function () {
                if (controler) controler.abort();
            }, 8000);

            var raspuns = await fetch('https://dev.bancatransilvania.ro/exchange.xml', {
                cache: 'no-store',
                signal: controler ? controler.signal : undefined
            });
            clearTimeout(limitaAsteptare);
            if (!raspuns.ok) throw new Error('Cursul BT nu a putut fi încărcat.');

            var continutXml = await raspuns.text();
            var documentBt = new DOMParser().parseFromString(continutXml, 'application/xml');
            if (documentBt.querySelector('parsererror')) {
                throw new Error('Răspuns XML invalid pentru cursul BT.');
            }

            var monedaEuro = documentBt.querySelector('currency[name="EUR"]');
            var valoareVanzare = monedaEuro ? monedaEuro.querySelector('sell value') : null;
            var curs = valoareVanzare ? parseFloat(valoareVanzare.textContent.trim().replace(',', '.')) : null;
            if (!isFinite(curs) || curs <= 0) {
                throw new Error('Răspuns invalid pentru cursul EUR de vânzare BT.');
            }

            var actualizare = documentBt.querySelector('updateDate');
            var dataActualizare = actualizare ? actualizare.getAttribute('name') : '';
            var partiData = dataActualizare.match(/^(\d{4})-(\d{2})-(\d{2})/);
            dataCursEuroBt = partiData ? partiData[3] + '-' + partiData[2] + '-' + partiData[1] : '';
            cursEuroBtMemorat = curs;
            momentCursEuroBtMemorat = Date.now();
            return curs;
        } catch (eroare) {
            console.error(eroare);
            return null;
        } finally {
            promisiuneCursEuroBt = null;
        }
    })();

    return promisiuneCursEuroBt;
}

function tr(x) {
    var denumiri = {
        tip1: 'MOTOR SMART HOME CU DETECȚIE / ÎNTRERUPĂTOR - 5 ANI GARANȚIE',
        tip2: 'MOTOR SMART HOME CU DETECȚIE / TELECOMANDĂ - 5 ANI GARANȚIE',
        tip3: 'MOTOR SOMFY OXIMO IO CU DETECȚIE / TELECOMANDĂ - 5 ANI GARANȚIE',
        tip4: 'MOTOR SOMFY RS100 IO CU DETECȚIE / TELECOMANDĂ - 5 ANI GARANȚIE',
        tip5: 'MOTOR SMART HOME CU ÎNTRERUPĂTOR - 2 ANI GARANȚIE',
        tip6: 'MOTOR SMART HOME CU TELECOMANDĂ - 2 ANI GARANȚIE',
        tip7: 'MOTOR SOMFY BOOST RTS CU TELECOMANDĂ - 2 ANI GARANȚIE',
        tip8: 'MOTOR SOMFY ILMO CU DETECȚIE / ÎNTRERUPĂTOR - 5 ANI GARANȚIE',
        tip9: 'MOTOR SOMFY RS100 IO CU PANOU SOLAR, DETECȚIE / TELECOMANDĂ - 5 ANI GARANȚIE',
        tip10: 'TELECOMANDĂ SOMFY 1-4 CANALE',
        tip11: 'TELECOMANDĂ SMART 15 CANALE',
        tip12: 'UNITATE CONTROL SMART HOME BOX',
        tip13: 'UNITATE CONTROL SOMFY TAHOMA',
        tip14: 'CLEME RIGIDE ANTIEFRACȚIE',
        tip15: 'MONTAJ RULOURI ELECTRICE',
        tip16: 'MONTAJ RULOURI MANUALE',
        tip17: 'MONTAJ PLASE INSECTE',
        tip18: 'PROFIL DISTANȚARE',
        tip19: 'FRÂNĂ SILICONICĂ PLASE INSECTE',
        tip20: 'ÎNTRERUPĂTOR SMART HOME',
        tip21: 'ÎNTRERUPĂTOR SOMFY SMOOVE'
    };
    return denumiri[x] || 'Accesoriu';
}

function plasa(x) {
    var denumiri = {
        tip1: 'Plasă de insecte tip rulou pentru geam cu frână',
        tip2: 'Plasă de insecte pentru ușă tip RULOU',
        tip3: 'Plasă de insecte pentru ușă tip PLISSE',
        tip4: 'Plasă de insecte pentru ușă tip PLISSE DUBLĂ',
        tip5: 'Plasă de insecte pentru ușă tip BATANTĂ CU REVENIRE',
        tip6: 'Plasă de insecte pentru ușă tip GLISANTĂ (CULISANTĂ)',
        tip7: 'Plasă de insecte pentru ușă tip GLISANTĂ (CULISANTĂ) DUBLĂ',
        tip8: 'Plasă de insecte FIXĂ'
    };
    return denumiri[x] || 'Plasă de insecte';
}

function revenire() {
    document.getElementById('comanda').style.display = 'block';
    document.getElementById('factura').style.display = 'none';
}

function antetPagina(subtitlu) {
    return '<header class="oferta-antet">' +
        '<img src="img/logo_ferotech.png" alt="Ferotech" class="oferta-logo">' +
        '<div class="oferta-antet-titlu"><span>OFERTĂ COMERCIALĂ</span><small>' + subtitlu + '</small></div>' +
        '</header>';
}

function subsolPagina(numar) {
    return '<footer class="oferta-subsol">' +
        '<span>FEROTECH DISTRIBUTION SRL · www.ferotech.ro</span>' +
        '<span>OFERTĂ ' + numar + ' / 3</span>' +
        '</footer>';
}

function blocDateOferta(dataOferta) {
    return '<section class="oferta-date-profesional">' +
        '<div><b>FURNIZOR</b><strong>FEROTECH DISTRIBUTION SRL</strong><span>Calea Baciului nr. 45, Cluj-Napoca</span><span>0264 481 161 · 0756 266 449</span><span>info@ferotech.ro · www.ferotech.ro</span></div>' +
        '<div><b>CLIENT</b><strong>' + (valoareCamp('nume_firma') || '—') + '</strong><span>Persoană de contact: ' + (valoareCamp('persoana_contact') || '—') + '</span><span>Telefon: ' + (valoareCamp('telefon') || '—') + '</span><span>Email: ' + (valoareCamp('email') || '—') + '</span></div>' +
        '<div><b>DETALII OFERTĂ</b><strong>Data: ' + dataOferta + '</strong><span>Valabilitate: 15 zile</span><span>Monedă: EUR</span><span>TVA: 21%</span></div>' +
        '</section>';
}

async function addtable() {
    var cursEuroBt = await obtineCursVanzareEuroBt();
    total();

    var randuriOferta = [];
    var valPretFinal = 0;
    var valPretFinalDiscount = 0;
    var itemeFactura = 0;
    var areRulouriOferta = false;
    var arePlaseOferta = false;
    var areCopertineOferta = false;
    var areUmbrireInterioaraOferta = false;
    var areRoletePlisseOferta = false;
    var areSkyLightOferta = false;
    var primulProdusInteriorOferta = null;
    var discount = parseInt(document.getElementById('val_discount').value, 10);
    if (isNaN(discount) || discount < 0 || discount > 100) discount = 0;

    for (var i = 0; i < rulouriIndex.length; i++) {
        var indexRulou = rulouriIndex[i];
        var pretTotalRulou = parseFloat(document.getElementById('pret_total_' + indexRulou).innerHTML);
        if (!(pretTotalRulou > 0)) continue;
        areRulouriOferta = true;

        itemeFactura++;
        var latime = document.getElementById('l_' + indexRulou).value;
        var inaltime = document.getElementById('h_' + indexRulou).value;
        var cantitate = document.getElementById('c_' + indexRulou).value;
        var pretBucata = parseFloat(document.getElementById('pret_rulou_' + indexRulou).innerHTML);
        var tipOferta = 'APLICAT';
        var culoareOferta = culoareExactaRulou(indexRulou);
        var plasaOferta = 'NU';
        var casetaOferta = '';

        if (document.getElementById('opt1_' + indexRulou).checked) tipOferta = 'SUPRAPUS';
        else if (document.getElementById('opt8_' + indexRulou).checked) tipOferta = 'TENCUIBIL';
        if (document.getElementById('opt5_' + indexRulou).checked) plasaOferta = 'DA';
        if (tipOferta == 'SUPRAPUS') casetaOferta = document.getElementById('opt7_' + indexRulou).checked ? '210 mm' : '170 mm';

        var descriere = '<div class="produs-titlu">Rulou exterior din aluminiu</div>' +
            '<div class="produs-detalii"><span><b>Dimensiune:</b> ' + escapeHtml(latime) + ' × ' + escapeHtml(inaltime) + ' mm</span>' +
            '<span><b>Tip:</b> ' + tipOferta + '</span><span><b>Culoare:</b> ' + culoareOferta + '</span>' +
            '<span><b>Plasă integrată:</b> ' + plasaOferta + '</span>' +
            (casetaOferta ? '<span><b>Casetă:</b> ' + casetaOferta + '</span>' : '') + '</div>';

        randuriOferta.push({nr: itemeFactura, descriere: descriere, pret: pretBucata, cantitate: cantitate, total: pretTotalRulou});
        valPretFinal += pretTotalRulou;
    }

    for (var j = 0; j < aditionaleIndex.length; j++) {
        var indexAditional = aditionaleIndex[j];
        var pretTotalAditional = parseFloat(document.getElementById('pret_total_ad_' + indexAditional).innerHTML);
        if (!(pretTotalAditional > 0)) continue;

        itemeFactura++;
        var tipAditional = tr(document.getElementById('select_ad_' + indexAditional).value);
        var cantitateAditional = document.getElementById('c_ad_' + indexAditional).value;
        var pretBucataAditional = parseFloat(document.getElementById('pret_ad_' + indexAditional).innerHTML);
        randuriOferta.push({nr: itemeFactura, descriere: '<div class="produs-titlu">' + tipAditional + '</div>', pret: pretBucataAditional, cantitate: cantitateAditional, total: pretTotalAditional});
        valPretFinal += pretTotalAditional;
    }

    for (var k = 0; k < plaseIndex.length; k++) {
        var indexPlasa = plaseIndex[k];
        var pretTotalPlasa = parseFloat(document.getElementById('pret_total_plase' + indexPlasa).innerHTML);
        if (!(pretTotalPlasa > 0)) continue;
        arePlaseOferta = true;

        itemeFactura++;
        var tipPlasa = plasa(document.getElementById('select_plase_' + indexPlasa).value);
        var latimePlasa = document.getElementById('l_plasa_' + indexPlasa).value;
        var inaltimePlasa = document.getElementById('h_plasa_' + indexPlasa).value;
        var culoarePlasa = culoareExactaPlasa(indexPlasa);
        var cantitatePlasa = document.getElementById('c_pl_' + indexPlasa).value;
        var pretBucataPlasa = parseFloat(document.getElementById('pret_plasa' + indexPlasa).innerHTML);
        var descrierePlasa = '<div class="produs-titlu">' + tipPlasa + '</div>' +
            '<div class="produs-detalii"><span><b>Dimensiune:</b> ' + escapeHtml(latimePlasa) + ' × ' + escapeHtml(inaltimePlasa) + ' mm</span>' +
            '<span><b>Culoare:</b> ' + culoarePlasa + '</span></div>';
        randuriOferta.push({nr: itemeFactura, descriere: descrierePlasa, pret: pretBucataPlasa, cantitate: cantitatePlasa, total: pretTotalPlasa});
        valPretFinal += pretTotalPlasa;
    }

    for (var m = 0; m < copertineIndex.length; m++) {
        var indexCopertina = copertineIndex[m];
        var pretTotalCopertina = parseFloat(document.getElementById('pret_total_copertina_' + indexCopertina).innerHTML);
        if (!(pretTotalCopertina > 0)) continue;
        areCopertineOferta = true;

        itemeFactura++;
        var configCopertina = configuratieCopertina(indexCopertina);
        var pretBucataCopertina = parseFloat(document.getElementById('pret_copertina_' + indexCopertina).innerHTML);
        var detaliiCopertina = '<span><b>Dimensiune:</b> ' + configCopertina.latime + ' × ' + configCopertina.proiectie + ' mm</span>';

        if (configCopertina.model === 'loggia' || configCopertina.model === 'monobloc') {
            detaliiCopertina += '<span><b>Acționare:</b> ' + denumireActionareCopertina(configCopertina.actionare) + '</span>' +
                '<span><b>Senzor:</b> ' + denumireSenzorCopertina(configCopertina.senzor) + '</span>';
        } else if (configCopertina.model === 'kset30') {
            detaliiCopertina += '<span><b>Acționare:</b> Motor Somfy cu telecomandă</span>' +
                '<span><b>Senzor:</b> ' + denumireSenzorCopertina(configCopertina.senzor) + '</span>';
        } else if (configCopertina.model === 'extensie') {
            detaliiCopertina += '<span><b>Configurație:</b> ' + (configCopertina.extensie === 'da' ? 'Cu extensie' : 'Fără extensie') + '</span>';
        } else if (configCopertina.model === 'teraspro') {
            detaliiCopertina += '<span><b>Acționare:</b> Motor Somfy cu telecomandă</span>' +
                '<span><b>Stâlpi + grindă:</b> ' + (configCopertina.structura === 'da' ? 'Da, H ' + configCopertina.inaltimeStalp + ' mm' : 'Nu') + '</span>';
        }
        detaliiCopertina += '<span><b>Culoare material:</b> ' + escapeHtml(configCopertina.culoare) + '</span>';

        var descriereCopertina = '<div class="produs-titlu">Copertină retractabilă ' + configCopertina.modelInfo.nume + '</div>' +
            '<div class="produs-detalii">' + detaliiCopertina + '</div>';
        randuriOferta.push({nr: itemeFactura, descriere: descriereCopertina, pret: pretBucataCopertina, cantitate: configCopertina.cantitate, total: pretTotalCopertina});
        valPretFinal += pretTotalCopertina;

        var pretTotalMontajCopertina = PRET_MONTAJ_COPERTINA * configCopertina.cantitate;
        itemeFactura++;
        var descriereMontajCopertina = '<div class="produs-titlu">Montaj copertină retractabilă</div>' +
            '<div class="produs-detalii"><span><b>Model:</b> ' + configCopertina.modelInfo.nume + '</span>' +
            '<span><b>Tarif:</b> 100 € fără TVA / bucată</span></div>';
        randuriOferta.push({nr: itemeFactura, descriere: descriereMontajCopertina, pret: PRET_MONTAJ_COPERTINA, cantitate: configCopertina.cantitate, total: pretTotalMontajCopertina});
        valPretFinal += pretTotalMontajCopertina;
    }

    for (var n = 0; n < umbrireInterioaraIndex.length; n++) {
        var indexInterior = umbrireInterioaraIndex[n];
        var pretTotalInterior = parseFloat(document.getElementById('pret_total_roleta_plisse_' + indexInterior).innerHTML);
        if (!(pretTotalInterior > 0)) continue;
        areUmbrireInterioaraOferta = true;

        itemeFactura++;
        var configInterior = configuratieRoletaPlisse(indexInterior);
        if (!primulProdusInteriorOferta) primulProdusInteriorOferta = configInterior.produs;
        if (configInterior.produs === 'skylight') areSkyLightOferta = true;
        else areRoletePlisseOferta = true;
        var pretBucataInterior = parseFloat(document.getElementById('pret_roleta_plisse_' + indexInterior).innerHTML);
        var titluProdusInterior = configInterior.produsInfo.titluOferta;
        var descriereInterior = '<div class="produs-titlu">' + titluProdusInterior + '</div>' +
            '<div class="produs-detalii"><span><b>Dimensiune:</b> ' + configInterior.latime + ' × ' + configInterior.inaltime + ' mm</span>' +
            '<span><b>Material:</b> ' + escapeHtml(configInterior.material.nume) + '</span>' +
            '<span><b>Tip material:</b> ' + escapeHtml(configInterior.material.tip) + '</span>' +
            '<span><b>Compoziție:</b> ' + escapeHtml(configInterior.material.compozitie) + '</span>' +
            '<span><b>Suprafață:</b> ' + formateazaSuprafataRoletaPlisse(configInterior.suprafata) + ' m²</span>' +
            '<span><b>Suprafață calculată:</b> ' + formateazaSuprafataRoletaPlisse(configInterior.suprafataFacturata) + ' m²</span>' +
            '<span><b>Culori sistem:</b> ALB / ARGINTIU / NEGRU</span></div>';
        randuriOferta.push({nr: itemeFactura, descriere: descriereInterior, pret: pretBucataInterior, cantitate: configInterior.cantitate, total: pretTotalInterior});
        valPretFinal += pretTotalInterior;
    }

    valPretFinalDiscount = valPretFinal * (100 - discount) / 100;
    var subtotal = valPretFinal.toFixed(2);
    var subtotalDiscount = valPretFinalDiscount.toFixed(2);
    var tva = (valPretFinalDiscount * 0.21).toFixed(2);
    var totalCuTva = (valPretFinalDiscount * 1.21).toFixed(2);
    var totalLei = cursEuroBt !== null ? valPretFinalDiscount * 1.21 * cursEuroBt : null;
    var dataOferta = new Date().toLocaleDateString('ro-RO', {day: '2-digit', month: '2-digit', year: 'numeric'});

    var randuriHtml = '';
    for (var r = 0; r < randuriOferta.length; r++) {
        var rand = randuriOferta[r];
        randuriHtml += '<tr><td>' + rand.nr + '</td><td>' + rand.descriere + '</td><td>' + rand.pret.toFixed(2) + ' €</td><td>' + escapeHtml(rand.cantitate) + '</td><td>' + rand.total.toFixed(2) + ' €</td></tr>';
    }

    var rezumatHtml = '<div class="card-total">' +
        '<div><span>Subtotal fără TVA</span><b>' + subtotal + ' €</b></div>' +
        (discount > 0 ? '<div><span>Discount aplicat</span><b>' + discount + '%</b></div><div><span>Total cu discount, fără TVA</span><b>' + subtotalDiscount + ' €</b></div>' : '') +
        '<div><span>TVA 21%</span><b>' + tva + ' €</b></div>' +
        '<div class="total-final"><span>Preț final cu TVA</span><b>' + totalCuTva + ' €' + (totalLei !== null ? ' <small>(' + formateazaLei(totalLei) + ' lei)</small>' : '') + '</b></div>' +
        '</div>';

    var notaCurs = cursEuroBt !== null
        ? 'Echivalentul în lei este calculat la cursul de vânzare BT EUR/RON din ' + (dataCursEuroBt || dataOferta) + ': <b>' + cursEuroBt.toFixed(4) + ' lei/EUR</b>.'
        : 'Cursul EUR/RON nu a putut fi actualizat automat; echivalentul în lei nu este afișat.';

    var ofertaDoarPlase = arePlaseOferta && !areRulouriOferta && !areCopertineOferta && !areUmbrireInterioaraOferta;
    var ofertaCuCopertine = areCopertineOferta;
    var ofertaCuInterioare = areUmbrireInterioaraOferta && !areCopertineOferta;
    var prezentariInterioare = {
        rolete_plisse: {
            titlu: 'Rolete interioare Plisse',
            imagine: 'img/interior-plisse-principala.png',
            descriere: 'Un sistem textil foarte versatil, realizat la dimensiune, care permite controlul luminii și al intimității prin poziționare flexibilă pe suprafața vitrată.',
            beneficii: ['potrivite pentru ferestre clasice și forme speciale', 'deschidere de sus, de jos sau poziționare intermediară', 'materiale decorative, filtrante sau opace', 'design compact și integrare discretă', 'configurație adaptată fiecărei ferestre']
        },
        skylight: {
            titlu: 'Rolete textile SkyLight',
            imagine: 'img/interior-skylight-principala.png',
            descriere: 'Soluția dedicată ferestrelor de mansardă, concepută pentru lumină filtrată, confort termic și intimitate, cu materiale textile potrivite stilului încăperii.',
            beneficii: ['proiectate pentru ferestre de mansardă', 'ghidare stabilă pe suprafața înclinată', 'materiale filtrante sau blackout', 'culori elegante și variante pentru camera copilului', 'execuție personalizată după dimensiunea ferestrei']
        },
        rolete_interioare: {
            titlu: 'Rolete textile interioare',
            imagine: 'img/interior-rolete-principala.png',
            descriere: 'O soluție modernă pentru protecție solară și intimitate, cu linii simple și o colecție variată de materiale care completează amenajarea interioară.',
            beneficii: ['control eficient al luminii naturale', 'protecție împotriva privirilor din exterior', 'materiale decorative și funcționale', 'potrivite pentru locuințe și birouri', 'execuție personalizată la dimensiune']
        },
        doublette: {
            titlu: 'Rolete textile Doublette',
            imagine: 'img/interior-doublette-principala.png',
            descriere: 'Materialul cu benzi transparente și opace permite reglarea fină a luminii, îmbinând funcționalitatea unei rolete cu un aspect contemporan.',
            beneficii: ['alternanță de benzi transparente și opace', 'reglare graduală a luminii și intimității', 'potrivite pentru living, bucătărie sau baie', 'integrare în decor modern sau clasic', 'aspect textil elegant și funcțional']
        },
        doublette_maxi: {
            titlu: 'Rolete textile Doublette Maxi',
            imagine: 'img/interior-doublette-principala.png',
            descriere: 'Varianta Maxi păstrează alternanța benzilor transparente și opace, într-un sistem dimensionat pentru suprafețe vitrate mai ample și control confortabil al luminii.',
            beneficii: ['format adaptat ferestrelor de dimensiuni mai mari', 'benzi transparente și opace cu reglaj gradual', 'control simultan al luminii și intimității', 'aspect textil modern și elegant', 'execuție personalizată la dimensiune']
        }
    };
    var prezentareInterior = prezentariInterioare[primulProdusInteriorOferta] || prezentariInterioare.rolete_plisse;
    var subtitluPagina1 = ofertaCuCopertine
        ? 'COPERTINE RETRACTABILE · PROTECȚIE SOLARĂ'
        : (ofertaCuInterioare ? 'SISTEME DE UMBRIRE INTERIOARĂ · CONFORT ȘI DESIGN' : (ofertaDoarPlase ? 'PLASE DE INSECTE · UȘI ȘI FERESTRE' : 'RULOURI EXTERIOARE · SISTEME DE UMBRIRE'));
    var prezentarePagina1;
    if (ofertaCuCopertine) {
        prezentarePagina1 = '<div class="produs-prezentare produs-prezentare-copertine"><div class="produs-prezentare-text"><span class="eticheta">CONFORT PENTRU TERASE</span><h1>Copertine retractabile personalizate</h1><p>Sisteme de umbrire realizate la dimensiune, concepute pentru terase și balcoane care au nevoie de protecție solară, confort termic și un aspect elegant.</p><ul><li>construcție robustă cu brațe articulate</li><li>protecție solară și confort vizual</li><li>acționare manuală sau electrică, în funcție de model</li><li>senzori de vânt sau soare-vânt disponibili</li><li>material textil și finisaje alese din paletar</li></ul></div><div class="produs-prezentare-imagini"><img src="img/copertina-principala-ferotech.png" alt="Copertină retractabilă Ferotech - imagine de referință"></div></div>';
    } else if (ofertaCuInterioare) {
        var beneficiiInteriorHtml = '';
        for (var b = 0; b < prezentareInterior.beneficii.length; b++) beneficiiInteriorHtml += '<li>' + prezentareInterior.beneficii[b] + '</li>';
        prezentarePagina1 = '<div class="produs-prezentare produs-prezentare-interioare produs-prezentare-' + primulProdusInteriorOferta + '"><div class="produs-prezentare-text"><span class="eticheta">LUMINĂ CONTROLATĂ</span><h1>' + prezentareInterior.titlu + '</h1><p>' + prezentareInterior.descriere + '</p><ul>' + beneficiiInteriorHtml + '</ul></div><div class="produs-prezentare-imagini"><img src="' + prezentareInterior.imagine + '" alt="' + prezentareInterior.titlu + ' - imagine de referință"></div></div>';
    } else if (ofertaDoarPlase) {
        prezentarePagina1 = '<div class="produs-prezentare produs-prezentare-plase"><div class="produs-prezentare-text"><span class="eticheta">CONFORT FĂRĂ INSECTE</span><h1>Plase de insecte pentru uși și ferestre</h1><p>Soluții discrete și durabile, executate la comandă, care permit aerisirea naturală și păstrează insectele și polenul la exterior.</p><ul><li>protecție eficientă cu ușile și ferestrele deschise</li><li>cadre stabile din aluminiu și plasă de calitate</li><li>modele rulou, plisse, glisante, batante sau fixe</li><li>vizibilitate bună și integrare discretă</li><li>culori adaptate tâmplăriei</li></ul></div><div class="produs-prezentare-imagini"><img src="img/plase-principala-ferotech.png" alt="Plasă de insecte pentru ușă - lucrare de referință"></div></div>';
    } else {
        prezentarePagina1 = '<div class="produs-prezentare"><div class="produs-prezentare-text"><span class="eticheta">SISTEME ALUPROF</span><h1>Rulouri exterioare ALUPROF</h1><p>Sisteme din aluminiu de înaltă calitate, executate la comandă pentru protecție solară, confort termic și fonic, intimitate și un plus de siguranță.</p><ul><li>lamele din aluminiu umplute cu spumă poliuretanică</li><li>casetă și ghidaje rezistente la coroziune</li><li>acționare manuală, electrică sau Smart Home</li><li>culori și finisaje adaptate tâmplăriei</li><li>opțional, plasă de insecte integrată</li></ul></div><div class="produs-prezentare-imagini"><img src="img/rulouri-aluprof-referinta.png" alt="Rulouri exterioare ALUPROF - imagine de referință"></div></div>';
    }

    var pagina1 = '<section class="oferta-pagina oferta-pagina-prezentare">' + antetPagina(subtitluPagina1) +
        blocDateOferta(dataOferta) +
        '<div class="oferta-salut"><p>Stimate client,</p><p>Vă mulțumim pentru interesul acordat produselor Ferotech. Vă prezentăm mai jos soluția configurată conform cerințelor dumneavoastră.</p></div>' +
        prezentarePagina1 +
        '<div class="rezumat-prima-pagina"><div><span>POZIȚII ÎN OFERTĂ</span><strong>' + itemeFactura + '</strong></div><div><span>VALABILITATE</span><strong>15 zile</strong></div><div><span>PREȚ FINAL CU TVA</span><strong>' + totalCuTva + ' €</strong></div></div>' +
        subsolPagina(1) + '</section>';

    var pagina2 = '<section class="oferta-pagina oferta-pagina-urmatoare oferta-pagina-calcul">' + antetPagina('CONFIGURAȚIE ȘI PREȚURI') +
        '<div class="sectiune-titlu"><span>02</span><div><h2>Calculul ofertei</h2><p>Produsele, dimensiunile și opțiunile selectate</p></div></div>' +
        '<table class="tabel-factura tabel-profesional"><thead><tr><th>Nr.</th><th>Produs / configurație</th><th>Preț unitar</th><th>Cant.</th><th>Total</th></tr></thead><tbody>' + randuriHtml + '</tbody></table>' +
        '<div class="zona-totaluri"><div class="nota-financiara"><h3>Informații financiare</h3><p>Toate prețurile sunt exprimate în <b>EURO</b>.</p><p>' + notaCurs + '</p><p>Prețul în lei are caracter informativ și se actualizează automat în momentul generării ofertei.</p></div>' + rezumatHtml + '</div>' +
        '<div class="conditii-profesionale"><h3>Condiții comerciale</h3><div class="conditii-grid"><p><b>Termen de livrare</b><span>10 zile lucrătoare pentru culorile standard și 15 zile lucrătoare pentru celelalte culori.</span></p><p><b>Condiții de plată</b><span>Avans minim 50% din valoarea lucrării; termenul curge de la data achitării avansului.</span></p><p><b>Servicii incluse</b><span>Oferta este finală și include TVA, măsurători și montaj.</span></p><p><b>Valabilitate</b><span>15 zile calendaristice de la data emiterii.</span></p></div></div>' +
        '<p class="nota-masuratori">Prețul final este confirmat după verificarea dimensiunilor la locul montajului. Pentru informații: 0756 266 449.</p>' +
        subsolPagina(2) + '</section>';

    var primaImagineGalerie = '<figure class="galerie-card galerie-card-mare"><img src="img/3.png" alt="Rulouri din aluminiu Ferotech"><figcaption>Rulouri din aluminiu</figcaption></figure>';
    var subtitluGalerie = ofertaCuCopertine
        ? 'Imagine de referință și soluții complementare pentru amenajarea terasei'
        : (ofertaCuInterioare ? 'Imagini de referință pentru soluții de umbrire și confort interior' : (ofertaDoarPlase ? 'Imagini de referință pentru soluții de protecție și umbrire' : 'Imagini de referință din gama de soluții Ferotech'));

    var pagina3 = '<section class="oferta-pagina oferta-pagina-urmatoare oferta-pagina-referinte">' + antetPagina('PRODUSE ȘI LUCRĂRI DE REFERINȚĂ') +
        '<div class="sectiune-titlu"><span>03</span><div><h2>Inspirație pentru proiectul dumneavoastră</h2><p>' + subtitluGalerie + '</p></div></div>' +
        '<div class="galerie-referinte">' + primaImagineGalerie + '<figure class="galerie-card"><img src="img/2.png" alt="Motorizare smart Ferotech"><figcaption>Motorizare smart</figcaption></figure><figure class="galerie-card"><img src="img/1.png" alt="Raffstore Ferotech"><figcaption>Raffstore</figcaption></figure><figure class="galerie-card"><img src="img/6.png" alt="Plase plisse Ferotech"><figcaption>Plase tip plisse</figcaption></figure><figure class="galerie-card"><img src="img/4.png" alt="Rolete interioare Ferotech"><figcaption>Rolete interioare</figcaption></figure><figure class="galerie-card"><img src="img/5.png" alt="Pergole Ferotech"><figcaption>Pergole</figcaption></figure></div>' +
        '<div class="incheiere-oferta"><div><span class="eticheta">VĂ MULȚUMIM</span><h2>Suntem pregătiți să transformăm oferta în proiect.</h2><p>Echipa Ferotech vă stă la dispoziție pentru clarificări, măsurători și alegerea finisajelor potrivite.</p></div><div class="contact-final"><b>FEROTECH DISTRIBUTION SRL</b><span>Calea Baciului nr. 45, Cluj-Napoca</span><span>0756 266 449 · 0264 481 161</span><span>info@ferotech.ro · www.ferotech.ro</span></div></div>' +
        '<div class="acceptare-oferta"><div><b>Acceptat de client</b><span>Nume, semnătură și dată</span></div><div><b>Reprezentant Ferotech</b><span>Semnătură și ștampilă</span></div></div>' +
        subsolPagina(3) + '</section>';

    document.getElementById('adaug-here').innerHTML = '<div class="oferta-document">' + pagina1 + pagina2 + pagina3 + '</div>';
    document.getElementById('comanda').style.display = 'none';
    document.getElementById('factura').style.display = 'block';
    window.scrollTo(0, 0);
}
