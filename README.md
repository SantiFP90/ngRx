# NgRx - Documentación

## ¿Qué es NgRx?

NgRx es una librería de gestión de estado reactivo para aplicaciones Angular, inspirada en Redux. Proporciona un patrón predecible para manejar el estado de la aplicación mediante el uso de acciones, reducers y efectos.

## Conceptos Fundamentales

### 1. **Store (Almacén)**

- **Teoría**: Es la única fuente de verdad para el estado de la aplicación
- **Práctica**: Contiene todo el estado en un objeto JavaScript inmutable

### 2. **State (Estado)**

- **Teoría**: Representación inmutable del estado actual de la aplicación
- **Práctica**: Objeto que describe cómo se ve la aplicación en un momento dado

### 3. **Actions (Acciones)**

- **Teoría**: Objetos planos que describen qué eventos ocurrieron
- **Práctica**: Tienen un `type` y opcionalmente un `payload`

### 4. **Reducers**

- **Teoría**: Funciones puras que toman el estado actual y una acción, devolviendo un nuevo estado
- **Práctica**: Especifican cómo cambia el estado en respuesta a las acciones

### 5. **Effects (Efectos)**

- **Teoría**: Manejan tareas asíncronas y efectos secundarios
- **Práctica**: Escuchan acciones y pueden despachar nuevas acciones

### 6. **Selectors**

- **Teoría**: Funciones puras para obtener porciones específicas del estado
- **Práctica**: Permiten acceso eficiente y memoizado al estado

## Flujo de Datos

```
Component → Action → Reducer → Store → Selector → Component
                 ↘ Effect ↗
```

## Instalación

```bash
# Instalar NgRx
ng add @ngrx/store
ng add @ngrx/effects
ng add @ngrx/store-devtools
ng add @ngrx/entity

# O con npm
npm install @ngrx/store @ngrx/effects @ngrx/store-devtools @ngrx/entity
```

## Estructura de Proyecto Recomendada

```
src/
  app/
    store/
      actions/
        user.actions.ts
        product.actions.ts
      reducers/
        user.reducer.ts
        product.reducer.ts
        index.ts
      effects/
        user.effects.ts
        product.effects.ts
      selectors/
        user.selectors.ts
        product.selectors.ts
      models/
        user.model.ts
        product.model.ts
```

## Implementación Práctica

### 1. Definir el Estado

```typescript
// store/models/user.model.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  selectedUser: User | null;
}

export const initialUserState: UserState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
};
```

### 2. Crear Acciones

```typescript
// store/actions/user.actions.ts
import { createAction, props } from "@ngrx/store";
import { User } from "../models/user.model";

// Acciones para cargar usuarios
export const loadUsers = createAction("[User] Load Users");
export const loadUsersSuccess = createAction("[User] Load Users Success", props<{ users: User[] }>());
export const loadUsersFailure = createAction("[User] Load Users Failure", props<{ error: string }>());

// Acciones para crear usuario
export const createUser = createAction("[User] Create User", props<{ user: Omit<User, "id"> }>());
export const createUserSuccess = createAction("[User] Create User Success", props<{ user: User }>());

// Acciones para seleccionar usuario
export const selectUser = createAction("[User] Select User", props<{ userId: number }>());
```

### 3. Implementar Reducer

```typescript
// store/reducers/user.reducer.ts
import { createReducer, on } from "@ngrx/store";
import { UserState, initialUserState } from "../models/user.model";
import * as UserActions from "../actions/user.actions";

export const userReducer = createReducer(
  initialUserState,

  // Cargar usuarios
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
    error: null,
  })),

  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Crear usuario
  on(UserActions.createUserSuccess, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
  })),

  // Seleccionar usuario
  on(UserActions.selectUser, (state, { userId }) => ({
    ...state,
    selectedUser: state.users.find((user) => user.id === userId) || null,
  }))
);
```

### 4. Crear Selectores

```typescript
// store/selectors/user.selectors.ts
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "../models/user.model";

// Selector de feature
export const selectUserState = createFeatureSelector<UserState>("users");

// Selectores básicos
export const selectAllUsers = createSelector(selectUserState, (state) => state.users);

export const selectUsersLoading = createSelector(selectUserState, (state) => state.loading);

export const selectUsersError = createSelector(selectUserState, (state) => state.error);

export const selectSelectedUser = createSelector(selectUserState, (state) => state.selectedUser);

// Selectores computados
export const selectUserCount = createSelector(selectAllUsers, (users) => users.length);

export const selectActiveUsers = createSelector(selectAllUsers, (users) => users.filter((user) => user.email.includes("@")));
```

### 5. Implementar Efectos

```typescript
// store/effects/user.effects.ts
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { map, catchError, switchMap } from "rxjs/operators";
import { UserService } from "../../services/user.service";
import * as UserActions from "../actions/user.actions";

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  // Efecto para cargar usuarios
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      switchMap(() =>
        this.userService.getUsers().pipe(
          map((users) => UserActions.loadUsersSuccess({ users })),
          catchError((error) =>
            of(
              UserActions.loadUsersFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  // Efecto para crear usuario
  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      switchMap(({ user }) =>
        this.userService.createUser(user).pipe(
          map((createdUser) =>
            UserActions.createUserSuccess({
              user: createdUser,
            })
          ),
          catchError((error) =>
            of(
              UserActions.loadUsersFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );
}
```

### 6. Configurar el Store

```typescript
// store/reducers/index.ts
import { ActionReducerMap } from "@ngrx/store";
import { userReducer } from "./user.reducer";
import { UserState } from "../models/user.model";

export interface AppState {
  users: UserState;
}

export const reducers: ActionReducerMap<AppState> = {
  users: userReducer,
};
```

```typescript
// app.module.ts
import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { reducers } from "./store/reducers";
import { UserEffects } from "./store/effects/user.effects";

@NgModule({
  imports: [
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([UserEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  // ...
})
export class AppModule {}
```

### 7. Usar en Componentes

```typescript
// user-list.component.ts
import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { User } from "../store/models/user.model";
import * as UserActions from "../store/actions/user.actions";
import * as UserSelectors from "../store/selectors/user.selectors";

@Component({
  selector: "app-user-list",
  template: `
    <div *ngIf="loading$ | async">Cargando...</div>
    <div *ngIf="error$ | async as error" class="error">{{ error }}</div>

    <div *ngFor="let user of users$ | async" (click)="selectUser(user.id)">{{ user.name }} - {{ user.email }}</div>

    <p>Total usuarios: {{ userCount$ | async }}</p>
  `,
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  userCount$: Observable<number>;

  constructor(private store: Store) {
    this.users$ = this.store.select(UserSelectors.selectAllUsers);
    this.loading$ = this.store.select(UserSelectors.selectUsersLoading);
    this.error$ = this.store.select(UserSelectors.selectUsersError);
    this.userCount$ = this.store.select(UserSelectors.selectUserCount);
  }

  ngOnInit() {
    this.store.dispatch(UserActions.loadUsers());
  }

  selectUser(userId: number) {
    this.store.dispatch(UserActions.selectUser({ userId }));
  }

  createUser() {
    const newUser = { name: "Nuevo Usuario", email: "nuevo@email.com" };
    this.store.dispatch(UserActions.createUser({ user: newUser }));
  }
}
```

## Patrones Avanzados

### 1. NgRx Entity

```typescript
// Usando EntityAdapter para operaciones CRUD optimizadas
import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";

export interface UserState extends EntityState<User> {
  loading: boolean;
  error: string | null;
}

export const userAdapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialState: UserState = userAdapter.getInitialState({
  loading: false,
  error: null,
});

// En el reducer
on(UserActions.loadUsersSuccess, (state, { users }) => userAdapter.setAll(users, { ...state, loading: false }));
```

### 2. Feature Modules

```typescript
// user-store.module.ts
@NgModule({
  imports: [StoreModule.forFeature("users", userReducer), EffectsModule.forFeature([UserEffects])],
})
export class UserStoreModule {}
```

## Mejores Prácticas

### 1. **Naming Conventions**

- Acciones: `[Source] Event` (ej: `[User API] Load Users Success`)
- Reducers: Usar `createReducer` con `on`
- Selectores: Prefijo `select` (ej: `selectAllUsers`)

### 2. **Estructura del Estado**

- Mantener el estado plano
- Normalizar datos relacionales
- Separar estado de UI del estado de datos

### 3. **Inmutabilidad**

- Nunca mutar el estado directamente
- Usar spread operator o librerías como Immer

### 4. **Efectos**

- Un efecto por operación asíncrona
- Manejar siempre los casos de error
- Usar operadores RxJS apropiados

### 5. **Testing**

```typescript
// Testing de reducers
describe("User Reducer", () => {
  it("should load users successfully", () => {
    const users = [{ id: 1, name: "Test", email: "test@test.com" }];
    const action = UserActions.loadUsersSuccess({ users });
    const result = userReducer(initialUserState, action);

    expect(result.users).toEqual(users);
    expect(result.loading).toBe(false);
  });
});
```

## Cuándo Usar NgRx

### ✅ **Usar NgRx cuando:**

- La aplicación tiene estado complejo
- Múltiples componentes necesitan el mismo estado
- Hay muchas interacciones de usuario
- Se necesita debugging avanzado
- El equipo es grande

### ❌ **No usar NgRx cuando:**

- Aplicación simple con poco estado
- Estado solo se usa en un componente
- Prototipo rápido
- Equipo pequeño sin experiencia

## Herramientas de Desarrollo

### 1. **Redux DevTools**

- Inspeccionar acciones y estado
- Time-travel debugging
- Replay de acciones

### 2. **NgRx Schematics**

```bash
# Generar feature completa
ng generate @ngrx/schematics:feature --name User --module app.module.ts

# Generar store
ng generate @ngrx/schematics:store State --root --module app.module.ts
```

## Recursos Adicionales

- [Documentación Oficial NgRx](https://ngrx.io/)
- [NgRx Workshop](https://github.com/ngrx/platform/tree/master/projects/ngrx.io/content/examples)
- [Redux Pattern](https://redux.js.org/introduction/core-concepts)
- [RxJS Operators](https://rxjs.dev/guide/operators)

---

Este README proporciona una base sólida tanto teórica como práctica para comenzar a trabajar con NgRx en proyectos Angular.
