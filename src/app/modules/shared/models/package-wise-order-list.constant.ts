import { CONFIG, CONSULTATION_CONFIG, FREECONFIG, PAIDCONFIG } from "./package-list.constant";

export interface PACKAGE_WISE_ORDER_SCHEMA {
    gtp_hcnctg: string,
    gtp_srtdescrn: string,
    gtp_agegroup: string,
    gtp_name: string,
    gtp_type: string,
    gtp_slug: string,
    gtp_lngdescrn: string,
    gtp_price: string,
    gtp_guid: string,
    gtp_title: string,
    gtp_consultation_time: string,
    gtp_total_consultations: string
    gtp_thumbnail: string[],
    gtp_config: CONFIG[],
    gtp_consultation_config: CONSULTATION_CONFIG[],
    gtp_paidconfig: PAIDCONFIG,
    gtp_freeconfig: FREECONFIG,
    orders: ORDERS_SCHEMA[],
}

interface ORDERS_SCHEMA {
    gto_time: string,
    gto_user_id: string,
    gto_guid: string,
    gto_type: string,
    gto_status: string,
    c_date: string,
    gto_config: [],
    gto_id: string,
    gto_pack_id: string,
    gto_date: string,
    order_appointment_status: string,
    gto_slot: string
}