import { Map } from 'immutable';

export default function mergeDeeplyElements(page1, page2) {
  const mergedMap = Map(page1).mergeDeep(Map(page2));
  return mergedMap;
}
