import { cloneDeep } from "lodash";
import { META_TAG_AND_TITLE } from "../modules/shared/constants/metatag-titletag.constant";

export class CommonUtil {

    static parseDate(input: any, isTime: any = null) {
        var d = new Date(input),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (!isTime) {
            return [year, month, day].join('-');
        }
        return [year, month, day].join('-') + ' ' +
            [
                CommonUtil.padTo2Digits(d.getHours()),
                CommonUtil.padTo2Digits(d.getMinutes()),
            ].join(':');
    }

    static padTo2Digits(num: any) {
        return num.toString().padStart(2, '0');
    }

    static setMetaTagAndTitle(titleService, metaService, data) {
        const meta = data;

        //set title of page 
        titleService.setTitle(meta.title || 'Gytree');

        // meta tag setting
        metaService.updateTag({
            name: 'description',
            content: meta?.metaDescription
        });

        metaService.updateTag({
            name: 'keywords',
            content: meta?.metaKeyword
        });

        metaService.updateTag({
            property: 'og:title',
            content: meta?.metaTitle
        });

        metaService.updateTag({
            property: 'og:description',
            content: meta?.metaDescription
        });
        
        metaService.updateTag({
            property: 'og:image',
            content: meta?.metaImage
        });

        metaService.updateTag({
            property: 'twitter:title',
            content: meta?.metaTitle
        });

        metaService.updateTag({
            property: 'twitter:description',
            content: meta?.metaDescription
        });
    }
}