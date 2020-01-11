import uniqid from 'uniqid';


import {elements} from '../views/base'
export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        this.persistData();
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        // [2,4,8] splice(1, 2) -> returns [4, 8], original array is [2]
        // [2,4,8] slice(1, 2) -> returns 4, original array is [2,4,8]
        this.items.splice(index, 1);
        this.persistData();
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }

    persistData(){
        localStorage.setItem('list',JSON.stringify(this.items));
    }
    readStorage(){
        const storage=JSON.parse(localStorage.getItem('list'));
        // Restore shopping list
        if(storage) this.items=storage;
    }
    deleteAllItem() {
        this.items=[];
        elements.shopping.innerHTML='';
        this.persistData();
    }
    download_shopping_list(){
        var csv='Amount,Unit,Ingredients\n';
        var data=JSON.parse(localStorage.getItem('list'));
        data.forEach(row=>{
            csv +=row.count.toFixed(2);
            csv +=',';
            csv +=row.unit;
            csv +=',';
            csv +="\"" + row.ingredient + "\"";
            csv +='\n';
        });
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'Shopping_List.csv';
        hiddenElement.click();
    }
}