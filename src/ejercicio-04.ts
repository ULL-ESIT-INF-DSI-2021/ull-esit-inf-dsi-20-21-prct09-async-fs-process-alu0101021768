import {existsSync} from 'fs';
import {lstatSync} from 'fs';
import * as yargs from 'yargs';
import {spawn} from 'child_process';
/**
 * @description Command that identifies if it is a directory or a file only
 * using the path
 */
yargs.command({
  command: 'identify',
  describe: 'Given a path, checks whether it is a directory or a file',
  builder: {
    path: {
      describe: 'Path to the file',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    // Si existe el path al archivo sigue la ejecución
    if (typeof argv.path === 'string' && existsSync(argv.path)) {
      if (lstatSync(argv.path).isDirectory()) {
        process.stdout.write(argv.path + ' is a directory\n');
      } else {
        process.stdout.write(argv.path + ' is a file\n');
      }
    } else {
      console.log('Error opening the file/directory: Unexisting path');
    }
  },
}).demandCommand(1, 'You should try using a command');
/**
 * @description Command that creates a directory on the specified path
 */
yargs.command({
  command: 'create',
  describe: 'Given a path, creates a new directory',
  builder: {
    path: {
      describe: 'Path to the directory',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    // Si existe el path al archivo sigue la ejecución
    if (typeof argv.path === 'string' && !existsSync(argv.path)) {
      const mkdir = spawn('mkdir', [argv.path]);
      mkdir.on('close', () => {
        process.stdout.write('Directory ' + argv.path +
          ' created succesfully\n');
      });
    } else {
      console.log('Cannot create the directory ' +
        argv.path + ': Already exists');
    }
  },
}).demandCommand(1, 'You should try using a command');
/**
 * @description Command that lists all the files on a directory
 */
yargs.command({
  command: 'list',
  describe: 'Given a path to a directory, lists all files on it',
  builder: {
    path: {
      describe: 'Path to the directory',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    // Si existe el path al archivo sigue la ejecución
    if (typeof argv.path === 'string' && existsSync(argv.path)) {
      const ls = spawn('ls', [argv.path]);
      ls.stdout.on('data', (output) => {
        process.stdout.write(output);
      });
    } else {
      console.log('Error opening the directory: Unexisting path');
    }
  },
}).demandCommand(1, 'You should try using a command');
/**
 * @description Command that shows the content of a file
 */
yargs.command({
  command: 'show',
  describe: 'Given a path to a file, prints all the content on it',
  builder: {
    path: {
      describe: 'Path to the file',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    // Si existe el path al archivo sigue la ejecución
    if (typeof argv.path === 'string' && existsSync(argv.path)) {
      const cat = spawn('cat', [argv.path]);
      cat.stdout.on('data', (output) => {
        process.stdout.write(output);
      });
    } else {
      console.log('Error opening the file: Unexisting path');
    }
  },
}).demandCommand(1, 'You should try using a command');
/**
 * @description Command that removes a file or a directory specified with a path
 */
yargs.command({
  command: 'remove',
  describe: 'Given a path to a file or directory, removes it',
  builder: {
    path: {
      describe: 'Path to the file or directory',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    // Si existe el path al archivo sigue la ejecución
    if (typeof argv.path === 'string' && existsSync(argv.path)) {
      if (lstatSync(argv.path).isDirectory()) {
        const rmdir = spawn('rmdir', [argv.path]);
        rmdir.on('close', () => {
          process.stdout.write('Directory ' + argv.path +
            ' deleted succesfully.\n');
        });
      } else {
        const rm = spawn('rm', [argv.path]);
        rm.on('close', () => {
          process.stdout.write('File ' + argv.path +
            ' deleted succesfully.\n');
        });
      }
    } else {
      console.log('Error removing the file/directory: Unexisting path');
    }
  },
}).demandCommand(1, 'You should try using a command');
/**
 * @description Command that copy and moves files from a route to another route
 */
yargs.command({
  command: 'move',
  describe: 'Moves contents from files or directory from an ' +
    'origin route to a destiny route',
  builder: {
    origin: {
      describe: 'Path to the file or directory to be copied/moved',
      demandOption: true,
      type: 'string',
    },
    destiny: {
      describe: 'Path where data is copied/moved to',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.origin === 'string' &&
      typeof argv.destiny === 'string' &&
      existsSync(argv.origin)) {
      // Si la ruta de origen es un diretorio, se debe copiar dicho directorio
      // y todo su contenido en la ruta destino
      if (lstatSync(argv.origin).isDirectory()) {
        const cp = spawn('cp', ['-r', argv.origin, argv.destiny]);
        cp.on('close', () => {
          process.stdout.write('Content copied succesfully!\n');
        });
      } else {
        const mv = spawn('mv', [argv.origin, argv.destiny]);
        mv.on('close', () => {
          process.stdout.write('File moved succesfully!\n');
        });
      }
    } else {
      console.log('Error moving/copying the file/directory: Unexisting path');
    }
  },
}).demandCommand(1, 'You should try using a command');
yargs.parse();
