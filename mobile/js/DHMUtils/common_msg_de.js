/**
 * Created by zhaojing1 on 2015/1/20.
 */
var msgObj={
	hello:"Hallo",
	sign_out:"Ausloggen",
	close:"in der Nähe",
	cancel:"Stornieren",
	apply:"Übernehmen",
	reset:"Zurücksetzen",
	max:"Max.",
	min:"Mind.",
	filter:"Filtere",
	cas:"Kategorien",
	price:"Preis",
	less_than:"weniger als",
	clear_history:"Verlauf löschen",
	input_key_word:"Bitte geben Sie ein Schlagwort ein.",
	hot_search:"Hot Suche",
	free_shipping:"Kostenloser Versand",
	wholesale:"Großhandel",
	reviews:"Rezensionen",
	l_best_match:"Bester Treffer",
	l_price_lth:"Preis: niedrig bis hoch",
	l_price_htl:"Preis: hoch bis niedrig",
	l_items_htl:"Artikel verkauft: hoch bis niedrig",
	l_recent_list:"Neu gelistet",
	l_feedback:"Feedback",
	l_all_cas:"Alle Kategorien",
	l_min_order:"Min Bestellung",
	PO_PAY_enter_State:"Bitte geben Sie einen gültigen Staat, Provinz oder Region ein.",
	PO_only_number:"Nur Zahlen erlaubt.",
	PO_PAY_emptyError_contactName:"Bitte geben Sie Ihren Vornamen ein. Wenn Sie einen zweiten Vornamen haben, geben Sie bitte auch mit Ihrem Vornamen ein.",
	PO_PAY_emptyError_lastName:"Nachname wird benötigt oder die Lieferung könnte fehlschlagen.",
	PO_PAY_emptyError_addressline1:"Geben Sie bitte eine gültige Adresszeile1 ein.",
	PO_PAY_emptyError_city:"Geben Sie bitte eine Abrechnungs-Stadt/Ort ein.",
	PO_PAY_emptyError_postalcode:"Geben Sie bitte eine gültige Postleitzahl ein.",
	PO_PAY_emptyError_tel:"Bitte eine gültige Telefonnummer angeben.",
	PO_PAY_emptyError_country:"Bitte geben Sie ein gültiges Land ein.",
	PO_emptyError_vatNumber:"PBitte geben Sie eine gültige VAT-Nummer ein.",
	PO_PAY_lenError_contactName:"Länge des Vornamens muss weniger als 30 sein.",
	PO_PAY_lenError_lastName:"Länge des Nachnamens muss weniger als 30 sein.",
	PO_PAY_lenError_addressline1:"Länge der Adresszeile1 muss weniger als 400 sein.",
	PO_PAY_lenError_addressline2:"Länge der Adresszeile2 muss weniger als 400 sein.",
	PO_PAY_lenError_state1:"Limitiert auf 40 Zeichen.",
	PO_PAY_lenError_city:"Limitiert auf 400 Zeichen.",
	PO_PAY_lenError_postalcode:"Die Länge der Postleitzahl muss zwischen 4 und 10 sein.",
	PO_lenError_tel:"Die Länge der Telefonnummer muss zwischen 4 und 20 sein.",
	PO_PAY_resError_contactName_21:"Vorname wird angefordert.",
	PO_PAY_resError_contactName_22:"'Länge des Vornamens überschritt max. 100.",
	PO_PAY_resError_lastName_23:"Nachname wird angefordert.",
	PO_PAY_resError_lastName_24:"'Länge des Nachnamens überschritt max. 100.",
	PO_PAY_resError_addressline1_31:"Adresszeile1 wird angefordert.",
	PO_PAY_resError_addressline1_32:"Länge der Adresszeile1 überschritt max. 400.",
	PO_PAY_resError_addressline2_42:"Länge der Adresszeile2 überschritt max. 400.",
	PO_PAY_resError_city_51:"Stadt wird angefordert",
	PO_PAY_resError_city_52:"Länge der Stadt überschritt max. 400.",
	PO_PAY_resError_state_61:"Staat / Provinz wird angefordert.",
	PO_PAY_resError_state_62:"Länge des Staat / Provinz  überschritt max. 400.",
	PO_PAY_resError_country_71:"Land wird angefordert.",
	PO_PAY_resError_country_72:"Länge des Landes überschritt max. 100.",
	PO_PAY_resError_postalcode_81:"Postleitzahl wird angefordert.",
	PO_PAY_resError_postalcode_82:"Länge der Postleitzahl überschritt max. 20.",
	PO_PAY_resError_tel_91:"Telefonnummer wird angefordert.",
	PO_PAY_resError_tel_92:"Länge der Telefonnummer überschritt max. 20.",
	PO_resError_1:"Ungültige Bemerkung",
	PO_resError_1002:"Gutschein konnte nicht hinzugefügt werden",
	PO_resError_3:"Ungültiger Gutschein",
	PO_resError_4:"Herzlichen Glückwunsch!",
	PO_cannot_shipping_to:"Die von Ihnen gewählte Versandadresse ist nicht gültig, bitte geben Sie eine neue Adresse ein.",
	PO_only:"Nur",
	PO_to:"bis",
	PO_is_allow:"ist erlaubt",
	PO_number_allow:"Nur Zahlen erlaubt.",
	PO_enter_coupon:"Bitte geben Sie einen Gutschein ein.",
	PAY_success_dialog:"Verfolgen Sie Ihren Einkauf und machen Sie Ihr nächstes Einkaufserlebnis schneller und einfacher. Probieren Sie unsere neue App aus!",
	PAY_for_order:"Für Bestellung zahlen",
	PAY_error_11:"Passwort muss zwischen 6 und 20 Zeichen lang sein.",
	PAY_error_21:"Bitte geben Sie eine gültige Kartennummer ein.",
	PAY_error_22:"Kartennummer muss weniger als 18 Zeichen sein.",
	PAY_error_31:"Länge der Kartenprüfnummer muss 3-stellig sein.",
	PAY_error_32:"Länge der Kartenprüfnummer muss 3 oder 4 Ziffern sein.",
	PAY_error_3:"Kartennummer ist falsch.",
	PAY_error_2:"Sicherheitscode ist falsch.",
	PAY_edit:"Editieren",
	PAY_save:"Sichern",
	DETAIL_quntity_mininum_MOrder:"Menge kann den Mindestbestellwert (Mindestbestellwert = nicht überschreiten ",
	DETAIL_quntity_mininum_MSstock:"Die Menge kann die maximale Anzahl auf Lager nicht überschreiten (Max. Stock = ",
	DETAIL_Show_more_photos:"Zeigen 10 weitere Fotos",
	DETAIL_add_to_cart:"1 Artikel in Warenkorb hinzugefügt",
	DETAIL_by:"Von",
	DETAIL_report_review:"Diese Bewertung melden",
	DETAIL_seller_res:"Käufer Antwort",
	DETAIL_cannot_shipping_toL:"Dieses Produkt kann nicht verschickt werden nach ",
    DETAIL_error1:"Bitte wählen Sie Optionen",
	CART_remove:"Vom Einkaufswagen entfernen?",
	LOGIN_6_30_characters:"6-30 Zeichen angefordert.",
	Recommended_products:"Empfehlenswerte Produkte",
	Show_more:"Mehr anzeigen",
	Youmaylike:"Das interessiert Ihnen auch",
	COMMON_Price_onapp:"Bessere Preise auf App genießen!",
	UserType:"Bitte wählen Sie mindestens eine Option aus."
};