import { ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot } from "@angular/router";
import { ServersService } from "../servers.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

interface Server {
  id: number;
  name: string;
  status: string;
}

@Injectable()
export class ServerResolver implements Resolve<Server> {

  constructor(private serversService: ServersService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<Server> | Observable<Server> | Promise<Server> | Server {
    return this.serversService.getServer(+route.params['id']);
  }
}
