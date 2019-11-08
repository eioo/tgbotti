import { readdirSync, statSync } from 'fs';
import * as path from 'path';

interface ICommand {
  description?: string;
  load?(): void;
}

export const commands: StringMap<ICommand> = {};

function getDirectories(sourcePath: string) {
  return readdirSync(sourcePath).filter(f =>
    statSync(path.join(sourcePath, f)).isDirectory()
  );
}

async function loadCommand(name: string) {
  try {
    const command: ICommand = await import(`./${name}`);

    if (command.load) {
      command.load();
      commands[name] = command;
      return true;
    } else {
      console.warn(`Command "${name}" does not have load function`);
    }
  } catch (e) {
    console.warn(`Could not load command "${name}"\n`, e.stack);
  }

  return false;
}

export async function loadCommands() {
  const commandNames = getDirectories(__dirname);
  let loadCount = 0;

  for (const name of commandNames) {
    if (await loadCommand(name)) {
      loadCount++;
    }
  }

  return { loadCount };
}
