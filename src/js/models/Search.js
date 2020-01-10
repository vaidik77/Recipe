import axios from 'axios';
import {key} from '../config';
export default class Search{
    constructor(query){
        this.query=query;

    }
    async getResults(){
        
    
        try{
            const res = await axios(`https://api.spoonacular.com/recipes/search?apiKey=${key}&query=${this.query}&number=50`); 
            //console.log(res);
            this.results=res.data.results;
            //console.log(this.result);
        }catch(error){
            alert(error);
        }
    }
}

