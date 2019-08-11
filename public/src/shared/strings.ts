export default Object.freeze({
    account: {
        create_account: 'Maak account aan',
        i_got_account: 'Ik heb een account',
        i_logged_in: 'Ik ben ingelogd',
        log_me_in: 'Mij inloggen',
        need_to_be_logged_in:
            'Om een GTIN aan te maken moet u zich eerst inloggen',
        not_logged_in_yet:
            'Volg deze [link](www.logintoaccountlink.be) om in te loggen. Laat maar weten wanneer u ingelogd bent.',
        now_logged_in: 'U bent nu ingelogd. Welkom terug!',
        saw_new_user_create_account:
            'Om een GTIN aan te maken moet u zich eerst registreren. Wilt u nu een nieuw account aanmaken? Als u zich eerder vergist had en reeds een account hebt, selecteer dan "mij inloggen"',
        see_account_creation_page:
            'Volg deze [link](www.createaccountlink.be) om een account aan te maken. Laat maar weten wanneer u klaar bent.',
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
        add_to_existing: 'Wenst u een GTIN toe te voegen een bestaande prefix?',
        cd_dvd_vinyl_form:
            'Volg deze [link](www.cdgtin.be) om de aanvraag van een barcode voor een CD, DVD of Viniyl plaat te vervolledigen.',
        chose_to_add_to_prefix: (prefix: string) =>
            `U koos er voor om een gtin toe te voegen aan prefix ${prefix}. Volg deze [link](www.linknaarprefixen.be) om het proces te voltooien.`,
        for_cd_or_other:
            'Heeft u een GTIN nodig voor CD/DVD/Vinyl in eigen beheer, of voor een ander product?',
        give_revenue_please: 'Geef uw omzet in alstublieft',
        is_revenue_correct: (revenue: string) =>
            `Klopt volgend omzetcijfer: ${revenue}. Dit is belangrijk voor het bepalen van het tarief en zal later ook nog geverifieerd worden.`,
        need_prefix: 'In dit geval heeft een barcode prefix nodig.',
        possible_answers: {
            cd_dvd_vinyl: 'CD DVD of Vinyl',
            other: 'Andere',
        },
        prefix_determines_gtins:
            'De prefix bepaalt het maximaal aantal GTINs. Bekijk deze [link](gtins.be) voor meer info',
        special_offer:
            'We hebben een speciaal aanbod voor barcodes voor CD/DVD/Vinyl. Wilt u hier gebruik van maken?',
    },
    main: {
        help: {
            possibilities: {
                general_question: 'Ik heb een Algemene vraag',
                need_gtin: 'Ik heb een GTIN nodig',
                need_lei: 'Ik heb een LEI nodig',
            },
            what_can_i_do: 'Waarmee kan ik u helpen?',
        },
        new_user: 'Bent u een nieuwe gebruiker?',
        new_user_documents:
            'Eerder gaf u aan dat u een nieuwe gebruiker bent. Bekijk alvast deze documenten om het aanvragen van een GTIN zo vlot mogelijk te laten verlopen. [LINK NAAR DOCS]',
        welcome: {
            introduction: 'Welkom ik ben GS1-Bot,',
            possibilities: {
                ask_question: 'Stel een vraag',
                create_barcode: 'Een barcode aanmaken',
            },
        },
        what_else: 'Wat kan ik nog voor je doen?',
    },
});
