import { Ingredient } from "../shared/ingredient.model";
export class Recipe {
  public recipeId?: number;
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];

  constructor(name: string, desc: string, imagePath: string, ingredients: Ingredient[], recipeId?: number) {
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
    this.recipeId = recipeId;
  }
}
