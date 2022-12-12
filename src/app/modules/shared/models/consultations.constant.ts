import { OwlOptions } from "ngx-owl-carousel-o";

export interface CONSULTATION_SCHEMA {
    consultationList: OwlOptions,
    staticData?: CONSULTATION_DATA_SCHEMA[]
}

interface CONSULTATION_DATA_SCHEMA {
    title: string,
    description: string,
    src: string,
    routing: string,
    afterLoginRouting?: string,
    heading: string,
    id: string
}