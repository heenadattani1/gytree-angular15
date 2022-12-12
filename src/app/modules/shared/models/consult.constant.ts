export interface CONSULT_QUESTION_LIST_SCHEMA {
    gtq_level: string,
    gtq_slug: string,
    gtq_type: string,
    gtq_option_type: string,
    gtq_options: GTQ_OPTIONS[],
    gtq_question: string,
}


interface GTQ_OPTIONS {
    name: string,
    checked: boolean,
    disabeled: boolean
}

export interface CONSULT_PAYLOAD {
    que_level?: string,
    que_type?: string,
}