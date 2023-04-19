{
	"translatorID": "47533cd7-ccaa-47a7-81bb-71c45e68a74d",
		"label": "Bibliothèque nationale de France",
			"creator": "Florian Ziche, Sylvain Machefert",
				"target": "^https?://[^/]*catalogue\\.bnf\\.fr",
					"minVersion": "3.0",
						"maxVersion": "",
							"priority": 100,
								"inRepository": true,
									"translatorType": 4,
										"browserSupport": "gcsibv",
											"lastUpdated": "2023-03-28 10:37:32"
}

/*
 *  Bibliothèque nationale de France Translator
 *  Copyright (C) 2010 Florian Ziche, ziche@noos.fr
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


/* Bnf namespace. */
var BnfClass = function () {
	// Private members

	/* Map MARC responsibility roles to Zotero creator types.
		See http://archive.ifla.org/VI/3/p1996-1/appx-c.htm.
	*/

	function getCreatorType(aut) {
		// To avoid an error on certain pages where the item is not well catalogued
		if (aut['4'] === undefined) return undefined;
		var typeAut = aut['4'].trim();
		switch (typeAut) {
			case "005":
			case "250":
			case "275":
			case "590": // performer
			case "755": // vocalist
				return "performer";
			case "040":
			case "130": // book designer
			case "740": // type designer
			case "750": // typographer
			case "350": // engraver
			case "360": // etcher
			case "430": // illuminator
			case "440": // illustrator
			case "510": // lithographer
			case "530": // metal engraver
			case "600": // photographer
			case "705": // sculptor
			case "760": // wood engraver
				return "artist";
			case "070":
			case "305":
			case "330":
			case undefined:
				return "author";
			case "020":
			case "210":
			case "212":
				return "commenter";
			case "180":
				return "cartographer";
			case "220":
			case "340":
			case "651":
				return "editor";
			// à activer lorsque la fonction sera activée dans Zotero
			// case "651":
			// 	return "editorial-director";
			case "230":
				return "composer";
			case "245":
				return "inventor";
			case "255":
			case "695": // scientific advisor
			case "727": // thesis advisor
				return "counsel";
			case "300":
				return "director";
			case "400": // funder
			case "723": // sponsor
				return "sponsor";
			case "460":
				return "interviewee";
			case "470":
				return "interviewer";
			case "480": // librettist
			case "520": // lyricist
				return "wordsBy";
			case "605":
				return "presenter";
			case "630":
				return "producer";
			case "635":
				return "programmer";
			case "660":
				return "recipient";
			case "090": // author of dialog
			case "690": // scenarist
				return "scriptwriter";
			case "730":
				return "translator";
			// Ignore (no matching Zotero creatorType):
			case "320": // donor
			case "610": // printer
			case "650": // publisher
				return undefined;
			// Default
			case "205":
			default:
				return "contributor";
		}
	}

	/* Fix creators (MARC translator is not perfect). */
	function getCreators(record, item) {
		// Clear creators
		item.creators = [];
		// Extract creators (700, 701 & 702)
		for (let i = 700; i < 703; i++) {
			let authorTag = record.getFieldSubfields(i);
			for (let j in authorTag) {
				let aut = authorTag[j];
				let authorText = "";
				if (aut.b) {
					authorText = aut.a + ", " + aut.b;
				}
				else {
					authorText = aut.a;
				}
				let type = getCreatorType(aut);
				if (type) {
					item.creators.push(Zotero.Utilities.cleanAuthor(authorText, type, true));
				}
			}
		}
		// Extract corporate creators (710, 711 & 712)
		for (let i = 710; i < 713; i++) {
			let authorTag = record.getFieldSubfields(i);
			for (let j in authorTag) {
				if (authorTag[j].a) {
					let type = getCreatorType(authorTag[j]);
					if (type) {
						item.creators.push({
							lastName: authorTag[j].a,
							creatorType: type,
							fieldMode: true
						});
					}
				}
			}
		}
	}

	// Add tag, if not present yet
	function addTag(item, tag) {
		for (var t in item.tags) {
			if (item.tags[t] == tag) {
				return;
			}
		}
		item.tags.push(tag);
	}

	// Tagging
	function getTags(record, item) {
		var pTag = record.getFieldSubfields("600");
		if (pTag) {
			for (let j in pTag) {
				let tagText = false;
				let person = pTag[j];
				tagText = person.a;
				if (person.b) {
					tagText += ", " + person.b;
				}
				if (person.c) {
					tagText += ", " + person.c;
				}
				if (person.f) {
					tagText += " (" + person.f + ")";
				}
				addTag(item, tagText);
			}
		}
		pTag = record.getFieldSubfields("601");
		if (pTag) {
			for (let j in pTag) {
				let tagText = false;
				let person = pTag[j];
				tagText = person.a;
				addTag(item, tagText);
			}
		}
		pTag = record.getFieldSubfields("605");
		if (pTag) {
			for (let j in pTag) {
				let tagText = false;
				let person = pTag[j];
				tagText = person.a;
				addTag(item, tagText);
			}
		}
		pTag = record.getFieldSubfields("606");
		if (pTag) {
			for (let j in pTag) {
				let tagText = false;
				let person = pTag[j];
				tagText = person.a;
				addTag(item, tagText);
			}
		}
		pTag = record.getFieldSubfields("607");
		if (pTag) {
			for (let j in pTag) {
				let tagText = false;
				let person = pTag[j];
				tagText = person.a;
				addTag(item, tagText);
			}
		}
		pTag = record.getFieldSubfields("602");
		if (pTag) {
			for (let j in pTag) {
				let tagText = false;
				let person = pTag[j];
				tagText = person.a;
				if (person.f) {
					tagText += " (" + person.f + ")";
				}
				addTag(item, tagText);
			}
		}
		pTag = record.getFieldSubfields("604");
		if (pTag) {
			for (let j in pTag) {
				let tagText = false;
				let person = pTag[j];
				tagText = person.a;
				if (person.b) {
					tagText += ", " + person.b;
				}
				if (person.f) {
					tagText += " (" + person.f + ")";
				}
				if (person.t) {
					tagText += ", " + person.t;
				}
				addTag(item, tagText);
			}
		}
	}

	// Get series (repeatable)
	function getSeries(record, item) {
		var seriesText = false;
		var seriesTag = record.getFieldSubfields("225");
		if (seriesTag && seriesTag.length > 1) {
			for (let j in seriesTag) {
				let series = seriesTag[j];
				if (seriesText) {
					seriesText += "; ";
				}
				else {
					seriesText = "";
				}
				seriesText += series.a;
				if (series.v) {
					seriesText += ", " + series.v;
				}
			}
			if (seriesText) {
				delete item.seriesNumber;
				item.series = cleanSeries(seriesText);
			}
		}
		// Try 461
		if (!item.series) {
			seriesTag = record.getFieldSubfields("461");
			if (seriesTag) {
				for (let j in seriesTag) {
					let series = seriesTag[j];
					if (seriesText) {
						seriesText += "; ";
					}
					else {
						seriesText = "";
					}
					seriesText += series.t;
				}
			}
			if (seriesText) {
				delete item.seriesNumber;
				item.series = cleanSeries(seriesText);
			}
		}
	}

	// Add extra text
	function addExtra(noteText, extra) {
		if (extra) {
			if (noteText) {
				if (!/\.$/.exec(noteText)) {
					noteText += ". ";
				}
				else {
					noteText += " ";
				}
			}
			else {
				noteText = "";
			}
			noteText += Zotero.Utilities.trim(extra);
		}
		return noteText;
	}

	// Assemble extra information
	function getExtra(record, item) {
		var noteText = false;
		// Material description
		var noteTag = record.getFieldSubfields("215");
		if (noteTag) {
			for (let j in noteTag) {
				let note = noteTag[j];
				noteText = addExtra(noteText, note.c);
				noteText = addExtra(noteText, note.d);
				noteText = addExtra(noteText, note.e);
			}
		}
		// Note
		noteTag = record.getFieldSubfields("300");
		if (noteTag) {
			for (let j in noteTag) {
				let note = noteTag[j];
				noteText = addExtra(noteText, note.a);
			}
		}
		// Edition history notes
		noteTag = record.getFieldSubfields("305");
		if (noteTag) {
			for (let j in noteTag) {
				let note = noteTag[j];
				noteText = addExtra(noteText, note.a);
			}
		}
		if (noteText) {
			if (!/\.$/.exec(noteText)) {
				noteText += ".";
			}
			// Supprime les sauts de ligne inutiles du champ history notes
			if (/\n/.exec(noteText)) {
				noteText = noteText.replace(/\n/g, '');
			}
			// Nettoie tout le champ Extra
			item.extra = cleanExtra(noteText);
		}
	}


	// Get title from 200
	function getTitle(record, item) {
		var titleTag = record.getFieldSubfields("200");
		if (titleTag) {
			titleTag = titleTag[0];
			var titleText = titleTag.a;
			if (titleTag.e) {
				// Ne prendre $f que s'il est précédé par "Actes" dans $e$	
				if (titleTag.e.match(/[Aa]ctes/) && titleTag.f) {
					if (!/^[,.:;-]/.exec(titleTag.f)) {
						titleText += "[" + titleTag.e[1].toUpperCase() + titleTag.e.slice(2) + titleTag.f + "]";
					}
				}
				else if (!/^[,.:;-]/.exec(titleTag.e)) {
					titleText += ": " + titleTag.e;
				}
				// titleText += titleTag.e;
				// Une autre solution pour remplacer les : en . :
				// titleText += titleTag.e[1].toUpperCase() + titleTag.e.slice(2);				
			}
			if (titleTag.h) {
				titleText += ", " + titleTag.h;
				// Récupérer l'indication du volume
				item.volume = titleTag.h;
				if (titleTag.i) {
					titleText += ". " + titleTag.i;
				}
			}
			else if (titleTag.i) {
				titleText += ", " + titleTag.i;
			}
		}
		shortTitleMatch = titleTag.a.match(/([^:,.;(]+[\?!"”»]?)/);
		item.shortTitle = cleanTitle(shortTitleMatch[1])
		item.title = cleanTitle(titleText);
	}

	function cleanTitle(value) {
		if (value === undefined) {
			return null;
		}

		// clean [] and ()
		// var char1 = value.substr(0, 1);
		// var char2 = value.substr(value.length - 1);
		// if ((char1 == "[" && char2 == "]") || (char1 == "(" && char2 == ")")) {
		// 	// chop of extraneous characters
		// 	return value.substr(1, value.length - 2);
		// }

		value = value.replace(/^[\s.,/:;]+/g, '');
		value = value.replace(/[\s.,/:;]+$/g, '');
		value = value.replace(/ +/g, ' ');
		value = value.replace(/\n/g, '');

		// Lexique
		value = value.replace(/[Mm]oyen[  ][aâ]ge/g, 'Moyen Âge');
		value = value.replace(/oeuvre/g, 'œuvre');
		value = value.replace(/([Mm])oeurs/g, '$1œurs');
		value = value.replace(/([Cc])oeur/g, '$1œur');
		value = value.replace(/oeil/g, 'œil');
		value = value.replace(/O[Ee]uvre/g, 'Œuvre');
		value = value.replace(/\?uvre/g, 'œuvre');

		// Années
		value = value.replace(/[  ]*[:,] *\(?([0-9]{4})[\- ]*([0-9]{4})\)?/g, ' ($1-$2)');
		value = value.replace(/[  ]*[:,] *\(?([0-9]{4})\)?/g, ' ($1)');
		value = value.replace(/[  ]+\(([0-9]{4}\-[0-9]{4})\)/g, ' ($1)');

		// Transformer les indications de volumes
		if (value.match(/, +(\d)\. +/)) {
			value = value.replace(/, +(\d)\. +/, '<i>, $1. </i>');
		}

		// Mettre en forme les siècles comme "XIIᵉ"
		if (value.match(/(?![Vv]ie)[\s(](([Xx]{0,2})([Xx]|[Vv]|[Ii][Xx]|[Ii][Vv]|[Vv]?[Ii]{1,3}))([eEᵉ]| ?ème)\b/)) {
			value = value.replace(/(?![Vv]ie)[\s(](([Xx]{0,2})([Xx]|[Vv]|[Ii][Xx]|[Ii][Vv]|[Vv]?[Ii]{1,3}))([eEᵉ]| ?ème)\b/g, function ($0, $1) { return $1.toUpperCase() + 'ᵉ' });
			value = value.replace(/[  ]*:[  ]*\(?((X{0,2})(X|V|IX|IV|V?I{1,3})ᵉ(\-(X{0,2})(X|V|IX|IV|V?I{1,3})ᵉ)?([  ]*siècles?))\)?/g, ' ($1)');
			value = value.replace(/,[  ]*((X{0,2})(X|V|IX|IV|V?I{1,3})ᵉ(\-(X{0,2})(X|V|IX|IV|V?I{1,3})ᵉ)?([  ]*siècles?)?)([  ]*[.:])?/g, ' ($1)$8');
			value = value.replace(/[  ]*\(((X{0,2})(X|V|IX|IV|V?I{1,3})ᵉ)/g, ' ($1');
			value = value.replace(/(\b(X{0,2})(X|V|IX|IV|V?I{1,3})ᵉ)[  ]*(siècles?)/g, '$1 $4');
		}

		// Mettre en forme les siècles comme "<span style="font-variant:small-caps;">xii</span>ᵉ"
		// value = value.replace(/(\b(X{0,2})(X|V|IX|IV|V?I{1,3}))(ᵉ)/g, function($0,$1) {return '<span style="font-variant:small-caps;">' + $1.toLowerCase() + '</span>ᵉ'});

		// Transformer les : > . dans les titres
		if (value.match(/:/)) {
			firstMatch = value.match(/(.+[^  ])[  ]*:/);
			firstPart = firstMatch[1]
			secondMatch = value.match(/: *([^  ].+)/);
			secondPart = secondMatch[1]
			secondPart = secondPart[0].toUpperCase() + secondPart.slice(1);
			value = firstPart += ". " + secondPart;
		}

		// Ponctuation
		value = value.replace(/[  ]*([,'.\]])/g, '$1');
		value = value.replace(/'/g, '’');
		value = value.replace(/[  ]*([:!?;»])/g, ' $1');
		value = value.replace(/([«])[  ]*/g, '$1 ');
		value = value.replace(/[  ]*:[  ]*\[/g, ' [');
		value = value.replace(/([?!])\./g, '$1');

		value = value.replace(/[  ]*[:,][  ]*actes(.*$)/g, ' [Actes$1]');
		value = value.replace(/\[actes/g, '[Actes');
		value = value.replace(/[  ]*[:,][  ]*colloque(.*$)/g, ' [Actes du colloque $1]');
		value = value.replace(/\[colloque/g, '[Actes du colloque');

		// Guillemets courbes
		value = value.replace(/"(\w)/g, '“$1');
		value = value.replace(/(\w|[?!])"/g, '$1”');

		// Supprime les [] dans les champs du titre
		//		titleTag.e = titleTag.e.replace(/[\[\]]/g, '');
		//		if (titleTag.f) {
		//			if (titleTag.f.match(/[\[\]]/)) {
		//				titleTag.f = titleTag.f.replace(/[\[\]]/g, '');
		//			}	
		//		}

		// Capitaliser le titre si le champ country retourne US ?
		// if (country.match(/US/)) {
		// 	value = ;
		// }

		return value;
	}

	function cleanPublisher(value) {
		if (value === undefined) {
			return null;
		}
		// Supprimer les informations entre []
		value = value.replace(/\[.*\]/g, '');

		// Supprimer les informations inutiles
		value = value.replace(/ *diff *[:.].*$/g, '');
		value = value.replace(/(Honoré Champion) éditeur/g, '$1');

		// Corriger la casse
		value = value.replace(/les Belles lettres/g, 'Les Belles Lettres');
		value = value.replace(/^Ed\./, 'Éd.');

		// Première lettre en majuscule
		value = value[0].toUpperCase() + value.slice(1);

		return value;
	}

	function cleanPlace(value) {
		if (value === undefined) {
			return null;
		}
		// Supprimer les informations entre []
		value = value.replace(/\[.*\]/g, '');

		// Supprimer les informations de diffusion
		value = value.replace(/ *diff *[:.].*$/g, '');

		return value;
	}

	// Ne fonctionne pas… Mofifier aussi les number pour enlever les N° etc.
	function cleanSeries(value) {
		if (value === undefined) {
			return null;
		}
		// Supprimer le terme "collection"
		value = value.replace(/Collection ?/g, '');

		return value;
	}

	function cleanExtra(value) {
		if (value === undefined) {
			return null;
		}

		value = value.replace(/^[\s.,/:;]+/g, '');
		value = value.replace(/[\s.,/:;]+$/g, '');
		value = value.replace(/ +/g, ' ');

		// Lexique
		value = value.replace(/[Mm]oyen[  ][aâ]ge/g, 'Moyen Âge');
		value = value.replace(/oeuvre/g, 'œuvre');
		value = value.replace(/O[Ee]uvre/g, 'Œuvre');
		value = value.replace(/\?uvre/g, 'œuvre');

		return value;
	}

	function getCote(record, item) {
		item.callNumber = "";
		var coteTag = record.getFieldSubfields("930");

		if (coteTag.length) {
			item.callNumber += coteTag[0].c + "-" + coteTag[0].a;
		}
	}

	// Do BnF specific Unimarc postprocessing
	function postprocessMarc(record, newItem) {
		// Title
		getTitle(record, newItem);
		// Fix publisher and place
		newItem.publisher = cleanPublisher(newItem.publisher);
		newItem.place = cleanPlace(newItem.place);
		// Fix creators
		getCreators(record, newItem);
		// Fix callNumber
		getCote(record, newItem);
		// Store perennial url from 003 as attachment and accession number
		var url = record.getField("003");
		if (url && url.length > 0 && url[0][1]) {
			newItem.attachments.push({
				title: 'BnF Link',
				url: url[0][1],
				mimeType: 'text/html',
				snapshot: false
			});
		}
		// Country (102a)
		record._associateDBField(newItem, "102", "a", "country");
		// ISSN
		record._associateDBField(newItem, "225", "x", "issn");
		if (!newItem.issn) {
			record._associateDBField(newItem, "410", "x", "issn");
		}
		// Try to retrieve volumes/pages from 215d
		if (!newItem.pages) {
			var dimTag = record.getFieldSubfields("215");
			for (let j in dimTag) {
				var dim = dimTag[j];
				if (dim.a) {
					// Je change la regex pour qu'elle capture les chiffres romains aussi
					// var pages = /[^\d]*(\d+)\s+p\..*/.exec(dim.a);
					var pages = /[^\dMDCLXVImdclxvi]*([MDCLXVImdclxvi]*-*\d+-*[MDCLXVImdclxvi]*)\s+(p\.?|pages).*/.exec(dim.a);
					if (pages) {
						newItem.numPages = pages[1].toLowerCase();
					}
					var vols = /[^\d]*(\d+)\s+vol\..*/.exec(dim.a);
					if (vols) {
						newItem.numberOfVolumes = vols[1];
					}
					// Mettre "1" comme nombre de volumes par défaut
					if (!newItem.numberOfVolumes) {
						newItem.numberOfVolumes = "1";
					}
				}
			}
		}
		// Series
		getSeries(record, newItem);
		// Extra
		getExtra(record, newItem);
		// Tagging
		getTags(record, newItem);
		// Repository
		newItem.libraryCatalog = "BnF Catalogue général (http:// catalogue.bnf.fr)";
	}

	// Public members
	// Get the UNIMARC URL for a given single result page.
	this.reformURL = function (url) {
		url = url.replace(/(^.*\/ark:\/12148\/cb[0-9]+[a-z]*)(.*$)/, "$1.unimarc");
		// Zotero.debug("URL1 "+ url);
		return url;
	};
	// Get the results table from a list page, if any. Looks for // table[@class="ListeNotice"].
	this.getResultsTable = function (doc) {
		try {
			var xPathObject = ZU.xpath(doc, '// div[@class="liste-notices"]');
			return xPathObject;
		}
		catch (x) {
			Zotero.debug(x.lineNumber + " " + x.message);
		}
		return undefined;
	};
	// Get selectable search items from a list page.
	// Loops through //td[@class="mn_partienoticesynthetique"], extracting the single items URLs from
	// their onclick attribute, thier titles by assembling the spans for each cell.
	this.getSelectedItems = function (doc) {
		var items = {};
		var found = false;
		var rows = ZU.xpath(doc, '//div[@class="liste-notices"]/div[@class="notice-item"]/div[@class="notice-contenu"]');
		for (var i = 0; i < rows.length; i++) {
			var title = "";
			var href = attr(rows[i], 'div[class="notice-synthese"] a', "href");
			try {
				title = ZU.trim(text(rows[i], 'div[class="notice-synthese"] a h2'));
			}
			catch (x) {
				title = ZU.trim(text(rows[i], 'div[class="notice-synthese"] a'));
			}
			var documentYear = text(rows[i], 'span[class="notice-ordre"]');
			if (documentYear.length == 6) {
				title += " / " + documentYear;
			}
			if (!href || !title) continue;
			found = true;
			items[href] = title;
		}
		return found ? items : false;
	};

	// Check for Gallica URL (digital version available), if found, set item.url
	function checkGallica(record, item) {
		var url = record.getFieldSubfields("856");
		if (url && url.length > 0 && url[0].u) {
			item.url = url[0].u;
		}
	}

	// Process UNIMARC URL.
	this.processMarcUrl = function (newDoc, _url) {
		// Init MARC record.
		// Load MARC
		var translator = Zotero.loadTranslator("import");
		translator.setTranslator("a6ee60df-1ddc-4aae-bb25-45e0537be973");
		translator.getTranslatorObject(function (obj) {
			var record = new obj.record();
			// Get table cell containing MARC code.
			var elmts = ZU.xpath(newDoc, '//div[@class="notice-detail"]/div/div[@class="zone"]');
			// Line loop.
			var elmt, tag, content;
			var ind = "";
			for (var i = 0; i < elmts.length; i++) {
				elmt = elmts[i];
				// Je désactive la fonction superCleanString car elle supprime les guillemets de fin de chaîne ce qui pose problème par exemple avec le champ extra où il y en a souvent
				// var line = Zotero.Utilities.superCleanString(elmt.textContent);
				var line = elmt.textContent;
				if (line.length == 0) {
					continue;
				}
				if (line.substring(0, 6) == "       ") {
					content += " " + line.substring(6);
					continue;
				}
				else if (tag) {
					record.addField(tag, ind, content);
				}
				line = line.replace(/[_\t\xA0]/g, " "); // nbsp
				tag = line.substr(0, 3);
				if (tag[0] != "0" || tag[1] != "0") {
					ind = line.substr(3, 2);
					content = line.substr(5).replace(/\$([a-z]|[0-9])/g, obj.subfieldDelimiter + "$1");
					content = content.replace(/ˆ([^‰]+)‰/g, "$1");
				}
				else if (tag == "000") {
					tag = undefined;
					record.leader = "0000" + line.substr(8);
				}
				else {
					content = line.substr(3);
				}
			}
			// case last zone
			if (tag) {
				record.addField(tag, ind, content);
			}
			// Create item
			var newItem = new Zotero.Item();
			record.translate(newItem);
			// Do specific Unimarc postprocessing
			postprocessMarc(record, newItem);
			// Check for Gallica URL
			checkGallica(record, newItem);
			newItem.complete();
		});
	};
};

/* Global BnfClass object. */
var Bnf = new BnfClass();

/* Translator API implementation. */
var typeMapping = {
	"moving image": "film",
	text: "book",
	"printed text": "book",
	"electronic resource": "book",
	score: "book",
	sound: "audioRecording",
	"sound recording": "audioRecording",
	"cartographic resource": "map",
	"still image": "artwork",
	kit: "document",
	"modern manuscript or archive": "manuscript",
	"coin or medal": "document",
	"physical object": "document",
	"three dimensional object": "document"
};

function detectWeb(doc, url) {
	var resultRegexp = /ark:\/12148\/cb[0-9]+/i;
	// Single result ?
	if (resultRegexp.test(url)) {
		var itemType = attr(doc, 'meta[name="DC.type"][lang="eng"]', "content");
		if (typeMapping[itemType]) {
			return typeMapping[itemType];
		}
		else {
			return "document";
		}
	}
	// Muliple result ?
	else if (Bnf.getResultsTable(doc)) {
		return "multiple";
	}
	// No items
	return undefined;
}

function doWeb(doc, url) {
	// Check type.
	var type = detectWeb(doc, url);
	Zotero.debug("type " + type);
	if (!type) {
		return;
	}
	// Build array of MARC URLs.
	var urls = [];
	switch (type) {
		case "multiple":
			var items = Bnf.getSelectedItems(doc);
			if (items) {
				// Let user select items
				Zotero.selectItems(items, function (items) {
					for (var i in items) {
						urls.push(Bnf.reformURL(i));
					}
					if (urls.length > 0) {
						// Z.debug(urls)
						Zotero.Utilities.processDocuments(urls, function (doc) {
							Bnf.processMarcUrl(doc, urls[0]);
						});
					}
				});
			}
			break;
		default:
			urls = [Bnf.reformURL(url)];
			Zotero.Utilities.processDocuments(urls, function (doc) {
				Bnf.processMarcUrl(doc, url);
			});
			break;
	}
}

/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "https://catalogue.bnf.fr/ark:/12148/cb40636779s",
		"items": [
			{
				"itemType": "map",
				"title": "Scotia Regnum divisum in Partem Septentrionalem et Meridionalem Subdivisas in Comitatus, Vicecomitatus, Provincias, Praefecturas, Dominia et Insulas",
				"creators": [
					{
						"firstName": "Frederick",
						"lastName": "De Wit ",
						"creatorType": "author"
					}
				],
				"date": "1680",
				"extra": "510 x 570. Le titre est en bas et à gauche dans un cartouche monumental décoré d'un Amour. En haut de la carte, deux Amours portent un écu aux armes de l'Ecosse. Vers 1680.",
				"language": "lat",
				"libraryCatalog": "BnF Catalogue général (http:// catalogue.bnf.fr)",
				"place": "S.l.",
				"publisher": "s.n.",
				"attachments": [
					{
						"title": "BnF Link",
						"mimeType": "text/html",
						"snapshot": false
					}
				],
				"tags": [
					{
						"tag": " Écosse, Royaume d' (843-1707) "
					}
				],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "https://catalogue.bnf.fr/ark:/12148/cb43664161m",
		"items": [
			{
				"itemType": "book",
				"title": "La déesse des petites victoires",
				"creators": [
					{
						"firstName": "Yannick",
						"lastName": "Grannec ",
						"creatorType": "author"
					}
				],
				"date": "2012",
				"ISBN": "9782286093051",
				"callNumber": "Tolbiac - Rez de Jardin - Littérature et art - Magasin - 2013-334011",
				"extra": "couv. ill. 21 cm. Bibliogr., 3 p.",
				"language": "fre",
				"libraryCatalog": "BnF Catalogue général (http:// catalogue.bnf.fr)",
				"numPages": "468",
				"numberOfVolumes": "1",
				"place": "Paris",
				"publisher": "le Grand livre du mois",
				"attachments": [
					{
						"title": "BnF Link",
						"mimeType": "text/html",
						"snapshot": false
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "https://catalogue.bnf.fr/ark:/12148/cb39209609w",
		"items": [
			{
				"itemType": "film",
				"title": "Problèmes et pratiques :  sciences de la vie et de la terre",
				"creators": [],
				"date": "199",
				"distributor": "Centre national de documentation pédagogique",
				"extra": "coul. (SECAM), son. Titre de dos : \"Sciences de la vie et de la terre, problèmes et pratiques. Notice réd. d'après un document produit en 1996.",
				"language": "fre",
				"libraryCatalog": "BnF Catalogue général (http:// catalogue.bnf.fr)",
				"shortTitle": "Problèmes et pratiques",
				"attachments": [
					{
						"title": "BnF Link",
						"mimeType": "text/html",
						"snapshot": false
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "https://catalogue.bnf.fr/ark:/12148/cb40494299f",
		"items": [
			{
				"itemType": "artwork",
				"title": "[Recueil. Vues stéréoscopiques de Louis] :  [photographie",
				"creators": [
					{
						"lastName": "Louis",
						"creatorType": "artist"
					}
				],
				"extra": "formats divers. Comprend deux séries : \"Le Petit Chaperon rouge\" et \"La Belle au Bois Dormant.",
				"language": "fre",
				"libraryCatalog": "BnF Catalogue général (http:// catalogue.bnf.fr)",
				"shortTitle": "[Recueil. Vues stéréoscopiques de Louis]",
				"attachments": [
					{
						"title": "BnF Link",
						"mimeType": "text/html",
						"snapshot": false
					}
				],
				"tags": [
					{
						"tag": " Figurines "
					},
					{
						"tag": " Perrault ,  Charles  ( 1628-1703 ),  La Belle au bois dormant "
					},
					{
						"tag": " Perrault ,  Charles  ( 1628-1703 ),  Le Petit Chaperon rouge "
					}
				],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "https://catalogue.bnf.fr/ark:/12148/cb39755519v",
		"items": [
			{
				"itemType": "manuscript",
				"title": "[3 lettres et 1 carte de visite d'Adolphe Aderer à Adolphe Jullien]",
				"creators": [
					{
						"firstName": "Adolphe",
						"lastName": "Aderer ",
						"creatorType": "author"
					},
					{
						"firstName": "Adolphe",
						"lastName": "Jullien ",
						"creatorType": "recipient"
					}
				],
				"language": "fre",
				"libraryCatalog": "BnF Catalogue général (http:// catalogue.bnf.fr)",
				"place": "1895-1922",
				"attachments": [
					{
						"title": "BnF Link",
						"mimeType": "text/html",
						"snapshot": false
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "https://catalogue.bnf.fr/ark:/12148/cb40025449j",
		"items": [
			{
				"itemType": "audioRecording",
				"title": "The complete D singles collection :  the sounds of Houston, Texas",
				"creators": [],
				"extra": "6 brochures.",
				"label": "Bear family records",
				"language": "eng",
				"libraryCatalog": "BnF Catalogue général (http:// catalogue.bnf.fr)",
				"place": "Hambergen (Allemagne)",
				"shortTitle": "The complete D singles collection",
				"attachments": [
					{
						"title": "BnF Link",
						"mimeType": "text/html",
						"snapshot": false
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "https://catalogue.bnf.fr/rechercher.do?motRecherche=test&critereRecherche=0&depart=0&facetteModifiee=ok",
		"items": "multiple"
	},
	{
		"type": "web",
		"url": "https://catalogue.bnf.fr/ark:/12148/cb410374690.public",
		"items": [
			{
				"itemType": "artwork",
				"title": "Les sorcières envahissent la forêt Lespinasse :  [affiche",
				"creators": [],
				"date": "2007",
				"extra": "60 x 40 cm.",
				"language": "fre",
				"libraryCatalog": "BnF Catalogue général (http:// catalogue.bnf.fr)",
				"shortTitle": "Les sorcières envahissent la forêt Lespinasse",
				"attachments": [
					{
						"title": "BnF Link",
						"mimeType": "text/html",
						"snapshot": false
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	}
]
/** END TEST CASES **/
