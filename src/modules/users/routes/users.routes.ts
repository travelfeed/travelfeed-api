import {Router} from 'express';
import UserHandler from '../handlers/users.handler';

export class UserRoutes {

  public router: Router;

  constructor(router: Router) {
    this.router = router;
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get('/', UserHandler.getUsers)
    this.router.get('/:id', UserHandler.getUser)
  }

};