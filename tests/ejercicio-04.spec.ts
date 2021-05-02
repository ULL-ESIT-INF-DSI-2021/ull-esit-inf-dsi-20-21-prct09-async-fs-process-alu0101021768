import 'mocha';
import {expect} from 'chai';
import {execSync} from 'child_process';

const test = (args: string): string => {
  return execSync(`node dist/ejercicio-04.js ${args}`)
      .toString();
};

const openError = 'Error opening the file/directory: Unexisting path\n';
const removeError = 'Error removing the file/directory: Unexisting path\n';

describe('Ejercicio 4 - Tests', () => {
  describe('Identify command', () => {
    it(`test('identify --path=notapath') should return ${openError}`, () => {
      expect(test('identify --path=notapath')).to.equal(openError);
    });
    it(`test('identify --path=src') should return 'src is a directory'`,
        () => {
          expect(test('identify --path=src')).to.equal('src is a directory\n');
        });
    it(`test('identify --path=file') should return 'file is a file'`,
        () => {
          execSync('touch file');
          expect(test('identify --path=file')).to.equal('file is a file\n');
          execSync('rm file');
        });
  });
  describe('Create command', () => {
    it(`test('create --path=newPath') should return 'Directory newPath` +
      ` created succesfully\n' `, () => {
      expect(test('create --path=newPath')).to
          .equal('Directory newPath created succesfully\n');
    });
    it(`test('create --path=newPath') should return 'Cannot create the ` +
      `directory newPath: Already exists\n `, () => {
      expect(test('create --path=newPath')).to
          .equal('Cannot create the directory newPath: Already exists\n');
      execSync('rmdir newPath');
    });
  });
  describe('List command', () => {
    it(`test('list --path=notapath') should return 'Error opening the ` +
      `directory: Unexisting path\n'`, () => {
      expect(test('list --path=notapath')).to
          .equal('Error opening the directory: Unexisting path\n');
    });
    it(`test('list --path=./src/teacher') should return ` +
      `'Nestor note\nNew Nestor note\n'`, () => {
      expect(test('list --path=./src/teacher')).to
          .equal('Nestor note\nNew Nestor note\n');
    });
  });
  describe('Show command', () => {
    it(`test('show --path=hello') should return 'Error opening the ` +
      `file: Unexisting path\n'`, () => {
      expect(test('show --path=hello')).to
          .equal('Error opening the file: Unexisting path\n');
    });
    it(`test('show --path=helloworld.txt') should return ` +
      ` 'Hola, \nmundo.\n¿Que tal?\n'`, () => {
      expect(test('show --path=helloworld.txt')).to
          .equal('Hola, \nmundo.\n¿Que tal?\n');
    });
  });
  describe('Remove command', () => {
    it(`test('remove --path=hello') should return ${removeError}`, () => {
      expect(test('remove --path=hello')).to.equal(removeError);
    });
    it(`test('remove --path=hello') should return ` +
      `'File hello deleted succesfully.\n'`, () => {
      execSync('touch hello');
      expect(test('remove --path=hello')).to
          .equal('File hello deleted succesfully.\n');
    });
    it(`test('remove --path=hello') should return ` +
      `'File hello deleted succesfully.\n'`, () => {
      execSync('mkdir hello');
      expect(test('remove --path=hello')).to
          .equal('Directory hello deleted succesfully.\n');
    });
  });
  describe('Move command', () => {
    it(`test('move --origin=hello --destiny=halo') should return ` +
      `'Error moving/copying the file/directory: Unexisting path\n'`,
    () => {
      expect(test('move --origin=hello --destiny=halo')).to
          .equal('Error moving/copying the file/directory: Unexisting path\n');
    });
    it(`test('move --origin=content --destiny=sameContent') should return ` +
      `'Content copied succesfully!\n'`,
    () => {
      execSync('mkdir content');
      execSync('touch content/file1 content/file2');
      expect(test('move --origin=content --destiny=sameContent')).to
          .equal('Content copied succesfully!\n');
      execSync('rm -rf content');
    });
  });
});
