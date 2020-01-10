import axios from 'axios';
import {key} from '../config';
export default class Recipe{
    constructor(id){
        this.id=id;
    }
    
    async getRecipe(){
        try{
            const res = await axios(`https://api.spoonacular.com/recipes/informationBulk?apiKey=${key}&ids=${this.id}`);
            this.title=res.data[0].title;
            this.author=res.data[0].sourceName;
            this.img = res.data[0].image;
            this.url=res.data[0].sourceUrl;
            const l=res.data[0].extendedIngredients.length;
            this.times=res.data[0].readyInMinutes;
            this.serve=res.data[0].servings;
            var arrayName = new Array();
            for(let i=0;i<l;i++){
                arrayName.push(res.data[0].extendedIngredients[i].originalString);
            }
            this.ingredients=arrayName;           
            
        }catch(error){
            console.log(error);
            alert('Something went wrong :( ');
        }
    }
    calcTime(){
        this.time=this.times;
    }
    calcServings(){
        this.servings=this.serve;
    }
    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp','lb', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

 updateServings(type){
     // Servings
        const newServings = type ==='dec'? this.servings-1 : this.servings+1;

     // Ingredients
        this.ingredients.forEach(ing =>{
            ing.count*=(newServings/this.servings);
        })
     this.servings=newServings;
 }
}
