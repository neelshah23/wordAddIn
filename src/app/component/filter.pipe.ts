import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'taskfilter'
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if(!items) return [];
        if(!searchText) return items;

        searchText = searchText.toLowerCase();
        return items.filter( it => {
            return (
                it.id.toLowerCase().includes(searchText) ||
                it.clause.toLowerCase().includes(searchText) ||
                it.assign.toLowerCase().includes(searchText) ||
                it.department.toLowerCase().includes(searchText) ||
                it.status.toLowerCase().includes(searchText)
            );
        });
    }
}
