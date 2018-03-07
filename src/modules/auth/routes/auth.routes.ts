import {Router} from 'express';
import AuthHandler from '../handlers/auth.handler';

export class AuthRoutes {

  public router: Router;

  constructor(router: Router) {
    this.router = router;
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get('/signin', AuthHandler.signin)
    this.router.get('/register', AuthHandler.register)
  }

};