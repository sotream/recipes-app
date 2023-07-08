import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.mpde';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService,
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    const requestBody = recipes.filter(({ recipeId }) => !recipeId)

    if (!requestBody.length) {
      return
    }

    this.http
      .post('http://localhost:8080/api/recipes', requestBody)
      .subscribe();
  }

  fetchRecipes () {
    return this.http
            .get<{ data: Recipe[] }>('http://localhost:8080/api/recipes')
            .pipe(
              map((response) => {
                const modifiedRecipes = response.data.map((recipe) => {
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
