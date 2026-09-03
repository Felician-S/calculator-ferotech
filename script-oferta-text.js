(function () {
    var exempluOfertaText = 'Fă-mi o ofertă pentru 3 rulouri tencuibile, stejar auriu, acționare electrică cu motor Smart Home cu telecomandă și montaj, cu dimensiunile 1400x1700, 900x1700, 900x1700.';

    function normalizeaza(text) {
        return (text || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/ș/g, 's')
            .replace(/ț/g, 't')
            .replace(/\bcoeprtina\b/g, 'copertina')
            .replace(/\bcopretina\b/g, 'copertina')
            .replace(/\blogia\b/g, 'loggia');
    }

    function contine(text, expresii) {
        for (var i = 0; i < expresii.length; i++) {
            if (text.indexOf(expresii[i]) !== -1) return true;
        }
        return false;
    }

    function extrageNumarRulouri(text) {
        var potrivire = text.match(/\b(\d+)\s*(?:de\s+)?rulou(?:ri|l)?\b/);
        if (potrivire) return parseInt(potrivire[1], 10);

        var numere = {
            'un': 1, 'o': 1, 'doua': 2, 'doi': 2, 'trei': 3, 'patru': 4,
            'cinci': 5, 'sase': 6, 'sapte': 7, 'opt': 8, 'noua': 9, 'zece': 10
        };
        var cuvinte = text.match(/\b(un|o|doua|doi|trei|patru|cinci|sase|sapte|opt|noua|zece)\s+rulou(?:ri|l)?\b/);
        return cuvinte ? numere[cuvinte[1]] : null;
    }

    function extrageNumarPlase(text) {
        var potrivire = text.match(/\b(\d+)\s*(?:de\s+)?plas(?:a|e)\b/);
        if (potrivire) return parseInt(potrivire[1], 10);

        var numere = {
            'un': 1, 'o': 1, 'doua': 2, 'doi': 2, 'trei': 3, 'patru': 4,
            'cinci': 5, 'sase': 6, 'sapte': 7, 'opt': 8, 'noua': 9, 'zece': 10
        };
        var cuvinte = text.match(/\b(un|o|doua|doi|trei|patru|cinci|sase|sapte|opt|noua|zece)\s+(?:de\s+)?plas(?:a|e)\b/);
        return cuvinte ? numere[cuvinte[1]] : null;
    }

    function extrageNumarCopertine(text) {
        var potrivire = text.match(/\b(\d+)\s*(?:de\s+)?copertin(?:a|e)\b/);
        if (potrivire) return parseInt(potrivire[1], 10);
        var numere = {'un': 1, 'o': 1, 'doua': 2, 'doi': 2, 'trei': 3, 'patru': 4, 'cinci': 5};
        var cuvinte = text.match(/\b(un|o|doua|doi|trei|patru|cinci)\s+(?:de\s+)?copertin(?:a|e)\b/);
        return cuvinte ? numere[cuvinte[1]] : 1;
    }

    function extrageDimensiuni(text) {
        var dimensiuni = [];
        var expresie = /(\d{3,4})\s*(?:x|×|\*)\s*(\d{3,4})/gi;
        var potrivire;

        while ((potrivire = expresie.exec(text)) !== null) {
            dimensiuni.push({latime: parseInt(potrivire[1], 10), inaltime: parseInt(potrivire[2], 10)});
        }
        return dimensiuni;
    }

    function identificaMotor(text) {
        if (contine(text, ['panou solar']) && contine(text, ['rs100', 'somfy'])) return 'tip9';
        if (contine(text, ['rs100'])) return 'tip4';
        if (contine(text, ['oximo'])) return 'tip3';
        if (contine(text, ['ilmo'])) return 'tip8';
        if (contine(text, ['boost'])) return 'tip7';

        if (contine(text, ['smart home'])) {
            var areDetectie = contine(text, ['detectie', 'detector']);
            var areIntrerupator = contine(text, ['intrerupator']);
            var areTelecomanda = contine(text, ['telecomanda']);

            if (areDetectie && areIntrerupator) return 'tip1';
            if (areDetectie && areTelecomanda) return 'tip2';
            if (areIntrerupator) return 'tip5';
            if (areTelecomanda) return 'tip6';
        }
        return null;
    }

    function identificaTipPlasa(text) {
        if (contine(text, ['plisse dubla', 'plise dubla'])) return 'tip4';
        if (contine(text, ['plisse', 'plise'])) return 'tip3';
        if (contine(text, ['batanta'])) return 'tip5';
        if (contine(text, ['glisanta dubla', 'culisanta dubla'])) return 'tip7';
        if (contine(text, ['glisanta', 'culisanta'])) return 'tip6';
        if (contine(text, ['fixa', 'isso'])) return 'tip8';
        if (contine(text, ['rulou']) && contine(text, ['usa'])) return 'tip2';
        if (contine(text, ['rulou'])) return 'tip1';
        return null;
    }

    function identificaCuloarePlasa(text) {
        return contine(text, ['extra', 'antracit', 'stejar', 'nuc', 'wenghe', 'mahon']) ? 'Extra' : 'Standard';
    }

    function identificaCuloareExactaPlasa(text) {
        if (contine(text, ['stejar auriu', 'stejar'])) return 'stejar_auriu';
        if (contine(text, ['antracit'])) return 'antracit';
        if (contine(text, ['wenghe'])) return 'wenghe';
        if (contine(text, ['mahon'])) return 'mahon';
        if (contine(text, ['nuc'])) return 'nuc';
        if (contine(text, ['maro'])) return 'maro';
        if (contine(text, ['extra'])) return 'antracit';
        return 'alb';
    }

    function extrageGrupuriPlase(text) {
        var numar = '(?:\\d+|un|o|doua|doi|trei|patru|cinci|sase|sapte|opt|noua|zece)';
        var inceput = numar + '\\s+(?:de\\s+)?plas(?:a|e)\\b';
        var expresie = new RegExp('(' + inceput + '[\\s\\S]*?)(?=\\s+(?:si|,)\\s+' + inceput + '|$)', 'g');
        var grupuri = [];
        var potrivire;
        while ((potrivire = expresie.exec(text)) !== null) grupuri.push(potrivire[1]);
        return grupuri.length ? grupuri : [text];
    }

    function interpreteazaPlase(text, dimensiuniGlobale) {
        var grupuri = extrageGrupuriPlase(text);
        var produse = [];
        var numarTotal = 0;

        for (var g = 0; g < grupuri.length; g++) {
            var grup = grupuri[g];
            var tip = identificaTipPlasa(grup);
            if (!tip) throw new Error('Nu am identificat tipul plasei din poziția ' + (g + 1) + ': rulou, plisse, glisantă, batantă sau fixă.');

            var dimensiuniGrup = extrageDimensiuni(grup);
            if (!dimensiuniGrup.length && dimensiuniGlobale.length === 1) {
                dimensiuniGrup = [{latime: dimensiuniGlobale[0].latime, inaltime: dimensiuniGlobale[0].inaltime}];
            }
            if (!dimensiuniGrup.length) {
                throw new Error('Lipsește dimensiunea pentru plasa din poziția ' + (g + 1) + '. Scrie, de exemplu, 800x1700.');
            }

            var cantitate = extrageNumarPlase(grup) || dimensiuniGrup.length;
            var culoare = identificaCuloarePlasa(grup);
            var culoareExacta = identificaCuloareExactaPlasa(grup);
            if (dimensiuniGrup.length === 1) {
                produse.push({tipPlasa: tip, culoarePlasa: culoare, culoareExactaPlasa: culoareExacta, dimensiune: dimensiuniGrup[0], cantitate: cantitate});
                numarTotal += cantitate;
            } else {
                if (cantitate !== dimensiuniGrup.length) {
                    throw new Error('Cantitatea din poziția ' + (g + 1) + ' nu corespunde cu numărul dimensiunilor.');
                }
                for (var d = 0; d < dimensiuniGrup.length; d++) {
                    produse.push({tipPlasa: tip, culoarePlasa: culoare, culoareExactaPlasa: culoareExacta, dimensiune: dimensiuniGrup[d], cantitate: 1});
                    numarTotal++;
                }
            }
        }

        for (var p = 0; p < produse.length; p++) {
            var dim = produse[p].dimensiune;
            if (dim.latime < 300 || dim.inaltime < 300) {
                throw new Error('Dimensiunea ' + dim.latime + 'x' + dim.inaltime + ' este prea mică.');
            }
        }

        return {
            categorie: 'plase',
            produsePlase: produse,
            numarPlase: numarTotal,
            montaj: contine(text, ['montaj']) ? 'tip17' : null,
            avertismente: []
        };
    }

    function interpreteazaCopertina(text, dimensiuni) {
        if (!dimensiuni.length) throw new Error('Lipsește dimensiunea copertinei. Scrie lățime x proiecție în mm, de exemplu 4000x3000.');
        var actionare = contine(text, ['motor cu manivela']) ? 'motor_manivela' : (contine(text, ['motor', 'electric']) ? 'motor_somfy' : 'manuala');
        var senzor = contine(text, ['soare-vant', 'soare vant', 'senzor soare']) ? 'soare_vant' : (contine(text, ['senzor de vant', 'senzor vant']) ? 'vant' : 'nu');
        var modeleGasite = [];
        var expresiiModele = [
            {model: 'loggia', expresie: /\bloggia\b/g},
            {model: 'monobloc', expresie: /\bmonobloc\b/g},
            {model: 'kset30', expresie: /\b(?:k-set\s*30|k\s*set\s*30|kset\s*30)\b/g},
            {model: 'teraspro', expresie: /\b(?:teras\s*pro|teraspro)\b/g},
            {model: 'extensie', expresie: /\b(?:extensie|extensibila)\b/g}
        ];
        for (var e = 0; e < expresiiModele.length; e++) {
            var potrivireModel;
            while ((potrivireModel = expresiiModele[e].expresie.exec(text)) !== null) {
                modeleGasite.push({model: expresiiModele[e].model, pozitie: potrivireModel.index});
            }
        }
        modeleGasite.sort(function (a, b) { return a.pozitie - b.pozitie; });
        if (!modeleGasite.length) throw new Error('Nu am identificat modelul copertinei: Loggia, Monobloc, K-SET 30, Extensie sau Teras Pro.');

        var produseCopertine = [];
        for (var m = 0; m < modeleGasite.length; m++) {
            produseCopertine.push({
                model: modeleGasite[m].model,
                dimensiune: dimensiuni[m] || dimensiuni[0],
                cantitate: modeleGasite.length === 1 ? extrageNumarCopertine(text) : 1,
                actionare: actionare,
                senzor: senzor,
                extensie: contine(text, ['fara extensie']) ? 'nu' : 'da',
                structura: contine(text, ['stalpi', 'stalp', 'grinda']) ? 'da' : 'nu'
            });
        }
        return {
            categorie: 'copertine',
            model: produseCopertine[0].model,
            dimensiuni: dimensiuni,
            cantitate: extrageNumarCopertine(text),
            actionare: actionare,
            senzor: senzor,
            extensie: contine(text, ['fara extensie']) ? 'nu' : 'da',
            structura: contine(text, ['stalpi', 'stalp', 'grinda']) ? 'da' : 'nu',
            produseCopertine: produseCopertine
        };
    }

    function interpreteazaOferta(textOriginal) {
        var text = normalizeaza(textOriginal);
        var dimensiuniGasite = extrageDimensiuni(text);

        if (/\bcopertin(?:a|e)\b/.test(text)) return interpreteazaCopertina(text, dimensiuniGasite);
        if (/\bplas(?:a|e)\b/.test(text)) return interpreteazaPlase(text, dimensiuniGasite);

        var rezultat = {
            categorie: 'rulouri',
            dimensiuni: dimensiuniGasite,
            numarRulouri: extrageNumarRulouri(text),
            tip: null,
            culoare: null,
            culoareCod: null,
            culoareDescriere: '',
            pir: contine(text, ['pir da', 'cu pir']) ? 'da' : 'nu',
            caseta210: contine(text, ['caseta 210', 'caseta de 210']),
            motor: identificaMotor(text),
            montaj: null,
            avertismente: []
        };

        if (contine(text, ['tencuibil'])) rezultat.tip = 'tencuibil';
        else if (contine(text, ['suprapus'])) rezultat.tip = 'suprapus';
        else if (contine(text, ['aplicat'])) rezultat.tip = 'aplicat';

        if (contine(text, ['stejar auriu'])) {
            rezultat.culoare = 'imitatie';
            rezultat.culoareCod = 'stejar_auriu';
            rezultat.culoareDescriere = 'Stejar Auriu';
        } else if (contine(text, ['nuc'])) {
            rezultat.culoare = 'imitatie';
            rezultat.culoareCod = 'nuc';
            rezultat.culoareDescriere = 'Nuc';
        } else if (contine(text, ['mahon'])) {
            rezultat.culoare = 'imitatie';
            rezultat.culoareCod = 'mahon';
            rezultat.culoareDescriere = 'Mahon';
        } else if (contine(text, ['wenghe'])) {
            rezultat.culoare = 'imitatie';
            rezultat.culoareCod = 'wenghe';
            rezultat.culoareDescriere = 'Wenghe';
        } else if (contine(text, ['imitatie'])) {
            rezultat.culoare = 'imitatie';
            rezultat.culoareCod = 'stejar_auriu';
            rezultat.culoareDescriere = 'Stejar Auriu';
        } else if (contine(text, ['silver'])) {
            rezultat.culoare = 'antracit';
            rezultat.culoareCod = 'silver';
            rezultat.culoareDescriere = 'Silver';
        } else if (contine(text, ['antracit'])) {
            rezultat.culoare = 'antracit';
            rezultat.culoareCod = 'antracit';
            rezultat.culoareDescriere = 'Antracit';
        } else if (contine(text, ['maro'])) {
            rezultat.culoare = 'standard';
            rezultat.culoareCod = 'maro';
            rezultat.culoareDescriere = 'Maro';
        } else if (contine(text, ['alb', 'standard'])) {
            rezultat.culoare = 'standard';
            rezultat.culoareCod = 'alb';
            rezultat.culoareDescriere = 'Alb';
        }

        var actionareElectrica = contine(text, ['electric', 'motor']);
        var actionareManuala = contine(text, ['manual']);
        if (contine(text, ['montaj'])) rezultat.montaj = actionareElectrica && !actionareManuala ? 'tip15' : 'tip16';

        if (!rezultat.numarRulouri) rezultat.numarRulouri = rezultat.dimensiuni.length;
        if (rezultat.dimensiuni.length === 1 && rezultat.numarRulouri > 1) {
            var dimensiuneUnica = rezultat.dimensiuni[0];
            while (rezultat.dimensiuni.length < rezultat.numarRulouri) {
                rezultat.dimensiuni.push({latime: dimensiuneUnica.latime, inaltime: dimensiuneUnica.inaltime});
            }
        }

        if (!rezultat.tip) throw new Error('Nu am identificat tipul ruloului: tencuibil, aplicat sau suprapus.');
        if (!rezultat.culoare) throw new Error('Nu am identificat culoarea: Standard, Antracit sau Imitație lemn.');
        if (!rezultat.dimensiuni.length) throw new Error('Nu am găsit dimensiuni scrise ca lățime x înălțime, de exemplu 1400x1700.');
        if (rezultat.numarRulouri !== rezultat.dimensiuni.length) {
            throw new Error('Numărul de rulouri (' + rezultat.numarRulouri + ') nu corespunde cu numărul dimensiunilor (' + rezultat.dimensiuni.length + ').');
        }

        for (var i = 0; i < rezultat.dimensiuni.length; i++) {
            var dim = rezultat.dimensiuni[i];
            if (dim.latime < 400 || dim.latime > 2800 || dim.inaltime < 400 || dim.inaltime > 3100) {
                throw new Error('Dimensiunea ' + dim.latime + 'x' + dim.inaltime + ' este în afara limitelor calculatorului.');
            }
        }

        if (actionareElectrica && !rezultat.motor) {
            rezultat.avertismente.push('Ai cerut acționare electrică, dar modelul motorului nu a fost identificat și nu a fost adăugat.');
        }
        if (rezultat.tip !== 'suprapus' && rezultat.caseta210) {
            rezultat.avertismente.push('Caseta 210 se aplică doar rulourilor suprapuse și a fost ignorată.');
            rezultat.caseta210 = false;
        }
        return rezultat;
    }

    function golesteProduseleCurente() {
        $('#rulouri').empty();
        $('#aditionale').empty();
        $('#plase').empty();
        $('#copertine').empty();
        rulouriIndex = [];
        aditionaleIndex = [];
        plaseIndex = [];
        copertineIndex = [];
        numarRulouri = 0;
        numarAditionale = 0;
        numarPlase = 0;
        numarCopertine = 0;
        $('#nr_rulouri').html('0');
        $('#nr_aditionale').html('0');
        $('#nr_plase').html('0');
        $('#nr_copertine').html('0');
    }

    function selecteazaRulou(nr, rezultat, dimensiune) {
        $('#l_' + nr).val(dimensiune.latime);
        $('#h_' + nr).val(dimensiune.inaltime);
        $('#c_' + nr).val('1');

        var optiuniTip = {suprapus: 'opt1_', aplicat: 'opt2_', tencuibil: 'opt8_'};
        var optiuniCuloare = {standard: 'opt3_', imitatie: 'opt4_', antracit: 'opt9_'};
        $('#' + optiuniTip[rezultat.tip] + nr).prop('checked', true);
        $('#' + optiuniCuloare[rezultat.culoare] + nr).prop('checked', true);
        $('#culoare_rulou_' + nr).val(rezultat.culoareCod || 'alb');
        sincronizeazaCuloareRulou(nr);
        $('#' + (rezultat.pir === 'da' ? 'opt5_' : 'opt6_') + nr).prop('checked', true);
        $('#opt7_' + nr).prop('checked', rezultat.caseta210);
        pret(nr);
    }

    function selecteazaPlasa(nr, produs) {
        $('#l_plasa_' + nr).val(produs.dimensiune.latime);
        $('#h_plasa_' + nr).val(produs.dimensiune.inaltime);
        $('#c_pl_' + nr).val(produs.cantitate);
        $('#select_plase_' + nr).val(produs.tipPlasa);
        $('#opt_culoare_1_' + nr).prop('checked', produs.culoarePlasa === 'Standard');
        $('#opt_culoare_2_' + nr).prop('checked', produs.culoarePlasa === 'Extra');
        $('#culoare_plasa_' + nr).val(produs.culoareExactaPlasa || (produs.culoarePlasa === 'Extra' ? 'antracit' : 'alb'));
        sincronizeazaCuloarePlasa(nr);
        pret3p(nr);
    }

    function selecteazaCopertinaAutomata(nr, rezultat, dimensiune, cantitate) {
        $('#model_copertina_' + nr).val(rezultat.model);
        actualizeazaCampuriCopertina(nr);
        if (rezultat.model === 'extensie') {
            $('#latime_copertina_libera_' + nr).val(dimensiune.latime);
            $('#proiectie_copertina_libera_' + nr).val(dimensiune.inaltime);
            $('#extensie_copertina_' + nr).val(rezultat.extensie);
        } else {
            $('#latime_copertina_' + nr).val(dimensiune.latime);
            $('#proiectie_copertina_' + nr).val(dimensiune.inaltime);
        }
        $('#actionare_copertina_' + nr).val(rezultat.actionare);
        $('#senzor_copertina_' + nr).val(rezultat.senzor);
        $('#structura_copertina_' + nr).val(rezultat.structura);
        actualizeazaInaltimeStalpCopertina(nr);
        $('#cantitate_copertina_' + nr).val(cantitate || 1);
        if (!(pretCopertina(nr) > 0)) throw new Error('Dimensiunea ' + dimensiune.latime + 'x' + dimensiune.inaltime + ' nu este compatibilă cu modelul ales.');
    }

    function adaugaProdusAditionalAutomat(tip, cantitate) {
        adaugaAditional();
        var nr = indexAditionale;
        $('#select_ad_' + nr).val(tip);
        $('#c_ad_' + nr).val(cantitate);
        pret2(nr);
    }

    function afiseazaStatus(mesaj, esteEroare) {
        var status = document.getElementById('oferta_text_status');
        status.className = esteEroare ? 'oferta-text-status eroare' : 'oferta-text-status succes';
        status.innerHTML = mesaj;
    }

    window.interpreteazaOfertaDinText = interpreteazaOferta;

    window.incarcaExempluOfertaText = function () {
        document.getElementById('cerere_oferta_text').value = exempluOfertaText;
        document.getElementById('cerere_oferta_text').focus();
    };

    window.genereazaOfertaDinText = async function (deschideOferta) {
        try {
            var text = document.getElementById('cerere_oferta_text').value.trim();
            if (!text) throw new Error('Scrie cererea pentru ofertă înainte de calcul.');

            var rezultat = interpreteazaOferta(text);
            if (document.getElementById('inlocuieste_produse_text').checked) golesteProduseleCurente();

            if (rezultat.categorie === 'copertine') {
                var produseCopertine = rezultat.produseCopertine || [{
                    model: rezultat.model,
                    dimensiune: rezultat.dimensiuni[0],
                    cantitate: rezultat.cantitate,
                    actionare: rezultat.actionare,
                    senzor: rezultat.senzor,
                    extensie: rezultat.extensie,
                    structura: rezultat.structura
                }];
                for (var c = 0; c < produseCopertine.length; c++) {
                    var produsCopertina = produseCopertine[c];
                    adaugaCopertina();
                    selecteazaCopertinaAutomata(indexCopertine, produsCopertina, produsCopertina.dimensiune, produsCopertina.cantitate);
                }
                total();
                var descrieriCopertine = produseCopertine.map(function (produs) {
                    return produs.cantitate + ' × ' + COPERTINE_MODELE[produs.model].nume + ', ' +
                        produs.dimensiune.latime + 'x' + produs.dimensiune.inaltime;
                });
                afiseazaStatus('<b>Oferta a fost completată:</b> ' + descrieriCopertine.join('; ') + '.', false);
                if (deschideOferta) {
                    await addtable();
                    return;
                }
                document.getElementById('copertine').scrollIntoView({behavior: 'smooth', block: 'start'});
                return;
            }

            if (rezultat.categorie === 'plase') {
                for (var p = 0; p < rezultat.produsePlase.length; p++) {
                    adaugaPlasa();
                    selecteazaPlasa(indexPlase, rezultat.produsePlase[p]);
                }
                if (rezultat.montaj) adaugaProdusAditionalAutomat(rezultat.montaj, rezultat.numarPlase);
                total();

                var denumiriPlase = {
                    tip1: 'rulou pentru geam cu frână', tip2: 'rulou pentru ușă', tip3: 'plisse', tip4: 'plisse dublă',
                    tip5: 'batantă cu revenire', tip6: 'glisantă', tip7: 'glisantă dublă', tip8: 'fixă'
                };
                var descrieriPlase = rezultat.produsePlase.map(function (produs) {
                    return produs.cantitate + ' × ' + denumiriPlase[produs.tipPlasa] + ', ' + produs.culoarePlasa + ', ' +
                        produs.dimensiune.latime + 'x' + produs.dimensiune.inaltime;
                });
                var mesajPlase = '<b>Oferta a fost completată:</b> ' + descrieriPlase.join('; ') + '.';
                if (rezultat.montaj) mesajPlase += ' Montajul a fost adăugat cu cantitatea ' + rezultat.numarPlase + '.';
                afiseazaStatus(mesajPlase, false);

                if (deschideOferta) {
                    await addtable();
                    return;
                }
                document.getElementById('plase').scrollIntoView({behavior: 'smooth', block: 'start'});
                return;
            }

            for (var i = 0; i < rezultat.dimensiuni.length; i++) {
                adaugaRulou();
                selecteazaRulou(indexRulouri, rezultat, rezultat.dimensiuni[i]);
            }

            if (rezultat.motor) adaugaProdusAditionalAutomat(rezultat.motor, rezultat.numarRulouri);
            if (rezultat.montaj) adaugaProdusAditionalAutomat(rezultat.montaj, rezultat.numarRulouri);
            total();

            var mesaj = '<b>Oferta a fost completată:</b> ' + rezultat.numarRulouri + ' rulouri ' + rezultat.tip +
                ', culoare ' + rezultat.culoareDescriere + ', dimensiuni ' +
                rezultat.dimensiuni.map(function (dim) { return dim.latime + 'x' + dim.inaltime; }).join(', ') + '.';
            if (rezultat.motor) mesaj += ' Motorul a fost adăugat cu cantitatea ' + rezultat.numarRulouri + '.';
            if (rezultat.montaj) mesaj += ' Montajul a fost adăugat cu cantitatea ' + rezultat.numarRulouri + '.';
            if (rezultat.avertismente.length) mesaj += '<br><b>Atenție:</b> ' + rezultat.avertismente.join(' ');
            afiseazaStatus(mesaj, false);

            if (deschideOferta) {
                await addtable();
                return;
            }
            document.getElementById('rulouri').scrollIntoView({behavior: 'smooth', block: 'start'});
        } catch (eroare) {
            afiseazaStatus('<b>Cererea nu a putut fi calculată:</b> ' + eroare.message, true);
        }
    };
})();
