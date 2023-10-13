/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 */

interface IRoute {
  path?: string
  icon?: string
  name: string
  routes?: IRoute[]
  checkActive?(pathname: String, route: IRoute): boolean
  exact?: boolean
}

export function routeIsActive(pathname: String, route: IRoute): boolean {
  if (route.checkActive) {
    return route.checkActive(pathname, route)
  }

  return route?.exact
    ? pathname == route?.path
    : (route?.path ? pathname.indexOf(route.path) === 0 : false)
}

const routes: IRoute[] = [
  {
    path: '/admin', // the url
    icon: 'HomeIcon', // the component being exported from icons/index.js
    name: 'Dashboard', // name that appear in Sidebar
    exact: true
  },
  {
    path: '/admin/instance', // the url
    icon: 'CardsIcon', // the component being exported from icons/index.js
    name: 'Instance', // name that appear in Sidebar
  },
  {
    icon: 'TablesIcon',
    name: 'Master',
    routes: [
      // submenu
      {
        path: '/admin/question',
        name: 'Question',
      },
    ],
  },
]

export type { IRoute }
export default routes
