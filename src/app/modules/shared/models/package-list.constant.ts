import { OwlOptions } from "ngx-owl-carousel-o"

export interface PACKAGE_SCHEMA {
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
    gtp_base_price: string,
    gt_doc_id: string,
    gtp_thumbnail: string[],
    gtp_config: CONFIG[],
    gtp_consultation_config: CONSULTATION_CONFIG[],
    gtp_paidconfig: PAIDCONFIG[],
    gtp_freeconfig: FREECONFIG,
    viewAll?: boolean,
    gtp_meta_desc: string,
    gtp_meta_image: string,
    gtp_meta_keywords: string,
    gtp_meta_title: string,
    gtp_type_name?: string
}

export interface PACKAGE_SCHEMA1 {
    packageData: PACKAGE_SCHEMA[],
    carouselOptions: OwlOptions,
    first?: PACKAGE_SCHEMA[],
    second?: PACKAGE_SCHEMA[],
    allPackages?: PACKAGE_SCHEMA[]
}

export interface PAIDCONFIG {
    title: string,
    type: string,
    url: string,
}

export interface FREECONFIG {
    image: string[]
}

export interface CONFIG {
    title: string,
    img_url: string,
    description: string
}

export interface CONSULTATION_CONFIG {
    title: string,
    type: string,
    description: string
}

export const FILTER_TYPE = {
    AGE: 'age',
    HEALTH_CLINIC: 'health-clinic'
}