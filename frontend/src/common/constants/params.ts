
import { UnknownKeysOfType } from '@/common/utils/types';

import NavigationRoutes from './routes';

/** This is the constraint that all custom navigation routes must meet. */
export type NavigationRouteConstraint = {
  locker?: any;
  query?: Record<string, string>;
  paths?: Record<string, string | number>;
};
/** This transforms a NavigationRouteConstraint into its full form. If ``T`` does not contain one of the properties (e.g: locker), the value of that property will become unknown. Unknown keys will later be filtered out and turned into optional keys. */
type CompleteNavigationRouteConfig<T extends NavigationRouteConstraint> = {
  /** Data stored in InterPageDataContext for sending data between pages */
  locker: T['locker'];
  /** Data stored directly in url. /search?q=Test */
  query: T['query'];
  /** Data inserted into the paths (purchase/[id] with { id: 'abc' } becomes purchase/abc) */
  paths: T['paths'];
};
export type NavigationRouteConfig<T extends NavigationRouteConstraint> = {
  /* Find and turn all keys of unknown type into optionals */
  [key in keyof UnknownKeysOfType<CompleteNavigationRouteConfig<T>>]?: T[key];
} & {
  /* Find and turn all keys that are not unknown to required */
  [key in Exclude<
    keyof CompleteNavigationRouteConfig<T>,
    keyof UnknownKeysOfType<CompleteNavigationRouteConfig<T>>
  >]: CompleteNavigationRouteConfig<T>[key];
};

type IdRoute = NavigationRouteConfig<{
  paths: {
    id: string;
  };
}>;

// |==============================|
// | WRITE ALL CUSTOM PARAMS HERE |
// |==============================|
export type CustomNavigationRouteParams = {
  [NavigationRoutes.AlbumView]: NavigationRouteConfig<{
    paths: {
      id: string;
    }
  }>
};
export type UnspecifiedNavigationRouteParams = {
  [key in Exclude<
    NavigationRoutes,
    keyof CustomNavigationRouteParams
  >]: undefined;
};
export type NavigationRouteParams = CustomNavigationRouteParams &
  UnspecifiedNavigationRouteParams;

// Contains all of the values that might exist in router.query
export type RouterQueryType<T extends keyof CustomNavigationRouteParams> =
  CustomNavigationRouteParams[T]['paths'] &
  CustomNavigationRouteParams[T]['query'];
