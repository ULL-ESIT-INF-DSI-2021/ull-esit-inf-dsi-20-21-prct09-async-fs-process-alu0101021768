import 'mocha';
import {expect} from 'chai';
import {execSync} from 'child_process';

const test = (args: string): string => {
  return execSync(`node dist/ejercicio-03/ejercicio-03.js watch ${args}`)
      .toString();
};

const openError = 'Error opening the file: Unexisting path\n';

describe('Ejercicio 3 - Tests', () => {
  // Trying to watch on an unexisting directory
  it(`test('--path=what.txt --user=me') should return ${openError}`, () => {
    expect(test('--path=what.txt --user=me')).to.equal(openError);
  });
  // Trying to watch existing directory
  // it(`test('--path=teacher --user=teacher') should return ''`, () => {
  //   expect(test('--path=teacher --user=teacher')).to.equal('');
  //   return;
  // });
});
