import {Component, ElementRef, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list.service";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShopingEditComponent {
  @ViewChild('nameInput', { static: false }) nameInputReference: ElementRef;
  @ViewChild('amountInput', { static: false }) amountInputReference: ElementRef;

  constructor(private shoppingListService: ShoppingListService) {}

  onAddItem() {
    const ingName = this.nameInputReference.nativeElement.value
    const ingAmount = this.amountInputReference.nativeElement.value

    const newIngredient = new Ingredient(ingName, ingAmount);

    this.shoppingListService.addIngredient(newIngredient);
  }
}
