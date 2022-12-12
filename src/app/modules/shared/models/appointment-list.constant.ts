export interface APPOINTMENT_SCHEMA {
    gto_doc_id: string,
    gto_time: string,
    gto_slot: string,
    gto_user_id: string,
    gto_guid: string,
    gto_type: string,
    gto_status: string,
    c_date: string,
    gto_config: [],
    gto_id: string,
    gto_pack_id: string,
    gto_date: string,
    order_appointment_status?: string,
    gto_from: string,
    gtpack_data: { gtp_title: string },
    gtdoc_data: { gtd_fullname: string },
    appointment_data: any
}