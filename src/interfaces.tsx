export interface routeInterface {
  path: string;
  key: string;
  exact?: boolean;
  component: Function;
  routes?: routeInterface[];
}
