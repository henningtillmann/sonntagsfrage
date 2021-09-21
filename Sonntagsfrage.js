// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: chart-bar;
/************************************************

Sonntagsfrage iOS Widget
von Henning Tillmann, henning-tillmann.de
v2.0.1
21. September 2021

GitHub für Updates:
https://github.com/henningtillmann/sonntagsfrage

Für dieses Widget gilt die Apache 2.0 Lizenz
https://github.com/henningtillmann/sonntagsfrage/blob/main/LICENSE

--
Umfragedaten von DAWUM, dawum.de
Lizenz: ODC-ODbL
https://opendatacommons.org/licenses/odbl/1.0/
--

Zeigt die aktuellen Umfragewerte für Bundestags-
und Landtagswahlen an. Alternativ kann Mittelwert
der letzten Umfragen zur Bundestagswahl eingeblendet
werden. Daten stammen von dawum.de.
Unterstützt iOS 14 Widget in klein, mittel und groß.
  
Im Widget-Parameter kann definiert werden,
welche Sonntagsfrage angezeigt werden soll.

Installation des Widgets:
1. Lange auf eine App auf dem Home-Screen drücken.
2. "Home-Bildschirm bearbeiten" auswählen.
3. Oben auf das "+" drücken
4. Runterscrollen bis "Scriptable" in der Liste erscheint.
5. Gewünschte Widgetgröße auswählen.
6. Auf das neue Widget drücken.
7. Bei Script "Sonntagsfrage" auswählen.
8. Bei Parameter gewünsche Option (s. u.) eintragen.
9. Fertig. Später kann der Parameter angepasst werden,
   wenn lange auf das Widget gedrückt wird und
   "Scriptable/Widget bearbeiten" ausgewählt wird.
    
Hinweis: Es können mehrere Widgets auf den Home Screen
gelegt und individuell konfiguriert werden!
  
Mögliche Optionen:
- Wenn leer oder beliebiger String, wird die
  aktuellste Umfrage angezeigt (alle Parlamente).
  
- Wenn Zahl >= 0, wird die aktuellste Umfrage für
  das gewählte Parlament angezeigt (s.u.).

- Wenn kommagetrennte Zahlen, wird die aktuellste
  Umfrage von einem der Parlamente angezeigt (s.u.).
  
- Wenn -1 wird der Mittelwert der letzten n Tage
  für Umfragen zur Bundestagswahl angezeigt.
  Es wird nur eine Umfrage pro Institut
  berücksichtigt.
    
Beispiele (ohne Anführungsstriche eintragen)
'0'     zeigt nur akt. Umfrage für Bundestag an

'0,10'  nur Bundestag oder NRW

'3,5,6' nur Berlin, Bremen oder Hamburg

'alle'  aktuellste, unabhängig vom Parlament

''      (wie 'alle')

'-1'    Mittelwert Umfragen für Bundestag
  
Es folgen hier nun weitere Konfigurationsoptionen
und die Liste der Parlamente, für den Widget-
Parameter.

************************************************/


// Liste der Parlamente und deren Zahlen
// (notwendig für die Parameter-Angabe).
// NICHT ANDERS ZUORDNEN!
const parliaments = [
      "Bundestag",  //  0
      "BW",         //  1
      "Bayern",     //  2
      "Berlin",     //  3
      "BB",         //  4
      "Bremen",     //  5
      "Hamburg",    //  6
      "Hessen",     //  7
      "MVP",        //  8
      "NDS",        //  9
      "NRW",        // 10
      "RLP",        // 11
      "Saarland",   // 12
      "Sachsen",    // 13
      "S.-Anhalt",  // 14
      "SH",         // 15
      "Thüringen",  // 16
      "EU-Parl."    // 17
     ];

// Soll ein Pfeil neben den Umfragewerten stehen,
// der den Trend zur letzten Umfrage anzeigt?
// Wenn der Mittelwert angezeigt wird, wird
// ein zweiter Mittelwert des gleichen Zeitraums
// vor meanDaysAgoPoll berechnet.
// Wenn false, ist Skript etwas schneller und es
// werden etwas weniger Daten verbraucht.
// Standard: true
const showComparative = true;

// Sollen bei der kleinen oder mittleren Ansicht
// "Sonstige" Parteien ausgeblendet werden?
// Klein und Mittel zeigen nur max. 6 Parteien,
// daher ist ausblenden ggf. sinnvoll.
// Standard: true
const ignoreOthersOnSmallAndMedium = true;

// Wenn der Mittelwert berechnet werden soll,
// wie alt dürfen die Umfragen maximal sein?
// Angabe in Tagen
// Standard: 14
const meanDaysAgoPoll = 14;

// Nach wieviel Stunden sollen frühstens neue Daten
// abgerufen werden?
// Standard: 6
const refreshHours = 6;


/** *********************************/
/** FORTGESCHRITTENE KONFIGURATION **/

// Standardverhalten, wenn kein Parameter definiert ist.
// Angabe als String.
// Bitte immer Widget-Parameter nutzen!
// Angabe hier NUR anpassen für Tests innerhalb der App.
// Standard: '' (alle Parlamente, empfohlen)
const defaultParliament = '';


/** FORTGESCHRITTEN: FÜR EINZELNE UMFRAGE **/
// Folgende Selektoren schränken die Ausgabe ein.
// Können einzeln verwendet werden oder auch in Kombination.

// Sollen nur Umfragen von einem bestimmten Institut
// angezeigt werden? Wenn ja, dann die Institutnummer
// hier eintragen (nachzuschlagen auf api.dawum.de).
// Ansonsten bei 0 belassen.
// Standard: 0 (alle Institute verwenden)
let instituteSelector = 0; 

// Sollen nur Umfragen von einem bestimmten Auftraggeber
// angezeigt werden? Wenn ja, dann die Tasker-Nummer
// hier eintragen (nachzuschlagen auf api.dawum.de).
// Ansonsten bei 0 belassen.
// Standard: 0 (alle Auftraggeber verwenden)
const taskerSelector = 0;

/** FORTGESCHRITTEN: FÜR MITTELWERT **/
// Sollen Institute ausgeschlossen werden bei der Berechnung
// des Mittelwerts? Angabe muss in einem Array erfolgen.
// Beispiel: [1, 2]
// Institutnummern nachzuschlagen auf api.dawum.de.
// Standard: [] (kein Ausschluss)
const meanExcludeInstitutes = [];

/** FORTGESCHRITTEN: FÜR VERGLEICHS-MITTELWERT **/
// Sollen bei der Berechnung des Vergleichsmittelwerts
// nur die Institute einbezogen werden, die auch bei
// der aktuellen Mittelwertberechnung benutzt werden?
// Wenn ja, können beim Vergleichswert höchstens so
// viele Umfragen benutzt werden, wie bei der aktuellen
// Messung. Das Ergebnis ist aber vergleichbarer.
// Standard: true
const useSameInstitutesForComparison = true;


/************************************************
AB HIER NICHTS ÄNDERN!
(AUSSER DU WEISST, WAS DU TUST.)
*************************************************/

const apiCompact = 'https://api.dawum.de/newest_surveys.json';
const apiFull = 'https://api.dawum.de/';
const api = (showComparative ? apiFull : apiCompact);
const version = '2.0.0';

const deviationMarkers = [        
      { maxVal: 0.5, glyphPos: '→', glyphNeg: '→' },
      { maxVal: 2.0, glyphPos: '↗', glyphNeg: '↘' },
      { maxVal: 3.5, glyphPos: '↑', glyphNeg: '↓' },
      { maxVal: 999, glyphPos: '⇈', glyphNeg: '⇊' }
    ];

const parties = [
      { "id": "0", "name": "Sonstige", "color": "#bbbbbb" },
      { "id": "1", "name": "CDU/CSU", "color": "#000000" },
      { "id": "101", "name": "CDU", "color": "#000000" },
      { "id": "102", "name": "CSU", "color": "#000000" },
      { "id": "2", "name": "SPD", "color": "#e0001a" },
      { "id": "3", "name": "FDP", "color": "#ccbc00" },
      { "id": "4", "name": "Grüne", "color": "#43b02a" },
      { "id": "5", "name": "Linke", "color": "#800080" },
      { "id": "6", "name": "Piraten", "color": "#ffa500" },
      { "id": "7", "name": "AfD", "color": "#8B4513" },
      { "id": "8", "name": "F.W.", "color": "#0000ff" },
      { "id": "9", "name": "NPD", "color":  "#A0522D" },
      { "id": "10", "name": "SSW", "color": "#3333cc" },
      { "id": "11", "name": "BP", "color": "#1313dd" },
      { "id": "13", "name": "Partei", "color": "#ee3333" },
      { "id": "14", "name": "BVB/FW", "color": "#ffa500" },
      { "id": "15", "name": "Tier", "color": "#005f6a" },
      { "id": "16", "name": "BIW", "color": "#000088" }
    ];
  
const widgetSize = (config.widgetFamily ? config.widgetFamily : 'large');
const widget = await createWidget();

if (!config.runInWidget) {
  switch(widgetSize) {
    case 'small':
    await widget.presentSmall();
    break;

    case 'large':
    await widget.presentLarge();
    break;
    
    default:
    await widget.presentMedium();
  }
}

Script.setWidget(widget);
Script.complete();

async function createWidget() {
  const list = new ListWidget();
  const nextRefresh = Date.now() + (1000*60*60 * refreshHours);
  list.refreshAfterDate = new Date(nextRefresh);
  
  if (widgetSize != 'small') {
    list.setPadding(20, 20, 20, 20);
  }
    
  let requestParliaments;
  
  if (!args.widgetParameter) {
    if (args.queryParameters && args.queryParameters.p) {
      requestParliaments = args.queryParameters.p + '';
    } else {
      requestParliaments = defaultParliament + '';
    }
  } else {
    requestParliaments = args.widgetParameter + '';
  }
  
  list.url = 'scriptable:///run/Sonntagsfrage/?p=' + requestParliaments;
  
  if (typeof(requestParliaments) === 'string' && requestParliaments.indexOf(',') > 0) {
    requestParliamens = requestParliaments.replace(/[^0-9,]/g, '');
    requestParliaments = requestParliaments.split(',');
  }
  
  const poll = await getPollData(requestParliaments);
  
  if (poll === false) {
    const errorMessage = list.addText('Fehler beim Laden der Sonntagsfrage.');
    errorMessage.font = Font.italicSystemFont(10);
    return list;
  } else if (!poll) {
    const errorMessage = list.addText('Keine Sonntagsfrage gefunden.');
    errorMessage.font = Font.italicSystemFont(10);
    return list;    
  }
  
  let headerText = (widgetSize == 'small' ? parliaments[poll.parliament_id] : 'Sonntagsfrage ' + parliaments[poll.parliament_id]);
  
  if (poll.is_mean)
    headerText += ' Ø';
  
  const header = list.addText(headerText);
  header.font = Font.blackSystemFont(16);
  
  switch(widgetSize) {
    case "medium":
    list.addSpacer(5);
    break;

    case "large":
    list.addSpacer(10);
    break;
    
    default:
  }
  
  const body = list.addStack();
  body.layoutHorizontally();

  const bodyColumns = [];  
  bodyColumns[0] = body.addStack();

  if (widgetSize == 'small') {
    body.addSpacer();
  } else {
    body.addSpacer(20);
  }
  
  bodyColumns[1] = body.addStack();

  if (widgetSize == 'small')
    body.addSpacer(10);
  
  bodyColumns[0].layoutVertically();
  bodyColumns[1].layoutVertically();
  
  const maxSlots = (widgetSize == 'large' ? 10 : 6);
  
  let maxParties = (poll.results.length <= maxSlots ? poll.results.length : maxSlots);
  
  let col = 0;
  
  for (let i = 0; i < maxParties; i++) {
    const p = poll.results[i][0];
    const v = parseFloat(poll.results[i][1]);
    
    if (p === "0" && (widgetSize != 'large' && ignoreOthersOnSmallAndMedium)) {
      maxParties++;
      continue;
    }

    const party = parties.find(elem => elem.id === p);
    
    const bodyItem = bodyColumns[col].addStack(); 
    
    col++;
    if (col > 1) {
      col = 0;
    }
    
    bodyItem.layoutVertically();
    bodyItem.setPadding((widgetSize == 'large' ? 20 : 10), 0, 0, 0);
    
    const bodyItemData = bodyItem.addStack();
    bodyItemData.layoutHorizontally();

    const partyName = bodyItemData.addText(party.name);
    
    switch (widgetSize) {
      case "small":
      partyName.font = Font.blackSystemFont(9);
      break;
      
      case "medium":
      partyName.font = Font.blackSystemFont(10);
      break;
      
      default:
      partyName.font = Font.mediumSystemFont(14);
    }
      
    partyName.textColor = new Color(party.color);

    if (widgetSize != 'small') {
      bodyItemData.addSpacer();
    
      const partyPercentage = bodyItemData.addText((poll.is_mean ? v.toFixed(1) :  v) + ' %' + (poll.has_comparative ? ' ' + getDeviationMarker(v, parseFloat(poll.results[i][2])) : ''));
      partyPercentage.font = (widgetSize == "medium" ? Font.blackSystemFont(10) : Font.mediumSystemFont(14));
      partyPercentage.textColor = new Color(party.color);
    } else {
      const partyPercentage = bodyItem.addText(v + ' %' + (poll.has_comparative ? ' ' + getDeviationMarker(v, parseFloat(poll.results[i][2])) : ''));
      partyPercentage.font = Font.blackSystemFont(9);
      partyPercentage.textColor = new Color(party.color);
    }
    
    if (widgetSize != 'small') {  
      let bar = '█'.repeat(Math.floor(v));
      
      if (Math.floor(v - 0.5) == Math.floor(v)) {
        bar += '▌'
      }
      
      const bodyItemBar = bodyItem.addText(bar);
      
      bodyItemBar.font = Font.regularSystemFont(2.5);
      bodyItemBar.textColor = new Color(party.color);
      bodyItemBar.shadowOffset = new Point(10, 10);
      bodyItemBar.shadowRadius = 5;
      bodyItemBar.shadowColor = new Color(party.color);
    }
  }
  
  if (widgetSize != 'small') {
    list.addSpacer(20);
  } else {
    list.addSpacer();
  }
  
  const footer = list.addStack();
  footer.layoutHorizontally();
  
  const pollDate = new Date(poll.date);
  const today = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  today.setHours(0, 0, 0, 0);
  const diff = Math.round(Math.abs((pollDate - today) / oneDay));

  let diffText = '';
  
  switch(diff) {
    case 0:
      diffText = 'Heute';
      break;
    case 1:
      diffText = 'Gestern';
      break;
    case 2:
      diffText = 'Vorgestern';
      break;
    default:
      diffText = `vor ${diff} Tagen`;
   }
  
  if (poll.is_mean) {
    diffText = 'Neueste: ' + diffText;
  }
  
  const footerDate = footer.addText(diffText);
  footerDate.font = Font.regularSystemFont(7);
  
  if (widgetSize != 'small') {
    footer.addSpacer();
    
    let footerSourceText = poll.institute;
    
    if (poll.tasker != '') {
      footerSourceText += ' für ' + poll.tasker; 
    }
    
    if (poll.is_mean) {
      footerSourceText = `Mittelwert von ${poll.institute} Instituten der letzten ${meanDaysAgoPoll} Tage`;
    }
    
    const footerSource = footer.addText(footerSourceText);
    
    footerSource.font = Font.italicSystemFont(7);
  }  
  
  if (widgetSize == 'large') {
    list.addSpacer();
    
    const socket = list.addStack();
    socket.layoutHorizontally();
        
    const socketLeft = socket.addStack();
    socketLeft.backgroundColor = new Color('#a0a0a0', .6);
    socketLeft.cornerRadius = 3;
    socketLeft.setPadding(2, 4, 2, 4)
    
    const socketAboutWidget = socketLeft.addText('Widget von henning-tillmann.de');
    socketAboutWidget.url = 'https://www.henning-tillmann.de/sonntagsfrage-ios-widget/?v=' + version;
    socketAboutWidget.font = Font.mediumSystemFont(9);
    socketAboutWidget.color = new Color('#efefef');
    
    socket.addSpacer();

    const socketRight = socket.addStack();
    socketRight.backgroundColor = new Color('#b0b0b0', .6);
    socketRight.cornerRadius = 3;
    socketRight.setPadding(2, 4, 2, 4);
    
    const socketAboutDataSource = socketRight.addText('Daten von dawum.de');
    socketAboutDataSource.url = 'https://dawum.de';
    socketAboutDataSource.font = Font.mediumSystemFont(9);
    socketAboutDataSource.color = new Color('#efefef');
    socketAboutDataSource.rightAlignText();
  }
  
  return list;
}


     
async function getPollData(parliament_ids) {
  let data;
  let date;
  let tasker_id;
  let institute_id;
  let parliament_id;
  let results;
  let pastResults;
  
  let calculateMean = false;
  let usedInstitutes = [];
  let usedInstitutesComparative = [];
  let meanResults = [];
  let meanResultsPast = [];
  let newestDate;
  
  let hasComparative = false;

  const meanOldestDate = new Date();
  meanOldestDate.setDate(meanOldestDate.getDate() - meanDaysAgoPoll);
  
  const meanOldestDateComparative = new Date();
  meanOldestDateComparative.setDate(meanOldestDateComparative.getDate() - 2 * meanDaysAgoPoll);

  /* Easter Egg – Als die Welt noch in Ordnung war :-p. */
  if (parseInt(parliament_ids) === 1998) {
    const results = [ ['2', 40.9], ['1', 35.1], ['4', 6.7], ['3', 6.2], ['5', 5.1] ];
    return {
      "date": '1998-09-27',
      "results": results,
      "institute": 'Bundestagswahl 1998',
      "tasker": '',
      "parliament_id": 0,
      "is_mean": false,
      "has_comparative": false
    }
  }
  /* Ende Easter Egg */
    
  if (!Array.isArray(parliament_ids)) {
    if (isNaN(parliament_ids) || parliament_ids === '') {
      parliament_ids = false;
    } else {
      if (parseInt(parliament_ids) === -1) {
        calculateMean = true;
        parliament_ids = '0';
      }
      parliament_ids = [parliament_ids];
    }
  }
  
  if (calculateMean) {
    for (k = 0; k < parties.length; k++) {
      meanResults[parties[k].id] = 0;
      meanResultsPast[parties[k].id] = 0;
    }
  }
  
  try {  
    data = await new Request(api).loadJSON();
  } catch (e) {
    return false; 
  }
        
  if (!data || !data.Database) {
    return false;  
  } else {    
    const keys = Object.keys(data.Surveys);
    let results;
    
    for (let i = keys.length - 1; i >= 0; i--) {
      if (calculateMean) {
        if (parseInt(data.Surveys[keys[i]].Parliament_ID) === 0) {
          date = data.Surveys[keys[i]].Date;

          if (!newestDate) {
            newestDate = date;
          }
          
          const dt = new Date(date);
          
          if (dt >= meanOldestDate) {
            institute_id = data.Surveys[keys[i]].Institute_ID;
            
            if (usedInstitutes.indexOf(institute_id) === -1 && meanExcludeInstitutes.indexOf(parseInt(institute_id)) === -1) {
              usedInstitutes.push(institute_id);
              
              const results = Object.entries(data.Surveys[keys[i]].Results);
              
              for (k = 0; k < results.length; k++) {
                meanResults[parseInt(results[k][0])] += parseFloat(results[k][1]);
              }
            }           
          } else {
            if (showComparative && dt >= meanOldestDateComparative) {
              institute_id = data.Surveys[keys[i]].Institute_ID;
              
              if (usedInstitutesComparative.indexOf(institute_id) === -1 && (!useSameInstitutesForComparison || usedInstitutes.indexOf(institute_id) > -1)) {
                usedInstitutesComparative.push(institute_id);
                
                const results = Object.entries(data.Surveys[keys[i]].Results);
                
                for (k = 0; k < results.length; k++) {
                  meanResultsPast[parseInt(results[k][0])] += parseFloat(results[k][1]);  
                }                               
              }
              
              continue;
            }
           
            const results = [];

            for (k = 0; k < meanResults.length; k++) {
              let p;
                
              if (showComparative && meanResultsPast[k]) {
                p = meanResultsPast[k] / usedInstitutesComparative.length; 
              }
              
              if (meanResults[k]) {
                const val = meanResults[k] / usedInstitutes.length;
                if (p) {
                  results.push([k + '', Math.round(val  * 10) / 10, Math.round(p * 10) / 10]);  
                } else {   
                  results.push([k + '', Math.round(val  * 10) / 10]);  
                }
              }
            } 
            
            results.sort((a, b) => b[1] - a[1]);
            
            return {
              "date": newestDate,
              "results": results,
              "institute": usedInstitutes.length,
              "comp_institute": usedInstitutesComparative.length,
              "tasker": '',
              "parliament_id": 0,
              "is_mean": true,
              "has_comparative": showComparative
            }
          }
        }
      } else {      
        if (parliament_ids === false || parliament_ids.indexOf(data.Surveys[keys[i]].Parliament_ID) > -1) {
          tasker_id = data.Surveys[keys[i]].Tasker_ID;
          institute_id = data.Surveys[keys[i]].Institute_ID;
          
          if (instituteSelector > 0 && instituteSelector != parseInt(institute_id)) {
            continue;
          }
          
          if (taskerSelector > 0 && taskerSelector != parseInt(tasker_id)) {
            continue;
          }
          
          if (!results) {  
            parliament_id = parseInt(data.Surveys[keys[i]].Parliament_ID);
            
            results = Object.entries(data.Surveys[keys[i]].Results);  
            results.sort((a, b) => b[1] - a[1]);
          
            date = data.Surveys[keys[i]].Date;
          
            if (showComparative) {
              parliament_ids = [data.Surveys[keys[i]].Parliament_ID];
              if (parseInt(data.Surveys[keys[i]].Parliament_ID) === 0)
                instituteSelector = parseInt(institute_id);
              continue;
            }
          } else {
            pastResults = Object.entries(data.Surveys[keys[i]].Results);
            
            for (let k = 0; k < results.length; k++) {
              for (let l = 0; l < pastResults.length; l++) {
                if (results[k][0] == pastResults[l][0]) {
                  results[k][2] = pastResults[l][1];  
                } 
              }
            }
          }
              
          return {
            "date": date,
            "results": results,
            "institute": data.Institutes[institute_id].Name,
            "tasker": data.Taskers[tasker_id].Name,
            "parliament_id": parliament_id,
            "is_mean": false,
            "has_comparative" : (pastResults ? true : false)
          }
        }
      }
    } 
  }
}

function getDeviationMarker(present, past) {      
  for (let i = 0; i < deviationMarkers.length; i++) {
    if (Math.abs(present - past) <= deviationMarkers[i].maxVal) {
      if (present - past > 0) {
        return deviationMarkers[i].glyphPos; 
      } else {
        return deviationMarkers[i].glyphNeg;
      }
    }  
  }
  return '*';
}

// Letzte Zeile.
