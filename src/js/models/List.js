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
}