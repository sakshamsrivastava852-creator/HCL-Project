import { Routes } from "@angular/router";

import { Home } from "./home/home";
import { Farms } from "./farms/farms";
import { Fields } from "./fields/fields";
import { Crops } from "./crops/crops";
import { CropPlans } from "./crop-plans/crop-plans";
import { FieldOperations } from "./field-operations/field-operations";
import { Login } from "./login/login";
import { Profile } from "./profile/profile";
import { authGuard } from "./auth/auth.guard";

export const routes: Routes = [
  {
    path: "login",
    component: Login
  },
  {
    path: "",
    component: Home,
    canActivate: [authGuard]
  },
  {
    path: "farms",
    component: Farms,
    canActivate: [authGuard]
  },
  {
    path: "fields",
    component: Fields,
    canActivate: [authGuard]
  },
  {
    path: "crops",
    component: Crops,
    canActivate: [authGuard]
  },
  {
    path: "crop-plans",
    component: CropPlans,
    canActivate: [authGuard]
  },
  {
    path: "field-operations",
    component: FieldOperations,
    canActivate: [authGuard]
  },
  {
    path: "profile",
    component: Profile,
    canActivate: [authGuard]
  },
  {
    path: "**",
    redirectTo: ""
  }
];
