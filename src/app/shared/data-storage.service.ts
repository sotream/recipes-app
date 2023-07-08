import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.mpde';
import { RecipeService } from '../recipes/recipe.service';
import {Ingredient} from "./ingredient.model";


@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    const requestBody = recipes.filter(({ recipeId }) => !recipeId)

    if (!requestBody.length) {
      return
    }

    this.http
      .post('http://localhost:8080/api/recipes', requestBody)
      .subscribe((response) => {
        console.log('Save ingredients response:', response);
      });
  }

  fetchRecipes () {
    return this.http
      .get<{ data: Recipe[] }>('http://localhost:8080/api/recipes')
      .pipe(
        map(({ data }) => {
          const modifiedRecipes = data.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            }
          })

          return modifiedRecipes
        }),
        tap((recipes) => {
          this.recipeService.setRecipes(recipes)
        })
      )
  }
}
