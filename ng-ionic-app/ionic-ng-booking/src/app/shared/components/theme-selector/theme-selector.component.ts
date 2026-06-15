import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService, ThemeName } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.scss'],
})
export class ThemeSelectorComponent implements OnInit, OnDestroy {
  themes: ThemeName[] = ['dark', 'blue', 'green'];
  currentTheme: ThemeName = 'blue';
  private themeSub: Subscription = new Subscription();

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeSub = this.themeService.currentTheme.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  ngOnDestroy(): void {
    this.themeSub.unsubscribe();
  }

  onThemeChange(theme: ThemeName): void {
    this.themeService.setTheme(theme);
  }

  getThemeLabel(theme: ThemeName): string {
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  }
}
