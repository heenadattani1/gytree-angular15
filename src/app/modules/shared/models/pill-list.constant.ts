export interface PILL_LIST_SCHEMA {
    gtpd_slug: string,
    gtpr_diagnosis: string,
    gtpr_url: string,
    gtpr_guid: string,
    gtpr_name: string,
    gtpr_age: string,
    gtpr_medications: { medicines: medicines[] },
    appointment_data: {
        gtap_date: string
        gtap_time: string
    }
    c_date: string,
    gtpr_medical_problems: string,
    gtpr_medical_symptoms: string,
    gtpr_sex: string,
    gtpr_order_time: string,
    gtpr_medical_history: string,
    gtpr_order_date: string,
    gtpr_instructions: string,
    gtp_name: string,
    gtd_name: string,
    gtpr_order_id: string
}

interface medicines {
    duration: string,
    name: string,
    notes: string,
    total_tablets: string,
    frequency: string,
    dosage: string
}