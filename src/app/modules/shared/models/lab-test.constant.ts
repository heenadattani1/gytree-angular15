export interface LAB_TEST_LIST_SCHEMA {
    gtlb_lb_slug: string,
    gtlb_name: string,
    gtlb_price: string,
    gtlb_slug: string,
    gtlb_srtdscr: string,
    gtlb_test_dscr: string[],
}

export interface LAB_TEST_CONFIG_SCHEMA {
    id: string,
    desc: string,
    image: string,
    title: string
}