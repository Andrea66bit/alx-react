import { Map } from 'immutable';

export default function mergeDeeplyElements (page1, page2) {
  const mapOne = new Map(page1);
  const mapTwo = new Map(page2);

  return mapOne.mergeDeep(mapTwo);
}
