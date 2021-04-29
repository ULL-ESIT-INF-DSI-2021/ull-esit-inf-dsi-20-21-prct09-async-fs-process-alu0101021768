import * as fs from 'fs';
import * as yargs from 'yargs';
import {spawn} from 'child_process';

yargs.command({
  command: 'info',
  describe: 'Gives information about a specific file',
  builder: {
    path: {
      describe: 'Path to the file',
      demandOption: true,
      type: 'string',
    },
    lines: {
      describe: 'Show number of lines',
      demandOption: false,
      type: 'boolean',
    },
    words: {
      describe: 'Show number of words',
      demandOption: false,
      type: 'boolean',
    },
    characters: {
      describe: 'Show number of characters',
      demandOption: false,
      type: 'boolean',
    },
  },
  handler(argv) {
    // Si existe el path al archivo sigue la ejecución
    if (typeof argv.path === 'string' && fs.existsSync(argv.path)) {
      let options = '-';
      const parameters = [argv.lines, argv.words, argv.characters];
      const parametersOptions = ['l', 'w', 'm'];
      const optionsElements = ['Lines', 'Words', 'Characters'];
      // Procesamos las opciones seleccionadas
      parameters.forEach((parameter, index) => {
        if (parameter) {
          options += parametersOptions[index];
        }
      });
      // Si se seleccionó alguna opción
      if (options.length > 1) {
        const filename = argv.path;
        const cat = spawn('cat', [filename]);
        const wc = spawn('wc', [options]);
        let selectedOptions = `${filename} information\n\t`;
        parametersOptions.forEach((option, index) => {
          if (options.includes(option)) {
            selectedOptions += optionsElements[index] + '\t';
          }
        });
        selectedOptions += '\n  ';
        if (options.length === 2) {
          selectedOptions += '\t';
        }
        cat.stdout.on('data', (chunk) => {
          wc.stdin.write(chunk);
        });
        cat.on('close', () => {
          wc.stdin.end();
        });

        let output = '';
        wc.stdout.on('data', (piece) => {
          output += selectedOptions + piece;
        });

        wc.on('close', () => {
          process.stdout.write(output);
        });
      } else {
        console.log('No options selected.\n' +
          'Options:' +
          '\n\t--lines=true' +
          '\n\t--words=true' +
          '\n\t--characters=true');
      }
    } else {
      console.log('Error opening the file: Unexisting path');
    }
  },
}).demandCommand(1, 'You should try using a command');

yargs.parse();

