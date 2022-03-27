import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss'],
})
export class SignInPageComponent implements OnInit {
  constructor(public translateService: TranslateService) {}

  /**
   * on init
   */
  ngOnInit(): void {
    // Sets language from browser settings.
    this.setupLanguage();
  }

  // --------------------------------------------------------------------------------
  // private methods
  // --------------------------------------------------------------------------------
  private setupLanguage() {
    // Setups language using browser settings.
    this.translateService.setDefaultLang(this.getLanguage(navigator.language));
    this.translateService.use(this.getLanguage(navigator.language));
  }

  private getLanguage(language: string): string {
    console.log('SignInPageComponent #getLanguage() language:' + language);

    const CHAR_HYPHEN = '-';
    if (language.indexOf(CHAR_HYPHEN) > 0) {
      const splittedLanguage: string[] = language.split(CHAR_HYPHEN);
      console.log(
        'SignInPageComponent #getLanguage() splittedLanguage[0]:' +
          splittedLanguage[0]
      );

      return splittedLanguage[0];
    }
    return language;
  }
}
