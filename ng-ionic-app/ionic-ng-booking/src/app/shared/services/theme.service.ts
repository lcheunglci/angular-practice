import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

export type ThemeName = 'dark' | 'blue' | 'green';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  private readonly THEME_PREFERENCE_KEY = 'appTheme';
  private readonly DEFAULT_THEME: ThemeName = 'blue';
  private _currentTheme = new BehaviorSubject<ThemeName>(this.DEFAULT_THEME);

  get currentTheme(): Observable<ThemeName> {
    return this._currentTheme.asObservable();
  }

  get currentThemeValue(): ThemeName {
    return this._currentTheme.value;
  }

  constructor() {}

  ngOnDestroy(): void {
    this._currentTheme.complete();
  }

  async loadSavedTheme(): Promise<void> {
    try {
      const result = await Preferences.get({ key: this.THEME_PREFERENCE_KEY });
      if (result.value) {
        const theme = result.value as ThemeName;
        if (this.isValidTheme(theme)) {
          this._currentTheme.next(theme);
          return;
        }
      }
    } catch (error) {
      console.error('Error loading saved theme:', error);
    }

    this._currentTheme.next(this.DEFAULT_THEME);
  }

  async setTheme(theme: ThemeName): Promise<void> {
    if (!this.isValidTheme(theme)) {
      console.warn(`Invalid theme name: ${theme}`);
      return;
    }

    try {
      await Preferences.set({ key: this.THEME_PREFERENCE_KEY, value: theme });
      this._currentTheme.next(theme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }

  private isValidTheme(theme: any): theme is ThemeName {
    return ['dark', 'blue', 'green'].includes(theme);
  }
}
