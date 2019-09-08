export default Object.freeze({
    account: {
        create_account: 'Maak account aan',
        i_got_account: 'Ik heb een account',
        i_logged_in: 'Ik ben ingelogd',
        log_me_in: 'Mij inloggen',
        need_to_be_logged_in:
            'Om een GTIN aan te maken moet u zich eerst inloggen',
        not_logged_in_yet:
            'Volg deze [link](https://www.gs1belu.org/nl/extranet/login) om in te loggen. Laat maar weten wanneer u ingelogd bent.',
        now_logged_in: 'U bent nu ingelogd. Welkom terug!',
        saw_new_user_create_account:
            'Om een GTIN aan te maken moet u zich eerst registreren. Wilt u nu een nieuw account aanmaken? Als u zich eerder vergist had en reeds een account hebt, selecteer dan "mij inloggen"',
        see_account_creation_page:
            'Volg deze [link](https://www.gs1belu.org/nl/extranet/register/company) om een account aan te maken. Laat maar weten wanneer u klaar bent.',
    },
    faq: {
        pose_differently:
            'Dan heb ik deze vraag niet helemaal begrepen, mijn excuses ik ben nog volop aan het leren. We zullen even opnieuw beginnen en misschien kan je je vraag anders formuleren? Je kan ook altijd contact opnemen met onze support medewerkers via email:"emailadres"',
        pose_question:
            'Stel uw vraag, ik zal deze zo goed mogelijk proberen te beantwoorden.',
        thanks_for_feedback: 'Top! Bedankt voor de feedback!',
        was_this_useful: 'Was dit een antwoord op je vraag?',
    },
    general: {
        no: 'Nee',
        yes: 'Ja',
    },
    gtin: {
        add_to_existing: 'Wenst u een GTIN toe te voegen aan een bestaande prefix?',
        ask_some_questions: 'Ik ga je nu een aantal vragen stellen om je vervolgens een overzicht te kunnen geven van de verschillende mogelijkheden en bijhorende tarieven.',
        cd_dvd_vinyl_form:
            'Volg deze [link](www.cdgtin.be) om de aanvraag van een barcode voor een CD, DVD of Vinyl plaat te vervolledigen.',
        check_revenue:'Nog even controleren...',
        chose_to_add_to_prefix: (prefix: string) =>
            `U koos er voor om een gtin toe te voegen aan prefix ${prefix}. Volg deze [link](www.linknaarprefixen.be) om het proces te voltooien.`,
        for_cd_or_other:
            'Heeft u een GTIN nodig voor CD/DVD/Vinyl in eigen beheer, of voor een ander product?',
        give_revenue_please: 'Gelieve de omzet van uw bedrijf in te geven',
        how_many_trade_units: 'Hoeveel handelseenheden wenst u te identificeren?',
        is_revenue_correct: (revenue: string) =>
            `Klopt volgend omzetcijfer van jouw bedrijf: ${revenue}EUR?`,
        
        need_prefix: 'In dit geval heeft een barcode prefix nodig.',
        no_problem: 'Geen probleem, misschien een andere keer.',
        possible_answers: {
            cd_dvd_vinyl: 'CD DVD of Vinyl',
            other: 'Andere',
        },
        prefix_determines_gtins:
            'De prefix bepaalt het maximaal aantal GTINs. Bekijk deze [link](gtins.be) voor meer info',
        ready_here_we_go: 'Ready? Here we go!',
        recommend_these_prefixes: (suggestedPrefixes: Array<{Prefix1:string, Aantal1:number,JoiningF1:number,YearlyF1:number}>) => 
            `Op basis van uw situatie raad ik u een bedrijfsprefix ${suggestedPrefixes[0].Prefix1} ${suggestedPrefixes[1] ? `of ${suggestedPrefixes[1].Prefix1}`: ''} aan.
Met een bedrijfsprefix ${suggestedPrefixes[0].Prefix1} kunt u tot ${suggestedPrefixes[0].Aantal1} verschillende handelseenheden identificeren. Hiervoor betaalt u eenmalig een toetredingsbijdrage van € ${suggestedPrefixes[0].JoiningF1} en een jaarlijkse bijdrage van € ${suggestedPrefixes[0].YearlyF1}.
\n\n${suggestedPrefixes[1] ? `Een bedrijfsprefix ${suggestedPrefixes[1].Prefix1} laat u toe om ${suggestedPrefixes[1].Aantal1} handelseenheden te identificeren voor een eenmalige kost van € ${suggestedPrefixes[1].JoiningF1} en € ${suggestedPrefixes[1].YearlyF1} per jaar.`
    :''}`,
        special_offer:
            'We hebben een speciaal aanbod voor barcodes voor CD/DVD/Vinyl. Wilt u hier gebruik van maken?',
        u_chose_prefix_x: (prefix:string, link:string) => `U hebt gekozen voor prefix ${prefix}. Klik op volgende [link](${link}) om het aankoopproces vanaf hier verder te zetten.`
        },
    main: {
        help: {
            possibilities: {
                general_question: 'Vraag stellen',
                need_gtin: 'Barcode aanmaken',
                need_lei: 'LEI aanvragen',
            },
            what_can_i_do: 'Waarmee kan ik je van dienst zijn?',
        },
        lei: 'Klik [hier](https://www.gs1belu.org/nl/lei-bestellen) om informatie over de aanvraag van een LEI te vinden.',
        new_user: 'Bent u een nieuwe gebruiker?',
        new_user_documents:
            'Eerder gaf u aan dat u een nieuwe gebruiker bent. Bekijk alvast [deze documenten](newUserDocs.be) om het aanvragen van een GTIN zo vlot mogelijk te laten verlopen.',
        welcome: {
            hello: 'Hallo',
            introduction: 'Ik ben jouw virtuele assistent bij GS1',
            possibilities: {
                ask_question: 'Stel een vraag',
                create_barcode: 'Een barcode aanmaken',
            },
        },
        what_else: 'Wat kan ik nog voor je doen?',
    },
});
