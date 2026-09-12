/*
=========================================================
ADMIN.JS
CARTE DU CARBURANT - MALI
=========================================================

Structure :

Région
   ↓
Cercle
   ↓
Commune
   ↓
Station

Bamako :

District de Bamako
   ↓
Arrondissement
   ↓
Quartier
   ↓
Station

=========================================================
*/


const ADMIN_DATA = [

    /*
    =====================================================
    BAMAKO
    =====================================================
    */

    {
        code: "BAMAKO",
        name: "District de Bamako",
        type: "district",

        cercles: [

            {
                code: "BKO01",
                name: "1er Arrondissement",

                communes: [
                    {
                        code: "BKO01_Q",
                        name: "Titibougou"
                    }
                ]
            },

            {
                code: "BKO02",
                name: "2e Arrondissement",

                communes: []
            },

            {
                code: "BKO03",
                name: "3e Arrondissement",

                communes: []
            },

            {
                code: "BKO04",
                name: "4e Arrondissement",

                communes: []
            },

            {
                code: "BKO05",
                name: "5e Arrondissement",

                communes: []
            },

            {
                code: "BKO06",
                name: "6e Arrondissement",

                communes: []
            },

            {
                code: "BKO07",
                name: "7e Arrondissement",

                communes: []
            }
        ]
    },


    /*
    =====================================================
    KAYES
    =====================================================
    */

    {
        code: "KAYES",
        name: "Kayes",
        type: "region",

        cercles: [

            {
                code: "KAYES_YELIMANE",
                name: "Yélimané",

                communes: [
                    {
                        code: "KAYES_YELIMANE_YELIMANE",
                        name: "Yélimané"
                    }
                ]
            },

            {
                code: "KAYES_KAYES",
                name: "Kayes",

                communes: [
                    {
                        code: "KAYES_KAYES_KAYES",
                        name: "Kayes"
                    }
                ]
            }
        ]
    },


    /*
    =====================================================
    KOULIKORO
    =====================================================
    */

    {
        code: "KOULIKORO",
        name: "Koulikoro",
        type: "region",

        cercles: [

            {
                code: "KOULIKORO_DIOILA",
                name: "Dioïla",

                communes: [
                    {
                        code: "KOULIKORO_DIOILA_DIOILA",
                        name: "Dioïla"
                    }
                ]
            },

            {
                code: "KOULIKORO_KATI",
                name: "Kati",

                communes: []
            },

            {
                code: "KOULIKORO_KOULIKORO",
                name: "Koulikoro",

                communes: []
            }
        ]
    },


    /*
    =====================================================
    SIKASSO
    =====================================================
    */

    {
        code: "SIKASSO",
        name: "Sikasso",
        type: "region",

        cercles: [

            {
                code: "SIKASSO_SIKASSO",
                name: "Sikasso",

                communes: [
                    {
                        code: "SIKASSO_SIKASSO_SIKASSO",
                        name: "Sikasso"
                    }
                ]
            },

            {
                code: "SIKASSO_KADIOLO",
                name: "Kadiolo",

                communes: []
            }
        ]
    },


    /*
    =====================================================
    SEGOU
    =====================================================
    */

    {
        code: "SEGOU",
        name: "Ségou",
        type: "region",

        cercles: [

            {
                code: "SEGOU_SEGOU",
                name: "Ségou",

                communes: [
                    {
                        code: "SEGOU_SEGOU_SEGOU",
                        name: "Ségou"
                    }
                ]
            },

            {
                code: "SEGOU_BLA",
                name: "Bla",

                communes: []
            }
        ]
    },


    /*
    =====================================================
    GAO
    =====================================================
    */

    {
        code: "GAO",
        name: "Gao",
        type: "region",

        cercles: [

            {
                code: "GAO_GAO",
                name: "Gao",

                communes: [
                    {
                        code: "GAO_GAO_GAO",
                        name: "Gao"
                    }
                ]
            }
        ]
    },


    /*
    =====================================================
    KIDAL
    =====================================================
    */

    {
        code: "KIDAL",
        name: "Kidal",
        type: "region",

        cercles: [

            {
                code: "KIDAL_ABEIBARA",
                name: "Abeïbara",

                communes: [
                    {
                        code: "KIDAL_ABEIBARA_TINZAWATEN",
                        name: "Tinzawaten"
                    }
                ]
            }
        ]
    },


    /*
    =====================================================
    TAOUDENIT
    =====================================================
    */

    {
        code: "TAOUDENIT",
        name: "Taoudénit",
        type: "region",

        cercles: [

            {
                code: "TAOUDENIT_TAOUDENIT",
                name: "Taoudénit",

                communes: [
                    {
                        code: "TAOUDENIT_TAOUDENIT_TAOUDENIT",
                        name: "Taoudénit"
                    }
                ]
            }
        ]
    },


    /*
    =====================================================
    DIOILA
    =====================================================
    */

    {
        code: "DIOILA",
        name: "Dioïla",
        type: "region",

        cercles: [

            {
                code: "DIOILA_FANA",
                name: "Fana",

                communes: [
                    {
                        code: "DIOILA_FANA_FANA",
                        name: "Fana"
                    }
                ]
            }
        ]
    },


    /*
    =====================================================
    STATIONS
    =====================================================
    */

];


const STATION_ADMIN = {


    /*
    TINZAWATEN
    */

    tinza_express: {

        region: "KIDAL",

        cercle: "KIDAL_ABEIBARA",

        commune:
            "KIDAL_ABEIBARA_TINZAWATEN"
    },


    /*
    SIKASSO
    */

    sikasso_wayerma_ii: {

        region: "SIKASSO",

        cercle:
            "SIKASSO_SIKASSO",

        commune:
            "SIKASSO_SIKASSO_SIKASSO"
    },


    /*
    TAOUDENIT
    */

    taoud_nit___shell_4: {

        region: "TAOUDENIT",

        cercle:
            "TAOUDENIT_TAOUDENIT",

        commune:
            "TAOUDENIT_TAOUDENIT_TAOUDENIT"
    },


    taoud_nit___total1: {

        region: "TAOUDENIT",

        cercle:
            "TAOUDENIT_TAOUDENIT",

        commune:
            "TAOUDENIT_TAOUDENIT_TAOUDENIT"
    },


    /*
    GAO
    */

    gao_bero_service2: {

        region: "GAO",

        cercle:
            "GAO_GAO",

        commune:
            "GAO_GAO_GAO"
    },


    /*
    KAYES
    */

    kayes_sotraka_1___006: {

        region: "KAYES",

        cercle:
            "KAYES_YELIMANE",

        commune:
            "KAYES_YELIMANE_YELIMANE"
    },


    /*
    SEGOU
    */

    s_gou_total2: {

        region: "SEGOU",

        cercle:
            "SEGOU_SEGOU",

        commune:
            "SEGOU_SEGOU_SEGOU"
    },


    total_s_gou1: {

        region: "SEGOU",

        cercle:
            "SEGOU_SEGOU",

        commune:
            "SEGOU_SEGOU_SEGOU"
    },


    /*
    FANA
    */

    traore_fana2: {

        region: "DIOILA",

        cercle:
            "DIOILA_FANA",

        commune:
            "DIOILA_FANA_FANA"
    },


    /*
    BAMAKO
    */

    shell_place_can: {

        region: "BAMAKO",

        cercle:
            "BKO01",

        commune:
            "BKO01_Q"
    }

};
