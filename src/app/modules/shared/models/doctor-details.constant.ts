export interface DOCTOR_DETAILS_SCHEMA {
    gtd_mobno: string,
    gtd_workexpr: WORK_EXPERIENCE_SCHEMA[],
    gtd_sign: string,
    gtd_type: string,
    gtd_degree: string,
    gtd_about_me: string,
    gtd_exper: string,
    gtd_dob: string,
    gtd_edu: EDUCATION_SCHEMA[],
    gtd_slug: string,
    gtd_guid: string,
    gtd_image: string,
    c_date: string,
    gtd_fullname: string,
    gtd_name: string,
    gtd_password: string,
    gtd_email: string,
    gtdp_color: string,
    gtd_consultation_price: string,
    viewAll: boolean
    gtd_meta_desc: string,
    gtd_meta_image: string,
    gtd_meta_keywords: string,
    gtd_meta_title: string
}

interface WORK_EXPERIENCE_SCHEMA {
    filetype: string,
    enddate: string,
    Organization_name: string,
    fileurl: string,
    id: string,
    position: string,
    startdate: string,
    currently_working: Boolean
}

interface EDUCATION_SCHEMA {
    filetype: string,
    enddate: string,
    university: string,
    degree: string,
    fileurl: string,
    id: string,
    startdate: string,
}