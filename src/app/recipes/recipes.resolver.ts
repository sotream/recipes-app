import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot
} from '@angular/router';

import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from './recipe.mpde';
import {RecipeService} from "./recipe.service";

export const recipesResolver: ResolveFn<Recipe[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const recipes = inject(RecipeService).getRecipes()

  if (recipes.length) {
    return recipes;
  } else {
    return inject(DataStorageService).fetchRecipes();
  }
};
