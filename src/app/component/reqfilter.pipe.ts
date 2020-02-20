import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'requestFilter'
})
export class RequestFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if(!items) return [];
        if(!searchText) return items;

        searchText = searchText.toLowerCase();
        return items.filter( it => {
            return (
                it.id.toLowerCase().includes(searchText) ||
                it.document_status.toLowerCase().includes(searchText) ||
                it.customer_data.name.toLowerCase().includes(searchText) ||
                (it.vendor_data && it.vendor_data.name.toLowerCase().includes(searchText))
            );
        });
    }
}