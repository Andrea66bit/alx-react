import { fromJS } from 'immutable';

function accessImmutableObject(object, array) {
  return fromJS(object).getIn(array, undefined);
}
export default accessImmutableObject;
