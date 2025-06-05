export class LoadProducts {
  static readonly type = '[Product] Load';
}

export class LoadProductsSuccess {
  static readonly type = '[Product] Load Success';
  constructor(public payload: any[]) {}
}

export class LoadProductsFailure {
  static readonly type = '[Product] Load Failure';
  constructor(public payload: any[]) {}
}
