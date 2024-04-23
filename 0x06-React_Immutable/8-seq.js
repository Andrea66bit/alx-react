import { Seq } from "immutable";

const printBestStudents = (object) => {
  const format = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const result = Seq(object)
    .filter((student) => student.score > 69)
    .map((student) => ({
      ...student,
      firstName: format(student.firstName),
      lastName: format(student.lastName),
    }))
    .toJS();
  console.log(result);
};

export default printBestStudents;
