declare const _default: Readonly<{
    account: {
        create_account: string;
        i_got_account: string;
        i_logged_in: string;
        log_me_in: string;
        need_to_be_logged_in: string;
        not_logged_in_yet: string;
        now_logged_in: string;
        saw_new_user_create_account: string;
        see_account_creation_page: string;
    };
    faq: {
        pose_differently: string;
        pose_question: string;
        thanks_for_feedback: string;
        was_this_useful: string;
    };
    general: {
        no: string;
        yes: string;
    };
    gtin: {
        add_to_existing: string;
        cd_dvd_vinyl_form: string;
        chose_to_add_to_prefix: (prefix: string) => string;
        for_cd_or_other: string;
        give_revenue_please: string;
        how_many_trade_units: string;
        is_revenue_correct: (revenue: string) => string;
        need_prefix: string;
        possible_answers: {
            cd_dvd_vinyl: string;
            other: string;
        };
        prefix_determines_gtins: string;
        recommend_these_prefixes: string;
        special_offer: string;
        u_chose_prefix_x: (prefix: string) => string;
    };
    main: {
        help: {
            possibilities: {
                general_question: string;
                need_gtin: string;
                need_lei: string;
            };
            what_can_i_do: string;
        };
        new_user: string;
        new_user_documents: string;
        welcome: {
            hello: string;
            introduction: string;
            possibilities: {
                ask_question: string;
                create_barcode: string;
            };
        };
        what_else: string;
    };
}>;
export default _default;
