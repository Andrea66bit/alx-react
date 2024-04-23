import { Map } from "immutable";

const mergeDeeplyElements = (page1, page2) => Map(page1).mergeDeep(page2);

export default mergeDeeplyElements;
