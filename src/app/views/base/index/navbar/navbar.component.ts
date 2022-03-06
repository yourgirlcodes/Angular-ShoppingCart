import { TranslateService } from "./../../../../shared/services/translate.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ProductService } from "./../../../../shared/services/product.service";
import { ThemeService } from "src/app/shared/services/theme.service";
import { AuthService } from "../../../../shared/services/auth.service";
import { User } from "../../../../shared/models/user";
import { CDPUserService } from "../../../../shared/services/user.service";

declare var $: any;

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  user: User;

  colorPallet2 = [
    {
      title: "Red Theme",
      color: "color-red",
      id: "red-theme",
    },
    {
      title: "Violet Theme",
      color: "color-violet",
      id: "violet-theme",
    },
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
    public productService: ProductService,
    public translate: TranslateService,
    private themeService: ThemeService,
    public userService: CDPUserService
  ) {
    authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit() {}

  login() {
    this.authService.showRegistrationLogin();
  }

  editUserDetails() {
    this.authService.openEditUserDetailsModal();
  }

  logout() {
    this.authService.logout();
    this.userService.clearUser();
    this.productService.clearLocalCart();
    this.productService.clearLocalFavourites();

    localStorage.clear();

    this.router.navigate(["/"]);
  }

  setLang(lang: string) {
    this.translate.use(lang).then(() => {});
  }

  updateTheme(theme: string) {
    this.themeService.updateThemeUrl(theme);
  }
}
