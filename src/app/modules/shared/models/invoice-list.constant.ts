export interface INVOICE_LIST_SCHEMA {
    gtiv_pack_id: string,
    gtiv_guid: string,
    gtiv_pdf: string,
    gtiv_order_uid: string,
    gtiv_user_id: string,
    gtiv_user_name: string,
    gtiv_refrence_id: string,
    gtiv_user_email: string,
    gtiv_user_mob: string,
    gtiv_ref_uid: string,
    gtiv_invoice_id?: string,
    gtiv_txn_id: string,
    gtiv_base_price: string,
    gtiv_cgst: string,
    gtiv_sgst: string,
    gtiv_details: INVOICE_DETAILS
    gtive_cdate: string,
    gtiv_gst: any,
    isOpen: any
}

interface INVOICE_DETAILS {
    datetime: string,
    summary: string,
    description: string,
    GST: string,
    total: string,
    Test_Name: string,
    consult_desc: string
}