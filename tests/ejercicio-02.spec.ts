import 'mocha';
import {expect} from 'chai';
import {execSync} from 'child_process';

const testA = (args: string): string => {
  return execSync(`node dist/ejercicio-02-a.js info ${args}`).toString();
};

const testB = (args: string): string => {
  return execSync(`node dist/ejercicio-02-b.js info ${args}`).toString();
};

const openError = 'Error opening the file: Unexisting path\n';
const noSelectedOptionsError = 'No options selected.\nOptions:\n' +
  '\t--lines=true\n\t--words=true\n\t--characters=true\n';
const linesOption = 'helloworld.txt information\n\tLines\t\n  \t3\n';
const wordsOption = 'helloworld.txt information\n\tWords\t\n  \t4\n';
const charactersOption = 'helloworld.txt information\n\tCharacters\t\n  \t24\n';
const linesWords =
  'helloworld.txt information\n\tLines\tWords\t\n        3       4\n';
const linesCharacters =
  'helloworld.txt information\n\tLines\tCharacters\t\n        3      24\n';
const wordsCharacters =
'helloworld.txt information\n\tWords\tCharacters\t\n        4      24\n';
const allOptions =
  'helloworld.txt information\n\tLines\tWords\tCharacters\t\n' +
  '        3       4      24\n';

describe('Ejercicio 2 - Tests', () => {
  // Trying to open unexisting file
  it(`testA('--path=what.txt') should return ${openError}`, () => {
    expect(testA('--path=what.txt')).to.equal(openError);
  });
  it(`testB('--path=what.txt') should return ${openError}`, () => {
    expect(testB('--path=what.txt')).to.equal(openError);
  });
  // Trying to open existing file without any options
  it(`testA('--path=helloworld.txt') should return ${noSelectedOptionsError}`,
      () => {
        expect(testA('--path=helloworld.txt')).to.equal(noSelectedOptionsError);
      });
  it(`testB('--path=helloworld.txt') should return ${noSelectedOptionsError}`,
      () => {
        expect(testB('--path=helloworld.txt')).to.equal(noSelectedOptionsError);
      });
  // Opening existing file with lines options
  it(`testA('--path=helloworld.txt --lines') should return ${linesOption}`,
      () => {
        expect(testA('--path=helloworld.txt --lines')).to.equal(linesOption);
      });
  it(`testB('--path=helloworld.txt --lines') should return ${linesOption}`,
      () => {
        expect(testB('--path=helloworld.txt --lines')).to.equal(linesOption);
      });

  // Opening existing file with words options
  it(`testA('--path=helloworld.txt --words') should return ${wordsOption}`,
      () => {
        expect(testA('--path=helloworld.txt --words')).to.equal(wordsOption);
      });
  it(`testB('--path=helloworld.txt --words') should return ${wordsOption}`,
      () => {
        expect(testB('--path=helloworld.txt --words')).to.equal(wordsOption);
      });
  // Opening existing file with characters options
  it(`testA('--path=helloworld.txt --characters') should return ` +
    `${charactersOption}`,
  () => {
    expect(testA('--path=helloworld.txt --characters')).to
        .equal(charactersOption);
  });
  it(`testB('--path=helloworld.txt --characters') should return ` +
    ` ${charactersOption}`,
  () => {
    expect(testB('--path=helloworld.txt --characters')).to
        .equal(charactersOption);
  });
  // Opening existing file with two options
  it(`testA('--path=helloworld.txt --lines --words') should return ` +
    `${linesWords}`,
  () => {
    expect(testA('--path=helloworld.txt --lines --words')).to
        .equal(linesWords);
  });
  it(`testA('--path=helloworld.txt --lines --characters') should return ` +
    `${linesCharacters}`,
  () => {
    expect(testA('--path=helloworld.txt --lines --characters')).to
        .equal(linesCharacters);
  });
  it(`testA('--path=helloworld.txt --words --characters') should return ` +
    `${wordsCharacters}`,
  () => {
    expect(testA('--path=helloworld.txt --words --characters')).to
        .equal(wordsCharacters);
  });
  it(`testB('--path=helloworld.txt --lines --words') should return ` +
    `${linesWords}`,
  () => {
    expect(testB('--path=helloworld.txt --lines --words')).to
        .equal(linesWords);
  });
  it(`testB('--path=helloworld.txt --lines --characters') should return ` +
    `${linesCharacters}`,
  () => {
    expect(testB('--path=helloworld.txt --lines --characters')).to
        .equal(linesCharacters);
  });
  it(`testB('--path=helloworld.txt --words --characters') should return ` +
    `${wordsCharacters}`,
  () => {
    expect(testB('--path=helloworld.txt --words --characters')).to
        .equal(wordsCharacters);
  });
  // Opening existing file with all the options
  it(`testB('--path=helloworld.txt --lines --words --characters') should ` +
    ` return ${allOptions}`,
  () => {
    expect(testB('--path=helloworld.txt --lines --words --characters')).to
        .equal(allOptions);
  });
});
