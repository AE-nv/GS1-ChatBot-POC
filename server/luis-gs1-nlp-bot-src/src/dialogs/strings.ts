export default Object.freeze({
    account:{
        create_account: 'Maak account aan',
        i_got_account: 'Ik heb een account',
        i_logged_in: 'Ik ben ingelogd',
        log_me_in: 'Mij inloggen',
        not_logged_in_yet: 'Volge deze [link](www.logintoaccountlink.be) om in te loggen. Laat maar weten wanneer u ingelogd bent.',
        now_logged_in: 'U bent nu ingelogd. Welkom terug!',
        saw_new_user_create_account: 'Om een GTIN aan te maken moet u zich eerst registreren. Wilt u nu een nieuw account aanmaken? Als u zich eerder vergist had en reeds een account hebt, selecteer dan "mij inloggen"',
        see_account_creation_page: 'Volg deze [link](www.createaccountlink.be) om een account aan te maken. Laat maar weten wanneer u klaar bent.'
    },
    faq: {
        pose_differently: 'Dan heb ik deze vraag niet helemaal begrepen, mijn excuses ik ben nog volop aan het leren. We zullen even opnieuw beginnen en misschien kan je je vraag anders formuleren? Je kan ook altijd contact opnemen met onze support medewerkers via email:"emailadres"',
        pose_question: 'Wat is je vraag?',
        thanks_for_feedback:'Top! Bedankt voor de feedback!',
        was_this_useful: 'Was dit een antwoord op je vraag?'
    },
    general: {
        no:'Nee',
        yes:'Ja',
    },
    gtin : {
        add_to_existing: 'Wenst u een GTIN toe te voegen een bestaande prefix?',
        chose_to_add_to_prefix: (prefix: string) => `U koos er voor om een gtin toe te voegen aan prefix ${prefix}. Volg deze [link](www.linknaarprefixen.be) om het proces te voltooien.` 
    },
    main: {
        help: {
            possibilities: {
                general_question:'Ik heb een Algemene vraag',
                need_gtin: 'Ik heb een GTIN nodig',
                need_lei: 'Ik heb een LEI nodig',
            }            ,
            what_can_i_do: 'Waarmee kan ik u helpen?'
        },
        new_user: 'Bent u een nieuwe gebruiker?',
        new_user_documents: 'Eerder gaf u aan dat u een nieuwe gebruiker bent. Bekijk alvast deze documenten om het aanvragen van een GTIN zo vlot mogelijk te laten verlopen. [LINK NAAR DOCS]',
        welcome: {
            introduction: 'Welkom ik ben GS1-Bot,',
            possibilities: {
                ask_question: 'Stel een vraag',
                create_barcode: 'Een barcode aanmaken',
            }
        },
        what_else: 'Wat kan ik nog voor je doen?'
    }
});
