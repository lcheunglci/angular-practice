import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../recipes.model';
import { RecipesService } from '../recipes.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit, OnDestroy {
  loadedRecipe!: Recipe;

  constructor(
    private activatedRoute: ActivatedRoute,
    private recipesService: RecipesService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave');
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('recipeId')) {
        // redirect
        return;
      }
      const recipeId = paramMap.get('recipeId');
      if (recipeId != null) {
        this.loadedRecipe = this.recipesService.getRecipe(recipeId);
      }
      
    });
  }

  onDeleteRecipe() {
    this.alertCtrl
      .create({
        header: 'Are you sure?',
        message: 'Do you really want to delete the recipe?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            handler: () => {
              this.recipesService.deleteRecipe(this.loadedRecipe.id);
              this.router.navigate(['/recipes']);
            },
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
